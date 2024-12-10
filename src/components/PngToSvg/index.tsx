import React, { useEffect } from "react";
import { Button } from "antd";
export default function index() {
  // 返回文件(图片的宽和高)
  function getImageWH(file: any, callback: (w: number, h: number) => void) {
    // 创建一个FileReader实例
    const reader = new FileReader();
    // 当文件读取完成时触发
    reader.onload = function (e) {
      // e 这个对象中包含这个图片相关的属性
      let result = e?.target?.result as string;
      // 创建一个新的Image对象
      const img = new Image();
      // 设置Image的src为读取到的文件内容
      img.src = result;
      // 当图片加载时触发
      img.onload = function () {
        // 调用回调函数，并传入图片的宽高
        callback(img.width, img.height);
        let width = img.width;
        let height = img.height;
        let dataURL = result;
        //svg 的dom节点(字符串)
        var svgString = `<svg id="downloadSvg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    width="${width}px" height="${height}px"
    viewBox="0 0 ${width} ${height}" enable-background="new 0 0 ${width} ${height}" xml:space="preserve">
        <image id="image0" width="${width}" height="${height}" x="0" y="0" href="${dataURL}"></image>
    </svg>`;
        let contanier = document.getElementById("container") as HTMLDivElement;
        //把svg插入到页面中
        // $("#container").append(svgString);
        contanier.innerHTML = svgString;
      };
    };
    // 开始读取文件内容，以DataURL的形式
    // reader.onload 方法的执行需要调用下面这个 reader.readAsDataURL
    if (file) reader.readAsDataURL(file);
  }

  // 读取文件,然后返回宽度和高度
  function readFile(e: any) {
    let file = e.target.files[0];
    getImageWH(file, function (width: number, height: number) {
      console.log("Width:", width, "Height:", height);
    });
  }

  useEffect(() => {
    // 获取文件节点
    let fileNode = document.getElementById("file") as HTMLInputElement;
    // 给文件节点注册事件
    fileNode.addEventListener("change", readFile);
  }, []);

  //下载功能
  function download(arg: any) {
    var blob = new Blob([arg], { type: "image/svg" });
    var href = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = href;
    a.download = "download.svg"; //设置下载svg的名称
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
  }

  return (
    <div>
      <p>图片地址：</p>
      <div id="container"></div>
      <br />
      <br />
      <br />
      <p>转换为svg：</p>
      <p>
        <Button
          onClick={() => {
            let svgDom = document.querySelector("#downloadSvg");
            if (svgDom) {
              download(svgDom.outerHTML);
            }
          }}
        >
          下载svg
        </Button>
        <input type="file" id="file" accept="image/*" />
      </p>
    </div>
  );
}
