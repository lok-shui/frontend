// 绘制裁剪框的凿点(正方形)
function drawTrim(
  sx: number,
  sy: number,
  rw: number,
  rh: number,
  ctx: any,
  canvasW: number,
  canvasH: number
) {
  // 每一帧都需要清除画布
  ctx.clearRect(0, 0, canvasW, canvasH);
  // 绘制蒙层
  ctx.save();
  ctx.fillStyle = "#F0F2F5";
  ctx.fillRect(0, 0, canvasW, canvasH - 11);
  // 将裁剪框凿开
  ctx.globalCompositeOperation = "source-atop";
  ctx.clearRect(sx, sy, rw, rh);
  // 绘制8个节点
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#DC0816";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  let size = 8; // 节点大小
  // 填充色
  ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
  ctx.fillRect(sx - size / 2 + rw / 2, sy - size / 2, size, size);
  ctx.fillRect(sx - size / 2 + rw, sy - size / 2, size, size);
  ctx.fillRect(sx - size / 2, sy - size / 2 + rh / 2, size, size);
  ctx.fillRect(sx - size / 2 + rw, sy - size / 2 + rh / 2, size, size);
  ctx.fillRect(sx - size / 2, sy - size / 2 + rh, size, size);
  ctx.fillRect(sx - size / 2 + rw / 2, sy - size / 2 + rh, size, size);
  ctx.fillRect(sx - size / 2 + rw, sy - size / 2 + rh, size, size);
  // 边框色
  ctx.strokeRect(sx - size / 2, sy - size / 2, size, size);
  ctx.strokeRect(sx - size / 2 + rw / 2, sy - size / 2, size, size);
  ctx.strokeRect(sx - size / 2 + rw, sy - size / 2, size, size);
  ctx.strokeRect(sx - size / 2, sy - size / 2 + rh / 2, size, size);
  ctx.strokeRect(sx - size / 2 + rw, sy - size / 2 + rh / 2, size, size);
  ctx.strokeRect(sx - size / 2, sy - size / 2 + rh, size, size);
  ctx.strokeRect(sx - size / 2 + rw / 2, sy - size / 2 + rh, size, size);
  ctx.strokeRect(sx - size / 2 + rw, sy - size / 2 + rh, size, size);
  ctx.restore();
  // 绘制底图, 将图片绘制到蒙层下方
  ctx.save();
  ctx.globalCompositeOperation = "destination-over";
}

// 裁剪 ====================================================
// 裁剪区域
let newClipArea: any = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};

let isMoved: any = false;

