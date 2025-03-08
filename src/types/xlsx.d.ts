declare module 'xlsx' {
  export interface CellObject {
    t: string; // Type
    v: any; // Value
    r?: string; // Rich text
    h?: string; // HTML
    w?: string; // Formatted text
    f?: string; // Formula
    s?: any; // Style
  }

  export interface WorkSheet {
    '!ref'?: string;
    '!merges'?: any[];
    '!cols'?: any[];
    '!rows'?: any[];
    [cell: string]: CellObject | any;
  }

  export interface WorkBook {
    SheetNames: string[];
    Sheets: { [sheet: string]: WorkSheet };
    Props?: any;
  }

  export interface CellAddress {
    c: number;
    r: number;
  }

  export interface Range {
    s: CellAddress;
    e: CellAddress;
  }

  export namespace utils {
    function book_new(): WorkBook;
    function book_append_sheet(wb: WorkBook, ws: WorkSheet, name: string): void;
    function table_to_sheet(table: HTMLElement, opts?: any): WorkSheet;
    function sheet_to_json<T>(ws: WorkSheet, opts?: any): T[];
    function json_to_sheet<T>(data: T[], opts?: any): WorkSheet;
    function aoa_to_sheet(data: any[][], opts?: any): WorkSheet;
    function sheet_add_aoa(ws: WorkSheet, data: any[][], opts?: any): WorkSheet;
    function sheet_add_json(ws: WorkSheet, data: any[], opts?: any): WorkSheet;
    function encode_cell(cell: CellAddress): string;
    function encode_range(range: Range): string;
    function decode_cell(address: string): CellAddress;
    function decode_range(range: string): Range;
  }

  export function writeFile(wb: WorkBook, filename: string, opts?: any): void;
  export function write(wb: WorkBook, opts?: any): any;
  export function readFile(filename: string, opts?: any): WorkBook;
  export function read(data: any, opts?: any): WorkBook;
}

declare module 'xlsx-style' {
  export * from 'xlsx';

  export interface CellStyle {
    font?: {
      name?: string;
      sz?: number;
      color?: { rgb: string };
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
    };
    fill?: {
      fgColor?: { rgb: string };
      bgColor?: { rgb: string };
      patternType?: string;
    };
    border?: {
      top?: { style?: string; color?: { rgb: string } };
      bottom?: { style?: string; color?: { rgb: string } };
      left?: { style?: string; color?: { rgb: string } };
      right?: { style?: string; color?: { rgb: string } };
    };
    alignment?: {
      horizontal?: 'left' | 'center' | 'right';
      vertical?: 'top' | 'middle' | 'bottom';
      wrapText?: boolean;
    };
    numFmt?: string;
  }

  export interface CellObject {
    s?: CellStyle;
  }
}
