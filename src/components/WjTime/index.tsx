import React, { useEffect } from "react";
import "./style.less";
export default function Index() {
  var Flipper = /** @class */ (function () {
    function Flipper(node, currentTime, nextTime) {
      this.isFlipping = false;
      this.duration = 600;
      this.flipNode = node;
      this.frontNode = node.querySelector(".front");
      this.backNode = node.querySelector(".back");
      this.setFrontTime(currentTime);
      this.setBackTime(nextTime);
    }
    Flipper.prototype.setFrontTime = function (time) {
      this.frontNode.dataset.number = time;
    };
    Flipper.prototype.setBackTime = function (time) {
      this.backNode.dataset.number = time;
    };
    Flipper.prototype.flipDown = function (currentTime, nextTime) {
      var _this = this;
      if (this.isFlipping) {
        return false;
      }
      this.isFlipping = true;
      this.setFrontTime(currentTime);
      this.setBackTime(nextTime);
      this.flipNode.classList.add("running");
      setTimeout(function () {
        _this.flipNode.classList.remove("running");
        _this.isFlipping = false;
        _this.setFrontTime(nextTime);
      }, this.duration);
    };
    return Flipper;
  })();
  /**
   * 时间格式化
   * @param date
   * @returns
   */
  const getTimeFromDate = function (date) {
    return date.toTimeString().slice(0, 8).split(":").join("");
  };

  useEffect(() => {
    const flips = document.querySelectorAll(".flip");
    const now = new Date();
    const nowTimeStr = getTimeFromDate(new Date(now.getTime() - 1000));
    const nextTimeStr = getTimeFromDate(now);
    const flippers = Array.from(flips).map(function (flip, i) {
      return new Flipper(flip, nowTimeStr[i], nextTimeStr[i]);
    });
    let timer = setInterval(function () {
      const now = new Date();
      const nowTimeStr = getTimeFromDate(new Date(now.getTime() - 1000));
      const nextTimeStr = getTimeFromDate(now);
      for (let i = 0; i < flippers.length; i++) {
        if (nowTimeStr[i] === nextTimeStr[i]) {
          continue;
        }
        flippers[i].flipDown(nowTimeStr[i], nextTimeStr[i]);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div className="time-container">
      <h1 className="on-holiday">距离过年还有</h1>
      <div className="clock">
        <div className="flip">
          <div className="digital front" data-number="0"></div>
          <div className="digital back" data-number="1"></div>
        </div>
        <div className="flip">
          <div className="digital front" data-number="0"></div>
          <div className="digital back" data-number="1"></div>
        </div>
        <em className="divider">:</em>
        <div className="flip">
          <div className="digital front" data-number="0"></div>
          <div className="digital back" data-number="1"></div>
        </div>
        <div className="flip">
          <div className="digital front" data-number="0"></div>
          <div className="digital back" data-number="1"></div>
        </div>
        <em className="divider">:</em>
        <div className="flip">
          <div className="digital front" data-number="0"></div>
          <div className="digital back" data-number="1"></div>
        </div>
        <div className="flip">
          <div className="digital front" data-number="0"></div>
          <div className="digital back" data-number="1"></div>
        </div>
      </div>
    </div>
  );
}
