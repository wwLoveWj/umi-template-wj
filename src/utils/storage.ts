import vstores from "vstores";
import { SystemThemeEnum } from "@/enums/appEnum";

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
  menuTheme: "dark" | "light";
  systemColor: {
    systemThemeMode: SystemThemeEnum;
    systemThemeType: SystemThemeEnum;
  };
  themeColor: string;
  borderMode: boolean;
  fileList: File[];
};

export const storage = vstores.create<StorageType>({
  formatKey: (v: string) => {
    return "wj" + v;
  },
});
