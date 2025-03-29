import request from "../request";

export const queryLinkCardListAPI = (
  params = {}
): Promise<API.CardListType[]> => {
  return request.get("/link/query", { params });
};

export const createLinkCardListAPI = (params: API.CardListType) => {
  return request.post<null>("/link/create", params);
};
