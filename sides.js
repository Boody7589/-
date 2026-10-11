// ===== sides.js: محطة البطاطس والمشروبات (جرافيكس جديد) =====

function drawPotatoBin() {
  const b = POTATO_BIN;
  withShadow(14, 6, "rgba(0,0,0,0.35)", function () {
    outlinedRound(b.x, b.y, b.w, b.h, 14, metalGradient(b.y, b.y + b.h), 3);
  });
  fillRound(b.x + 10, b.y + 24, b.w - 20, b.h - 36, 8, "#3a424a");
  outlinedRound(b.x + 4, b.y + 6, b.w - 8, 16, 7, "#eef2f5", 2);
  const pots = [[42, 98, "#c9a15a"], [92, 96, "#b98d46"], [66, 72, "#d4ac66"]];
  for (let i = 0; i < pots.length; i++) {
    drawEllipse(b.x + pots[i][0], b.y + pots[i][1], 25, 17, pots[i][2]);
    drawEllipse(b.x + pots[i][0] - 7, b.y + pots[i][1] - 5, 6, 3, "rgba(255,255,255,0.3)");
    drawEllipse(b.x + pots[i][0] + 6, b.y + pots[i][1] + 2, 3, 2, "#8a6a30");
  }
  if (game.stock.potatoes <= 0 && game.up.fries > 0) {
    fillRound(b.x, b.y, b.w, b.h, 14, "rgba(0,0,0,0.6)");
    drawText("خلص!", b.x + b.w / 2, b.y + 75, 24, "#ff7a70");
  }
  if (game.hover === "bin-potato") {
    strokeRound(b.x - 3, b.y - 3, b.w + 6, b.h + 6, 17, "#fff3df", 4);
  }
  drawText("بطاطس x" + game.stock.potatoes, b.x + b.w / 2, 630, 17, "#1a110b");
  if (game.up.fries < 1) {
    drawLockOverlay(b.x, b.y, b.w, b.h, 14, "مقفول");
  }
}

// القلاية: جسم ستانلس وبيت للسبتين وشاشة مؤقت
function drawFryer() {
  withShadow(18, 8, "rgba(0,0,0,0.45)", function () {
    outlinedRound(300, 440, 350, 210, 16, metalGradient(440, 650), 3);
  });
  // لوحة التحكم
  outlinedRound(312, 448, 326, 40, 10, "#c93a34", 3);
  drawGloss(312, 448, 326, 40, 8);
  drawText("القلاية", 475, 476, 20, "#fff3df");
  drawBolt(322, 458);
  drawBolt(628, 458);

  for (let i = 0; i < FRYER_SLOTS.length; i++) {
    const s = FRYER_SLOTS[i];
    const p = game.fryer[i];
    // حوض الزيت
    outlinedRound(s.x - 60, s.y - 44, 120, 88, 12, "#3a424a", 3);
    fillRound(s.x - 54, s.y - 38, 108, 76, 8, vGradient(s.y - 38, s.y + 38, "#f0c040", "#b8861a"));
    fillRound(s.x - 48, s.y - 34, 96, 8, 4, "rgba(255,255,255,0.35)");
    if (i >= fryerSlots()) {
      drawLockOverlay(s.x - 60, s.y - 44, 120, 88, 12, "مقفول");
      continue;
    }
    // شاشة المؤثر
    fillRound(s.x - 26, 456, 52, 24, 6, "#10242c");
    const secs = p !== null && !p.arriving ? Math.floor(p.cook) : 0;
    drawText(secs < 10 ? "0" + secs : String(secs), s.x, 474, 16, "#7dffb0");
    if (p === null || p.arriving) {
      continue;
    }
    const done = getFryDoneness(p.cook);
    drawSteam(s.x, s.y - 20, 1);
    for (let k = 0; k < 6; k++) {
      const bx = s.x - 44 + k * 18;
      const by = s.y + 28 - ((game.time * 34 + k * 13) % 50);
      drawEllipse(bx, by, 3, 3, "rgba(255,255,255,0.6)");
    }
    // السبت (شبك) والبطاطس
    ctx.strokeStyle = "#2b1d14";
    ctx.lineWidth = 3;
    ctx.strokeRect(s.x - 46, s.y - 32, 92, 58);
    fillRound(s.x + 46, s.y - 7, 42, 12, 5, "#1a110b");
    let col = "#e8b53a";
    if (done === "raw") {
      col = "#f3e3a0";
    } else if (done === "burnt") {
      col = "#6b4a1a";
    }
    for (let k = 0; k < 8; k++) {
      outlinedRound(s.x - 38 + k * 10, s.y - 28 + (k % 3) * 3, 7, 44, 2, col, 1.5, "rgba(58,33,18,0.5)");
    }
    ctx.strokeStyle = "rgba(40,22,12,0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let k = 1; k < 4; k++) {
      ctx.moveTo(s.x - 46, s.y - 32 + k * 14);
      ctx.lineTo(s.x + 46, s.y - 32 + k * 14);
    }
    ctx.stroke();
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
      strokeRound(s.x - 64, s.y - 48, 128, 118, 12, "#fff3df", 3);
    }
  }
  drawText("الشريط: أصفر بيضا | أخضر دهبي | أحمر محروق", 475, 638, 13, "#1a110b");
  if (game.up.fries < 1) {
    drawLockOverlay(300, 440, 350, 210, 16, "القلاية مقفولة - افتحها من التطويرات");
  }
}

