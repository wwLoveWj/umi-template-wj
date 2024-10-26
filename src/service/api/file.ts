import request from "../request";

export const imgInfoQueryAPI = (params = {}): Promise<any> => {
  return request.get("/file/query", { params });
};
