import React, { useState } from "react";
// 获取用户信息
const searchInfo = () => {
  const [historyResult, setHistoryResult] = useState<API.MenuRoutesType[]>([]);
  return {
    historyResult,
    setHistoryResult,
  };
};

export default searchInfo;
