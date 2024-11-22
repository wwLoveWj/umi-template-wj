import request from "../request";

export const imgInfoQueryAPI = (params = {}): Promise<any> => {
  return request.get<API.ImageUploadType>("/file/query", { params });
};

// 单张图片的删除
export const imgInfoDeleteAPI = (params = {}) => {
  return request.post<null>("/file/delete", params);
};
