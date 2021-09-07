// canvas绘制图片，由于浏览器的安全考虑，如果在使用canvas绘图的过程中，使用到了外域的图片资源，那么在toDataURL()时会抛出安全异常：
// 除了当前执行canvas前开启跨域（img.crossOrigin = 'Anonymous'）外，服务端也必须开启允许跨域。
export function baseImage(image: any) {
  // 创建一个 canvas 元素并获取其上下文
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  const ctx: any = canvas.getContext("2d");

  canvas.width = image.width;
  canvas.height = image.height;
  // 绘制图片
  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  // console.log("compressImage图片的base64", canvas.toDataURL("image/jpeg", 0.4));
  // 使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
  return canvas.toDataURL("image/jpeg", 0.4);
}

// --------------------------------------------------------------------------------------------------------------
// 图片url, /service/替换成/static/ ，后缀改为txt, 组成新的文本url
export function jsonSource(url: string) {
  let staticUrl = url.replace(/\/service\//g, "/static/");
  const suffixName = staticUrl.substring(staticUrl.lastIndexOf(".") + 1); // 获取后缀名
  const newTxtUrl = staticUrl.replace(suffixName, "txt");
  return newTxtUrl;
}

// --------------------------------------------------------------------------------------------------------------
// 判断网络图片url的后缀格式（目前只判断jpg\png\jpeg三种格式的）
export function fitImgSuffix(url: string, hasSuffix: boolean) {
  // const fit = ['.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp', '.psd', '.svg', '.tiff'];
  const fit = [".png", ".jpg", ".jpeg", ".PNG", ".JPG", ".JPEG"];
  const urlName = url.substring(url.lastIndexOf("/") + 1); // 获取网络图片的名字
  const urlSuffix = urlName.substring(urlName.lastIndexOf(".")); // 获取网络图片的格式
  if (fit.indexOf(urlSuffix) == -1 && hasSuffix == true) {
    const message = "请上传jpg或png格式的图片";
    return message;
  }
}

// require.context('需要读取的文件路径', false, /.svg$/)
// require.context接收三个参数，第一个是文件路径，第二个是是否读取子文件。false不读取， 第三个参数
// 是个正则表达式： .svg匹配以.svg文件结尾的文件
export function fileItemName() {
  const iconName: any = [];
  const files = require
    .context("@/assets/images/newicon", false, /.svg$/)
    .keys();
  files.forEach((item: any) => {
    const aa = item.replace("./", "").replace(".svg", "");
    iconName.push(aa);
  });
  return iconName;
}
