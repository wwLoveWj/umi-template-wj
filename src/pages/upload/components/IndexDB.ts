/**
 * IndexedDB数据库配置
 */
const DB_NAME = "FileUploadDB";
const DB_VERSION = 1;
const STORE_NAME = "uploadedFiles";

/**
 * 文件信息接口
 */
interface FileInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  data: string; // Base64格式的图片数据
}

/**
 * 初始化数据库
 * @returns Promise<IDBDatabase>
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    debugger;
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("name", "name", { unique: false });
        store.createIndex("type", "type", { unique: false });
      }
    };
  });
};

/**
 * 保存文件到IndexedDB
 * @param file 文件对象
 * @returns Promise<void>
 */
const saveFileToDB = async (file: File): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    // 将文件转换为Base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileInfo: FileInfo = {
          id: `${file.name}-${file.lastModified}`,
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          data: reader.result as string,
        };

        // 在新的事务中保存数据
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        // 等待事务完成
        await new Promise<void>((resolveTransaction, rejectTransaction) => {
          const request = store.put(fileInfo);
          request.onsuccess = () => resolveTransaction();
          request.onerror = () => rejectTransaction(request.error);
        });

        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

/**
 * 从IndexedDB获取所有文件
 * @returns Promise<FileInfo[]>
 */
const getAllFilesFromDB = async (): Promise<FileInfo[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * 从IndexedDB删除文件
 * @param id 文件ID
 * @returns Promise<void>
 */
const deleteFileFromDB = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
/**
 * 批量保存文件到IndexedDB
 * @param files 文件数组
 * @returns Promise<void>
 */
const saveFilesToDB = async (files: File[]): Promise<void> => {
  const db = await initDB();

  // 将文件转换为Base64并创建FileInfo对象
  const fileInfos = await Promise.all(
    files.map((file) => {
      return new Promise<FileInfo>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            id: `${file.name}-${file.lastModified}`,
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            data: reader.result as string,
          });
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    })
  );

  // 使用单个事务保存所有文件
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // 创建所有文件的保存请求
    const requests = fileInfos.map((fileInfo) => {
      return new Promise<void>((resolveRequest, rejectRequest) => {
        const request = store.put(fileInfo);
        request.onsuccess = () => resolveRequest();
        request.onerror = () => rejectRequest(request.error);
      });
    });

    // 等待所有请求完成
    Promise.all(requests)
      .then(() => resolve())
      .catch((error) => reject(error));

    // 处理事务完成
    transaction.oncomplete = () => {
      console.log("所有文件保存完成");
    };

    // 处理事务错误
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};

export {
  saveFileToDB,
  getAllFilesFromDB,
  deleteFileFromDB,
  saveFilesToDB,
  initDB,
  STORE_NAME,
};
