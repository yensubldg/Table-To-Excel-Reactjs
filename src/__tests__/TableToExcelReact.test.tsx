import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TableToExcelReact } from '../index';

// Mock the download function
const mockDownload = jest.fn();
jest.mock('../hooks/useExportExcel', () => ({
  useDownloadExcel: () => ({
    onDownload: mockDownload,
  }),
}));

describe('TableToExcelReact', () => {
  beforeEach(() => {
    mockDownload.mockClear();
  });

  it('renders children correctly', () => {
    render(
      <TableToExcelReact
        table="test-table"
        fileName="test-file"
        sheet="test-sheet"
        id="test-id"
        className="test-class"
      >
        <button>Export to Excel</button>
      </TableToExcelReact>
    );

    expect(screen.getByText('Export to Excel')).toBeInTheDocument();
  });

  it('calls onDownload when clicked', () => {
    render(
      <TableToExcelReact
        table="test-table"
        fileName="test-file"
        sheet="test-sheet"
        id="test-id"
        className="test-class"
      >
        <button>Export to Excel</button>
      </TableToExcelReact>
    );

    fireEvent.click(screen.getByText('Export to Excel'));
    expect(mockDownload).toHaveBeenCalledTimes(1);
  });
});
