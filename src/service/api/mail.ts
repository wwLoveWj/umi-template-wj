import request from "../request";

// 邮件信息查询
export const MailInfoQueryAPI = (params = {}): Promise<any> => {
  return request.get("/mail/query", {
    params,
  });
};
// 邮箱配置新增
export const MailConfigCreateAPI = (params = {}): Promise<any> => {
  return request.post("/mail/config", params);
};
// 邮箱配置信息查询
export const MailConfigInfoQueryAPI = (params = {}): Promise<any> => {
  return request.get("/mail/config/query", {
    params,
  });
};

// 设置邮箱当前模板
export const MailConfigInfoSetAPI = (params = {}): Promise<any> => {
  return request.post("/mail/config/set", params);
};
