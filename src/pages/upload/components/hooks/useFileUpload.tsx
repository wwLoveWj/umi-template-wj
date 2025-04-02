import { useState } from "react";
import { message } from "antd";
import type { UploadProgress } from "../type";

/**
 * 文件上传 Hook
 * @returns 上传进度状态和上传方法
 */
export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});

  /**
   * 上传单个文件到服务器
   * @param file 要上传的文件
   * @returns Promise<void>
   */
  const uploadFileToServer = async (
    file: File,
    url = "http://localhost:3007/file/upload",
    token: string
  ): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          message.success(`${file.name} 上传成功`);
          resolve();
        } else if (xhr.status === 401) {
          message.error("认证失败，请重新登录");
          reject(new Error("认证失败"));
        } else {
          message.error(`${file.name} 上传失败`);
          reject(new Error(`上传失败: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        message.error(`${file.name} 上传出错`);
        reject(new Error("上传出错"));
      };

      xhr.open("POST", url, true);
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  };

  /**
   * 批量上传文件到服务器
   * @param files 要上传的文件数组
   * @returns Promise<void>
   */
  const uploadFilesToServer = async (
    files: File[],
    url = "http://localhost:3007/file/upload",
    token: string
  ): Promise<void> => {
    try {
      await Promise.all(
        files.map((file) => uploadFileToServer(file, url, token))
      );
      message.success("所有文件上传完成");
    } catch (error) {
      console.error("批量上传失败:", error);
      message.error("部分文件上传失败");
    }
  };

  return {
    uploadProgress,
    uploadFileToServer,
    uploadFilesToServer,
  };
};
