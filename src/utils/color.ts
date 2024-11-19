import { message } from "antd";
// 系统主色
export const SystemMainColor = [
  "#1485FF",
  "#B48DF3",
  "#7A7FFF",
  "#60C041",
  "#38C0FC",
  "#F9901F",
  "#FF80C8",
];

export function getCssVariable(str: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(str);
}

/**
 * hex颜色转rgb颜色
 * @param str 颜色值字符串
 * @returns 返回处理后的颜色值
 */
export function hexToRgb(str: any) {
  let hexs: any = "";
  const reg = /^#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(str)) return message.warning("输入错误的hex");
  str = str.replace("#", "");

  hexs = str.match(/../g);

  for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16);
  return hexs;
}
// 将hex颜色转成rgb  例如(#F55442, 1)
export function hexToRgba(
  hex: string,
  opacity: number
): { red: number; green: number; blue: number; rgba: string } {
  // 移除可能存在的 # 前缀并转换为大写
  hex = hex.replace(/^#/, "").toUpperCase();

  // 如果是缩写形式（如 FFF），转换为完整形式
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char.repeat(2))
      .join("");
  }
  // 验证 hex 格式
  if (!/^[0-9A-F]{6}$/.test(hex)) {
    throw new Error("Invalid hex color format");
  }

  // 解析 RGB 值
  const [red, green, blue] = hex.match(/\w\w/g)!.map((x) => parseInt(x, 16));

  // 确保 opacity 在有效范围内
  opacity = Math.max(0, Math.min(1, opacity));

  // 构建 RGBA 字符串
  const rgba = `rgba(${red}, ${green}, ${blue}, ${opacity.toFixed(2)})`;

  return { red, green, blue, rgba };
}

// 将rgb颜色转成hex  例如(24,12,255)
export function rgbToHex(r: any, g: any, b: any) {
  const hex =
    "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}

const colorList = [
  "#D8F8FF",
  "#FDDFD9",
  "#FCE6F0",
  "#D3F8F0",
  "#FFEABC",
  "#F5E1FF",
  "#E1E6FE",
];

export const SystemGradientColor = [
  "linear-gradient(310deg, #50D0FF, #50A3FF)",
  "linear-gradient(310deg, #998DF3, #B48DF3)",
  "linear-gradient(310deg, #7AA2FF, #7A7FFF)",
  "linear-gradient(310deg, #7EC041, #60C041)",
  "linear-gradient(310deg, #6ACFFC, #38C0FC)",
  "linear-gradient(310deg, #FFAB4D, #F9901F)",
  "linear-gradient(310deg, #FF99D3, #FF80C8)",
];

let lastColor: string | null = null;
export const randomColor = () => {
  let newColor: string;

  do {
    const index = Math.floor(Math.random() * colorList.length);
    newColor = colorList[index];
  } while (newColor === lastColor);

  lastColor = newColor;
  return newColor;
};

/**
 * 加深颜色值
 * @param color 颜色值字符串
 * @param level 加深的程度，限0-1之间
 * @returns 返回处理后的颜色值
 */
export function getDarkColor(color: string, level: number) {
  const reg = /^#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(color)) return message.warning("输入错误的hex颜色值");
  const rgb = hexToRgb(color);
  for (let i = 0; i < 3; i++)
    rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

/**
 * 变浅颜色值
 * @param color 颜色值字符串
 * @param level 加深的程度，限0-1之间
 * @returns 返回处理后的颜色值
 */
export function getLightColor(color: string, level: number) {
  const reg = /^#?[0-9A-Fa-f]{6}$/;
  if (!reg.test(color)) return message.warning("输入错误的hex颜色值");
  const rgb = hexToRgb(color);

  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.round(255 * level + rgb[i] * (1 - level));
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}
