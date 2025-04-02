import React, { useRef, useEffect, useState } from "react";
import { Radio, Button, message, Popconfirm } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import styles from "./style.less";
import FileListItem from "./FileListItem";
import {
  getAllFilesFromDB,
  saveFileToDB,
  deleteFileFromDB,
  saveFilesToDB,
  initDB,
  STORE_NAME,
} from "./IndexDB";
import type {
  DataTransferItem,
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
} from "./type";
import {
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  dataURLtoFile,
} from "./utils";
import { useFileUpload } from "./hooks/useFileUpload";

export default function DragAndDrop() {
  const { uploadProgress, uploadFileToServer, uploadFilesToServer } =
    useFileUpload();
  const [fileList, setFileList] = useState<File[]>([]);
  const [fileType, setFileType] = useState<"directory" | "file">("file");
  const drop = useRef<HTMLDivElement>(null);

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
    const token = localStorage.getItem("system-token") || "";
    try {
      for (const item of items) {
        const entry = (item as unknown as DataTransferItem).webkitGetAsEntry();

        if (entry.isDirectory) {
          const content = await traverseDirectory(
            entry as FileSystemDirectoryEntry
          );
          await saveFilesToDB(content);
          await uploadFilesToServer(
            content,
            "http://localhost:3007/file/upload",
            token
          ); // 添加这行
          newFiles.push(...content);
        } else if (entry.isFile) {
          const content = await traverseFile(entry as FileSystemFileEntry);
          await saveFileToDB(content);
          await uploadFileToServer(
            content,
            "http://localhost:3007/file/upload",
            token
          ); // 添加这行
          newFiles.push(content);
        }
      }
      setFileList(newFiles);
    } catch (error) {
      console.error("文件处理失败:", error);
    }
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
    const token = localStorage.getItem("system-token") || "";
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
        await uploadFilesToServer(
          files,
          "http://localhost:3007/file/upload",
          token
        ); // 添加这行上传文件
        newFiles.push(...files);

        setFileList(newFiles);
        // 预览图片
        // handleFileChange(event);
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
  /**
   * 清除所有文件
   */
  const handleClearAll = async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      await store.clear();
      setFileList([]);
      message.success("所有文件已清除");
    } catch (error) {
      console.error("清除文件失败:", error);
      message.error("清除文件失败");
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
      {fileList.length > 0 && (
        <Popconfirm
          title="确定要清除所有文件吗？"
          onConfirm={handleClearAll}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="text"
            danger
            icon={<ClearOutlined />}
            className={styles.clearButton}
          >
            清除全部
          </Button>
        </Popconfirm>
      )}
      {/* <div className="custom-preview" /> */}
      <ul className={styles.fileList}>
        {fileList.map((file, index) => (
          <FileListItem
            key={`${file.name}-${index}`}
            file={file}
            onDelete={handleDeleteFile}
            uploadProgress={uploadProgress}
          />
        ))}
      </ul>
    </>
  );
}
