import React from "react";
import "./style.less";
const elevatorList = [
  {
    title: "海绵宝宝",
  },
  {
    title: "多啦A梦",
  },
  {
    title: "海贼王",
  },
  {
    title: "胡歌",
  },
];
const animationList = [
  {
    name: "海绵宝宝",
    imgUrlList: [
      "https://img0.baidu.com/it/u=1075588657,2462494969&fm=253&fmt=auto&app=138&f=JPEG?w=1395&h=800",
      "http://img2.baidu.com/it/u=1807551831,1268787679&fm=253&app=138&f=JPEG?w=1423&h=800",
      "http://img2.baidu.com/it/u=1576622884,3140563851&fm=253&app=138&f=JPEG?w=1422&h=800",
      "https://img0.baidu.com/it/u=1075588657,2462494969&fm=253&fmt=auto&app=138&f=JPEG?w=1395&h=800",
      "https://img0.baidu.com/it/u=1075588657,2462494969&fm=253&fmt=auto&app=138&f=JPEG?w=1395&h=800",
      "https://img1.baidu.com/it/u=4283091602,629952980&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
      "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Ffe48f21e-adc0-402a-9a30-eff7e3a902b4%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1734960741&t=eb1e9dd7b895abedf6dd2f0895ddf4a0",
    ],
  },
  {
    name: "多啦A梦",
    imgUrlList: [
      "https://img0.baidu.com/it/u=2805507919,149197406&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500",
      "https://img0.baidu.com/it/u=1075588657,2462494969&fm=253&fmt=auto&app=138&f=JPEG?w=1395&h=800",
      "https://img0.baidu.com/it/u=2733494835,1546549386&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500",
      "https://img2.baidu.com/it/u=3890155182,1102467613&fm=253&fmt=auto&app=120&f=JPEG?w=950&h=534",
      "https://img1.baidu.com/it/u=2897659963,1908415984&fm=253&fmt=auto&app=138&f=JPEG?w=686&h=500",
      "http://img2.baidu.com/it/u=1807551831,1268787679&fm=253&app=138&f=JPEG?w=1423&h=800",
      "http://img2.baidu.com/it/u=1576622884,3140563851&fm=253&app=138&f=JPEG?w=1422&h=800",
      "https://img0.baidu.com/it/u=1075588657,2462494969&fm=253&fmt=auto&app=138&f=JPEG?w=1395&h=800",
    ],
  },
  {
    name: "海贼王",
    imgUrlList: [
      "https://img0.baidu.com/it/u=1075588657,2462494969&fm=253&fmt=auto&app=138&f=JPEG?w=1395&h=800",
      "http://img2.baidu.com/it/u=1807551831,1268787679&fm=253&app=138&f=JPEG?w=1423&h=800",
      "http://img2.baidu.com/it/u=1576622884,3140563851&fm=253&app=138&f=JPEG?w=1422&h=800",
      "https://img0.baidu.com/it/u=1075588657,2462494969&fm=253&fmt=auto&app=138&f=JPEG?w=1395&h=800",
      "https://pic.rmb.bdstatic.com/a3fb7838ed01885e94fd83bcaefe967f.jpeg@wm_2,t_55m+5a625Y+3L+mAl+S5kOmAl+S6hg==,fc_ffffff,ff_U2ltSGVp",
      "https://img1.baidu.com/it/u=4283091602,629952980&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500",
      "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Ffe48f21e-adc0-402a-9a30-eff7e3a902b4%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1734960741&t=eb1e9dd7b895abedf6dd2f0895ddf4a0",
      "https://img0.baidu.com/it/u=2805507919,149197406&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500",
      "https://image.baidu.com/search/detail?ct=503316480&z=0&tn=baiduimagedetail&ipn=d&word=%E5%93%86%E5%95%A6A%E6%A2%A6%E5%9B%BE%E7%89%87&step_word=&lid=8469242326571947110&ie=utf-8&in=&cl=2&lm=-1&st=-1&hd=undefined&latest=undefined&copyright=undefined&cs=2636537330,509226418&os=3266774987,3700533721&simid=4244964384,634789748&pn=177&rn=1&di=7416423379248349185&ln=1841&fr=&fmq=1732368776402_R&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=2&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=96&objurl=https%3A%2F%2Fi1.hdslb.com%2Fbfs%2Farchive%2F9d4171037fce594939afb2ac956c5acc16300d01.jpg&rpstart=0&rpnum=0&adpicid=0&nojc=undefined&dyTabStr=MCwzLDEsMiwxMyw3LDYsNSwxMiw5",
      "https://img0.baidu.com/it/u=2733494835,1546549386&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500",
      "https://img2.baidu.com/it/u=3890155182,1102467613&fm=253&fmt=auto&app=120&f=JPEG?w=950&h=534",
      "https://img1.baidu.com/it/u=2897659963,1908415984&fm=253&fmt=auto&app=138&f=JPEG?w=686&h=500",
      "http://img2.baidu.com/it/u=1807551831,1268787679&fm=253&app=138&f=JPEG?w=1423&h=800",
      "http://img2.baidu.com/it/u=1576622884,3140563851&fm=253&app=138&f=JPEG?w=1422&h=800",
      "https://img0.baidu.com/it/u=1075588657,2462494969&fm=253&fmt=auto&app=138&f=JPEG?w=1395&h=800",
      "https://img0.baidu.com/it/u=2805507919,149197406&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500",
      "https://image.baidu.com/search/detail?ct=503316480&z=0&tn=baiduimagedetail&ipn=d&word=%E5%93%86%E5%95%A6A%E6%A2%A6%E5%9B%BE%E7%89%87&step_word=&lid=8469242326571947110&ie=utf-8&in=&cl=2&lm=-1&st=-1&hd=undefined&latest=undefined&copyright=undefined&cs=2636537330,509226418&os=3266774987,3700533721&simid=4244964384,634789748&pn=177&rn=1&di=7416423379248349185&ln=1841&fr=&fmq=1732368776402_R&ic=undefined&s=undefined&se=&sme=&tab=0&width=undefined&height=undefined&face=undefined&is=0,0&istype=2&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=96&objurl=https%3A%2F%2Fi1.hdslb.com%2Fbfs%2Farchive%2F9d4171037fce594939afb2ac956c5acc16300d01.jpg&rpstart=0&rpnum=0&adpicid=0&nojc=undefined&dyTabStr=MCwzLDEsMiwxMyw3LDYsNSwxMiw5",
      "https://img0.baidu.com/it/u=2733494835,1546549386&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500",
      "https://img2.baidu.com/it/u=3890155182,1102467613&fm=253&fmt=auto&app=120&f=JPEG?w=950&h=534",
      "https://img1.baidu.com/it/u=2897659963,1908415984&fm=253&fmt=auto&app=138&f=JPEG?w=686&h=500",
      "http://img2.baidu.com/it/u=1807551831,1268787679&fm=253&app=138&f=JPEG?w=1423&h=800",
      "http://img2.baidu.com/it/u=1576622884,3140563851&fm=253&app=138&f=JPEG?w=1422&h=800",
      "https://img0.baidu.com/it/u=1075588657,2462494969&fm=253&fmt=auto&app=138&f=JPEG?w=1395&h=800",
    ],
  },
  {
    name: "胡歌",
    imgUrlList: [
      "https://img0.baidu.com/it/u=2805507919,149197406&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500",
      "https://img0.baidu.com/it/u=1075588657,2462494969&fm=253&fmt=auto&app=138&f=JPEG?w=1395&h=800",
      "https://img0.baidu.com/it/u=2733494835,1546549386&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500",
      "https://img2.baidu.com/it/u=3890155182,1102467613&fm=253&fmt=auto&app=120&f=JPEG?w=950&h=534",
      "https://img1.baidu.com/it/u=2897659963,1908415984&fm=253&fmt=auto&app=138&f=JPEG?w=686&h=500",
    ],
  },
];
export default function ElevatorNavigation() {
  return (
    <div className="elevator" style={{ timelineScope: "--t0,--t1,--t2,--t3" }}>
      <ul className="nav">
        {elevatorList?.map((item, index) => (
          <li>
            <a href={`#t${index}`} style={{ "--s": `--t${index}` }}>
              {item?.title}
            </a>
          </li>
        ))}
      </ul>
      <h1>电梯导航</h1>
      {animationList?.map((item, index) => (
        <dl className="content" style={{ "--s": `--t${index}` }}>
          <dt id={`t${index}`}>{item?.name}</dt>
          <dd>
            {item?.imgUrlList?.map((url) => (
              <img src={url} alt="" />
            ))}
          </dd>
        </dl>
      ))}
    </div>
  );
}
