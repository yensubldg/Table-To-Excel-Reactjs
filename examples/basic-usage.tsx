import React from 'react';
import { TableToExcelReact, useDownloadExcel } from '../src';

// Example with component
export const ComponentExample: React.FC = () => {
  return (
    <div>
      <h2>Export with Component</h2>
      <TableToExcelReact
        table="example-table"
        fileName="component-example"
        sheet="Users"
        format="xlsx"
      >
        <button className="export-button">Export to Excel</button>
      </TableToExcelReact>
      
      <table id="example-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>28</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jane Smith</td>
            <td>jane@example.com</td>
            <td>32</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Bob Johnson</td>
            <td>bob@example.com</td>
            <td>45</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Example with hook
export const HookExample: React.FC = () => {
  const { onDownload } = useDownloadExcel({
    table: 'hook-example-table',
    fileName: 'hook-example',
    sheet: 'Products',
    format: 'xlsx',
  });

  return (
    <div>
      <h2>Export with Hook</h2>
      <button onClick={onDownload} className="export-button">
        Export to Excel
      </button>
      
      <table id="hook-example-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>P001</td>
            <td>Laptop</td>
            <td>Electronics</td>
            <td>$999.99</td>
          </tr>
          <tr>
            <td>P002</td>
            <td>Smartphone</td>
            <td>Electronics</td>
            <td>$699.99</td>
          </tr>
          <tr>
            <td>P003</td>
            <td>Headphones</td>
            <td>Accessories</td>
            <td>$149.99</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}; 