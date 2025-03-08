# Table To Excel - Reactjs

Export data in table to excel file using reactjs.

### Installation

```
npm install table-to-excel-react
```

or

```
yarn add table-to-excel-react
```

### Features

- Component to export table to excel
- Hook to export table to excel
- Download HTML table to excel in .xls or .xlsx format
- Export multiple tables to separate sheets
- Export custom data (not from HTML tables)
- Export to multiple sheets with different configurations
- Customize styles (headers, rows, cells)
- Cell formatting options
- Support for React 17, 18, and 19
- TypeScript support
- No server-side processing required

## Usage

### Basic Usage

#### with Component

A list of available properties can be found below. These must be passed to the containing `TableToExcelReact` component

| Property           | Type                | Description                                                                                    | Default   |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------- | --------- |
| **table**          | _string_            | ID of table to export                                                                          | -         |
| **fileName**       | _string_            | Name of Excel file (without extension)                                                         | -         |
| **sheet**          | _string_            | Name of sheet in Excel file                                                                    | "Sheet1"  |
| **format**         | _"xlsx" \| "xls"_   | Format of the Excel file                                                                       | "xlsx"    |
| **useLegacyExport**| _boolean_           | Whether to use the legacy export method                                                        | false     |
| **id**             | _string_            | ID attribute for the component                                                                 | -         |
| **className**      | _string_            | CSS class for the component                                                                    | -         |
| **children**       | _ReactElement_      | Component that will obtain the onClick event to export to excel (the most common is a button). | -         |

#### Example

```jsx
import { TableToExcelReact } from "table-to-excel-react";

function App() {
  return (
    <div className="App">
      <TableToExcelReact 
        table="table-to-xls" 
        fileName="myFile" 
        sheet="sheet 1"
        format="xlsx"
      >
        <button>Download</button>
      </TableToExcelReact>
      <table id="table-to-xls">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Edison</td>
            <td>Padilla</td>
            <td>20</td>
          </tr>
          <tr>
            <td>Alberto</td>
            <td>Lopez</td>
            <td>94</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
```

#### with Hook

A list of available properties can be found below. These must be passed to the containing `useDownloadExcel` hook.

| Property           | Type                | Description                                                                                    | Default   |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------- | --------- |
| **table**          | _string_            | ID of table to export                                                                          | -         |
| **fileName**       | _string_            | Name of Excel file (without extension)                                                         | -         |
| **sheet**          | _string_            | Name of sheet in Excel file                                                                    | "Sheet1"  |
| **format**         | _"xlsx" \| "xls"_   | Format of the Excel file                                                                       | "xlsx"    |
| **useLegacyExport**| _boolean_           | Whether to use the legacy export method                                                        | false     |
| **id**             | _string_            | ID attribute for the component                                                                 | -         |
| **className**      | _string_            | CSS class for the component                                                                    | -         |

#### Example

```jsx
import { useDownloadExcel } from "table-to-excel-react";

function App() {
  const { onDownload } = useDownloadExcel({
    fileName: "myFile",
    table: "table-to-xls",
    sheet: "sheet 1",
    format: "xlsx"
  });
  
  return (
    <div className="App">
      <button onClick={onDownload}>Download</button>
      <table id="table-to-xls">
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Edison</td>
            <td>Padilla</td>
            <td>20</td>
          </tr>
          <tr>
            <td>Alberto</td>
            <td>Lopez</td>
            <td>94</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
```

### Advanced Features

#### Export Multiple Tables to Separate Sheets

You can export multiple tables to separate sheets in a single Excel file:

```jsx
import { TableToExcelReact } from "table-to-excel-react";

function App() {
  return (
    <div className="App">
      <TableToExcelReact
        tables={["users-table", "products-table"]}
        fileName="multiple-tables"
        format="xlsx"
      >
        <button>Export All Tables</button>
      </TableToExcelReact>
      
      <table id="users-table">
        {/* Users table content */}
      </table>
      
      <table id="products-table">
        {/* Products table content */}
      </table>
    </div>
  );
}
```

