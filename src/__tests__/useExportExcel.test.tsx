import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useDownloadExcel } from '../hooks/useExportExcel';

// Mock document.getElementById
const mockTableElement = document.createElement('table');
mockTableElement.innerHTML = `
  <thead>
    <tr><th>Name</th><th>Age</th></tr>
  </thead>
  <tbody>
    <tr><td>John</td><td>30</td></tr>
  </tbody>
`;

// Create a mock for XLSX
const mockXLSX = {
  utils: {
    book_new: jest.fn(() => ({})),
    table_to_sheet: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
};

// Mock XLSX library
jest.mock('xlsx', () => mockXLSX);

// Test component using the hook
const TestComponent: React.FC = () => {
  const { onDownload } = useDownloadExcel({
    table: 'test-table',
    fileName: 'test-file',
    sheet: 'test-sheet',
  });

  return <button onClick={onDownload}>Export</button>;
};

describe('useDownloadExcel', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock document.getElementById
    document.getElementById = jest.fn().mockImplementation(id => {
      if (id === 'test-table') {
        return mockTableElement;
      }
      return null;
    });
  });

  it('should render a button that triggers export', () => {
    render(<TestComponent />);

    const button = screen.getByText('Export');
    expect(button).toBeInTheDocument();
  });

  it('should call XLSX functions when button is clicked', () => {
    render(<TestComponent />);

    const button = screen.getByText('Export');
    fireEvent.click(button);

    expect(mockXLSX.utils.book_new).toHaveBeenCalled();
    expect(mockXLSX.utils.table_to_sheet).toHaveBeenCalledWith(mockTableElement);
    expect(mockXLSX.utils.book_append_sheet).toHaveBeenCalled();
    expect(mockXLSX.writeFile).toHaveBeenCalled();
  });

  it('should handle missing table element', () => {
    document.getElementById = jest.fn().mockReturnValue(null);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<TestComponent />);

    const button = screen.getByText('Export');
    fireEvent.click(button);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Table with id "test-table" not found');

    consoleErrorSpy.mockRestore();
  });
});
