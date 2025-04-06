importScripts("../../../src/components/LargeFiles/spark-md5.js");
// import SparkMD5 from "https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.min.js";
// importScripts(
//   "https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.min.js"
// );
// const SparkMD5 = require("spark-md5");
function createChunk(file, index, chunkSize) {
  return new Promise((reslove, reject) => {
    const start = index * chunkSize;
    const end = start + chunkSize;
    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();
    const blob = file.slice(start, end);
    fileReader.onload = (e) => {
      spark.append(e.target?.result);
      reslove({
        chunkStart: start,
        chunkEnd: end,
        chunkIndex: index,
        chunkHash: spark.end(),
        chunkBlob: blob,
      });
    };
    fileReader?.readAsArrayBuffer(blob);
  }).catch((err) => {
    throw new Error(err);
  });
}
