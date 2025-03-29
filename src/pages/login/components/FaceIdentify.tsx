import React, { useEffect } from "react";

export default function FaceIdentify() {
  useEffect(() => {
    const img = document.querySelector("img") as HTMLImageElement;
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      debugger;
      if ("FaceDetector" in window) {
        const faceDetector = new FaceDetector().detect(img);
        faceDetector.then((faces) => {
          faces.forEach((face) => {
            ctx.beginPath();
            ctx.arc(
              face.boundingBox.x + face.boundingBox.width / 2,
              face.boundingBox.y + face.boundingBox.height / 2,
              face.boundingBox.width / 2,
              0,
              2 * Math.PI
            );
            ctx.stroke();
          });
        });
      } else {
        console.log("FaceDetector not supported");
      }
    };
  }, []);

  return (
    <div style={{ height: "500px" }}>
      <canvas></canvas>
      <img src="" alt="" />
    </div>
  );
}
