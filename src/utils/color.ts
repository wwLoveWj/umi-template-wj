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
  debugger;
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
