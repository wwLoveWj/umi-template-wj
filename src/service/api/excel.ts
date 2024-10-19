import request from "../request";

// 查询待办任务列表
export const ExcelInfoQueryAPI = (params = {}): Promise<any> => {
  return request.get("/excel/query", params);
};
// 删除待办任务
export const ExcelInfoDelAPI = (params = {}): Promise<any> => {
  return request.post("/excel/delete", params);
};
// excel列表的数据导出
export const ExcelInfoExportAPI = (params = {}): Promise<any> => {
  return request("/excel/export", {
    method: "post",
    params: { taskStatus: "2", ...params },
    // responseType: "blob",
  });
};
// excel列表的数据导入
export const ExcelInfoImportAPI = (data = {}, params: number): Promise<any> => {
  return request("/excel/import/" + params, {
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
