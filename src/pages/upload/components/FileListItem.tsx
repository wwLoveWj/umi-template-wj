import React, { useEffect, useState } from "react";
import { Button, Progress } from "antd";
import styles from "./style.less";
import { UploadProgress } from "./type";
/**
 * 文件列表项组件
 */
interface FileListItemProps {
  file: File;
  onDelete: (file: File) => void;
  uploadProgress: UploadProgress;
}

const FileListItem: React.FC<FileListItemProps> = (props) => {
  const { file, onDelete, uploadProgress } = props;
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isImage, setIsImage] = useState<boolean>(false);

  useEffect(() => {
    // 检查文件类型
    if (file.type.startsWith("image/")) {
      setIsImage(true);
      // 创建预览URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // 清理URL
    }
  }, [file]);
  /**
   * 获取文件图标
   * @param fileType 文件类型
   * @returns 图标组件
   */
  const getFileIcon = (fileType: string): React.ReactNode => {
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word")) return "📝";
    if (fileType.includes("excel")) return "📊";
    if (fileType.includes("video")) return "🎥";
    if (fileType.includes("audio")) return "🎵";
    return "📁";
  };

  /**
   * 格式化文件大小
   * @param bytes 字节数
   * @returns 格式化后的文件大小
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <li className={styles.fileListItem}>
      <div className={styles.fileInfo}>
        {isImage ? (
          <div className={styles.imagePreview}>
            <img src={previewUrl} alt={file.name} />
          </div>
        ) : (
          <div className={styles.fileIcon}>{getFileIcon(file.type)}</div>
        )}
        <div className={styles.fileDetails}>
          <div className={styles.fileName}>{file.name}</div>
          <div className={styles.fileSize}>{formatFileSize(file.size)}</div>
        </div>
      </div>
      <div className={styles.fileActions}>
        {uploadProgress[file.name] !== undefined && (
          <Progress
            percent={uploadProgress[file.name]}
            size="small"
            style={{ width: 100 }}
          />
        )}
        <Button
          type="link"
          danger
          onClick={() => onDelete(file)}
          className={styles.deleteButton}
        >
          删除
        </Button>
      </div>
    </li>
  );
};

export default FileListItem;
