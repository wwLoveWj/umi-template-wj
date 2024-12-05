import request from "../request";

// 邮件信息查询
export const MailInfoQueryAPI = (params = {}): Promise<any> => {
  return request.get("/mail/query", {
    params,
  });
};
// 创建任务
// export const ReminderTaskcreateAPI = (params = {}): Promise<any> => {
//   return request.post("/task/create", params);
// };
