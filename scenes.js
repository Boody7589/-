// ===== scenes.js: رسم كل المشاهد (المنيو، الكاونتر، المطبخ، اللابتوب، التقرير) =====

// ---------- مشهد الكاونتر ----------

function drawLamp(x) {
  const glow = ctx.createRadialGradient(x, 130, 5, x, 130, 190);
  glow.addColorStop(0, "rgba(255,214,130,0.45)");
  glow.addColorStop(1, "rgba(255,214,130,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(x - 190, 64, 380, 300);
  ctx.fillStyle = "#1a110b";
  ctx.fillRect(x - 1, 64, 2, 40);
  ctx.beginPath();
  ctx.moveTo(x - 36, 126);
  ctx.lineTo(x - 14, 102);
  ctx.lineTo(x + 14, 102);
  ctx.lineTo(x + 36, 126);
  ctx.closePath();
  ctx.fillStyle = "#d62f2a";
  ctx.fill();
  drawEllipse(x, 128, 12, 5, "#ffe9a8");
}

function drawLaptopOnCounter() {
  const hot = game.hover === "laptop";
  const b = laptopScreenBox;

  // القاعدة والكيبورد
  withShadow(18, 10, "rgba(0,0,0,0.45)", function () {
    ctx.fillStyle = vGradient(585, 618, "#4a4f55", "#2c3036");
    ctx.beginPath();
    ctx.moveTo(116, 585);
    ctx.lineTo(374, 585);
    ctx.lineTo(396, 618);
    ctx.lineTo(94, 618);
    ctx.closePath();
    ctx.fill();
  });
  for (let r = 0; r < 2; r++) {
    for (let k = 0; k < 11; k++) {
      ctx.fillStyle = hot ? "rgba(143,220,90,0.55)" : "rgba(255,255,255,0.14)";
      ctx.fillRect(138 + k * 21, 590 + r * 9, 17, 5);
    }
  }
  fillRound(220, 608, 50, 6, 3, "rgba(255,255,255,0.18)");

  // الشاشة
  fillRound(b.x - 12, b.y - 12, b.w + 24, b.h + 24, 10, "#1a1d21");
  drawEllipse(b.x + b.w / 2, b.y - 5, 2.5, 2.5, "#3a4a55");
  fillRound(b.x, b.y, b.w, b.h, 4, hot ? vGradient(b.y, b.y + b.h, "#4ab3e0", "#2a7fa4") : vGradient(b.y, b.y + b.h, "#2f8fb0", "#14304a"));
  fillRound(b.x, b.y, b.w, 18, 4, "rgba(0,0,0,0.3)");
  drawText("Burger OS", b.x + 8, b.y + 13, 11, "#fff3df", "left");
  const icons = ["#f2b134", "#5aa335", "#d62f2a", "#3d6fbf"];
  for (let i = 0; i < 4; i++) {
    const ix = b.x + 14 + i * 48;
    fillRound(ix, b.y + 34, 38, 38, 9, icons[i]);
    fillRound(ix + 3, b.y + 36, 32, 14, 6, "rgba(255,255,255,0.25)");
  }
  // لمعة على الشاشة
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.moveTo(b.x, b.y + 20);
  ctx.lineTo(b.x + 90, b.y + 20);
  ctx.lineTo(b.x + 40, b.y + b.h);
  ctx.lineTo(b.x, b.y + b.h);
  ctx.closePath();
  ctx.fill();
  drawText("اضغط هنا", b.x + b.w / 2, b.y + 108, hot ? 20 : 18, "#fff3df");

  // نقطة حمرا لو فيه جديد
  if (game.deliveries.length > 0 || game.unreadReviews > 0) {
    drawEllipse(b.x + b.w - 4, b.y + 4, 9, 9, "#d62f2a");
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(b.x + b.w - 4, b.y + 4, 9, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawRegister() {
  withShadow(16, 8, "rgba(0,0,0,0.4)", function () {
    fillRound(1000, 520, 160, 100, 12, vGradient(520, 620, "#3b3f45", "#1f2327"));
  });
  fillRound(1016, 534, 128, 38, 6, "#9fe3b0");
  let total = "0";
  if (game.ticket !== null) {
    total = String(game.ticket.order.price);
  }
  drawText(total + " EGP", 1080, 561, 20, "#10260a");
  for (let k = 0; k < 4; k++) {
    fillRound(1020 + k * 30, 584, 22, 16, 4, "#6b7580");
  }
}

function drawTicket() {
  if (game.ticket === null) {
    return;
  }
  ctx.save();
  ctx.translate(478, 580);
  ctx.rotate(-0.05);
  withShadow(10, 5, "rgba(0,0,0,0.4)", function () {
    fillRound(-84, -48, 168, 100, 4, "#fff3df");
  });
  drawEllipse(0, -48, 6, 6, "#d62f2a");
  drawText("طلب رقم " + game.ticket.number, 0, -24, 16, "#2b1d14");
  const lines = game.ticket.order.lines;
  for (let i = 0; i < lines.length; i++) {
    drawText(lines[i], 0, -2 + i * 20, 13, "#6b4a32");
  }
  ctx.restore();
}

function drawTray() {
  withShadow(14, 8, "rgba(0,0,0,0.4)", function () {
    drawEllipse(690, 596, 130, 26, "#c9d0d6");
  });
  drawEllipse(690, 594, 110, 19, "#9aa3ab");
  drawTrayItems(game.tray, 690, 598, 0.62);
}

function drawFloorTiles(topY) {
  ctx.fillStyle = vGradient(topY, 720, "#7a5238", "#4f321f");
  ctx.fillRect(0, topY, 1280, 720 - topY);

  const rows = [];
  let yy = topY;
  let step = 12;
  while (yy < 720) {
    rows.push(yy);
    yy = yy + step;
    step = step * 1.35;
  }
  rows.push(720);

  // بلاط شطرنج
  for (let r = 0; r < rows.length - 1; r++) {
    const t0 = (rows[r] - topY) / (720 - topY);
    const t1 = (rows[r + 1] - topY) / (720 - topY);
    for (let i = -10; i < 10; i++) {
      if (Math.abs((i + r) % 2) === 0) {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(640 + i * (60 + 170 * t0), rows[r]);
      ctx.lineTo(640 + (i + 1) * (60 + 170 * t0), rows[r]);
      ctx.lineTo(640 + (i + 1) * (60 + 170 * t1), rows[r + 1]);
      ctx.lineTo(640 + i * (60 + 170 * t1), rows[r + 1]);
      ctx.closePath();
      ctx.fillStyle = "rgba(255,235,200,0.09)";
      ctx.fill();
    }
  }

  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 2;
  for (let i = -8; i <= 8; i++) {
    ctx.beginPath();
    ctx.moveTo(640 + i * 60, topY);
    ctx.lineTo(640 + i * 230, 720);
    ctx.stroke();
  }
  for (let r = 0; r < rows.length; r++) {
    ctx.beginPath();
    ctx.moveTo(0, rows[r]);
    ctx.lineTo(1280, rows[r]);
    ctx.stroke();
  }
}

function drawCounterScene() {
  ctx.fillStyle = vGradient(64, 340, "#6b4630", "#4f321f");
  ctx.fillRect(0, 0, 1280, 340);
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  for (let x = 0; x < 1280; x += 160) {
    ctx.fillRect(x, 64, 2, 232);
  }
  ctx.fillStyle = "#3a2819";
  ctx.fillRect(0, 300, 1280, 40);
  ctx.fillStyle = "#a87244";
  ctx.fillRect(0, 296, 1280, 6);

  drawFloorTiles(340);

  // الشباك
  withShadow(16, 6, "rgba(0,0,0,0.4)", function () {
    ctx.fillStyle = "#2b1d14";
    ctx.fillRect(70, 135, 300, 150);
  });
  ctx.fillStyle = vGradient(145, 275, "#bfe3f2", "#f6e7c4");
  ctx.fillRect(82, 147, 276, 126);
  ctx.fillStyle = "#7d8fa0";
  ctx.fillRect(96, 200, 50, 73);
  ctx.fillRect(156, 180, 64, 93);
  ctx.fillRect(232, 210, 44, 63);
  ctx.fillRect(286, 190, 60, 83);
  ctx.fillStyle = "#2b1d14";
  ctx.fillRect(218, 147, 6, 126);
  ctx.fillRect(82, 208, 276, 6);
  ctx.fillStyle = "#a87244";
  ctx.fillRect(60, 285, 320, 10);
  drawSunRays();

  drawWallDecor();

  drawDiningArea();
  drawLamp(450);
  drawLamp(900);

  if (game.customer !== null) {
    drawCustomer(game.customer);
  }

  // سطح الكاونتر
  ctx.beginPath();
  ctx.moveTo(50, 470);
  ctx.lineTo(1230, 470);
  ctx.lineTo(1280, 720);
  ctx.lineTo(0, 720);
  ctx.closePath();
  ctx.fillStyle = vGradient(470, 720, "#a2703f", "#6e4527");
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 2;
  for (let t = 1; t < 12; t++) {
    ctx.beginPath();
    ctx.moveTo(50 + (t / 12) * 1180, 474);
    ctx.lineTo((t / 12) * 1280, 720);
    ctx.stroke();
  }
  fillRound(50, 460, 1180, 14, 6, "#d09a62");
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(60, 462, 1160, 3);

  drawRegister();
  drawTicket();
  drawTray();
  drawLaptopOnCounter();
  drawMenuBook();
  drawVignette();
  drawHotspotButtons();
  drawHud();
  drawMessage();
}

// ---------- مشهد المطبخ ----------

function drawBin(box, key, label, stock, hoverName) {
  withShadow(14, 6, "rgba(0,0,0,0.35)", function () {
    fillRound(box.x, box.y, box.w, box.h, 16, vGradient(box.y, box.y + box.h, "#d3dae0", "#9aa3ab"));
  });
  fillRound(box.x + 10, box.y + 10, box.w - 20, box.h - 20, 10, "#4a525a");
  if (key === "bun") {
    drawEllipse(box.x + 32, box.y + 96, 22, 15, "#d9893b");
    drawEllipse(box.x + 80, box.y + 96, 22, 15, "#d9893b");
    drawEllipse(box.x + 56, box.y + 72, 22, 15, "#e8a04d");
    drawEllipse(box.x + 56, box.y + 67, 12, 4, "rgba(255,255,255,0.3)");
  } else {
    fillRound(box.x + 20, box.y + 84, 72, 14, 3, "#f2c230");
    fillRound(box.x + 24, box.y + 66, 72, 14, 3, "#f7d24d");
    fillRound(box.x + 18, box.y + 48, 72, 14, 3, "#f2c230");
    drawEllipse(box.x + 40, box.y + 55, 3, 3, "#d9a51c");
    drawEllipse(box.x + 62, box.y + 91, 3, 3, "#d9a51c");
  }
  if (stock <= 0) {
    fillRound(box.x, box.y, box.w, box.h, 16, "rgba(0,0,0,0.6)");
    drawText("خلص!", box.x + box.w / 2, box.y + 75, 24, "#ff7a70");
  }
  if (game.hover === hoverName) {
    roundRectPath(box.x - 3, box.y - 3, box.w + 6, box.h + 6, 18);
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  drawText(label + " x" + stock, box.x + box.w / 2, 630, 17, "#1a110b");
}

function drawBins() {
  drawBin(BUN_BIN, "bun", "رغيف", game.stock.buns, "bin-bun");
  drawBin(CHEESE_BIN, "cheese", "جبنة", game.stock.cheese, "bin-cheese");
  if (game.up.cheese < 1) {
    drawLockOverlay(CHEESE_BIN.x, CHEESE_BIN.y, CHEESE_BIN.w, CHEESE_BIN.h, 16, "مقفول");
  }
}

// الصوصات متعلقة من فوق بالمقلوب
function drawSauceRack() {
  ctx.fillStyle = vGradient(72, 86, "#c3cad0", "#7d868e");
  ctx.fillRect(340, 72, 380, 12);
  for (let i = 0; i < SAUCES.length; i++) {
    const s = SAUCES[i];
    const hot = game.hover === "sauce-" + s.key;
    const squeezing = game.stream !== null && game.stream.key === s.key;
    let squeeze = 1;
    if (squeezing) {
      squeeze = 1 - 0.12 * Math.sin(Math.PI * Math.min(1, game.stream.t / game.stream.dur));
    }
    ctx.save();
    ctx.translate(s.x, 84);
    ctx.scale(1, squeeze);
    ctx.fillStyle = "#8a939b";
    ctx.fillRect(-4, 0, 8, 10);
    fillRound(-27, 8, 54, 86, 14, vGradient(8, 94, s.color, s.dark));
    fillRound(-18, 18, 8, 60, 4, "rgba(255,255,255,0.35)");
    fillRound(-9, 92, 18, 22, 4, s.cap);
    fillRound(-4, 112, 8, 8, 2, s.cap);
    ctx.restore();
    if (hot) {
      roundRectPath(s.x - 38, 78, 76, 150, 14);
      ctx.strokeStyle = "#1a110b";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    drawText(s.label, s.x, 196, 16, "#1a110b");
    drawText("x" + game.stock[s.key], s.x, 216, 16, "#1a110b");
    if (game.stock[s.key] <= 0) {
      drawText("خلص!", s.x, 150, 18, "#d62f2a");
    }
  }
}

function drawFreezer() {
  const f = FREEZER_BOX;
  const open = Math.min(1, game.freezerOpen * 2);
  withShadow(18, 8, "rgba(0,0,0,0.4)", function () {
    fillRound(f.x, f.y, f.w, f.h, 16, vGradient(f.y, f.y + f.h, "#e6f1f7", "#b7cbd6"));
  });
  // الجزء الجوا
  fillRound(f.x + 12, f.y + 12, 166, 366, 10, "#1d3340");
  ctx.fillStyle = "#3d5a6a";
  for (let r = 0; r < 4; r++) {
    ctx.fillRect(f.x + 12, f.y + 90 + r * 70, 166, 6);
  }
  const shown = Math.min(game.stock.patties, 8);
  for (let k = 0; k < shown; k++) {
    drawEllipse(f.x + 60 + (k % 2) * 70, f.y + 78 + Math.floor(k / 2) * 70, 28, 9, "#d77a72");
  }
  // الباب
  const doorW = 166 * (1 - 0.85 * open);
  fillRound(f.x + 12, f.y + 12, doorW, 366, 10, vGradient(f.y, f.y + f.h, "#f2f8fb", "#cfdde5"));
  fillRound(f.x + 12 + doorW - 18, f.y + 130, 8, 90, 4, "#6b7580");
  if (open < 0.3) {
    drawText("الفريزر", f.x + 95, f.y + 60, 24, "#274a5a");
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    for (let k = 0; k < 14; k++) {
      ctx.fillRect(f.x + 30 + (k * 37) % 120, f.y + 250 + (k * 53) % 100, 4, 4);
    }
    drawText("باتي x" + game.stock.patties, f.x + 95, f.y + 340, 20, "#274a5a");
  }
  if (game.hover === "freezer") {
    roundRectPath(f.x - 3, f.y - 3, f.w + 6, f.h + 6, 18);
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

function drawFlames(cx, cy) {
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let k = 0; k < 14; k++) {
    const a = (k / 14) * Math.PI * 2;
    const flick = 3 + Math.sin(game.time * 14 + k * 1.7) * 3;
    ctx.strokeStyle = k % 2 === 0 ? "#4aa3ff" : "#9fd0ff";
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 46, cy + Math.sin(a) * 46);
    ctx.lineTo(cx + Math.cos(a) * (52 + flick), cy + Math.sin(a) * (52 + flick));
    ctx.stroke();
  }
}

function drawStove() {
  withShadow(18, 8, "rgba(0,0,0,0.45)", function () {
    fillRound(780, 440, 460, 210, 16, vGradient(440, 650, "#e1e6ea", "#98a1a9"));
  });
  fillRound(796, 452, 428, 150, 10, "#2a2e33");

  for (let i = 0; i < STOVE_SLOTS.length; i++) {
    const s = STOVE_SLOTS[i];
    const p = game.grill[i];
    drawEllipse(s.x, s.y, 50, 50, "#15181b");
    if (i >= stoveBurners()) {
      drawLockOverlay(s.x - 56, s.y - 56, 112, 112, 56, "مقفول");
      continue;
    }
    ctx.strokeStyle = "#4a5058";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(s.x - 50, s.y); ctx.lineTo(s.x + 50, s.y);
    ctx.moveTo(s.x, s.y - 50); ctx.lineTo(s.x, s.y + 50);
    ctx.stroke();

    if (p === null || p.arriving) {
      continue;
    }
    drawFlames(s.x, s.y);
    // المقلاة
    fillRound(s.x + 40, s.y - 6, 46, 12, 5, "#1a110b");
    const pan = ctx.createRadialGradient(s.x - 12, s.y - 12, 4, s.x, s.y, 46);
    pan.addColorStop(0, "#6b7580");
    pan.addColorStop(1, "#2f343a");
    drawEllipse(s.x, s.y, 44, 44, pan);

    const done = getDoneness(p.cook);
    const colors = pattyColors(done);
    const grad = ctx.createRadialGradient(s.x - 10, s.y - 10, 4, s.x, s.y, 36);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    drawEllipse(s.x, s.y, 34, 34, grad);

    // حلقة التقدم: أصفر نيّ، أخضر استوى، أحمر اتحرق
    let ringColor = "#f2b134";
    if (done === "cooked") {
      ringColor = "#5aa335";
    } else if (done === "burnt") {
      ringColor = "#d62f2a";
    }
    drawSteam(s.x, s.y - 40, done === "raw" ? 0.5 : 1);
    const frac = Math.min(p.cook / COOK_MAX, 1);
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = ringColor;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 64, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    ctx.stroke();
    if (game.hover === "slot-" + i) {
      ctx.strokeStyle = "#fff3df";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 72, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // اللوحة الأمامية
  drawText("الحلقة: أصفر نيّ  |  أخضر استوى  |  أحمر اتحرق", 1010, 622, 14, "#1a110b");
  for (let i = 0; i < 3; i++) {
    drawEllipse(STOVE_SLOTS[i].x, 640, 8, 8, "#1a110b");
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(STOVE_SLOTS[i].x, 640);
    ctx.lineTo(STOVE_SLOTS[i].x + 4, 634);
    ctx.stroke();
  }
  drawText("بوتاجاز", 1222, 644, 14, "#1a110b", "right");
}

function drawKitchenTicket() {
  ctx.fillStyle = "#8a939b";
  ctx.fillRect(40, 100, 220, 6);
  ctx.save();
  ctx.translate(150, 165);
  ctx.rotate(-0.03);
  withShadow(12, 6, "rgba(0,0,0,0.35)", function () {
    fillRound(-105, -66, 210, 132, 4, "#fff3df");
  });
  drawEllipse(0, -66, 7, 7, "#d62f2a");
  if (game.ticket !== null) {
    const order = game.ticket.order;
    drawText("طلب رقم " + game.ticket.number, 0, -36, 19, "#2b1d14");
    for (let i = 0; i < order.lines.length; i++) {
      drawText(order.lines[i], 0, -12 + i * 20, 16, "#6b4a32");
    }
    let hint = "";
    for (let i = 0; i < order.items.length; i++) {
      if (order.items[i].kind === "burger") {
        hint = recipeHintFor(order.items[i]);
      }
    }
    drawText(hint, 0, 54, 12, "#2b1d14");
  } else {
    drawText("مفيش طلب دلوقتي", 0, -6, 19, "#6b4a32");
  }
  ctx.restore();
}

// حاجات بتطير (رغيف أو باتي) والصوص النازل
function drawFlyers() {
  for (let i = 0; i < game.flyers.length; i++) {
    const f = game.flyers[i];
    const p = f.t / f.dur;
    const x = f.x0 + (f.x1 - f.x0) * p;
    const y = f.y0 + (f.y1 - f.y0) * p - Math.sin(Math.PI * p) * 70;
    if (f.kind === "bun") {
      drawEllipse(x, y, 34, 22, "#e8a04d");
      drawEllipse(x, y - 6, 20, 6, "rgba(255,255,255,0.3)");
    } else if (f.kind === "cheese") {
      fillRound(x - 32, y - 6, 64, 12, 3, "#f2c230");
    } else if (f.kind === "potato") {
      drawEllipse(x, y, 28, 18, "#c9a15a");
      drawEllipse(x - 8, y - 4, 6, 4, "#a8803a");
    } else if (f.kind === "fries") {
      drawFries(x, y + 24, 0.9, f.doneness);
    } else if (f.kind === "cup") {
      drawCup(x, y + 34, 0.9, f.drink);
    } else {
      drawEllipse(x, y, 34, 34, pattyColors(f.doneness)[0]);
    }
  }
}

function drawStream() {
  const st = game.stream;
  if (st === null) {
    return;
  }
  const p = st.t / st.dur;
  const head = Math.min(1, p * 2.2);
  const tail = Math.max(0, (p - 0.55) / 0.45);
  const cx = st.x0 + (st.x1 - st.x0) * 0.1;
  const cy = st.y0 + 70;
  ctx.strokeStyle = st.color;
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let k = 0; k <= 12; k++) {
    const s = tail + (head - tail) * (k / 12);
    const x = (1 - s) * (1 - s) * st.x0 + 2 * (1 - s) * s * cx + s * s * st.x1;
    const y = (1 - s) * (1 - s) * st.y0 + 2 * (1 - s) * s * cy + s * s * st.y1;
    if (k === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  if (head >= 1) {
    drawEllipse(st.x1, st.y1 + 2, 24 * Math.min(1, (p - 0.4) * 3), 6, st.color);
  }
}

function drawKitchenScene() {
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

  // الشفاط
  ctx.beginPath();
  ctx.moveTo(790, 64);
  ctx.lineTo(1250, 64);
  ctx.lineTo(1200, 160);
  ctx.lineTo(840, 160);
  ctx.closePath();
  ctx.fillStyle = vGradient(64, 160, "#c3cad0", "#7d868e");
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  for (let x = 870; x < 1180; x += 30) {
    ctx.fillRect(x, 120, 16, 6);
  }

  // سطح التحضير
  ctx.fillStyle = vGradient(430, 720, "#c9d0d6", "#8a939b");
  ctx.fillRect(0, 430, 1280, 290);
  ctx.fillStyle = "#e8edf0";
  ctx.fillRect(0, 426, 1280, 8);

  drawKitchenTicket();
  drawSauceRack();
  drawBins();
  drawFreezer();
  drawStove();

  drawPlate(PLATE_X, 618, 110);
  drawBurger(PLATE_X, PLATE_BASE_Y, game.plate, 0.95);
  drawFlyers();
  drawStream();
  drawVignette();

  drawHotspotButtons();
  drawHud();
  drawMessage();
}

// ---------- مشهد اللابتوب: تطبيق طلب المكونات ----------

function drawShopIcon(key, cx, cy) {
  if (key === "buns") {
    drawEllipse(cx - 12, cy + 8, 18, 12, "#d9893b");
    drawEllipse(cx + 12, cy + 8, 18, 12, "#d9893b");
    drawEllipse(cx, cy - 6, 18, 12, "#e8a04d");
  } else if (key === "patties") {
    drawEllipse(cx, cy + 10, 24, 9, "#a8483f");
    drawEllipse(cx, cy + 2, 24, 9, "#d77a72");
    drawEllipse(cx, cy - 8, 24, 9, "#a8483f");
    drawEllipse(cx, cy - 15, 24, 9, "#d77a72");
  } else if (key === "cheese") {
    fillRound(cx - 22, cy + 4, 44, 11, 3, "#f2c230");
    fillRound(cx - 18, cy - 8, 44, 11, 3, "#f7d24d");
    fillRound(cx - 24, cy - 20, 44, 11, 3, "#f2c230");
  } else if (key === "potatoes") {
    drawEllipse(cx - 10, cy + 6, 14, 10, "#c9a15a");
    drawEllipse(cx + 12, cy + 4, 14, 10, "#b98d46");
    drawEllipse(cx, cy - 8, 14, 10, "#c9a15a");
  } else if (key === "cups") {
    drawCup(cx - 8, cy + 22, 0.6, null, 0);
    drawCup(cx + 10, cy + 26, 0.6, null, 0);
  } else if (key === "cola" || key === "orange") {
    drawCup(cx, cy + 24, 0.62, key);
  } else {
    let sauce = SAUCES[0];
    for (let i = 0; i < SAUCES.length; i++) {
      if (SAUCES[i].key === key) {
        sauce = SAUCES[i];
      }
    }
    fillRound(cx - 14, cy - 10, 28, 36, 8, sauce.color);
    fillRound(cx - 6, cy - 22, 12, 14, 3, sauce.cap);
  }
}


// ---------- تاب طلب المكونات ----------

// ---------- تاب التطويرات ----------

// ---------- تاب التقييمات ----------

// ---------- القائمة الرئيسية ----------

const MENU_BURGER = [
  { type: "bun" },
  { type: "sauce", color: "#d62f2a" },
  { type: "patty", doneness: "cooked" },
  { type: "sauce", color: "#e8b21a" },
  { type: "patty", doneness: "cooked" },
  { type: "bun" }
];

function drawMenuScene() {
  ctx.fillStyle = vGradient(0, 720, "#3a2112", "#1a110b");
  ctx.fillRect(0, 0, 1280, 720);
  const glow = ctx.createRadialGradient(400, 380, 20, 400, 380, 420);
  glow.addColorStop(0, "rgba(242,177,52,0.35)");
  glow.addColorStop(1, "rgba(242,177,52,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1280, 720);
  ctx.strokeStyle = "rgba(255,243,223,0.05)";
  ctx.lineWidth = 2;
  for (let x = -720; x < 1280; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 720);
    ctx.lineTo(x + 720, 0);
    ctx.stroke();
  }

  if (imageReady("logo")) {
    const bob = Math.sin(game.time * 2) * 6;
    withShadow(30, 12, "rgba(0,0,0,0.5)", function () {
      ctx.drawImage(IMAGES.logo, 150, 110 + bob, 500, 500);
    });
  } else {
    withShadow(20, 6, "rgba(0,0,0,0.6)", function () {
      drawText("برجر الحريف", 400, 200, 70, "#f2b134");
    });
    const bob = Math.sin(game.time * 2) * 6;
    drawPlate(400, 620, 170);
    drawBurger(400, 608 + bob, MENU_BURGER, 1.7);
  }

  drawHotspotButtons();
  if (game.saveInfo !== null) {
    drawText("فيه لعبة محفوظة: اليوم " + game.saveInfo.day, 930, 660, 18, "#8fdc5a");
  }
  drawText("ممكن تدوس F في أي وقت لملء الشاشة", 640, 700, 16, "#8a6d55");
}

// ---------- تقرير آخر اليوم ----------

function drawResultsScene() {
  ctx.fillStyle = vGradient(0, 720, "#3a2112", "#1a110b");
  ctx.fillRect(0, 0, 1280, 720);
  withShadow(30, 12, "rgba(0,0,0,0.5)", function () {
    fillRound(340, 80, 600, 560, 24, "#fff3df");
  });
  drawText("تقرير اليوم " + game.day, 640, 140, 38, "#2b1d14");
  ctx.fillStyle = "#f2b134";
  ctx.fillRect(400, 158, 480, 4);

  const st = game.stats;
  const profit = st.revenue - st.spent - st.upgrades;
  const avg = averageRating();
  const rows = [
    ["زباين اتخدموا", String(st.served), "#2b1d14"],
    ["زباين مشيوا زهقانين", String(st.left), "#2b1d14"],
    ["طلبات اترفضت", String(st.rejected), "#2b1d14"],
    ["المبيعات والبقشيش", st.revenue + " EGP", "#2b1d14"],
    ["مصاريف المكونات", st.spent + " EGP", "#2b1d14"],
    ["تطويرات", st.upgrades + " EGP", "#2b1d14"],
    ["الربح", (profit >= 0 ? "+" : "") + profit + " EGP", profit >= 0 ? "#2f7a1a" : "#b3261e"],
    ["التقييم العام", avg === null ? "-" : avg.toFixed(1) + " / 5", "#2b1d14"],
    ["الكاش دلوقتي", game.cash + " EGP", "#2b1d14"]
  ];
  for (let i = 0; i < rows.length; i++) {
    const y = 205 + i * 38;
    drawText(rows[i][0], 900, y, 21, "#6b4a32", "right");
    drawText(rows[i][1], 380, y, 23, rows[i][2], "left");
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(380, y + 10, 520, 2);
  }
  drawText("تم حفظ تقدمك تلقائياً", 640, 632, 15, "#6b4a32");

  drawHotspotButtons();
}

// ---------- الترابيزات والزباين اللي بياكلوا ----------

function drawDiningArea() {
  for (let i = 0; i < game.up.tables; i++) {
    const spot = TABLE_SPOTS[i];
    let diner = null;
    for (let k = 0; k < game.diners.length; k++) {
      if (game.diners[k].table === i) {
        diner = game.diners[k];
      }
    }
    // الترابيزات ورا في المحل: أصغر وأبعد
    ctx.save();
    ctx.translate(spot.x, spot.y);
    ctx.scale(spot.s, spot.s);
    if (diner !== null) {
      drawMiniDiner(0, 0, diner.look, game.time + i);
    }
    withShadow(8, 4, "rgba(0,0,0,0.35)", function () {
      drawEllipse(0, 0, 54, 14, "#a87244");
    });
    drawEllipse(0, -2, 48, 10, "#c58a52");
    if (diner !== null && diner.timer / DINE_TIME > 0.25) {
      drawBurger(0, -2, MINI_BURGER, 0.24);
    }
    ctx.restore();
  }
}

// إطار اللوجو على الحيطة (مكان لوحة المنيو القديمة)
function drawWallDecor() {
  withShadow(16, 6, "rgba(0,0,0,0.4)", function () {
    fillRound(900, 124, 200, 166, 10, "#a87244");
  });
  fillRound(908, 132, 184, 150, 6, "#2b1d14");
  if (imageReady("logo")) {
    ctx.drawImage(IMAGES.logo, 925, 134, 150, 146);
  } else {
    drawText("برجر الحريف", 1000, 214, 26, "#f2b134");
  }
}

// أشعة الشمس من الشباك
function drawSunRays() {
  const g = ctx.createLinearGradient(220, 150, 520, 470);
  g.addColorStop(0, "rgba(255,236,170,0.22)");
  g.addColorStop(1, "rgba(255,236,170,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(82, 147);
  ctx.lineTo(358, 147);
  ctx.lineTo(640, 470);
  ctx.lineTo(330, 470);
  ctx.closePath();
  ctx.fill();
}

// كتاب المنيو اللي على الكاونتر
function drawMenuBook() {
  const b = BOOK_BOX;
  const hot = game.hover === "book";
  ctx.save();
  ctx.translate(b.x + b.w / 2, b.y + b.h / 2);
  ctx.rotate(-0.06);
  withShadow(14, 8, "rgba(0,0,0,0.5)", function () {
    fillRound(-b.w / 2, -b.h / 2 + 8, b.w, b.h - 8, 8, "#3a1a10");
  });
  fillRound(-b.w / 2 + 6, -b.h / 2 + 2, b.w - 12, b.h - 12, 6, "#f4e6c8");
  fillRound(-b.w / 2, -b.h / 2, b.w - 8, b.h - 14, 8, hot ? vGradient(-b.h / 2, b.h / 2, "#c4483c", "#8a2a20") : vGradient(-b.h / 2, b.h / 2, "#a8382e", "#6e1f18"));
  strokeRound(-b.w / 2 + 8, -b.h / 2 + 8, b.w - 24, b.h - 30, 5, "#f2b134", 2);
  drawText("المنيو", -b.w / 2 + (b.w - 8) / 2, 6, 26, "#f2b134");
  drawText("اضغط وافتح", -b.w / 2 + (b.w - 8) / 2, 28, 13, "#ffe9a8");
  ctx.restore();
}

const MINI_BURGER = [{ type: "bun" }, { type: "patty", doneness: "cooked" }, { type: "bun" }];

// ---------- شاشة التحميل ----------

function drawLoadingScene() {
  ctx.fillStyle = vGradient(0, 720, "#3a2112", "#1a110b");
  ctx.fillRect(0, 0, 1280, 720);
  const L = game.loading;
  if (imageReady("loading")) {
    withShadow(30, 10, "rgba(0,0,0,0.5)", function () {
      ctx.drawImage(IMAGES.loading, 0, 90, 1280, 487);
    });
  } else {
    drawText("برجر الحريف", 640, 340, 80, "#f2b134");
  }
  const dots = ".".repeat(Math.floor(game.time * 3) % 4);
  drawText("جاري التحميل" + dots, 640, 625, 22, "#fff3df");
  fillRound(380, 645, 520, 14, 7, "#2b1d14");
  fillRound(380, 645, Math.max(14, 520 * Math.min(1, L.t / L.dur)), 14, 7, "#f2b134");
  drawText(L.tip, 640, 692, 17, "#e8d3b0");
}
