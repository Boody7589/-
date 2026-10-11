// ===== sides.js: محطة البطاطس والمشروبات =====

function drawPotatoBin() {
  const b = POTATO_BIN;
  withShadow(14, 6, "rgba(0,0,0,0.35)", function () {
    fillRound(b.x, b.y, b.w, b.h, 16, vGradient(b.y, b.y + b.h, "#d3dae0", "#9aa3ab"));
  });
  fillRound(b.x + 10, b.y + 10, b.w - 20, b.h - 20, 10, "#4a525a");
  drawEllipse(b.x + 42, b.y + 92, 24, 16, "#c9a15a");
  drawEllipse(b.x + 90, b.y + 90, 24, 16, "#b98d46");
  drawEllipse(b.x + 66, b.y + 66, 24, 16, "#c9a15a");
  drawEllipse(b.x + 58, b.y + 62, 5, 3, "#a8803a");
  if (game.stock.potatoes <= 0 && game.up.fries > 0) {
    fillRound(b.x, b.y, b.w, b.h, 16, "rgba(0,0,0,0.6)");
    drawText("خلص!", b.x + b.w / 2, b.y + 75, 24, "#ff7a70");
  }
  if (game.hover === "bin-potato") {
    roundRectPath(b.x - 3, b.y - 3, b.w + 6, b.h + 6, 18);
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  drawText("بطاطس x" + game.stock.potatoes, b.x + b.w / 2, 630, 17, "#1a110b");
  if (game.up.fries < 1) {
    drawLockOverlay(b.x, b.y, b.w, b.h, 16, "مقفول");
  }
}

function drawFryer() {
  withShadow(18, 8, "rgba(0,0,0,0.45)", function () {
    fillRound(300, 440, 350, 210, 16, vGradient(440, 650, "#c93a34", "#7a1a17"));
  });
  drawText("القلاية", 475, 468, 20, "#fff3df");

  for (let i = 0; i < FRYER_SLOTS.length; i++) {
    const s = FRYER_SLOTS[i];
    const p = game.fryer[i];
    // الزيت
    fillRound(s.x - 56, s.y - 40, 112, 80, 10, vGradient(s.y - 40, s.y + 40, "#e6b73a", "#b8861a"));
    fillRound(s.x - 50, s.y - 36, 100, 8, 4, "rgba(255,255,255,0.3)");
    if (i >= fryerSlots()) {
      drawLockOverlay(s.x - 56, s.y - 40, 112, 80, 10, "مقفول");
      continue;
    }
    if (p === null || p.arriving) {
      continue;
    }
    const done = getFryDoneness(p.cook);
    drawSteam(s.x, s.y - 30, 1);
    // الفقاعات
    for (let k = 0; k < 5; k++) {
      const bx = s.x - 40 + k * 20;
      const by = s.y + 20 - ((game.time * 30 + k * 13) % 40);
      drawEllipse(bx, by, 3, 3, "rgba(255,255,255,0.55)");
    }
    // السبت والبطاطس
    ctx.strokeStyle = "#2b1d14";
    ctx.lineWidth = 3;
    ctx.strokeRect(s.x - 46, s.y - 30, 92, 56);
    fillRound(s.x + 46, s.y - 6, 40, 10, 4, "#1a110b");
    let col = "#e8b53a";
    if (done === "raw") {
      col = "#f3e3a0";
    } else if (done === "burnt") {
      col = "#6b4a1a";
    }
    for (let k = 0; k < 8; k++) {
      fillRound(s.x - 38 + k * 10, s.y - 26 + (k % 3) * 3, 6, 44, 2, col);
    }
    // شريط التقدم
    let barColor = "#f2b134";
    if (done === "cooked") {
      barColor = "#5aa335";
    } else if (done === "burnt") {
      barColor = "#d62f2a";
    }
    fillRound(s.x - 50, s.y + 52, 100, 10, 5, "#2b1d14");
    fillRound(s.x - 50, s.y + 52, Math.max(10, 100 * Math.min(p.cook / FRY_MAX, 1)), 10, 5, barColor);
    ctx.fillStyle = "#fff3df";
    ctx.fillRect(s.x - 50 + 100 * (FRY_RAW_UNTIL / FRY_MAX), s.y + 50, 2, 14);
    ctx.fillRect(s.x - 50 + 100 * (FRY_BURNT_AFTER / FRY_MAX), s.y + 50, 2, 14);
    if (game.hover === "fry-" + i) {
      roundRectPath(s.x - 62, s.y - 46, 124, 112, 12);
      ctx.strokeStyle = "#fff3df";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
  drawText("الشريط: أصفر بيضا | أخضر دهبي | أحمر محروق", 475, 636, 13, "#fff3df");
  if (game.up.fries < 1) {
    drawLockOverlay(300, 440, 350, 210, 16, "القلاية مقفولة - افتحها من التطويرات");
  }
}

// ماكينة المشروبات (soda machine)
function drawSodaMachine() {
  withShadow(18, 8, "rgba(0,0,0,0.4)", function () {
    fillRound(960, 250, 270, 400, 18, vGradient(250, 650, "#c93a34", "#7a1a17"));
  });
  fillRound(975, 262, 240, 44, 10, "#fff3df");
  drawText("مشروبات", 1095, 293, 26, "#7a1a17");

  // الحنفيات
  fillRound(1030, 384, 20, 24, 4, "#2b1d14");
  fillRound(1150, 384, 20, 24, 4, "#2b1d14");

  // مكان الكوباية
  const slot = SODA.cupSlot;
  fillRound(slot.x - 10, 440, slot.w + 20, 160, 10, "rgba(0,0,0,0.3)");
  fillRound(1010, 592, 160, 14, 6, "#7d868e");

  const s = game.soda;
  let status = "خد كوباية فاضية";
  if (s !== null) {
    if (s.drink === null) {
      status = "اختار نكهة";
    } else if (s.fill < 1) {
      status = "بتتملي...";
    } else {
      status = "خدها!";
    }
    drawCup(1090, 590, 1.5, s.drink, s.fill);
    if (s.drink !== null && s.fill < 1) {
      const nx = s.drink === "cola" ? 1040 : 1160;
      ctx.strokeStyle = s.drink === "cola" ? "#4a2615" : "#f08a1c";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(nx, 408);
      ctx.lineTo(nx, 430);
      ctx.lineTo(1090, 590 - 46 * 1.5 * s.fill - 6);
      ctx.stroke();
    }
  }
  drawText(status, 1095, 458, 18, "#fff3df");
  if (game.hover === "soda-cup") {
    roundRectPath(slot.x - 3, slot.y - 3, slot.w + 6, slot.h + 6, 12);
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // الكبايات الفاضية
  const st = SODA.stack;
  fillRound(st.x - 6, st.y + 96, st.w + 12, 14, 6, "#7d868e");
  for (let k = 0; k < 4; k++) {
    drawCup(st.x + 50, st.y + 100 - k * 14, 1.0, null, 0);
  }
  drawText("كبايات x" + game.stock.cups, st.x + 50, 630, 17, "#1a110b");
  if (game.hover === "soda-stack") {
    roundRectPath(st.x - 6, st.y - 14, st.w + 12, st.h + 28, 12);
    ctx.strokeStyle = "#1a110b";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  if (game.up.drinks < 1) {
    drawLockOverlay(960, 250, 270, 400, 18, "الماكينة مقفولة - افتحها من التطويرات");
    drawLockOverlay(st.x - 6, st.y - 14, st.w + 12, st.h + 28, 12, "مقفول");
  }
}

function drawTrayPreview() {
  const t = TRAY_PREVIEW;
  withShadow(12, 6, "rgba(0,0,0,0.35)", function () {
    drawEllipse(t.x, t.y, 85, 18, "#c9d0d6");
  });
  drawEllipse(t.x, t.y - 1, 70, 12, "#9aa3ab");
  drawTrayItems(game.tray, t.x, t.y, 0.5);
  drawText("الصينية (" + game.tray.length + ")", t.x, 636, 15, "#1a110b");
}

function drawSidesScene() {
  // الحيطة والسطح
  ctx.fillStyle = vGradient(64, 430, "#efe8d8", "#d9d0bb");
  ctx.fillRect(0, 64, 1280, 366);
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 2;
  for (let x = 0; x < 1280; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 64);
    ctx.lineTo(x, 430);
    ctx.stroke();
  }
  for (let y = 64; y < 430; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    ctx.stroke();
  }
  ctx.fillStyle = vGradient(430, 720, "#c9d0d6", "#8a939b");
  ctx.fillRect(0, 430, 1280, 290);
  ctx.fillStyle = "#e8edf0";
  ctx.fillRect(0, 426, 1280, 8);

  drawText("محطة البطاطس والمشروبات", 400, 140, 30, "#6b4a32");
  drawPotatoBin();
  drawFryer();
  drawSodaMachine();
  drawTrayPreview();
  drawFlyers();
  drawVignette();

  drawHotspotButtons();
  drawHud();
  drawMessage();
}
