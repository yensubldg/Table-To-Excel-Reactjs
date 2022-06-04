# Table To Excel - Reactjs
Export data in table to excel file using reactjs.
### Installation

```
npm install table-to-excel-reactjs
```

or

```
yarn add table-to-excel-reactjs
```
### Features
- Component to export table to excel
- Hook to export table to excel
- Download HTML table to excel in .xls file
- Set desired .xls filename and sheet
- No need server side

### Usage
#### with Component

A list of available properties can be found below. These must be passed to the containing `TableToExcelReact` component

| Property     | Type           | Description                                                                                    |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------- |
| **table**    | _string_       | Id of table to export                                                                          |
| **fileName** | _string_       | Name of Excel file                                                                             |
| **sheet**    | _string_       | Name of sheet in Excel file                                                                    |
| **children** | _ReactElement_ | component that will obtain the onClick event to export to excel (the most common is a button). |

#### Example

```jsx
import { TableToExcelReact } from "table-to-excel-reactjs";

function App() {
  return (
    <div className="App">
      <TableToExcelReact table="table-to-xls" fileName="myFile" sheet="sheet 1">
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
| Property            | Type          | Description                         |
| ------------------- | ------------- | ----------------------------------- |
| **table**           | _string_      | id of table to export               |
| **fileName**        | _string_      | Name of Excel file.                 |
| **sheet**           | _string_      | Name of Excel sheet.                |

#### Example

```jsx
import { useDownloadExcel } from "table-to-excel-reactjs";
function App() {
  const { onDownload } = useDownloadExcel({
    fileName: "myFile",
    table: "table-to-xls",
    sheet: "sheet 1",
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

### License
ISC License (ISC)

### Coming soon
- Export multiple tables to excel
- Customize styles
- Export to multiple sheets
