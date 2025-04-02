import React, { useRef, useEffect, useState } from "react";
import { Radio } from "antd";
import styles from "../style.less";
import FileListItem from "./FileListItem";
import {
  getAllFilesFromDB,
  saveFileToDB,
  deleteFileFromDB,
  saveFilesToDB,
} from "./IndexDB";
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

export default function DragAndDrop() {
  const [fileList, setFileList] = useState<File[]>([]);
  const [fileType, setFileType] = useState<"directory" | "file">("file");
  const drop = useRef<HTMLDivElement>(null);

  /**
   * 将Base64数据转换为File对象
   * @param dataURL Base64数据
   * @param filename 文件名
   * @param mimeType MIME类型
   * @returns File对象
   */
  const dataURLtoFile = (
    dataURL: string,
    filename: string,
    mimeType: string
  ): File => {
    const arr = dataURL.split(",");
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mimeType });
  };
  // 组件加载时从IndexedDB加载文件
  useEffect(() => {
    const loadFilesFromDB = async () => {
      try {
        const files = await getAllFilesFromDB();
        debugger;
        const fileObjects = files.map((fileInfo) => {
          // 将Base64数据转换回File对象
          return dataURLtoFile(fileInfo.data, fileInfo.name, fileInfo.type);
        });
        setFileList(fileObjects);
      } catch (error) {
        console.error("加载文件失败:", error);
      }
    };
    loadFilesFromDB();
  }, []);

  /**
   * 遍历文件并获取File对象
   * @param entry - 文件系统入口
   * @returns Promise<File>
   */
  const traverseFile = (entry: FileSystemFileEntry): Promise<File> => {
    return new Promise((resolve) => {
      entry.file((file) => {
        resolve(file);
      });
    });
  };
  /**
   * 递归遍历目录
   * @param directoryEntry - 目录入口
   * @param path - 当前路径
   * @returns Promise<File[]>
   */
  const traverseDirectory = async (
    directoryEntry: FileSystemDirectoryEntry,
    path = ""
  ): Promise<File[]> => {
    return new Promise((resolve) => {
      const dirReader = directoryEntry.createReader();
      const entries: File[] = [];
      const readEntries = () => {
        dirReader.readEntries(async (results) => {
          if (results.length === 0) {
            resolve(entries);
          } else {
            for (const entry of results) {
              if (entry.isFile) {
                const fileData = await traverseFile(
                  entry as FileSystemFileEntry
                );
                entries.push(fileData);
              } else if (entry.isDirectory) {
                const result = await traverseDirectory(
                  entry as FileSystemDirectoryEntry,
                  `${path}${entry.name}/`
                );
                entries.push(...result);
              }
            }
            readEntries(); // 继续读取剩余条目
          }
        });
      };

      readEntries(); // 开始读取
    });
  };

  /**
   * 处理文件拖拽事件
   * @param e - 拖拽事件对象
   * @param fileList - 当前文件列表
   * @param setFileList - 更新文件列表的函数
   */
  const handleDrop = async (e: DragEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    const items = Array.from(e.dataTransfer!.items);
    const newFiles: File[] = [...fileList];
    try {
      for (const item of items) {
        const entry = (item as unknown as DataTransferItem).webkitGetAsEntry();

        if (entry.isDirectory) {
          const content = await traverseDirectory(
            entry as FileSystemDirectoryEntry
          );
          await saveFilesToDB(content);
          newFiles.push(...content);
        } else if (entry.isFile) {
          const content = await traverseFile(entry as FileSystemFileEntry);
          await saveFileToDB(content);
          newFiles.push(content);
        }
      }
      setFileList(newFiles);
    } catch (error) {
      console.error("文件处理失败:", error);
    }
  };

  // 在拖拽区运动
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("进来了");
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("出去了");
  };
  useEffect(() => {
    if (!drop.current) return;
    // useRef 的 drop.current 取代了 ref 的 this.drop
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);
    drop.current.addEventListener("dragenter", handleDragEnter);
    drop.current.addEventListener("dragleave", handleDragLeave);
    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  /**
   * 创建文件选择器并处理文件选择事件
   * @param {string} fileType - 文件类型，可选值：'directory' | 'file'
   * @returns {void}
   */
  const createFileInput = (): void => {
    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", "multiple");
    // 判断是文件选择器还是文件夹选择器
    if (fileType === "directory") {
      input.setAttribute("webkitdirectory", "true");
      input.setAttribute("mozdirectory", "true");
      input.setAttribute("odirectory", "true");
    }
    // 如果需要限制文件类型，可以取消注释并修改
    // input.setAttribute("accept", "xlsx/*");
    input.click();
    input.onchange = async (event: Event): Promise<void> => {
      try {
        const target = event.target as HTMLInputElement;
        const files: File[] = Array.from(target.files || []);
        const newFiles: File[] = [...fileList];

        await saveFilesToDB(files);
        newFiles.push(...files);

        setFileList(newFiles);
        // 预览图片
        handleFileChange(event);
      } catch (error) {
        console.error("文件上传失败:", error);
      }

      // 如果需要预览图片，可以取消注释
      // previewImage(event);

      // 如果需要上传，可以取消注释
      // uploadApi(formData);
    };
    input.remove();
  };

  /**
   * 图片预览配置接口
   */
  interface PreviewConfig {
    containerSelector: string;
    fallbackImageUrl: string;
    maxWidth?: number;
    maxHeight?: number;
  }

  /**
   * 默认预览配置
   */
  const DEFAULT_CONFIG: PreviewConfig = {
    containerSelector: ".fileItem",
    fallbackImageUrl: "https://via.placeholder.com/150?text=Image+Not+Found",
    maxWidth: 300,
    maxHeight: 300,
  };

  /**
   * 预览图片
   * @param event - 文件选择事件
   * @param config - 预览配置
   * @returns Promise<void>
   */
  const previewImage = async (
    event: Event,
    config: Partial<PreviewConfig> = {}
  ): Promise<void> => {
    try {
      // 合并配置
      const finalConfig = { ...DEFAULT_CONFIG, ...config };
      // 获取文件
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) {
        throw new Error("未选择文件");
      }
      // 验证文件类型
      if (!file.type.startsWith("image/")) {
        throw new Error("请选择图片文件");
      }
      // 创建预览容器
      const container = document.querySelector(finalConfig.containerSelector);
      if (!container) {
        throw new Error("未找到预览容器");
      }

      // 创建图片元素
      const img = document.createElement("img");
      img.className = "preview-image";
      img.style.maxWidth = `${finalConfig.maxWidth}px`;
      img.style.maxHeight = `${finalConfig.maxHeight}px`;
      img.style.objectFit = "contain";

      // 使用 Promise 包装 FileReader
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result as string);
        };

        reader.onerror = () => {
          reject(new Error("图片读取失败"));
        };

        reader.readAsDataURL(file);
      });

      // 设置图片源
      img.src = dataUrl;

      // 处理图片加载错误
      img.onerror = () => {
        img.src = finalConfig.fallbackImageUrl;
      };

      // 清空容器并添加新图片
      container.innerHTML = "";
      container.appendChild(img);
    } catch (error) {
      console.error("图片预览失败:", error);
      // 可以在这里添加错误提示UI
    }
  };

  const handleFileChange = (e: Event) => {
    previewImage(e, {
      containerSelector: ".custom-preview",
      maxWidth: 200,
      maxHeight: 200,
    });
  };
  // 修改文件删除处理函数
  const handleDeleteFile = async (file: File) => {
    try {
      const fileId = `${file.name}-${file.lastModified}`;
      await deleteFileFromDB(fileId);
      setFileList(fileList.filter((f) => f.name !== file.name));
    } catch (error) {
      console.error("删除文件失败:", error);
    }
  };
  return (
    <>
      <Radio.Group
        block
        value={fileType}
        options={[
          { label: "文件上传", value: "file" },
          { label: "文件夹上传", value: "directory" },
        ]}
        onChange={(e) => {
          setFileType(e.target.value);
        }}
        defaultValue="file"
        optionType="button"
        buttonStyle="solid"
      />
      <div className={styles.fileDrag} ref={drop}>
        <div
          className={styles.imageUploadContainer}
          onClick={() => {
            createFileInput();
          }}
        >
          <div className={styles.imageUploadIcon}>📸</div>
          <div className={styles.imageUploadText}>点击上传图片</div>
        </div>

        {/* <p>上传进度:{upLoadProgress}</p>
        <Progress
          percent={upLoadProgress}
          status="active"
          style={{ width: "300px" }}
          strokeColor={getStrokeColor()}
        /> */}
      </div>
      {/* <div className="custom-preview" /> */}
      {fileList.map((file, index) => (
        <FileListItem
          key={`${file.name}-${index}`}
          file={file}
          onDelete={handleDeleteFile}
        />
      ))}
    </>
  );
}
