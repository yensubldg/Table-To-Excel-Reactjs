import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-style';
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
   * Converts a hex color to the XLSX format
   */
  function hexToXLSXColor(hex: string): { rgb: string } {
    // Remove # if present
    const cleanHex = hex.startsWith('#') ? hex.substring(1) : hex;
    return { rgb: cleanHex };
  }

  /**
   * Converts our style interface to XLSX style format
   */
  function convertToXLSXStyle(style: CellStyle): XLSXStyle.CellStyle {
    const xlsxStyle: XLSXStyle.CellStyle = {};

    if (style.font) {
      xlsxStyle.font = {
        name: style.font.name,
        sz: style.font.size,
        bold: style.font.bold,
        italic: style.font.italic,
        underline: style.font.underline,
      };

      if (style.font.color) {
        xlsxStyle.font.color = hexToXLSXColor(style.font.color);
      }
    }

    if (style.fill && style.fill.backgroundColor) {
      xlsxStyle.fill = {
        patternType: style.fill.patternType || 'solid',
        fgColor: hexToXLSXColor(style.fill.backgroundColor),
      };
    }

    if (style.border) {
      xlsxStyle.border = {};

      if (style.border.top) {
        xlsxStyle.border.top = {
          style: style.border.top.style || 'thin',
        };
        if (style.border.top.color) {
          xlsxStyle.border.top.color = hexToXLSXColor(style.border.top.color);
        }
      }

      if (style.border.bottom) {
        xlsxStyle.border.bottom = {
          style: style.border.bottom.style || 'thin',
        };
        if (style.border.bottom.color) {
          xlsxStyle.border.bottom.color = hexToXLSXColor(style.border.bottom.color);
        }
      }

      if (style.border.left) {
        xlsxStyle.border.left = {
          style: style.border.left.style || 'thin',
        };
        if (style.border.left.color) {
          xlsxStyle.border.left.color = hexToXLSXColor(style.border.left.color);
        }
      }

      if (style.border.right) {
        xlsxStyle.border.right = {
          style: style.border.right.style || 'thin',
        };
        if (style.border.right.color) {
          xlsxStyle.border.right.color = hexToXLSXColor(style.border.right.color);
        }
      }
    }

    if (style.alignment) {
      xlsxStyle.alignment = {
        horizontal: style.alignment.horizontal,
        vertical: style.alignment.vertical,
        wrapText: style.alignment.wrapText,
      };
    }

    if (style.numberFormat) {
      xlsxStyle.numFmt = style.numberFormat;
    }

    return xlsxStyle;
  }

  /**
   * Applies styles to a worksheet
   */
  function applyStyles(ws: XLSX.WorkSheet, styles?: TableStyles): XLSX.WorkSheet {
    if (!styles) return ws;

    // Get the range of the worksheet
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');

    // Apply header row styles
    if (styles.headerRow) {
      const headerStyle = convertToXLSXStyle(styles.headerRow);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        if (ws[cellRef]) {
          ws[cellRef].s = headerStyle;
        }
      }
    }

    // Apply data row styles (alternating if alternatingRow is provided)
    if (styles.dataRow) {
      const dataStyle = convertToXLSXStyle(styles.dataRow);
      const altStyle = styles.alternatingRow ? convertToXLSXStyle(styles.alternatingRow) : null;

      for (let row = range.s.r + 1; row <= range.e.r; row++) {
        const rowStyle = altStyle && row % 2 === 0 ? altStyle : dataStyle;

        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (ws[cellRef]) {
            ws[cellRef].s = rowStyle;
          }
        }
      }
    }

    // Apply custom cell styles
    if (styles.cells) {
      Object.entries(styles.cells).forEach(([cellRange, cellStyle]) => {
        const range = XLSX.utils.decode_range(cellRange);
        const style = convertToXLSXStyle(cellStyle);

        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
            if (ws[cellRef]) {
              ws[cellRef].s = style;
            }
          }
        }
      });
    }

    return ws;
  }

  /**
   * Creates a worksheet from custom data
   */
  function createWorksheetFromData(data: any[][], headers?: string[]): XLSX.WorkSheet {
    let wsData = data;

    // Add headers if provided
    if (headers && headers.length > 0) {
      wsData = [headers, ...data];
    }

    return XLSX.utils.aoa_to_sheet(wsData);
  }

  /**
   * Exports data to Excel using the XLSX library
   */
  function downloadWithXLSX(
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
      const wb = XLSX.utils.book_new();

      // Handle multiple sheets
      if (sheets && sheets.length > 0) {
        for (const sheetConfig of sheets) {
          let ws: XLSX.WorkSheet;

          // Create worksheet from table or data
          if (sheetConfig.tableId) {
            const tableElement = document.getElementById(sheetConfig.tableId);
            if (!tableElement) {
              if (process.env.NODE_ENV !== 'production') {
                console.error(`Table with id "${sheetConfig.tableId}" not found`);
              }
              continue;
            }
            ws = XLSX.utils.table_to_sheet(tableElement);
          } else if (sheetConfig.data) {
            ws = createWorksheetFromData(sheetConfig.data, sheetConfig.headers);
          } else {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Sheet "${sheetConfig.name}" has no data source`);
            }
            continue;
          }

          // Apply styles if provided
          if (sheetConfig.styles) {
            ws = applyStyles(ws, sheetConfig.styles);
          }

          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, sheetConfig.name);
        }
      }
      // Handle multiple tables
      else if (useExport.tables && useExport.tables.length > 0) {
        for (let i = 0; i < useExport.tables.length; i++) {
          const tableId = useExport.tables[i];
          const tableElement = document.getElementById(tableId);

          if (!tableElement) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Table with id "${tableId}" not found`);
            }
            continue;
          }

          const ws = XLSX.utils.table_to_sheet(tableElement);

          // Apply styles if provided
          if (styles) {
            applyStyles(ws, styles);
          }

          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, `Sheet${i + 1}`);
        }
      }
      // Handle single table or data
      else {
        let ws: XLSX.WorkSheet;

        if (table) {
          const tableElement = document.getElementById(table);
          if (!tableElement) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Table with id "${table}" not found`);
            }
            return false;
          }
          ws = XLSX.utils.table_to_sheet(tableElement);
        } else if (data) {
          ws = createWorksheetFromData(data, headers);
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.error('No data source provided');
          }
          return false;
        }

        // Apply styles if provided
        if (styles) {
          ws = applyStyles(ws, styles);
        }

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Sheet1');
      }

      // Check if we have any sheets
      if (wb.SheetNames.length === 0) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('No valid data to export');
        }
        return false;
      }

      // Use xlsx-style for styled workbooks
      if (styles || (sheets && sheets.some(s => s.styles))) {
        // Convert to xlsx-style format
        const xsWb = XLSXStyle.write(wb, { bookType: format, type: 'binary' });

        // Create a Blob and trigger download
        const blob = new Blob([s2ab(xsWb)], {
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
      } else {
        // Use regular xlsx for non-styled workbooks
        XLSX.writeFile(wb, `${fileName}.${format}`);
      }

      return true;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error exporting to Excel:', error);
      }
      return false;
    }
  }

  /**
   * Converts a string to an ArrayBuffer
   */
  function s2ab(s: string): ArrayBuffer {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
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
        success = downloadWithXLSX(
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
