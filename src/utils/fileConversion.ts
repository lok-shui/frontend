// blob转为base64
function blobToBase64(blob: any) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      resolve(e.target.result);
    };
    // readAsDataURL
    fileReader.readAsDataURL(blob);
    fileReader.onerror = () => {
      reject(new Error("blobToBase64 error"));
    };
  });
}

// base64转为blob（方法1）
function translateBase64ImgToBlob(base64: any, contentType: any) {
  let arr = base64.split(",");
  let bstr = atob(arr[1]);
  let leng = bstr.length;
  let u8arr = new Uint8Array(leng);
  while (leng--) {
    u8arr[leng] = bstr.charCodeAt(leng);
  }
  let blob = new Blob([u8arr], { type: contentType });
  const blobImg = {
    url: URL.createObjectURL(blob),
    name: new Date().getTime() + ".png"
  };
  return blobImg;
}
// base64转为blob（方法2）

function base64ToBlob(dataurl: string) {
  let arr: any = dataurl.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// URL(如网络图片)转为文件
function dataURLtoFile(dataurl: any, filename: any) {
  let arr: any = dataurl.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// 转为base64
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default {
  blobToBase64,
  translateBase64ImgToBlob,
  base64ToBlob,
  dataURLtoFile,
  getBase64
};
