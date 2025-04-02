interface UploadProgress {
  [key: string]: number;
}
/**
 * 文件系统入口类型
 */
interface FileSystemEntry {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
  file: (callback: (file: File) => void) => void;
  createReader: () => FileSystemDirectoryReader;
}

/**
 * 目录读取器类型
 */
interface FileSystemDirectoryReader {
  readEntries: (callback: (entries: FileSystemEntry[]) => void) => void;
}

/**
 * 文件系统目录入口类型
 */
interface FileSystemDirectoryEntry extends FileSystemEntry {
  isDirectory: true;
  createReader: () => FileSystemDirectoryReader;
}

/**
 * 文件系统文件入口类型
 */
interface FileSystemFileEntry extends FileSystemEntry {
  isFile: true;
  file: (callback: (file: File) => void) => void;
}

/**
 * 拖拽项类型
 */
interface DataTransferItem {
  webkitGetAsEntry: () => FileSystemEntry;
}

/**
 * 统一导出所有类型
 */
export type {
  UploadProgress,
  FileSystemEntry,
  FileSystemDirectoryReader,
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  DataTransferItem,
};
