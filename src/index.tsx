import React from "react";
import { IProps } from "./interfaces/table-to-excel-react";
import { useDownloadExcel } from "./hooks/useExportExcel";

const TableToExcelReact: React.FC<IProps> = ({
  table,
  fileName,
  sheet,
  id,
  className,
  children,
}) => {
  const { onDownload } = useDownloadExcel({
    table,
    fileName,
    sheet,
    id,
    className,
  });
  return <span onClick={onDownload}>{children}</span>;
};

export { TableToExcelReact, useDownloadExcel };