#### Export Custom Data (Not from HTML Tables)

You can export custom data arrays without needing HTML tables:

```jsx
import { TableToExcelReact } from "table-to-excel-react";

function App() {
  // Sample data
  const userData = [
    ["John Doe", "john@example.com", 28],
    ["Jane Smith", "jane@example.com", 32],
    ["Bob Johnson", "bob@example.com", 45],
  ];
  
  const headers = ["Name", "Email", "Age"];
  
  return (
    <div className="App">
      <TableToExcelReact
        data={userData}
        headers={headers}
        fileName="custom-data"
        sheet="Users"
        format="xlsx"
      >
        <button>Export Custom Data</button>
      </TableToExcelReact>
    </div>
  );
}
```

#### Styled Excel Export

You can apply styles to your Excel exports:

```jsx
import { TableToExcelReact } from "table-to-excel-react";

function App() {
  return (
    <div className="App">
      <TableToExcelReact
        table="styled-table"
        fileName="styled-export"
        sheet="Styled Data"
        format="xlsx"
        styles={{
          headerRow: {
            font: { 
              bold: true, 
              color: "#FFFFFF",
              size: 12
            },
            fill: { 
              backgroundColor: "#4472C4",
              patternType: "solid"
            },
            alignment: {
              horizontal: "center",
              vertical: "middle"
            }
          },
          dataRow: {
            font: { 
              name: "Arial",
              size: 11
            }
          },
          alternatingRow: {
            fill: { 
              backgroundColor: "#E9EDF4",
              patternType: "solid"
            }
          },
          cells: {
            "D2:D5": {
              font: { 
                bold: true,
                color: "#FF0000"
              }
            }
          }
        }}
      >
        <button>Export Styled Excel</button>
      </TableToExcelReact>
      
      <table id="styled-table">
        {/* Table content */}
      </table>
    </div>
  );
}
```

#### Multiple Sheets with Different Configurations

You can configure multiple sheets with different data sources and styles:

```jsx
import { TableToExcelReact } from "table-to-excel-react";

function App() {
  // Sample data for custom sheet
  const salesData = [
    ["Q1", "North", 45000],
    ["Q1", "South", 38000],
    ["Q2", "North", 52000],
    ["Q2", "South", 41000],
  ];
  
  return (
    <div className="App">
      <TableToExcelReact
        fileName="multi-sheet-config"
        format="xlsx"
        sheets={[
          {
            name: "Employees",
            tableId: "employees-table",
            styles: {
              headerRow: {
                font: { bold: true, color: "#FFFFFF" },
                fill: { backgroundColor: "#4472C4" }
              }
            }
          },
          {
            name: "Sales Data",
            data: salesData,
            headers: ["Quarter", "Region", "Revenue"],
            styles: {
              headerRow: {
                font: { bold: true, color: "#FFFFFF" },
                fill: { backgroundColor: "#548235" }
              }
            }
          }
        ]}
      >
        <button>Export Multiple Sheets</button>
      </TableToExcelReact>
      
      <table id="employees-table">
        {/* Employees table content */}
      </table>
    </div>
  );
}
```

#### Export with Callbacks

You can use callbacks to handle events before and after export:

```jsx
import React, { useState } from "react";
import { useDownloadExcel } from "table-to-excel-react";

function App() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  
  const { onDownload } = useDownloadExcel({
    table: "data-table",
    fileName: "with-callbacks",
    sheet: "Data",
    format: "xlsx",
    onBeforeExport: () => {
      setIsExporting(true);
      setExportStatus("Exporting...");
    },
    onAfterExport: (success) => {
      setIsExporting(false);
      setExportStatus(success ? "Export successful!" : "Export failed");
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setExportStatus(null);
      }, 3000);
    }
  });
  
  return (
    <div className="App">
      <button 
        onClick={onDownload} 
        disabled={isExporting}
      >
        {isExporting ? "Exporting..." : "Export with Status"}
      </button>
      
      {exportStatus && <div>{exportStatus}</div>}
      
      <table id="data-table">
        {/* Table content */}
      </table>
    </div>
  );
}
```

