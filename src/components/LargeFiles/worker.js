// worker.js
// 方法一：
// 定义worker线程脚本代码
// const workercode = () => {
//   self.importScripts("../../../src/components/LargeFiles/createChunk.js");
//   self.onmessage = async (e) => {
//     const { file, CHUNK_SIZE, start, end } = e.data;
//     let result = [];
//     for (let index = start; index < end; index++) {
//       result.push(createChunk(file, index, CHUNK_SIZE));
//     }
//     const chunks = await Promise.all(result);
//     self.postMessage(chunks); // here it's working without self
//   };
// };
// // 把脚本代码转为string
// let code = workercode.toString();
// code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

// const blob = new Blob([code], { type: "application/javascript" });
// export const worker_script = URL.createObjectURL(blob);

// 方法二：
importScripts("../../../src/components/LargeFiles/createChunk.js");
// import { createChunk } from "./createChunk";

onmessage = async (e) => {
  const { file, CHUNK_SIZE, start, end } = e.data;
  let result = [];
  for (let index = start; index < end; index++) {
    result.push(createChunk(file, index, CHUNK_SIZE));
  }
  const chunks = await Promise.all(result);
  postMessage(chunks); // here it's working without self
};
