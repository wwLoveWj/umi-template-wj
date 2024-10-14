import React, { useEffect, useState, useRef } from "react";
import { useLocation, history } from "umi";
import { WjRadio } from "magical-antd-ui";
// import { useToggle } from "react-use";
import {
  Form,
  Input,
  Button,
  notification,
  Popconfirm,
  Radio,
  Checkbox,
  Row,
} from "antd";
import type { RadioChangeEvent } from "antd";
import styles from "./style.less";
// import { handleLoginInfo } from "@/service/login";
import { useRequest } from "ahooks";
import { setToken } from "@/utils/localToken";
import JSEncrypt from "jsencrypt";
import { redirectUrl, setPrivateKey, getPrivateKey } from "@/utils";
import { storage } from "@/utils/storage";
// 登录页面
const Login = () => {
  const pwdRef = useRef(null);
  const { pathname } = useLocation();
  const [form] = Form.useForm();
  //   const [visible, toggleVisible] = useToggle(false);
  const [checked, setChecked] = useState(false); //记住密码
  const [selectedValue, setSelectedValue] = useState("4"); //radio的选中值，登录身份
  const [role, setActiveName] = useState<1 | 2 | 3 | 4>(2); //存储切换的页面
  const [isVipLogin, setIsVipLogin] = useState<boolean>(false);

  useEffect(() => {
    // 仅在组件挂载时运行
    const initializeForm = async () => {
      if (process.env.NODE_ENV === "development") {
        const loginChecked = getPrivateKey(storage.get("loginChecked") || "");
        if (loginChecked) {
          try {
            const {
              checked: checkedCache,
              password,
              loginName,
            } = JSON.parse(loginChecked);
            setChecked(checkedCache);
            // 自动填充表单
            await form.setFieldsValue({
              loginName,
              password,
              checked: checkedCache,
            });
            // 如果记住登录状态被勾选，则自动聚焦到登录按钮
          } catch (error) {
            console.error("Error initializing form fields:", error);
            // 处理解密或解析错误
            storage.del("loginChecked"); // 出错时清理无效的cookie
          }
        }
      }
    };

    initializeForm();
  }, []);
  // 记住密码;
  const onChangePwd = async (e: any) => {
    const loginChecked = getPrivateKey(storage.get("loginChecked") || "");
    if (loginChecked) {
      setChecked(false);
      storage.del("loginChecked");
    } else {
      const values = await form.validateFields();
      values.checked = e.target.checked;
      setChecked(e.target.checked);
      const rsaPassWord = setPrivateKey(JSON.stringify(values)) || "";
      storage.set("loginChecked", rsaPassWord, { expire: [7, "day"] }); //7天有效期
    }
  };
  // 公共响应数据处理部分
  const commonResposeData = async (res: any) => {
    await setToken(res?.data?.token);
    storage.set("login-info", {
      ...res?.data,
      loginPath: [3, 4]?.includes(role) ? "/login" : "/iamlogin",
    });
    // 根据权限判断跳转哪个页面
    const redirectPath = redirectUrl(res?.data?.userType[0]);
    const { location } = history;
    const { query, search } = location as any;
    //   请求路径携带参数的处理
    if (Object.keys(query).length !== 0) {
      const params =
        search && search?.split("?")[2] ? `?${search.split("?")[2]}` : "";
      const redirect = query?.redirect?.split("?")[0];

      //   其他应用公用登录页面
      if (redirect?.startsWith("http://") || redirect?.startsWith("https://")) {
        window.location.href =
          redirect + `?userInfo=${JSON.stringify(res?.data)}`;
        return;
      }
      /**
       * 存在权限菜单内的接口可以参数跳转，不存在则统一重定向到/users
       */
      if (res?.data?.menuList?.includes("/" + redirect?.split("/")[1])) {
        // history.push(redirect + params);
        window.location.href = window.location.origin + redirect + params;
      } else {
        window.location.href = window.location.origin + redirectPath;
      }
    } else {
      window.location.href = window.location.origin + redirectPath;
    }
    // notification.success({
    //   message: '登录成功',
    //   description: `${res?.data?.loginName}，欢迎回来`,
    //   duration: 5,
    // });
  };

  //   // 处理登录接口
  //   const handleLoginInfoMsg = useRequest(
  //     (fieldValues) => {
  //       return handleLoginInfo(fieldValues);
  //     },
  //     {
  //       debounceWait: 100,
  //       manual: true,
  //       onSuccess: async (res) => {
  //         if (res.code === "200") {
  //           commonResposeData(res);
  //         } else {
  //           notification.error({
  //             message: "登录失败",
  //             description: res.message,
  //           });
  //         }
  //       },
  //     }
  //   );
  // 登录提交按钮
  const handleSubmit = (values: { password: string; loginName: string }) => {
    const encryptor = new JSEncrypt(); // 创建加密对象实例
    //之前生成的公钥，复制的时候要小心不要有空格(此处把密钥省略了，自己写的时候可把自己生成的公钥粘到对应位置)
    const pubKey =
      "MIIBCgKCAQEAzXfoDXWCayxsg9nUn6AYTXWF0x61YwpQXY4QubpYXnNU5wyHOjKPh/xtXA8lJzz4PnVbrvBy9YQerUc5rnXFuS8VOfYU0pjRbbd93E3MXngV3AbkNrkvrNaCt5raJQBVF4+Jo/OxuhSB4cGDDNUSa7fqE5balplMnI8OslKjtpwszI8gC6X7eDnBEoX7k+hUUMQHPB5HlvilT2Tvs9JcMqemqK1/cCgFijXB7rAFZeRXs0+yAIKHhX+GcPqlKA9b0y/QamwisA8xtg1qZwUxYyat0feTVH8PYAyHNd7c8/A/+HNXoM6psjSnGbBht4oh/gj0B9yXiuqKPNBHG5/IrwIDAQAB";
    encryptor.setPublicKey(pubKey); //设置公钥
    const rsaPassWord = encryptor.encrypt(values?.password); // 对内容进行加密
    const params = { role, ...values, password: rsaPassWord };
    // handleLoginInfoMsg.run(params);
  };

  /**
   * @description 更改radio的选中值进行切换页面
   * @param e 获取radio的选中值
   */
  const onChange = (e: RadioChangeEvent) => {
    setActiveName(e.target.value);
  };

  /**
   * @description 获取radio选中的值，切换登陆身份
   * @param value 选中的值
   */
  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    setIsVipLogin(pathname?.includes("/iamlogin"));
    let selectRole: 1 | 2 | 3 | 4 = 2;
    const currentRole = storage.get("role") || 2;
    if (pathname?.includes("/iamlogin")) {
      selectRole =
        [3, 4]?.includes(currentRole) || !currentRole ? 2 : currentRole;
    } else if (pathname?.includes("/login")) {
      selectRole =
        [1, 2]?.includes(currentRole) || !currentRole ? 4 : currentRole;
    }
    setActiveName(selectRole);
  }, [pathname]);

  useEffect(() => {
    if (role) storage.set("role", role);
  }, [role]);

  return (
    <div className={styles.loginPage}>
      <div className={styles.main}>
        {process.env.NODE_ENV === "development" && (
          <div className={styles.ribbon}>本地开发环境</div>
        )}
        <div className={styles.mainRight}>
          <h1 className={styles.title}>欢迎使用创世纪管理平台</h1>
          {isVipLogin ? (
            <Radio.Group onChange={onChange} value={role}>
              <Radio value={2}>超级管理员</Radio>
              <Radio value={1}>造物主</Radio>
            </Radio.Group>
          ) : (
            // <Radio.Group onChange={onChange} value={role}>
            //   <Radio value={4}>普通用户</Radio>
            //   <Radio value={3}>权限管理员</Radio>
            //               </Radio.Group>
            <WjRadio
              value={selectedValue}
              onChange={handleRadioChange}
              options={[
                {
                  label: "普通用户",
                  value: "4",
                },
                {
                  label: "权限管理员",
                  value: "3",
                },
              ]}
              configuration={{
                colorRadio: "red",
                mode: "flex",
                jumpX: "10em",
                // jumpX: "3em",
                // jumpY: "-1.5em",
                // widthRadio: "10em",
                //   '--tranlateX': '6.65em',
                //   '--tranlateY': '-2.5em',
              }}
            />
          )}
          <div className={styles.formCard}>
            <Form name="basic" form={form} onFinish={handleSubmit}>
              <Form.Item
                name="loginName"
                rules={[
                  {
                    required: true,
                    message: "请输入用户名（带邮箱后缀）",
                  },
                  {
                    validator(_, value) {
                      const trimValue = value && value.trim();
                      if (
                        !trimValue ||
                        trimValue.endsWith("@163.com") ||
                        trimValue.endsWith("@qq.com")
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("用户名需带邮箱后缀"));
                    },
                  },
                ]}
              >
                <Input
                  placeholder="请输入用户名（带邮箱后缀）"
                  allowClear
                  //   prefix={
                  //     <img
                  //       src={require("../../../assets/iconsvg/login_userName.svg")}
                  //     />
                  //   }
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "请输入密码",
                  },
                ]}
              >
                <Input.Password
                  ref={pwdRef}
                  placeholder="请输入密码"
                  // visibilityToggle={false}
                  //   iconRender={(visiblePwd) =>
                  //     visiblePwd ? (
                  //       <img
                  //         src={require("../../../assets/iconsvg/login_showPwd.svg")}
                  //       />
                  //     ) : (
                  //       <img
                  //         src={require("../../../assets/iconsvg/login_hidePwd.svg")}
                  //       />
                  //     )
                  //   }
                  //   prefix={
                  //     <img
                  //       src={require("../../../assets/iconsvg/login_pwd.svg")}
                  //     />
                  //   }
                />
              </Form.Item>
              {process.env.NODE_ENV === "development" && (
                <Row className={styles.loginInfoCheck}>
                  <Form.Item
                    name="checked"
                    valuePropName="checked"
                    wrapperCol={{
                      offset: 0,
                      span: 24,
                    }}
                  >
                    <Checkbox onChange={onChangePwd} checked={checked}>
                      记住密码
                    </Checkbox>
                  </Form.Item>
                  <Form.Item>
                    {location.pathname === "/iamlogin" ? (
                      <a
                        href={window.location.origin + "/login"}
                        style={{ minHeight: "32px" }}
                      >
                        {"外部登录"}
                      </a>
                    ) : (
                      <a
                        href={window.location.origin + "/iamlogin"}
                        style={{ minHeight: "32px" }}
                      >
                        {"内部登录"}
                      </a>
                    )}
                  </Form.Item>
                </Row>
              )}
              {/* <p className={styles.otpTips}>忘记密码怎么办？</p> */}
              <Form.Item className={styles.submitItem}>
                <Button
                  type="primary"
                  className={styles.submit}
                  htmlType="submit"
                  //   loading={handleLoginInfoMsg?.loading}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
