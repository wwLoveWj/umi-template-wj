// import { worker_script } from "./worker";
const CHUNK_SIZE = 1024 * 1024 * 5; //5兆
const THREAD_COUNT = navigator.hardwareConcurrency || 4; //CPU数量

export const cutFile = (file: File) => {
  // 切了多少片
  const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
  // 给每个worker线程分多少个任务
  const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT);
  debugger;
  for (let index = 0; index < THREAD_COUNT; index++) {
    // const worker = new Worker(worker_script);
    const worker = new Worker(new URL("./worker.js", import.meta.url));
    // const worker = new Worker("./worker.js", { type: "module" });

    const start = index * threadChunkCount;
    let end = (index + 1) * threadChunkCount;
    //   如果超出切片数，最大只能是切片数
    if (end > chunkCount) end = chunkCount;

    worker.onerror = (err) => {
      console.log("worker================", index, err);
    };
    worker.postMessage({
      file,
      CHUNK_SIZE,
      start,
      end,
    });
    //   接收worker传回来的数据
    worker.onmessage = (e) => {
      console.log(e.data);
    };
  }
};
