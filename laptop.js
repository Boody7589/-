// ===== laptop.js: نظام Burger OS (الشاشة الرئيسية والتطبيقات) =====

// ---------- أيقونات التطبيقات ----------

function drawAppIcon(key, cx, cy, size, color, locked) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  const r = size * 0.22;
  const s = size;
  withShadow(10, 5, "rgba(0,0,0,0.4)", function () {
    fillRound(x, y, size, size, r, color);
  });
  fillRound(x + 4, y + 3, size - 8, size / 2 - 3, r * 0.8, "rgba(255,255,255,0.25)");
  strokeRound(x, y, size, size, r, "rgba(26,17,11,0.8)", 3);

  const cream = "#fff3df";
  ctx.fillStyle = cream;
  if (key === "shop") {
    fillRound(cx - s * 0.22, cy - s * 0.05, s * 0.44, s * 0.36, 6, cream);
    ctx.strokeStyle = cream;
    ctx.lineWidth = s * 0.05;
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.05, s * 0.12, Math.PI, Math.PI * 2);
    ctx.stroke();
  } else if (key === "upgrades") {
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.27);
    ctx.lineTo(cx + s * 0.22, cy);
    ctx.lineTo(cx + s * 0.09, cy);
    ctx.lineTo(cx + s * 0.09, cy + s * 0.25);
    ctx.lineTo(cx - s * 0.09, cy + s * 0.25);
    ctx.lineTo(cx - s * 0.09, cy);
    ctx.lineTo(cx - s * 0.22, cy);
    ctx.closePath();
    ctx.fill();
  } else if (key === "reviews") {
    drawStar(cx, cy + 2, s * 0.3, cream);
  } else if (key === "reports") {
    fillRound(cx - s * 0.24, cy + s * 0.05, s * 0.12, s * 0.2, 3, cream);
    fillRound(cx - s * 0.06, cy - s * 0.1, s * 0.12, s * 0.35, 3, cream);
    fillRound(cx + s * 0.12, cy - s * 0.22, s * 0.12, s * 0.47, 3, cream);
  } else if (key === "staff") {
    drawEllipse(cx, cy - s * 0.12, s * 0.1, s * 0.1, cream);
    ctx.beginPath();
    ctx.ellipse(cx, cy + s * 0.22, s * 0.2, s * 0.15, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  } else {
    // بيت (الشاشة الرئيسية)
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.27, cy - s * 0.02);
    ctx.lineTo(cx, cy - s * 0.27);
    ctx.lineTo(cx + s * 0.27, cy - s * 0.02);
    ctx.closePath();
    ctx.fill();
    fillRound(cx - s * 0.18, cy - s * 0.02, s * 0.36, s * 0.26, 3, cream);
    fillRound(cx - s * 0.05, cy + s * 0.08, s * 0.1, s * 0.16, 2, color);
  }
  if (locked) {
    fillRound(x, y, size, size, r, "rgba(20,14,10,0.62)");
    ctx.strokeStyle = "#f2b134";
    ctx.lineWidth = Math.max(2, s * 0.04);
    ctx.beginPath();
    ctx.arc(cx, cy - s * 0.08, s * 0.1, Math.PI, Math.PI * 2);
    ctx.stroke();
    fillRound(cx - s * 0.15, cy - s * 0.08, s * 0.3, s * 0.24, 4, "#f2b134");
  }
}

function drawBadge(x, y, n) {
  drawEllipse(x, y, 14, 14, "#d62f2a");
  ctx.strokeStyle = "#fff3df";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.stroke();
  drawText(String(n), x, y + 6, 16, "#fff3df");
}

// ---------- شريط الحالة (أعلى الشاشة) ----------

