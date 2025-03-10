import ExcelJS from 'exceljs';
import {
  UseExport,
  UseExportReturn,
  TableStyles,
  SheetConfig,
  CellStyle,
} from '../interfaces/use-export';

/**
 * Hook for exporting HTML tables to Excel
 *
 * @param useExport - Configuration options for the Excel export
 * @returns Object containing the onDownload function
 *
 * @example
 * ```jsx
 * const { onDownload } = useDownloadExcel({
 *   table: 'my-table-id',
 *   fileName: 'my-excel-file',
 *   sheet: 'Sheet1',
 *   format: 'xlsx'
 * });
 *
 * return <button onClick={onDownload}>Export to Excel</button>;
 * ```
 */
export const useDownloadExcel = (useExport: UseExport): UseExportReturn => {
  /**
   * Validates the environment to ensure document is available
   */
  function valEnv(): boolean {
    if (typeof document === 'undefined') {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Failed to access document object');
      }
      return false;
    }
    return true;
  }

  /**
   * Converts a hex color to the ExcelJS format
   */
  function hexToColor(hex: string): string {
    // Remove # if present
    return hex.startsWith('#') ? hex.substring(1) : hex;
  }

  /**
   * Applies our style interface to an ExcelJS cell
   */
  function applyStyleToCell(cell: ExcelJS.Cell, style: CellStyle): void {
    if (style.font) {
      cell.font = {
        name: style.font.name,
        size: style.font.size,
        bold: style.font.bold,
        italic: style.font.italic,
        underline: style.font.underline ? 'single' : undefined,
        color: style.font.color ? { argb: 'FF' + hexToColor(style.font.color) } : undefined,
      };
    }

    if (style.fill && style.fill.backgroundColor) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF' + hexToColor(style.fill.backgroundColor) },
      };
    }

    if (style.border) {
      cell.border = {
        top: style.border.top
          ? {
              style: style.border.top.style || 'thin',
              color: style.border.top.color
                ? { argb: 'FF' + hexToColor(style.border.top.color) }
                : undefined,
            }
          : undefined,
        bottom: style.border.bottom
          ? {
              style: style.border.bottom.style || 'thin',
              color: style.border.bottom.color
                ? { argb: 'FF' + hexToColor(style.border.bottom.color) }
                : undefined,
            }
          : undefined,
        left: style.border.left
          ? {
              style: style.border.left.style || 'thin',
              color: style.border.left.color
                ? { argb: 'FF' + hexToColor(style.border.left.color) }
                : undefined,
            }
          : undefined,
        right: style.border.right
          ? {
              style: style.border.right.style || 'thin',
              color: style.border.right.color
                ? { argb: 'FF' + hexToColor(style.border.right.color) }
                : undefined,
            }
          : undefined,
      };
    }

    if (style.alignment) {
      cell.alignment = {
        horizontal: style.alignment.horizontal,
        vertical: style.alignment.vertical,
        wrapText: style.alignment.wrapText,
      };
    }

    if (style.numberFormat) {
      cell.numFmt = style.numberFormat;
    }
  }

  /**
   * Applies styles to a worksheet
   */
  function applyStyles(ws: ExcelJS.Worksheet, styles?: TableStyles): void {
    if (!styles) return;

    // Get the used range of the worksheet
    const startRow = 1;
    const endRow = ws.rowCount || 1;
    const startCol = 1;
    const endCol = ws.columnCount || 1;

    // Apply header row styles
    if (styles.headerRow) {
      const headerRow = ws.getRow(startRow);
      for (let col = startCol; col <= endCol; col++) {
        const cell = headerRow.getCell(col);
        applyStyleToCell(cell, styles.headerRow);
      }
    }

    // Apply data row styles (alternating if alternatingRow is provided)
    if (styles.dataRow) {
      for (let row = startRow + 1; row <= endRow; row++) {
        const rowStyle =
          styles.alternatingRow && row % 2 === 0 ? styles.alternatingRow : styles.dataRow;
        const dataRow = ws.getRow(row);

        for (let col = startCol; col <= endCol; col++) {
          const cell = dataRow.getCell(col);
          applyStyleToCell(cell, rowStyle);
        }
      }
    }

    // Apply custom cell styles
    if (styles.cells) {
      Object.entries(styles.cells).forEach(([cellRange, cellStyle]) => {
        // Parse cell range like 'A1:B5'
        const [start, end] = cellRange.split(':');

        if (!start || !end) {
          // Handle single cell case
          const match = start.match(/([A-Z]+)(\d+)/);
          if (match) {
            // We don't need to extract col and row separately since we're using the full cell reference
            const cell = ws.getCell(start);
            applyStyleToCell(cell, cellStyle);
          }
          return;
        }

        const startMatch = start.match(/([A-Z]+)(\d+)/);
        const endMatch = end.match(/([A-Z]+)(\d+)/);

        if (startMatch && endMatch) {
          const startCol = startMatch[1];
          const startRow = parseInt(startMatch[2]);
          const endCol = endMatch[1];
          const endRow = parseInt(endMatch[2]);

          // Convert column letters to numbers
          const startColNum = colLetterToNumber(startCol);
          const endColNum = colLetterToNumber(endCol);

          for (let row = startRow; row <= endRow; row++) {
            for (let col = startColNum; col <= endColNum; col++) {
              const colLetter = numberToColLetter(col);
              const cell = ws.getCell(`${colLetter}${row}`);
              applyStyleToCell(cell, cellStyle);
            }
          }
        }
      });
    }
  }

  /**
   * Convert column letter to number (A -> 1, B -> 2, etc.)
   */
  function colLetterToNumber(colLetter: string): number {
    let result = 0;
    for (let i = 0; i < colLetter.length; i++) {
      result = result * 26 + (colLetter.charCodeAt(i) - 64);
    }
    return result;
  }

  /**
   * Convert column number to letter (1 -> A, 2 -> B, etc.)
   */
  function numberToColLetter(num: number): string {
    let result = '';
    while (num > 0) {
      const modulo = (num - 1) % 26;
      result = String.fromCharCode(65 + modulo) + result;
      num = Math.floor((num - modulo) / 26);
    }
    return result;
  }

  /**
   * Creates a worksheet from custom data
   */
  function createWorksheetFromData(
    workbook: ExcelJS.Workbook,
    data: any[][],
    headers?: string[]
  ): ExcelJS.Worksheet {
    const worksheet = workbook.addWorksheet('Sheet');

    // Add headers if provided
    if (headers && headers.length > 0) {
      worksheet.addRow(headers);
    }

    // Add data rows
    data.forEach(row => {
      worksheet.addRow(row);
    });

    return worksheet;
  }

  /**
   * Creates a worksheet from an HTML table
   */
  function createWorksheetFromTable(
    workbook: ExcelJS.Workbook,
    tableElement: HTMLTableElement
  ): ExcelJS.Worksheet {
    const worksheet = workbook.addWorksheet('Sheet');

    // Process table headers
    const headerRow = tableElement.querySelector('thead tr');
    if (headerRow) {
      const headers = Array.from(headerRow.querySelectorAll('th, td')).map(
        cell => cell.textContent?.trim() || ''
      );
      if (headers.length > 0) {
        worksheet.addRow(headers);
      }
    }

    // Process table body
    const rows = tableElement.querySelectorAll('tbody tr');
    rows.forEach(row => {
      const rowData = Array.from(row.querySelectorAll('td')).map(cell => {
        // Try to convert to number if possible
        const text = cell.textContent?.trim() || '';
        const num = Number(text);
        return !isNaN(num) && text !== '' ? num : text;
      });
      worksheet.addRow(rowData);
    });

    return worksheet;
  }

  /**
   * Exports data to Excel using the ExcelJS library
   */
  function downloadWithExcelJS(
    fileName: string,
    format: 'xlsx' | 'xls' = 'xlsx',
    sheets?: SheetConfig[],
    table?: string,
    sheetName?: string,
    data?: any[][],
    headers?: string[],
    styles?: TableStyles
  ): boolean {
    try {
      // Create a workbook
      const workbook = new ExcelJS.Workbook();

      // Handle multiple sheets
      if (sheets && sheets.length > 0) {
        for (const sheetConfig of sheets) {
          let worksheet: ExcelJS.Worksheet;

          // Create worksheet from table or data
          if (sheetConfig.tableId) {
            const tableElement = document.getElementById(sheetConfig.tableId) as HTMLTableElement;
            if (!tableElement) {
              if (process.env.NODE_ENV !== 'production') {
                console.error(`Table with id "${sheetConfig.tableId}" not found`);
              }
              continue;
            }

            worksheet = createWorksheetFromTable(workbook, tableElement);
            // Rename the worksheet
            worksheet.name = sheetConfig.name;
          } else if (sheetConfig.data) {
            worksheet = createWorksheetFromData(workbook, sheetConfig.data, sheetConfig.headers);
            // Rename the worksheet
            worksheet.name = sheetConfig.name;
          } else {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Sheet "${sheetConfig.name}" has no data source`);
            }
            continue;
          }

          // Apply styles if provided
          if (sheetConfig.styles) {
            applyStyles(worksheet, sheetConfig.styles);
          }
        }
      }
      // Handle multiple tables
      else if (useExport.tables && useExport.tables.length > 0) {
        for (let i = 0; i < useExport.tables.length; i++) {
          const tableId = useExport.tables[i];
          const tableElement = document.getElementById(tableId) as HTMLTableElement;

          if (!tableElement) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Table with id "${tableId}" not found`);
            }
            continue;
          }

          const worksheet = createWorksheetFromTable(workbook, tableElement);
          // Rename the worksheet
          worksheet.name = `Sheet${i + 1}`;

          // Apply styles if provided
          if (styles) {
            applyStyles(worksheet, styles);
          }
        }
      }
      // Handle single table or data
      else {
        let worksheet: ExcelJS.Worksheet;

        if (table) {
          const tableElement = document.getElementById(table) as HTMLTableElement;
          if (!tableElement) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Table with id "${table}" not found`);
            }
            return false;
          }

          worksheet = createWorksheetFromTable(workbook, tableElement);
          // Rename the worksheet
          worksheet.name = sheetName || 'Sheet1';
        } else if (data) {
          worksheet = createWorksheetFromData(workbook, data, headers);
          // Rename the worksheet
          worksheet.name = sheetName || 'Sheet1';
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.error('No data source provided');
          }
          return false;
        }

        // Apply styles if provided
        if (styles) {
          applyStyles(worksheet, styles);
        }
      }

      // Check if we have any sheets
      if (workbook.worksheets.length === 0) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('No valid data to export');
        }
        return false;
      }

      // Write to buffer and trigger download
      workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], {
          type:
            format === 'xlsx'
              ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              : 'application/vnd.ms-excel',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      return true;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error exporting to Excel:', error);
      }
      return false;
    }
  }

  /**
   * Legacy export method using HTML template
   */
  function downloadLegacy(tableHTML: string, fileName: string, sheetName: string): boolean {
    try {
      // Legacy method using HTML template
      const uri = 'data:application/vnd.ms-excel;base64,';
      const template =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-mic' +
        'rosoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta cha' +
        'rset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:Exce' +
        `lWorksheet><x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>` +
        '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></' +
        'xml><![endif]--></head><body>' +
        tableHTML +
        '</body></html>';

      const base64 = (s: string) => window.btoa(unescape(encodeURIComponent(s)));

      const element = document.createElement('a');
      element.href = uri + base64(template);
      element.download = `${fileName}.xls`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      return true;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error exporting to Excel (legacy method):', error);
      }
      return false;
    }
  }

  /**
   * Main function to trigger the Excel download
   */
  function onDownload(): boolean {
    if (!valEnv()) return false;

    try {
      // Call onBeforeExport callback if provided
      if (useExport.onBeforeExport) {
        useExport.onBeforeExport();
      }

      const fileName = String(useExport.fileName);
      const format = useExport.format || 'xlsx';
      let success = false;

      // Use legacy method if explicitly requested
      if (useExport.useLegacyExport && useExport.table) {
        const tableElement = document.getElementById(useExport.table);
        if (!tableElement) {
          if (process.env.NODE_ENV !== 'production') {
            console.error(`Table with id "${useExport.table}" not found`);
          }
          return false;
        }

        const sheetName = String(useExport.sheet || 'Sheet1');
        success = downloadLegacy(tableElement.outerHTML, fileName, sheetName);
      } else {
        // Use modern method
        success = downloadWithExcelJS(
          fileName,
          format,
          useExport.sheets,
          useExport.table,
          useExport.sheet,
          useExport.data,
          useExport.headers,
          useExport.styles
        );
      }

      // Call onAfterExport callback if provided
      if (useExport.onAfterExport) {
        useExport.onAfterExport(success);
      }

      return success;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error in onDownload:', error);
      }

      // Call onAfterExport callback with failure if provided
      if (useExport.onAfterExport) {
        useExport.onAfterExport(false);
      }

      return false;
    }
  }

  return { onDownload };
};
