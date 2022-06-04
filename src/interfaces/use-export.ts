export interface UseExport {
  table: string;
  fileName: string;
  sheet?: string;
  id: string;
  className: string;
}

export interface UseExportReturn {
  onDownload: () => boolean;
}
