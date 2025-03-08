import React from 'react';
import { IProps } from './interfaces/table-to-excel-react';
import { useDownloadExcel } from './hooks/useExportExcel';

/**
 * TableToExcelReact component for exporting HTML tables to Excel
 *
 * @example
 * ```jsx
 * <TableToExcelReact
 *   table="my-table-id"
 *   fileName="my-excel-file"
 *   sheet="Sheet1"
 *   format="xlsx"
 * >
 *   <button>Export to Excel</button>
 * </TableToExcelReact>
 * ```
 *
 * @example Multiple tables
 * ```jsx
 * <TableToExcelReact
 *   tables={["table1", "table2"]}
 *   fileName="multiple-tables"
 * >
 *   <button>Export Multiple Tables</button>
 * </TableToExcelReact>
 * ```
 *
 * @example Custom data
 * ```jsx
 * <TableToExcelReact
 *   data={[["John", 30], ["Jane", 25]]}
 *   headers={["Name", "Age"]}
 *   fileName="custom-data"
 *   sheet="Users"
 * >
 *   <button>Export Custom Data</button>
 * </TableToExcelReact>
 * ```
 *
 * @example Styled export
 * ```jsx
 * <TableToExcelReact
 *   table="my-table"
 *   fileName="styled-export"
 *   styles={{
 *     headerRow: {
 *       font: { bold: true, color: "#ffffff" },
 *       fill: { backgroundColor: "#4472C4" }
 *     },
 *     dataRow: {
 *       font: { color: "#000000" }
 *     },
 *     alternatingRow: {
 *       fill: { backgroundColor: "#E9EDF4" }
 *     }
 *   }}
 * >
 *   <button>Export Styled Excel</button>
 * </TableToExcelReact>
 * ```
 */
const TableToExcelReact: React.FC<IProps> = ({
  table,
  tables,
  sheets,
  data,
  headers,
  fileName,
  sheet,
  id,
  className,
  format,
  useLegacyExport,
  styles,
  onBeforeExport,
  onAfterExport,
  children,
}) => {
  const { onDownload } = useDownloadExcel({
    table,
    tables,
    sheets,
    data,
    headers,
    fileName,
    sheet,
    id,
    className,
    format,
    useLegacyExport,
    styles,
    onBeforeExport,
    onAfterExport,
  });

  return (
    <span
      onClick={onDownload}
      id={id}
      className={className}
      style={{ cursor: 'pointer', display: 'inline-block' }}
    >
      {children}
    </span>
  );
};

export { TableToExcelReact, useDownloadExcel };
