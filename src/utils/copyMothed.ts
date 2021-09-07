export function windownCopy(key: any) {
  let url = key;
  let oInput = document.createElement("input");
  oInput.value = url;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  console.log(oInput.value);
  document.execCommand("Copy"); // 执行浏览器复制命令
  return true;
}
