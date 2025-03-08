import { IContext, ContextType } from '../interfaces/context';

// base64
export const base64 = (s: string | number | boolean) => {
  return window.btoa(unescape(encodeURIComponent(s)));
};

// format
export const format = (s: string, c: IContext) => {
  return s.replace(/{(\w+)}/g, (_: string, p: ContextType) => c[p]);
};

// uri
export const uri = 'data:application/vnd.ms-excel;base64,';

// template
export const template =
  '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-mic' +
  'rosoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta cha' +
  'rset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:Exce' +
  'lWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>' +
  '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></' +
  'xml><![endif]--></head><body>{table}</body></html>';
