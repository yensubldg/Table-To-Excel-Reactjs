import React from 'react';
import { TableToExcelReact, useDownloadExcel } from '../src';

// Example with multiple tables
export const MultipleTablesExample: React.FC = () => {
  return (
    <div>
      <h2>Export Multiple Tables to Separate Sheets</h2>
      <TableToExcelReact
        tables={['users-table', 'products-table']}
        fileName="multiple-tables-example"
        format="xlsx"
      >
        <button className="export-button">Export All Tables</button>
      </TableToExcelReact>
      
      <div className="tables-container">
        <div>
          <h3>Users Table</h3>
          <table id="users-table">
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
            </tbody>
          </table>
        </div>
        
        <div>
          <h3>Products Table</h3>
          <table id="products-table">
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Example with custom data
export const CustomDataExample: React.FC = () => {
  // Sample data
  const userData = [
    ['John Doe', 'john@example.com', 28],
    ['Jane Smith', 'jane@example.com', 32],
    ['Bob Johnson', 'bob@example.com', 45],
  ];
  
  const headers = ['Name', 'Email', 'Age'];
  
  return (
    <div>
      <h2>Export Custom Data</h2>
      <TableToExcelReact
        data={userData}
        headers={headers}
        fileName="custom-data-example"
        sheet="Users"
        format="xlsx"
      >
        <button className="export-button">Export Custom Data</button>
      </TableToExcelReact>
    </div>
  );
};

// Example with styled export
export const StyledExportExample: React.FC = () => {
  return (
    <div>
      <h2>Export with Styling</h2>
      <TableToExcelReact
        table="styled-table"
        fileName="styled-export-example"
        sheet="Styled Data"
        format="xlsx"
        styles={{
          headerRow: {
            font: { 
              bold: true, 
              color: '#FFFFFF',
              size: 12
            },
            fill: { 
              backgroundColor: '#4472C4',
              patternType: 'solid'
            },
            alignment: {
              horizontal: 'center',
              vertical: 'middle'
            }
          },
          dataRow: {
            font: { 
              name: 'Arial',
              size: 11
            }
          },
          alternatingRow: {
            fill: { 
              backgroundColor: '#E9EDF4',
              patternType: 'solid'
            }
          },
          cells: {
            'D2:D5': {
              font: { 
                bold: true,
                color: '#FF0000'
              }
            }
          }
        }}
      >
        <button className="export-button">Export Styled Excel</button>
      </TableToExcelReact>
      
      <table id="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>Engineering</td>
            <td>$85,000</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jane Smith</td>
            <td>Marketing</td>
            <td>$75,000</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Bob Johnson</td>
            <td>Finance</td>
            <td>$95,000</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Alice Williams</td>
            <td>HR</td>
            <td>$70,000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Example with multiple sheets with different configurations
export const MultipleSheetConfigExample: React.FC = () => {
  // Sample data for custom sheet
  const salesData = [
    ['Q1', 'North', 45000],
    ['Q1', 'South', 38000],
    ['Q2', 'North', 52000],
    ['Q2', 'South', 41000],
  ];
  
  return (
    <div>
      <h2>Export Multiple Sheets with Different Configurations</h2>
      <TableToExcelReact
        fileName="multi-sheet-config-example"
        format="xlsx"
        sheets={[
          {
            name: 'Employees',
            tableId: 'employees-table',
            styles: {
              headerRow: {
                font: { bold: true, color: '#FFFFFF' },
                fill: { backgroundColor: '#4472C4' }
              }
            }
          },
          {
            name: 'Sales Data',
            data: salesData,
            headers: ['Quarter', 'Region', 'Revenue'],
            styles: {
              headerRow: {
                font: { bold: true, color: '#FFFFFF' },
                fill: { backgroundColor: '#548235' }
              },
              dataRow: {
                font: { name: 'Arial' }
              }
            }
          }
        ]}
        onBeforeExport={() => console.log('Starting export...')}
        onAfterExport={(success) => console.log(`Export ${success ? 'completed' : 'failed'}`)}
      >
        <button className="export-button">Export Multiple Configured Sheets</button>
      </TableToExcelReact>
      
      <div>
        <h3>Employees Table</h3>
        <table id="employees-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>John Doe</td>
              <td>Senior Developer</td>
              <td>Engineering</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jane Smith</td>
              <td>Marketing Manager</td>
              <td>Marketing</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Bob Johnson</td>
              <td>Financial Analyst</td>
              <td>Finance</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Example with hook and callbacks
export const HookWithCallbacksExample: React.FC = () => {
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportStatus, setExportStatus] = React.useState<string | null>(null);
  
  const { onDownload } = useDownloadExcel({
    table: 'hook-callback-table',
    fileName: 'hook-with-callbacks',
    sheet: 'Data',
    format: 'xlsx',
    styles: {
      headerRow: {
        font: { bold: true },
        fill: { backgroundColor: '#DDEBF7' }
      }
    },
    onBeforeExport: () => {
      setIsExporting(true);
      setExportStatus('Exporting...');
    },
    onAfterExport: (success) => {
      setIsExporting(false);
      setExportStatus(success ? 'Export successful!' : 'Export failed');
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setExportStatus(null);
      }, 3000);
    }
  });
  
  return (
    <div>
      <h2>Hook with Callbacks</h2>
      <div>
        <button 
          onClick={onDownload} 
          disabled={isExporting}
          className="export-button"
        >
          {isExporting ? 'Exporting...' : 'Export with Status'}
        </button>
        
        {exportStatus && (
          <span className={`status ${exportStatus.includes('successful') ? 'success' : 'error'}`}>
            {exportStatus}
          </span>
        )}
      </div>
      
      <table id="hook-callback-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Status</th>
            <th>Deadline</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Website Redesign</td>
            <td>In Progress</td>
            <td>2023-06-30</td>
            <td>John Doe</td>
          </tr>
          <tr>
            <td>Mobile App Development</td>
            <td>Planning</td>
            <td>2023-08-15</td>
            <td>Jane Smith</td>
          </tr>
          <tr>
            <td>Database Migration</td>
            <td>Completed</td>
            <td>2023-05-10</td>
            <td>Bob Johnson</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}; 