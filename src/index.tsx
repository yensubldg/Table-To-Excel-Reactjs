import React from "react";
import { Component, ReactNode } from "react";

type Props = {
  table: string;
  fileName: string;
  sheetName: string;
  id: string;
  className: string;
  buttonText: string;
};

const propTypes: Props = {
  table: "",
  fileName: "",
  sheetName: "",
  id: "",
  className: "",
  buttonText: "",
};

type defaultProps = {
  id: string;
  className: string;
  buttonText: string;
};

const defaultProps: defaultProps = {
  id: "btn-download-excel",
  className: "btn-download-excel",
  buttonText: "Download Excel",
};

// extend the Component class
class TableToExcelReactjs extends Component<Props> {
  static defaultProps: defaultProps;
  static propTypes: Props;
  constructor(props: Props) {
    super(props);
    this.handleDownload = this.handleDownload.bind(this);
  }

  static base64(s: string) {
    return window.btoa(unescape(encodeURIComponent(s)));
  }

  static format(s: string, c: any) {
    return s.replace(/{(\w+)}/g, function (m, p) {
      return c[p];
    });
  }

  handleDownload = () => {
    if (!document) {
      console.error("Failed to access document object");

      return null;
    }

    if (
      document.getElementById(this.props.table)?.nodeType !== 1 ||
      document.getElementById(this.props.table)?.nodeName !== "TABLE"
    ) {
      console.error("Provided table property is not html table element");

      return null;
    }

    const table = document.getElementById(this.props.table);
    const sheet = String(this.props.sheetName || "Sheet1");
    const fileName = `${String(this.props.fileName)}.xlsx`;

    const uri = "data:application/vnd.ms-excel;base64,";
    const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>`;

    const context = {
      worksheet: sheet || "Worksheet",
      table,
    };

    // If IE11
    if (window.navigator.msSaveOrOpenBlob) {
      const fileData = [
        `${
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-mic' +
          'rosoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta cha' +
          'rset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:Exce' +
          "lWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>" +
          "</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></" +
          "xml><![endif]--></head><body>"
        }${table}</body></html>`,
      ];

      const blobObject: Blob = new Blob(fileData);

      // click call signature
      document.getElementById(this.props.id)?.click();

      window.navigator.msSaveOrOpenBlob(blobObject, fileName);

      return true;
    }

    const element = document.createElement("a");
    element.href =
      uri +
      TableToExcelReactjs.base64(TableToExcelReactjs.format(template, context));

    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    return true;
  };

  render(): ReactNode {
    return (
      <button
        id={this.props.id}
        className={this.props.className}
        type="button"
        onClick={this.handleDownload}
      >
        {this.props.buttonText}
      </button>
    );
  }
}

TableToExcelReactjs.propTypes = propTypes;
TableToExcelReactjs.defaultProps = defaultProps;

export default TableToExcelReactjs;
