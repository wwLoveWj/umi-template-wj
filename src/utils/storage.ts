import vstores from "vstores";

type StorageType = {
  "login-info": {
    userType: (1 | 2 | 3 | 4 | 5 | 6)[];
    email: string;
    loginName: string;
    loginPath: string;
    tenantId: string;
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
