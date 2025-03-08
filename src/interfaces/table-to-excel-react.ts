import { ReactElement } from 'react';
import { UseExport } from './use-export';

/**
 * Props for the TableToExcelReact component
 * Extends the UseExport interface and adds children prop
 */
export interface IProps extends UseExport {
  /**
   * Child elements to render inside the component
   * Typically a button or other clickable element
   */
  children: ReactElement | ReactElement[];
}