### Multiple tables in one file

Here is a trick when formatting from HTML table to excel, you can wrap multiple tables in a parent tag and set its id to match the config like the examples above

#### Example

```jsx
import { TableToExcelReact } from "table-to-excel-react";

function App() {
  return (
    <div className="App">
      <TableToExcelReact table="table-to-xls" fileName="myFile" sheet="sheet 1">
        <button>Download</button>
      </TableToExcelReact>
      <div id="table-to-xls">
        <table>
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Edison</td>
              <td>Padilla</td>
              <td>20</td>
            </tr>
            <tr>
              <td>Alberto</td>
              <td>Lopez</td>
              <td>94</td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Edison</td>
              <td>Padilla</td>
              <td>20</td>
            </tr>
            <tr>
              <td>Alberto</td>
              <td>Lopez</td>
              <td>94</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
```

## API Reference

### TableToExcelReact Props

| Property           | Type                | Description                                                                                    | Default   |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------- | --------- |
| **table**          | _string_            | ID of table to export (for single table export)                                                | -         |
| **tables**         | _string[]_          | IDs of multiple tables to export to separate sheets                                            | -         |
| **sheets**         | _SheetConfig[]_     | Configuration for multiple sheets with different data sources and styles                       | -         |
| **data**           | _any[][]_           | Custom data array (2D) for export                                                              | -         |
| **headers**        | _string[]_          | Headers for custom data                                                                        | -         |
| **fileName**       | _string_            | Name of Excel file (without extension)                                                         | -         |
| **sheet**          | _string_            | Name of sheet in Excel file (for single table/data export)                                     | "Sheet1"  |
| **format**         | _"xlsx" \| "xls"_   | Format of the Excel file                                                                       | "xlsx"    |
| **useLegacyExport**| _boolean_           | Whether to use the legacy export method                                                        | false     |
| **styles**         | _TableStyles_       | Styles to apply to the Excel file                                                              | -         |
| **onBeforeExport** | _() => void_        | Callback function to execute before export                                                     | -         |
| **onAfterExport**  | _(success: boolean) => void_ | Callback function to execute after export                                             | -         |
| **id**             | _string_            | ID attribute for the component                                                                 | -         |
| **className**      | _string_            | CSS class for the component                                                                    | -         |
| **children**       | _ReactElement_      | Component that will obtain the onClick event to export to excel (the most common is a button). | -         |

### SheetConfig Interface

| Property           | Type                | Description                                                                                    |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------- |
| **name**           | _string_            | Name of the sheet                                                                              |
| **tableId**        | _string_            | Table ID to export (if using HTML tables)                                                       |
| **data**           | _any[][]_           | Custom data to export (if not using HTML tables)                                               |
| **headers**        | _string[]_          | Headers for custom data                                                                        |
| **styles**         | _TableStyles_       | Styles for this sheet                                                                          |

### TableStyles Interface

| Property           | Type                | Description                                                                                    |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------- |
| **headerRow**      | _CellStyle_         | Header row styles                                                                              |
| **dataRow**        | _CellStyle_         | Data row styles                                                                                |
| **alternatingRow** | _CellStyle_         | Alternating data row styles                                                                    |
| **cells**          | _Record<string, CellStyle>_ | Custom cell styles by selector (e.g., "A1:B5")                                         |

### CellStyle Interface

| Property           | Type                | Description                                                                                    |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------- |
| **font**           | _object_            | Font properties (name, size, color, bold, italic, underline)                                   |
| **fill**           | _object_            | Fill/background properties (backgroundColor, patternType)                                       |
| **border**         | _object_            | Border properties for each side (top, bottom, left, right)                                     |
| **alignment**      | _object_            | Alignment properties (horizontal, vertical, wrapText)                                          |
| **numberFormat**   | _string_            | Number format                                                                                  |

## Changelog

For a detailed list of changes for each version, please see the [CHANGELOG.md](CHANGELOG.md) file.

## License

ISC License (ISC)
