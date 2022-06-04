import * as utils from "../utils";

import { UseExport, UseExportReturn } from "../interfaces/use-export";
import { IContext } from "../interfaces/context";

export const useDownloadExcel = (useExport: UseExport): UseExportReturn => {
  function valEnv(): boolean {
    if (!document) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to access document object");
      }
      return false;
    }
    return true;
  }

  function download(fileName: string, context: IContext): boolean {
    const element = document.createElement("a");
    element.href =
      utils.uri + utils.base64(utils.format(utils.template, context));
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    return true;
  }

  function onDownload(): boolean {
    if (!valEnv()) return false;
    const table = document.getElementById(useExport.table)?.outerHTML;
    const sheet = String(useExport.sheet || "Sheet1");
    const fileName = `${String(useExport.fileName)}.xls`;

    const context = {
      worksheet: sheet || "Worksheet",
      table,
    };

    return download(fileName, context);
  }
  return { onDownload };
};