function drawOsStatusBar() {
  fillRound(116, 106, 1048, 44, 10, "rgba(0,0,0,0.38)");
  // أيقونة برجر صغيرة + اسم النظام
  drawEllipse(146, 134, 11, 6, "#e0953f");
  drawEllipse(146, 128, 11, 7, "#f0a94d");
  fillRound(135, 130, 22, 4, 2, "#6b3a1f");
  drawText("Burger OS", 168, 135, 19, "#fff3df", "left");

  // الكاش
  drawEllipse(1142, 128, 10, 10, "#f2b134");
  drawText("E", 1142, 133, 12, "#2b1d14");
  drawText(game.cash + " EGP", 1124, 134, 17, "#fff3df", "right");

  // الوقت
  drawText(clockText(), 980, 134, 17, "#fff3df");

  // واي فاي
  ctx.strokeStyle = "#fff3df";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (let k = 1; k <= 3; k++) {
    ctx.beginPath();
    ctx.arc(900, 138, k * 6, -2.3, -0.84);
    ctx.stroke();
  }
  drawEllipse(900, 138, 2.5, 2.5, "#fff3df");

  // بطارية
  strokeRound(830, 124, 30, 15, 3, "#fff3df", 2);
  fillRound(833, 127, 22, 9, 2, "#8fdc5a");
  fillRound(861, 128, 3, 7, 1, "#fff3df");
}

// ---------- الشاشة الرئيسية ----------

function drawOsWallpaper() {
  fillRound(116, 106, 1048, 508, 10, vGradient(106, 614, "#2f8fb0", "#14304a"));
  const glow = ctx.createRadialGradient(640, 360, 20, 640, 360, 460);
  glow.addColorStop(0, "rgba(255,225,150,0.22)");
  glow.addColorStop(1, "rgba(255,225,150,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(116, 150, 1048, 464);
  if (imageReady("logo")) {
    ctx.globalAlpha = 0.14;
    ctx.drawImage(IMAGES.logo, 450, 190, 380, 380);
    ctx.globalAlpha = 1;
  }
}

function drawOsHome() {
  drawOsWallpaper();
  drawOsStatusBar();
  for (let i = 0; i < OS_APPS.length; i++) {
    const a = OS_APPS[i];
    const c = OS_ICON_POS[i];
    const hot = game.hover === "app-" + a.key;
    drawAppIcon(a.key, c.x, c.y, hot ? 132 : 120, a.color, !!a.locked);
    drawText(a.name, c.x, c.y + 98, 20, "#fff3df");
    if (a.key === "shop" && game.deliveries.length > 0) {
      drawBadge(c.x + 56, c.y - 56, game.deliveries.length);
    }
    if (a.key === "reviews" && game.unreadReviews > 0) {
      drawBadge(c.x + 56, c.y - 56, Math.min(99, game.unreadReviews));
    }
    if (a.locked) {
      drawText("قريباً", c.x, c.y + 120, 14, "#8fb3c4");
    }
  }
}

// ---------- الشريط الجانبي (dock) ----------

function drawDock() {
  fillRound(126, 160, 170, 444, 10, "rgba(0,0,0,0.3)");
  const items = [{ key: "home", name: "الرئيسية", color: "#2f8fb0" }].concat(OS_APPS);
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const b = dockBox(i);
    const active = game.laptopTab === it.key;
    const hot = game.hover === "dock-" + it.key;
    fillRound(b.x, b.y, b.w, b.h, 10, active ? "rgba(242,177,52,0.9)" : (hot ? "rgba(255,243,223,0.2)" : "rgba(255,243,223,0.08)"));
    drawAppIcon(it.key, b.x + b.w - 28, b.y + b.h / 2, 34, it.color, !!it.locked);
    drawText(it.name, b.x + b.w - 52, b.y + b.h / 2 + 6, 15, active ? "#2b1d14" : "#fff3df", "right");
  }
}

// ---------- الشاشة الرئيسية للابتوب ----------

function drawLaptopScene() {
  ctx.fillStyle = vGradient(0, 720, "#5a3a26", "#3a2819");
  ctx.fillRect(0, 0, 1280, 720);
  withShadow(30, 12, "rgba(0,0,0,0.5)", function () {
    fillRound(100, 90, 1080, 540, 18, "#1a1d21");
  });

  if (game.laptopTab === "home") {
    drawOsHome();
  } else {
    fillRound(116, 106, 1048, 508, 10, vGradient(106, 614, "#1f4a63", "#14283a"));
    drawOsStatusBar();
    drawDock();
    fillRound(310, 160, 850, 444, 12, "rgba(0,0,0,0.18)");
    if (game.laptopTab === "shop") {
      drawShopTab();
    } else if (game.laptopTab === "upgrades") {
      drawUpgradesTab();
    } else if (game.laptopTab === "reviews") {
      drawReviewsTab();
    } else {
      drawReportsTab();
    }
  }

  drawHotspotButtons();
  drawHud();
  drawMessage();
}

