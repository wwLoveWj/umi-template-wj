import { useControllableValue } from "ahooks";
import axios from "axios";

const useImageUpload = (props) => {
  const [upLoadProgress, setUpLoadProgress] =
    useControllableValue<number>(props);

  /**
   * @desc
   * @param { File } 文件file
   * @return { Boolean } 是图片 true 不是 false
   */
  function isImage(file: any) {
    // 检查文件MIME类型
    return file.type.startsWith("image/");
  }
  /**
   * 文件上传的方法
   * @param uploadApi 上传文件的api
   */
  const uploadImage = (uploadApi: (params: any) => any) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("multiple", "multiple");
    input.setAttribute("accept", "xlsx/*");
    input.click();
    input.onchange = async function (event: any) {
      // 判断是否是图片格式文件
      const file = event.target.files[0];
      if (!isImage(file)) {
        return;
      }
      // TODO:判断文件大小
      const formData = new FormData();
      formData.append("file", file);
      uploadApi(formData);
    };
    input.remove();
  };
  // 获取上传的url地址
  const getUploadUrl = async (formData: any, token: string, url: string) => {
    return await axios({
      url,
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      onUploadProgress: function (progressEvent) {
        //原生获取上传进度的事件
        if (progressEvent?.event?.lengthComputable) {
          //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          //如果lengthComputable为false，就获取不到progressEvent.total和progressEvent.loaded
          //   setupLoadProgress((progressEvent.loaded / progressEvent.total) * 100); //实时获取上传进度
          setUpLoadProgress(
            Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            )
          );
        }
      },
    }).then((res) => {
      return res?.data?.data;
    });
  };
  return {
    upLoadProgress1: upLoadProgress,
    getUploadUrl,
    uploadImage,
  };
};

export default useImageUpload;
