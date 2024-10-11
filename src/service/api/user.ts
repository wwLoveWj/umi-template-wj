import request from "../request";

export const Login = () => {
  return request.post<{
    token: string;
  }>("/api/user/login");
};
// 查询用户信息接口
export const UserInfoQueryAPI = (params = {}): Promise<any> => {
  return request.get<API.UseInfoType>("/userInfo", params);
};
// 创建用户信息
export const UserInfoCreateAPI = (params: any): Promise<any> => {
  return request.post("/userInfo/create", params);
};
// 更新用户信息
export const UserInfoUpdateAPI = (params: any): Promise<any> => {
  return request.post("/userInfo/edit", params);
};
// 删除用户信息
export const UserInfoDelAPI = (params: { userId: string }) => {
  return request.post("/userInfo/delete", params);
};
