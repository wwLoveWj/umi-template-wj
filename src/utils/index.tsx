import JSEncrypt from "jsencrypt";

export const toLoginPage = () => {};

export const guid = () => {
  return "xxxxxxxx-xxxx-6xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const redirectUrl = (userType: 1 | 2 | 3 | 4) => {
  const redirectMap = new Map([
    [1, "/admin/svip"],
    [2, "/admin/vip"],
    [3, "/admin/permission"],
    [4, "/users"],
  ]);
  return redirectMap.get(userType) || "/users";
};

// 解密
export const getPrivateKey = (data: string) => {
  const decrypt = new JSEncrypt(); //创建解密对象实例
  //之前生成的秘钥(把自己生成的密钥钥粘到对应位置)
  const priKey = `MIICXQIBAAKBgQC0w6ohy8KMB+Zm8msT7JK/r7boeq1yVfhT0NVrJ/SmqZSeGYcK
  BAY0uC4MEnZDmbcThrXC1OL+OY5H/siEQQ/RUFeBr9PYKdFvtaeonw2dqp4mIaPx
  r/WRD19hdJQ8pRhyu4E3nINz21VSMG+Fsq5IEnFXHSmZnXo0c8EnjkPnDwIDAQAB
  AoGAMn3dDeeehgLG5sacBkq0ivqH+tQZkrBU1wSkOHRGsC76Jlc3EyMgoKU5p4GY
  qzVKoBemua9BYIWvKokOdXK++d5H1TcqoM5vlg96tVGbWjQsBOB5vzrTL3iB9phm
  UQwPLlhQdlD8Oe0APCVEmcjGu4bZeOsjQcUKRQh6r68hEzECQQDhzb5gU8pfST9d
  yklhswKrYYTxCT3Bk0cWHXzeNJRhKx+LTnxER1j2/y2U1GDn2sD0HF8/fOp1wxio
  1b5AD3E9AkEAzPAGSEIorrKG5G0QwRs6/Hb8eUJMC+Kpk24nAjWSXEHB89RwiQ+f
  I9oOfcfZ9L6aT6CSVHv6P2eJKzh91ljmOwJBAMQVVX/y42cxhVxeALFdsTDAQ6DI
  xJ8n1PBIdRnFESD8QK1JX7IvPvtmht+aOfi9Rxf012WbhUL0Q6LB0i9w+YUCQQCI
  hVUKCdikGBW4UdeZbJRs3q7t8HZMbKBesECYPivT/ZJA5kJZa+itr3N74wiU++w8
  I1GXqkdYuZYtDqL1iZ9FAkA+P6RELAyLpsLYugHoDp1/pwsj3O3wIE67X21FWYn6
  +PIY817HUgWNc21HXWliWkkgMZTMHPXcyJbLy8+ClXMj`;
  decrypt.setPrivateKey(priKey); //设置秘钥
  const uncrypted = decrypt.decrypt(data); //解密之前拿公钥加密的内容
  return uncrypted;
};
// 加密
export const setPrivateKey = (content: any) => {
  const encryptor = new JSEncrypt(); // 创建加密对象实例
  //之前生成的公钥，复制的时候要小心不要有空格(此处把密钥省略了，自己写的时候可把自己生成的公钥粘到对应位置)
  const pubKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0w6ohy8KMB+Zm8msT7JK/r7bo
  eq1yVfhT0NVrJ/SmqZSeGYcKBAY0uC4MEnZDmbcThrXC1OL+OY5H/siEQQ/RUFeB
  r9PYKdFvtaeonw2dqp4mIaPxr/WRD19hdJQ8pRhyu4E3nINz21VSMG+Fsq5IEnFX
  HSmZnXo0c8EnjkPnDwIDAQAB`;
  encryptor.setPublicKey(pubKey); //设置公钥
  const rsaPassWord = encryptor.encrypt(content); // 对内容进行加密
  return rsaPassWord;
};
