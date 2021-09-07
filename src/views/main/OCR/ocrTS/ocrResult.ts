const sortWords = function(imageWords: any) {
  imageWords.sort((a: any, b: any) => {
    let y1 = a.rect.top;
    let y2 = a.rect.top + a.rect.height;
    let y3 = b.rect.top;
    let y4 = b.rect.top + b.rect.height;
    let yTopMin = Math.min(y1, y3);
    let yTopMax = Math.max(y1, y3);
    let yBottomMin = Math.min(y2, y4);
    let yBottomMax = Math.max(y2, y4);
    //
    let s = (yBottomMin - yTopMax) / (yBottomMax - yTopMin);
    if (s >= 0.7) {
      // 一行
      if (a.rect.left < b.rect.left) {
        return -1;
      } else {
        return 1;
      }
    }
  });
};

const rectangleCol = function(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
) {
  const maxX = x1 + w1 >= x2 + w2 ? x1 + w1 : x2 + w2;
  const maxY = y1 + h1 >= y2 + h2 ? y1 + h1 : y2 + h2;
  const minX = x1 <= x2 ? x1 : x2;
  const minY = y1 <= y2 ? y1 : y2;
  const col = maxX - minX <= w1 + w2 && maxY - minY <= h1 + h2;
  return col;
};

const getArea = function(v1: any, v2: any) {
  let p1, p2;
  if (v1.left < v2.left) {
    p1 = v1;
    p2 = v2;
  } else {
    p1 = v2;
    p2 = v1;
  }
  //
  let x1 = p1.left;
  let y1 = p1.top;
  let x2 = p1.left + p1.width;
  let y2 = p1.top + p1.height;
  let x3 = p2.left;
  let y3 = p2.top;
  let x4 = p2.left + p2.width;
  let y4 = p2.top + p2.height;
  //
  const lens = Math.min(x2, x4) - Math.max(x1, x3);
  const wide = Math.min(y2, y4) - Math.max(y1, y3);
  return lens * wide;
};

function getWords(imageWords: any, userOp: any) {
  sortWords(imageWords);
  let s = "";
  for (let e of imageWords) {
    const point = e.rect;
    const isExist = rectangleCol(
      userOp.left,
      userOp.top,
      userOp.width,
      userOp.height,
      point.left,
      point.top,
      point.width,
      point.height
    );
    if (isExist) {
      //矩形相交，求面积
      const t1 = getArea(point, userOp);
      // 字的面积
      const t2 = point.width * point.height;
      const t3 = t1 / t2;
      if (t3 > 0.4) {
        s += e.words;
      }
    }
  }
  return s;
}

export default {
  getWords
};
