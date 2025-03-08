/**
 * Cell style options for Excel export
 */
export interface CellStyle {
  /**
   * Font properties
   */
  font?: {
    /**
     * Font name
     */
    name?: string;
    /**
     * Font size
     */
    size?: number;
    /**
     * Font color (hex format)
     */
    color?: string;
    /**
     * Bold text
     */
    bold?: boolean;
    /**
     * Italic text
     */
    italic?: boolean;
    /**
     * Underlined text
     */
    underline?: boolean;
  };
  /**
   * Fill/background properties
   */
  fill?: {
    /**
     * Background color (hex format)
     */
    backgroundColor?: string;
    /**
     * Pattern type
     */
    patternType?: 'solid' | 'none';
  };
  /**
   * Border properties
   */
  border?: {
    /**
     * Top border
     */
    top?: {
      style?: 'thin' | 'medium' | 'thick' | 'dotted' | 'dashed';
      color?: string;
    };
    /**
     * Bottom border
     */
    bottom?: {
      style?: 'thin' | 'medium' | 'thick' | 'dotted' | 'dashed';
      color?: string;
    };
    /**
     * Left border
     */
    left?: {
      style?: 'thin' | 'medium' | 'thick' | 'dotted' | 'dashed';
      color?: string;
    };
    /**
     * Right border
     */
    right?: {
      style?: 'thin' | 'medium' | 'thick' | 'dotted' | 'dashed';
      color?: string;
    };
  };
  /**
   * Alignment properties
   */
  alignment?: {
    /**
     * Horizontal alignment
     */
    horizontal?: 'left' | 'center' | 'right';
    /**
     * Vertical alignment
     */
    vertical?: 'top' | 'middle' | 'bottom';
    /**
     * Text wrapping
     */
    wrapText?: boolean;
  };
  /**
   * Number format
   */
  numberFormat?: string;
}

/**
 * Style configuration for different parts of the table
 */
export interface TableStyles {
  /**
   * Header row styles
   */
  headerRow?: CellStyle;
  /**
   * Data row styles (alternating)
   */
  dataRow?: CellStyle;
  /**
   * Alternating data row styles
   */
  alternatingRow?: CellStyle;
  /**
   * Custom cell styles by selector
   * Example: { 'A1:B5': { font: { bold: true } } }
   */
  cells?: Record<string, CellStyle>;
}

/**
 * Sheet configuration for multi-sheet exports
 */
export interface SheetConfig {
  /**
   * Name of the sheet
   */
  name: string;
  /**
   * Table ID to export (if using HTML tables)
   */
  tableId?: string;
  /**
   * Custom data to export (if not using HTML tables)
   */
  data?: any[][];
  /**
   * Headers for custom data
   */
  headers?: string[];
  /**
   * Styles for this sheet
   */
  styles?: TableStyles;
}

export interface UseExport {
  /**
   * ID of the HTML table element to export (for single table export)
   */
  table?: string;

  /**
   * IDs of multiple HTML tables to export to separate sheets
   * Each table will be exported to a separate sheet
   */
  tables?: string[];

  /**
   * Configuration for multiple sheets
   * Allows more control over sheet names and content
   */
  sheets?: SheetConfig[];

  /**
   * Custom data source (2D array) for export
   * Used when not exporting from HTML tables
   */
  data?: any[][];

  /**
   * Headers for custom data
   */
  headers?: string[];

  /**
   * Name of the Excel file (without extension)
   */
  fileName: string;

  /**
   * Name of the Excel sheet (defaults to "Sheet1")
   * Only used for single table/data export
   */
  sheet?: string;

  /**
   * ID attribute for the component
   */
  id?: string;

  /**
   * CSS class for the component
   */
  className?: string;

  /**
   * Format of the Excel file (defaults to "xlsx")
   */
  format?: 'xlsx' | 'xls';

  /**
   * Whether to use the legacy export method (defaults to false)
   */
  useLegacyExport?: boolean;

  /**
   * Styles to apply to the Excel file
   */
  styles?: TableStyles;

  /**
   * Callback function to execute before export
   */
  onBeforeExport?: () => void;

  /**
   * Callback function to execute after export
   */
  onAfterExport?: (success: boolean) => void;
}

export interface UseExportReturn {
  /**
   * Function to trigger the Excel download
   * @returns boolean indicating success or failure
   */
  onDownload: () => boolean;
}
