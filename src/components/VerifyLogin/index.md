### 外部使用

```
import VerifyLogin from "@/components/VerifyLogin";

const [isClickPass, setIsClickPass] = useState(false); //记录是否点击过通过按钮
const [isPassing, setIsPassing] = useState(false); //是否通过了校验
// 控制是否通过校验
const chgValue = (isPassingvalue: boolean) => {
  setIsPassing(isPassingvalue);
};

在登录按钮处加入：
// 判断是否通过滑块校验
if (!isPassing) {
    setIsClickPass(true);
    return;
}
页面中：
<VerifyLogin
    isClickPass={isClickPass}
    isPassing={isPassing}
    chgValue={chgValue}
/>
```