// ---------- تطبيق طلب المكونات ----------

function drawShopTab() {
  drawText("طلب مكونات", 1140, 196, 26, "#fff3df", "right");
  drawText("صفحة " + (game.shopPage + 1) + " / " + shopPageCount(), 640, 192, 16, "#bfe3f2");
  const items = visibleShopItems();
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const y = shopRowY(i);
    fillRound(320, y, 580, 56, 12, "rgba(255,243,223,0.12)");
    fillRound(836, y + 6, 54, 44, 10, "rgba(0,0,0,0.25)");
    drawShopIcon(it.key, 863, y + 28);
    drawText(it.label, 824, y + 25, 20, "#fff3df", "right");
    drawText("حزمة " + it.pack + " = " + it.price + " EGP", 824, y + 46, 14, "#bfe3f2", "right");
    let stockText = "المخزون: " + game.stock[it.key];
    if (it.key === "patties") {
      stockText = "المخزون: " + game.stock.patties + " / " + freezerCap();
    }
    drawText(stockText, 640, y + 34, 18, "#fff3df");
    drawText(String(game.cart[it.key]), 420, y + 35, 22, "#f2b134");
  }

  const total = cartTotal();
  drawText("الإجمالي: " + total + " EGP", 340, 592, 22, "#fff3df", "left");
  if (total > game.cash) {
    drawText("فلوسك مش كفاية", 560, 592, 18, "#ff7a70", "left");
  }

  // طلبيات في الطريق
  fillRound(920, 190, 230, 404, 12, "rgba(0,0,0,0.25)");
  drawText("في الطريق", 1035, 224, 20, "#f2b134");
  if (game.deliveries.length === 0) {
    drawText("مفيش طلبيات", 1035, 270, 16, "#8fb3c4");
  }
  for (let i = 0; i < game.deliveries.length && i < 4; i++) {
    const d = game.deliveries[i];
    fillRound(932, 244 + i * 84, 206, 74, 10, "rgba(255,243,223,0.12)");
    drawText("طلبية رقم " + d.id, 1035, 270 + i * 84, 17, "#fff3df");
    drawText("توصل بعد " + Math.ceil(d.remaining) + " دقيقة", 1035, 296 + i * 84, 15, "#bfe3f2");
  }
}

// ---------- تطبيق التطويرات ----------

function drawUpgradesTab() {
  drawText("التطويرات", 1150, 196, 26, "#fff3df", "right");
  drawText("الكاش: " + game.cash + " EGP", 330, 196, 18, "#f2b134", "left");
  for (let i = 0; i < UPGRADES.length; i++) {
    const u = UPGRADES[i];
    const c = upgradeCardBox(i);
    const lvl = game.up[u.key] === undefined ? 0 : game.up[u.key];
    const owned = u.max > 0 && lvl >= u.max;
    fillRound(c.x, c.y, c.w, c.h, 12, owned ? "rgba(90,163,53,0.22)" : "rgba(255,243,223,0.12)");
    drawText(u.name, c.x + c.w - 12, c.y + 24, 17, "#fff3df", "right");
    drawText(u.desc, c.x + c.w - 12, c.y + 48, 12, "#bfe3f2", "right");
    let info = "";
    if (u.max === 0) {
      info = "جاي قريباً";
    } else if (u.max === 1) {
      info = lvl > 0 ? "مفتوح" : "مقفول";
    } else {
      info = "المستوى " + lvl + " / " + u.max;
    }
    if (u.key === "freezer") {
      info = info + " - السعة " + freezerCap();
    } else if (u.key === "soda") {
      info = info + " - " + sodaFillTime() + " ث";
    }
    drawText(info, c.x + c.w - 12, c.y + 72, 12, lvl > 0 ? "#8fdc5a" : "#f2b134", "right");
  }
}

