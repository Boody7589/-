// ===== screens.js: القائمة الرئيسية وشاشة التحميل وتقرير اليوم =====

const MENU_FLOATERS = ["bun", "patty", "cheese", "fries", "cup", "star", "bun", "patty", "cheese", "fries", "cup", "star", "bun", "star"];

// عناصر عايمة في الخلفية (رغيف وبطاطس وكوباية...)
function drawFloaters() {
  for (let i = 0; i < MENU_FLOATERS.length; i++) {
    const x = ((i * 137 + game.time * (14 + (i % 5) * 4)) % 1500) - 110;
    const y = 90 + ((i * 73) % 540) + Math.sin(game.time * 0.8 + i) * 22;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(game.time * 0.35 + i);
    ctx.globalAlpha = 0.2;
    const k = MENU_FLOATERS[i];
    if (k === "bun") {
      drawEllipse(0, 0, 30, 20, "#f0a94d");
      drawEllipse(0, -6, 16, 5, "#fff3df");
    } else if (k === "patty") {
      drawEllipse(0, 0, 28, 18, "#8a5230");
    } else if (k === "cheese") {
      fillRound(-24, -14, 48, 28, 4, "#f2c230");
    } else if (k === "fries") {
      drawFries(0, 14, 0.8, "cooked");
    } else if (k === "cup") {
      drawCup(0, 30, 0.7, "cola");
    } else {
      drawStar(0, 0, 18, "#f2b134");
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

function drawMenuScene() {
  ctx.fillStyle = vGradient(0, 720, "#3d2312", "#150c07");
  ctx.fillRect(0, 0, 1280, 720);
  // أشعة ضوء بتلف
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * Math.PI * 2 + game.time * 0.05;
    ctx.fillStyle = "rgba(255,214,130,0.055)";
    ctx.beginPath();
    ctx.moveTo(400, 380);
    ctx.lineTo(400 + Math.cos(a - 0.09) * 1000, 380 + Math.sin(a - 0.09) * 1000);
    ctx.lineTo(400 + Math.cos(a + 0.09) * 1000, 380 + Math.sin(a + 0.09) * 1000);
    ctx.closePath();
    ctx.fill();
  }
  const glow = ctx.createRadialGradient(400, 380, 20, 400, 380, 440 + Math.sin(game.time * 1.6) * 20);
  glow.addColorStop(0, "rgba(242,177,52,0.4)");
  glow.addColorStop(1, "rgba(242,177,52,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1280, 720);
  drawFloaters();

  // اللوجو
  const bob = Math.sin(game.time * 1.8) * 7;
  if (imageReady("logo")) {
    withShadow(34, 14, "rgba(0,0,0,0.6)", function () {
      fillRound(150, 100 + bob, 500, 500, 56, "#2b1d14");
    });
    ctx.save();
    roundRectPath(150, 100 + bob, 500, 500, 56);
    ctx.clip();
    ctx.drawImage(IMAGES.logo, 150, 100 + bob, 500, 500);
    ctx.restore();
    strokeRound(150, 100 + bob, 500, 500, 56, "rgba(242,177,52,0.9)", 5);
  } else {
    drawText("برجر الحريف", 400, 330, 70, "#f2b134");
  }
  drawText("مطعم برجر في قلب القاهرة", 400, 650, 24, "#ffe9a8");

  // لوح الأزرار
  const nButtons = getHotspots().filter(function (h) { return h.label; }).length;
  withShadow(24, 10, "rgba(0,0,0,0.5)", function () {
    outlinedRound(730, 186, 400, 90 + nButtons * 74 + (game.saveInfo !== null ? 40 : 0), 26, "rgba(30,18,10,0.78)", 3, "rgba(242,177,52,0.75)");
  });
  fillRound(742, 196, 376, 40, 18, "rgba(242,177,52,0.18)");
  drawText("القائمة الرئيسية", 930, 224, 22, "#f2b134");
  drawHotspotButtons();
  if (game.saveInfo !== null) {
    drawText("فيه لعبة محفوظة: اليوم " + game.saveInfo.day, 930, 250 + nButtons * 74 + 14, 17, "#8fdc5a");
  }
  drawText("دوس F في أي وقت لملء الشاشة", 640, 702, 15, "#8a6d55");
  drawText("الإصدار 8", 1256, 704, 14, "#6b5240", "right");
  drawVignette(0);
}

// ---------- شاشة التحميل ----------

function drawLoadingScene() {
  const L = game.loading;
  const frac = Math.min(1, L.t / L.dur);
  const eased = 1 - Math.pow(1 - frac, 2);
  ctx.fillStyle = vGradient(0, 720, "#3d2312", "#150c07");
  ctx.fillRect(0, 0, 1280, 720);
  const glow = ctx.createRadialGradient(640, 330, 20, 640, 330, 640);
  glow.addColorStop(0, "rgba(242,177,52,0.28)");
  glow.addColorStop(1, "rgba(242,177,52,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1280, 720);
  drawFloaters();

  // الصورة (بتقرب ببطء وبتظهر بنعومة)
  const fade = Math.min(1, L.t / 0.5);
  ctx.globalAlpha = fade;
  if (imageReady("loading")) {
    const zoom = 1 + 0.05 * frac;
    withShadow(34, 14, "rgba(0,0,0,0.6)", function () {
      ctx.save();
      roundRectPath(120, 92, 1040, 395, 24);
      ctx.clip();
      ctx.translate(640, 290);
      ctx.scale(zoom, zoom);
      ctx.drawImage(IMAGES.loading, -520, -197.5, 1040, 395);
      ctx.restore();
    });
    strokeRound(120, 92, 1040, 395, 24, "rgba(242,177,52,0.9)", 5);
  } else {
    drawText("برجر الحريف", 640, 300, 80, "#f2b134");
  }
  ctx.globalAlpha = 1;

  // شريط التقدم
  const bx = 330;
  const bw = 620;
  outlinedRound(bx, 540, bw, 26, 13, "#1a110b", 3, "rgba(242,177,52,0.6)");
  const fw = Math.max(26, bw * eased);
  roundRectPath(bx, 540, fw, 26, 13);
  const bar = ctx.createLinearGradient(0, 540, 0, 566);
  bar.addColorStop(0, "#ffd36b");
  bar.addColorStop(1, "#d9921c");
  ctx.fillStyle = bar;
  ctx.fill();
  // لمعة بتتحرك
  ctx.save();
  roundRectPath(bx, 540, fw, 26, 13);
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.fillRect(bx + ((game.time * 220) % (fw + 60)) - 30, 540, 22, 26);
  ctx.restore();
  // برجر صغير بيمشي على الشريط
  drawBurger(bx + fw - 6, 556 + Math.sin(game.time * 14) * 2, [{ type: "bun" }, { type: "patty", doneness: "cooked" }, { type: "bun" }], 0.2);
  const dots = ".".repeat(Math.floor(game.time * 3) % 4);
  drawText("جاري التحميل" + dots, 640, 600, 22, "#fff3df");
  drawText(Math.floor(eased * 100) + "%", bx + bw, 600, 18, "#f2b134", "right");

  // نصيحة
  outlinedRound(240, 626, 800, 48, 16, "rgba(30,18,10,0.8)", 2, "rgba(242,177,52,0.5)");
  drawStar(272, 650, 11, "#f2b134");
  drawText(L.tip, 660, 657, 18, "#ffe9a8");
  drawVignette(0);
}

// ---------- تقرير آخر اليوم (على شكل فاتورة) ----------

function drawResultsScene() {
  ctx.fillStyle = vGradient(0, 720, "#3d2312", "#150c07");
  ctx.fillRect(0, 0, 1280, 720);
  drawFloaters();
  drawVignette(0);

  // الورقة بحافة مسننة من تحت
  withShadow(30, 12, "rgba(0,0,0,0.55)", function () {
    ctx.beginPath();
    ctx.moveTo(340, 40);
    ctx.lineTo(940, 40);
    ctx.lineTo(940, 676);
    for (let x = 940; x > 340; x -= 20) {
      ctx.lineTo(x - 10, 692);
      ctx.lineTo(x - 20, 676);
    }
    ctx.closePath();
    ctx.fillStyle = "#fff6e4";
    ctx.fill();
  });
  ctx.strokeStyle = "rgba(90,58,38,0.35)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(358, 58, 564, 590);
  ctx.setLineDash([]);

  drawText("برجر الحريف", 640, 100, 34, "#c97a30");
  drawText("تقرير اليوم " + game.day, 640, 138, 24, "#2b1d14");
  ctx.fillStyle = "#f2b134";
  ctx.fillRect(420, 150, 440, 4);

  const st = game.stats;
  const profit = st.revenue - st.spent - st.upgrades;
  const avg = averageRating();
  const rows = [
    ["زباين اتخدموا", String(st.served), "#2b1d14"],
    ["زباين مشيوا زهقانين", String(st.left), "#2b1d14"],
    ["طلبات اترفضت", String(st.rejected), "#2b1d14"],
    ["المبيعات والبقشيش", st.revenue + " EGP", "#2b1d14"],
    ["مصاريف المكونات", (st.spent > 0 ? "-" : "") + st.spent + " EGP", st.spent > 0 ? "#b3261e" : "#2b1d14"],
    ["تطويرات", (st.upgrades > 0 ? "-" : "") + st.upgrades + " EGP", st.upgrades > 0 ? "#b3261e" : "#2b1d14"],
    ["الربح", (profit >= 0 ? "+" : "") + profit + " EGP", profit >= 0 ? "#2f7a1a" : "#b3261e"],
    ["فايدة البنك", (st.interest > 0 ? "+" : "") + st.interest + " EGP", st.interest > 0 ? "#2f7a1a" : "#2b1d14"],
    ["أقساط القروض", (st.loanPaid > 0 ? "-" : "") + st.loanPaid + " EGP", st.loanPaid > 0 ? "#b3261e" : "#2b1d14"],
    ["التقييم العام", avg === null ? "-" : avg.toFixed(1) + " / 5", "#2b1d14"],
    ["الكاش دلوقتي", game.cash + " EGP", "#2b1d14"],
    ["رصيد البنك", game.bank.balance + " EGP", "#2b1d14"]
  ];
  for (let i = 0; i < rows.length; i++) {
    const y = 192 + i * 31;
    const strong = i === 6;
    if (strong) {
      fillRound(380, y - 20, 520, 28, 8, "rgba(242,177,52,0.22)");
    }
    drawText(rows[i][0], 890, y, strong ? 21 : 19, "#6b4a32", "right");
    drawText(rows[i][1], 392, y, strong ? 22 : 20, rows[i][2], "left");
    ctx.font = "bold 20px " + FONT;
    const valueEnd = 392 + ctx.measureText(rows[i][1]).width + 14;
    ctx.font = "bold " + (strong ? 21 : 19) + "px " + FONT;
    const labelStart = 890 - ctx.measureText(rows[i][0]).width - 12;
    ctx.fillStyle = "rgba(90,58,38,0.3)";
    for (let dx = valueEnd; dx < labelStart; dx += 12) {
      ctx.fillRect(dx, y - 4, 5, 2);
    }
  }
  if (st.loanMissed > 0) {
    drawText("تنبيه: اتأخرت عن قسط قرض!", 640, 584, 17, "#b3261e");
  } else {
    drawText("تم حفظ تقدمك تلقائياً", 640, 584, 15, "#8a6d55");
  }

  // ختم
  ctx.save();
  ctx.translate(866, 104);
  ctx.rotate(-0.28);
  strokeRound(-56, -22, 112, 44, 8, "rgba(201,58,52,0.75)", 4);
  drawText("تم", 0, 9, 28, "rgba(201,58,52,0.75)");
  ctx.restore();

  drawHotspotButtons();
}
