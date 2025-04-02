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
export const previewImage = async (
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

export const handleFileChange = (e: Event) => {
  previewImage(e, {
    containerSelector: ".custom-preview",
    maxWidth: 200,
    maxHeight: 200,
  });
};

// ===============================================================================

// 在拖拽区运动
export const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const handleDragEnter = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("进来了");
};

export const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  console.log("出去了");
};

// ================================================================
/**
 * 将Base64数据转换为File对象
 * @param dataURL Base64数据
 * @param filename 文件名
 * @param mimeType MIME类型
 * @returns File对象
 */
export const dataURLtoFile = (
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

// ===================================================================