function drawClip(
  clipMark: any,
  msw: number,
  msh: number,
  mrx: number,
  mry: number,
  clipDraw: any,
  imgw: number,
  imgh: number,
  IMAGE: any,
  IW: number,
  IH: number,
  isw: number,
  ish: number,
  csw: number,
  csh: number,
  clipwidth: number,
  clipheight: number,
  markDraw: any,
  clipArea: any,
  clipDrag: boolean
) {
  clipMark.onmousedown = (ed: any) => {
    clipDrag = true;
    const [edx, edy] = [ed.offsetX, ed.offsetY];
    // 裁剪框的四个角
    const point1 =
      edx >= msw - 4 && edx <= msw && edy >= msh - 4 && edy <= msh + 4;
    const point3 = edx <= msw + mrx + 4 && edx >= msw + mrx - 4 && edy <= msh;
    const point5 =
      edx >= msw + mrx - 4 &&
      edx <= msw + mrx + 4 &&
      edy >= msh + mry - 4 &&
      edy <= msh + mry + 4;
    const point7 = edx <= msw && edy >= msh + mry - 4;
    // 裁剪框四条边的中心点
    const point2 =
      edx >= msw + mrx / 2 - 4 &&
      edx <= msw + mrx / 2 + 4 &&
      edy >= msh - 4 &&
      edy <= msh + 4;
    const point4 =
      edx <= msw + mrx + 4 &&
      edx >= msw + mrx - 4 &&
      edy <= msh + mry / 2 + 4 &&
      edy >= msh + mry / 2 - 4;
    const point6 =
      edx <= msw + mrx / 2 + 4 &&
      edx >= msw + mrx / 2 - 4 &&
      edy <= msh + mry + 4 &&
      edy >= msh + mry - 4;
    const point8 =
      edx <= msw + 4 &&
      edx >= msw - 4 &&
      edy <= msh + mry / 2 + 4 &&
      edy >= msh + mry / 2 - 4;

    if (point1 == true) {
      clipMark.onmousemove = (em: any) => {
        if (clipDrag == true) {
          console.log("111em.offsetY-edy");
          mrx = edx - em.offsetX + imgw;
          mry = edy - em.offsetY + imgh;
          msw = em.offsetX;
          msh = em.offsetY;
          drawTrim(msw, msh, mrx, mry, clipDraw, clipwidth, clipheight);
          clipDraw.drawImage(IMAGE, csw, csh, IW, IH);
          isMoved = true;
        }
      };
    }
    //3
    else if (point3 == true) {
      clipMark.onmousemove = (em: any) => {
        if (clipDrag == true) {
          console.log("333em.offsetY-edy", em.offsetY - edy);
          mrx = em.offsetX - edx + imgw;
          mry = edy - em.offsetY + imgh;
          msw = isw;
          msh = em.offsetY;
          drawTrim(msw, msh, mrx, mry, clipDraw, clipwidth, clipheight);
          clipDraw.drawImage(IMAGE, csw, csh, IW, IH);
          isMoved = true;
        }
      };
    }
    //5
    else if (point5 == true) {
      clipMark.onmousemove = (em: any) => {
        if (clipDrag == true) {
          console.log("555em.offsetY-edy", em.offsetY - edy);
          mrx = em.offsetX - edx + imgw;
          mry = em.offsetY - edy + imgh;
          msw = isw;
          msh = ish;
          drawTrim(msw, msh, mrx, mry, clipDraw, clipwidth, clipheight);
          clipDraw.drawImage(IMAGE, csw, csh, IW, IH);
          isMoved = true;
        }
      };
    }
    // 7
    else if (point7 == true) {
      clipMark.onmousemove = (em: any) => {
        if (clipDrag == true) {
          console.log("777em.offsetY-edy", em.offsetY - edy);
          mrx = edx - em.offsetX + imgw;
          mry = em.offsetY - edy + imgh;
          msw = isw - (edx - em.offsetX);
          msh = ish;
          markDraw.clearRect(0, 0, clipwidth, clipheight);
          drawTrim(msw, msh, mrx, mry, clipDraw, clipwidth, clipheight);
          clipDraw.drawImage(IMAGE, csw, csh, IW, IH);
          isMoved = true;
        }
      };
    }
    // 2
    else if (point2 == true) {
      clipMark.onmousemove = (em: any) => {
        if (clipDrag == true) {
          console.log("222em.offsetY-edy", em.offsetY - edy);
          mrx = imgw;
          mry = edy - em.offsetY + imgh;
          [msw, msh] = [isw, em.offsetY];
          markDraw.clearRect(0, 0, clipwidth, clipheight);
          drawTrim(msw, msh, mrx, mry, clipDraw, clipwidth, clipheight);
          clipDraw.drawImage(IMAGE, csw, csh, IW, IH);
          isMoved = true;
        }
      };
    }
    // 4
    else if (point4 == true) {
      clipMark.onmousemove = (em: any) => {
        if (clipDrag == true) {
          console.log("444em.offsetY-edy", em.offsetY - edy);
          mrx = em.offsetX - edx + imgw;
          mry = imgh;
          msw = isw;
          msh = ish;
          markDraw.clearRect(0, 0, clipwidth, clipheight);
          drawTrim(msw, msh, mrx, mry, clipDraw, clipwidth, clipheight);
          clipDraw.drawImage(IMAGE, csw, csh, IW, IH);
          isMoved = true;
        }
      };
    }
    // 6
    else if (point6 == true) {
      clipMark.onmousemove = (em: any) => {
        if (clipDrag == true) {
          console.log("666em.offsetY-edy", em.offsetY - edy);
          mrx = imgw;
          mry = em.offsetY - edy + imgh;
          msw = isw;
          msh = ish;
          markDraw.clearRect(0, 0, clipwidth, clipheight);
          drawTrim(msw, msh, mrx, mry, clipDraw, clipwidth, clipheight);
          clipDraw.drawImage(IMAGE, csw, csh, IW, IH);
          isMoved = true;
        }
      };
    }
    // 8
    else if (point8 == true) {
      clipMark.onmousemove = (em: any) => {
        if (clipDrag == true) {
          console.log("888em.offsetY-edy", em.offsetY - edy);
          mrx = edx - em.offsetX + imgw;
          mry = imgh;
          msw = isw - (edx - em.offsetX);
          msh = ish;
          markDraw.clearRect(0, 0, clipwidth, clipheight);
          drawTrim(msw, msh, mrx, mry, clipDraw, clipwidth, clipheight);
          clipDraw.drawImage(IMAGE, csw, csh, IW, IH);
          isMoved = true;
        }
      };
    } else {
      clipDrag = false;
    }
    clipMark.onmouseup = (eu: any) => {
      clipDrag = false;
      [isw, ish] = [msw, msh];
      imgw = mrx;
      imgh = mry;

      clipArea = {
        x: isw,
        y: ish,
        w: imgw,
        h: imgh
      };
      newClipArea = clipArea;
      console.log("鼠标抬起时的区域", clipArea);
    };
  };
}
// 裁剪后的区域return出去
function changeClipArea1(percent: number) {
  newClipArea.x = newClipArea.x / percent;
  newClipArea.y = newClipArea.y / percent;
  newClipArea.w = newClipArea.w / percent;
  newClipArea.h = newClipArea.h / percent;
  return newClipArea;
}
function changeClipArea() {
  return newClipArea;
}
function isCliped() {
  return isMoved;
}