// ماكينة المشروبات: ماكينة ريترو أحمر وأكياس شراب وحنفيات
function drawSodaMachine() {
  withShadow(18, 8, "rgba(0,0,0,0.4)", function () {
    outlinedRound(960, 240, 270, 410, 20, vGradient(240, 650, "#e0453c", "#8a1f19"), 4);
  });
  drawGloss(960, 240, 270, 410, 18);
  // لوحة مضيئة
  outlinedRound(976, 254, 238, 46, 10, "#fff3df", 3);
  drawText("مشروبات", 1095, 288, 26, "#8a1f19");
  drawEllipse(990, 277, 4, 4, "#f2b134");
  drawEllipse(1200, 277, 4, 4, "#f2b134");
  // الزجاج وأكياس الشراب
  outlinedRound(980, 312, 230, 76, 8, "#27414f", 3);
  outlinedRound(990, 320, 80, 60, 8, "#5a2a14", 2);
  drawText("COLA", 1030, 356, 18, "#fff3df");
  outlinedRound(1120, 320, 80, 60, 8, "#f08a1c", 2);
  drawText("ORANGE", 1160, 356, 16, "#fff3df");
  fillRound(986, 316, 224, 10, 5, "rgba(255,255,255,0.12)");

  // الحنفيات (فوق مكان الكوباية)
  outlinedRound(1028, 428, 24, 26, 5, "#2b1d14", 2);
  outlinedRound(1148, 428, 24, 26, 5, "#2b1d14", 2);

  // مكان الكوباية
  const slot = SODA.cupSlot;
  fillRound(slot.x - 14, 462, slot.w + 28, 136, 10, "rgba(0,0,0,0.32)");
  outlinedRound(1000, 596, 180, 16, 6, "#7d868e", 2);
  for (let k = 0; k < 10; k++) {
    fillRound(1010 + k * 17, 600, 10, 4, 2, "rgba(0,0,0,0.35)");
  }

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
    drawCup(1090, 592, 1.5, s.drink, s.fill);
    if (s.drink !== null && s.fill < 1) {
      const nx = s.drink === "cola" ? 1040 : 1160;
      ctx.strokeStyle = s.drink === "cola" ? "#4a2615" : "#f08a1c";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(nx, 454);
      ctx.lineTo(nx, 470);
      ctx.lineTo(1090, 592 - 46 * 1.5 * s.fill - 6);
      ctx.stroke();
    }
  }
  drawText(status, 1095, 482, 17, "#fff3df");
  if (game.hover === "soda-cup") {
    strokeRound(slot.x - 3, slot.y - 3, slot.w + 6, slot.h + 6, 12, "#fff3df", 3);
  }

  // برج الكبايات الفاضية
  const st = SODA.stack;
  outlinedRound(st.x - 8, st.y + 92, st.w + 16, 18, 6, metalGradient(st.y + 92, st.y + 110), 2);
  fillRound(st.x + 34, st.y - 30, 32, 126, 8, "rgba(255,255,255,0.18)");
  for (let k = 0; k < 6; k++) {
    drawCup(st.x + 50, st.y + 96 - k * 15, 1.0, null, 0);
  }
  drawText("كبايات x" + game.stock.cups, st.x + 50, 630, 17, "#1a110b");
  if (game.hover === "soda-stack") {
    strokeRound(st.x - 8, st.y - 20, st.w + 16, st.h + 36, 12, "#1a110b", 3);
  }

  if (game.up.drinks < 1) {
    drawLockOverlay(960, 240, 270, 410, 20, "الماكينة مقفولة - افتحها من التطويرات");
    drawLockOverlay(st.x - 8, st.y - 20, st.w + 16, st.h + 36, 12, "مقفول");
  }
}

function drawTrayPreview() {
  const t = TRAY_PREVIEW;
  const items = game.trays[game.sel];
  withShadow(12, 6, "rgba(0,0,0,0.35)", function () {
    drawEllipse(t.x, t.y, 85, 18, "#d4dbe0");
  });
  ctx.strokeStyle = "rgba(40,22,12,0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(t.x, t.y, 85, 18, 0, 0, Math.PI * 2);
  ctx.stroke();
  drawEllipse(t.x, t.y - 1, 70, 12, "#9aa3ab");
  drawTrayItems(items, t.x, t.y, 0.5);
  const label = slotCount() === 2 ? "صينية طلب " + (game.sel + 1) : "الصينية";
  drawText(label + " (" + items.length + ")", t.x, 640, 15, "#1a110b");
}

function drawSidesScene() {
  ctx.fillStyle = vGradient(64, 430, "#f6efdf", "#dcd2bb");
  ctx.fillRect(0, 64, 1280, 366);
  ctx.strokeStyle = "rgba(0,0,0,0.09)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let r = 0; r < 12; r++) {
    const y = 64 + r * 32;
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    for (let x = (r % 2) * 32; x < 1280; x += 64) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 32);
    }
  }
  ctx.stroke();
  drawPrepCounter();

  // لافتة المحطة
  outlinedRound(150, 100, 380, 56, 12, "#3a2112", 3);
  drawText("محطة البطاطس والمشروبات", 340, 138, 26, "#f2b134");

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
