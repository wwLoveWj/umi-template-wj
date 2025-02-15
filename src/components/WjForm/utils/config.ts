import {
  Button,
  Col,
  Form,
  Row,
  Space,
  Input,
  Select,
  InputNumber,
  Card,
  DatePicker,
  TimePicker,
  Radio,
  Slider,
  Rate,
} from "antd";
import WjBtnConfigForm from "../../WjBtnConfigForm/index";

export type ComponentsType = {
  card: typeof Card;
  space: typeof Space;
  col: typeof Col;
  row: typeof Row;
  button: typeof Button;
  formitem: typeof Form.Item;
  wjfrom: typeof Form;
  search: typeof Input.Search;
  select: typeof Select;
  textarea: typeof Input.TextArea;
  input: typeof Input;
  number: typeof InputNumber;
  password: typeof Input.Password;
  date: typeof DatePicker;
  time: typeof TimePicker;
  searchForm: typeof WjBtnConfigForm;
  radio: typeof Radio.Group;
  slider: typeof Slider;
  rate: typeof Rate;
};

const components: ComponentsType = {
  card: Card,
  space: Space,
  col: Col,
  row: Row,
  button: Button,
  formitem: Form.Item,
  wjfrom: Form,
  search: Input,
  select: Select,
  textarea: Input.TextArea,
  input: Input,
  number: InputNumber,
  password: Input.Password,
  date: DatePicker,
  time: TimePicker,
  searchForm: WjBtnConfigForm,
  radio: Radio.Group,
  slider: Slider,
  rate: Rate,
};

export default components;