// 鼠标滑过时对应的item高亮  =======================================
function lightUpArea(canvasCon: any, item: any, color: string) {
  canvasCon.strokeStyle = color;
  canvasCon.lineWidth = 1;
  canvasCon.strokeRect(item.sw, item.sh, item.rw, item.rh);
  canvasCon.fillStyle = color;
  canvasCon.fillRect(item.sw, item.sh, item.rw, item.rh);
}
// 绘制参照区矩形
function drawReferenceRect(canvasText: any, item: any) {
  canvasText.strokeStyle = "rgba(46,187,161,0.2)";
  canvasText.lineWidth = 1;
  canvasText.strokeRect(item.sw, item.sh, item.rw, item.rh);
  canvasText.fillStyle = "rgba(46,187,161,0.2)";
  canvasText.fillRect(item.sw, item.sh, item.rw, item.rh);
}
// 绘制当前参照区矩形
function drawCurrentRef(
  canvasText: any,
  sw: number,
  sh: number,
  rw: number,
  rh: number
) {
  canvasText.strokeStyle = "rgba(46,187,161,0.2)";
  canvasText.lineWidth = 1;
  canvasText.strokeRect(sw, sh, rw, rh);
  canvasText.fillStyle = "rgba(46,187,161,0.2)";
  canvasText.fillRect(sw, sh, rw, rh);
}
// 绘制识别区矩形
function drawIdenRect(canvasCon: any, item: any) {
  canvasCon.strokeStyle = "rgba(24,144,255,0.2)";
  canvasCon.lineWidth = 1;
  canvasCon.strokeRect(item.sw, item.sh, item.rw, item.rh);
  canvasCon.fillStyle = "rgba(24,144,255,0.2)";
  canvasCon.fillRect(item.sw, item.sh, item.rw, item.rh);
}
// 绘制当前参照区矩形
function drawCurrentIden(
  canvasText: any,
  sw: number,
  sh: number,
  rw: number,
  rh: number
) {
  canvasText.strokeStyle = "rgba(24,144,255,0.2)";
  canvasText.lineWidth = 1;
  canvasText.strokeRect(sw, sh, rw, rh);
  canvasText.fillStyle = "rgba(24,144,255,0.2)";
  canvasText.fillRect(sw, sh, rw, rh);
}

// 框选后识别对应的文字
function changeOcrResult(coor: Array<number>, coordinate: any) {
  let str = "";
  coordinate.forEach((item: any, key: number) => {
    const [isw, ish, iw, ih] = [
      item.rect.left,
      item.rect.top,
      item.rect.width,
      item.rect.height
    ];
    const [idw, idh] = [isw + iw, ish + ih];
    // 外框：超过文字的top height isw
    if (coor[0] < isw && coor[1] < ish && coor[2] > idw && coor[3] > idh) {
      console.log("匹配的item1", item.words);
      str += `${item.words}`;
    }
    // 下框：稍微超过文字的idh， 小于height/2
    if (
      coor[0] <= isw &&
      coor[1] > ish &&
      coor[1] < ish + ih / 2 &&
      coor[2] > idw &&
      coor[3] > idh
    ) {
      console.log("匹配的item2", item.words);
      str += `${item.words}`;
    }
    // 上框：
    if (
      coor[0] <= isw &&
      coor[1] < ish &&
      coor[2] > idw &&
      coor[3] > ish + ih / 2 &&
      coor[3] < idh
    ) {
      console.log("匹配的item3", item.words);
      str += `${item.words}`;
    }
    // 内框：
    if (coor[0] <= isw && coor[1] >= ish && coor[2] >= idw && coor[3] <= idh) {
      console.log("匹配的item4", item.words);
      str += `${item.words}`;
    }
  });
  return str;
}

export default {
  drawTrim,
  drawClip,
  changeClipArea,
  lightUpArea,
  drawReferenceRect,
  drawIdenRect,
  changeOcrResult,
  drawCurrentRef,
  drawCurrentIden,
  isCliped
};