// ---------- تطبيق التقييمات ----------

function drawReviewsTab() {
  drawText("التقييمات", 1150, 196, 26, "#fff3df", "right");
  const avg = averageRating();
  fillRound(320, 214, 240, 380, 12, "rgba(0,0,0,0.25)");
  drawText(avg === null ? "-" : avg.toFixed(1), 440, 320, 72, "#f2b134");
  drawStars(440, 360, 13, avg === null ? 0 : Math.round(avg));
  drawText("من " + game.ratingCount + " تقييم", 440, 410, 18, "#bfe3f2");
  drawText("التقييم العالي بيجيبلك", 440, 470, 15, "#8fb3c4");
  drawText("زباين أكتر", 440, 492, 15, "#8fb3c4");

  if (game.reviews.length === 0) {
    drawText("لسه مفيش تقييمات", 860, 330, 22, "#8fb3c4");
  }
  for (let i = 0; i < game.reviews.length && i < 5; i++) {
    const r = game.reviews[i];
    const y = 214 + i * 76;
    fillRound(580, y, 570, 68, 12, "rgba(255,243,223,0.12)");
    drawText(r.name, 1134, y + 26, 18, "#fff3df", "right");
    drawText(r.text, 1134, y + 52, 15, "#bfe3f2", "right");
    drawStars(660, y + 24, 8, r.stars);
    drawText("اليوم " + r.day, 610, y + 56, 13, "#8fb3c4", "left");
  }
}

// ---------- تطبيق التقارير ----------

function drawReportsTab() {
  drawText("التقارير", 1150, 196, 26, "#fff3df", "right");
  const st = game.stats;

  // النهاردة
  fillRound(320, 214, 260, 380, 12, "rgba(0,0,0,0.25)");
  drawText("النهاردة (يوم " + game.day + ")", 450, 248, 20, "#f2b134");
  const rows = [
    ["زباين اتخدموا", String(st.served)],
    ["زباين مشيوا", String(st.left)],
    ["طلبات اترفضت", String(st.rejected)],
    ["المبيعات", st.revenue + " EGP"],
    ["مصاريف المكونات", st.spent + " EGP"],
    ["تطويرات", st.upgrades + " EGP"]
  ];
  for (let i = 0; i < rows.length; i++) {
    const y = 292 + i * 44;
    drawText(rows[i][0], 566, y, 16, "#bfe3f2", "right");
    drawText(rows[i][1], 336, y, 18, "#fff3df", "left");
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(336, y + 10, 230, 1);
  }

  // آخر الأيام
  fillRound(600, 214, 550, 380, 12, "rgba(0,0,0,0.25)");
  drawText("آخر الأيام", 1134, 248, 20, "#f2b134", "right");
  const hist = game.history.slice(-7);
  if (hist.length === 0) {
    drawText("لسه مفيش أيام اتسجلت", 875, 400, 20, "#8fb3c4");
    return;
  }
  let max = 100;
  for (let i = 0; i < hist.length; i++) {
    max = Math.max(max, hist[i].revenue, hist[i].spent);
  }
  const baseY = 470;
  for (let k = 0; k < hist.length; k++) {
    const h = hist[hist.length - 1 - k];
    const gx = 1100 - k * 70;
    const revH = (h.revenue / max) * 170;
    const costH = (h.spent / max) * 170;
    fillRound(gx - 56, baseY - revH, 26, Math.max(2, revH), 4, "#f2b134");
    fillRound(gx - 28, baseY - costH, 26, Math.max(2, costH), 4, "#d62f2a");
    drawText("يوم " + h.day, gx - 28, baseY + 22, 14, "#bfe3f2");
    drawText((h.profit >= 0 ? "+" : "") + h.profit, gx - 28, baseY + 42, 13, h.profit >= 0 ? "#8fdc5a" : "#ff7a70");
  }
  fillRound(640, 548, 14, 14, 3, "#f2b134");
  drawText("مبيعات", 662, 560, 14, "#fff3df", "left");
  fillRound(740, 548, 14, 14, 3, "#d62f2a");
  drawText("مصاريف", 762, 560, 14, "#fff3df", "left");
}
