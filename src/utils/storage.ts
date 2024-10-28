import vstores from "vstores";

type StorageType = {
  "login-info": {
    email: string;
    loginName: string;
    loginPath: string;
    menuList: string[];
  };
  role: 1 | 2 | 3 | 4;
  loginChecked: string;
  menuList: string[];
};

export const storage = vstores.create<StorageType>({
  formatKey: (v: string) => {
    return "wj" + v;
  },
});
