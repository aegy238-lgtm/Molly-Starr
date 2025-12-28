
export interface FileRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  downloadCount: number;
  downloadUrl: string; // الرابط السحابي للملف
  storagePath: string; // مسار الملف في Firebase Storage للحذف
}

export interface AppStats {
  totalFiles: number;
  totalSize: number;
  totalDownloads: number;
}
