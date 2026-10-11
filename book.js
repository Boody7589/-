// ===== book.js: كتاب المنيو (صفحات بتظهر فيها الحاجات اللي فتحتها بس) =====

function drawSauceBottleUp(x, baseY, sauce, sc) {
  fillRound(x - 22 * sc, baseY - 90 * sc, 44 * sc, 80 * sc, 12 * sc, vGradient(baseY - 90 * sc, baseY - 10 * sc, sauce.color, sauce.dark));
  ctx.strokeStyle = "rgba(58,33,18,0.7)";
  ctx.lineWidth = 2;
  ctx.stroke();
  fillRound(x - 14 * sc, baseY - 80 * sc, 7 * sc, 55 * sc, 3, "rgba(255,255,255,0.35)");
  fillRound(x - 8 * sc, baseY - 112 * sc, 16 * sc, 24 * sc, 3, sauce.cap);
  fillRound(x - 3 * sc, baseY - 122 * sc, 6 * sc, 12 * sc, 2, sauce.cap);
}

function bookItemRow(y, name, price, desc) {
  drawText(name, 1040, y, 26, "#2b1d14", "right");
  if (price !== null) {
    drawText(price + " EGP", 680, y, 24, "#c97a30", "left");
  }
  drawText(desc, 1040, y + 26, 15, "#6b4a32", "right");
  ctx.fillStyle = "rgba(90,58,38,0.25)";
  ctx.fillRect(680, y + 40, 360, 2);
}

function drawBookScene() {
  // الترابيزة
  ctx.fillStyle = vGradient(0, 720, "#5a3a26", "#2b1d14");
  ctx.fillRect(0, 0, 1280, 720);
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 2;
  for (let y = 70; y < 720; y += 46) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1280, y);
    ctx.stroke();
  }

  // الكتاب
  withShadow(30, 14, "rgba(0,0,0,0.6)", function () {
    fillRound(190, 96, 900, 508, 18, "#5a2a1a");
  });
  fillRound(210, 114, 420, 472, 10, "#fff3df");
  fillRound(650, 114, 420, 472, 10, "#f7ead0");
  const spine = ctx.createLinearGradient(600, 0, 680, 0);
  spine.addColorStop(0, "rgba(90,58,38,0)");
  spine.addColorStop(0.5, "rgba(90,58,38,0.45)");
  spine.addColorStop(1, "rgba(90,58,38,0)");
  ctx.fillStyle = spine;
  ctx.fillRect(600, 114, 80, 472);
  // شريط العلامة
  ctx.fillStyle = "#d62f2a";
  ctx.beginPath();
  ctx.moveTo(1010, 96);
  ctx.lineTo(1036, 96);
  ctx.lineTo(1036, 168);
  ctx.lineTo(1023, 154);
  ctx.lineTo(1010, 168);
  ctx.closePath();
  ctx.fill();

  const spreads = bookSpreads();
  if (game.bookPage >= spreads.length) {
    game.bookPage = spreads.length - 1;
  }
  const kind = spreads[game.bookPage];

  if (kind === "burgers") {
    const layers = [{ type: "bun" }, { type: "sauce", color: "#d62f2a" }, { type: "patty", doneness: "cooked" }];
    if (game.up.cheese > 0) {
      layers.push({ type: "cheese" });
    }
    layers.push({ type: "bun" });
    drawPlate(420, 520, 150);
    drawBurger(420, 512, layers, 1.9);
    drawText("البرجر", 860, 170, 34, "#5a2a1a");
    bookItemRow(240, MENU.classic.name, MENU.classic.price, "رغيف + باتي + رغيف");
    let y = 350;
    if (game.up.cheese > 0) {
      bookItemRow(y, MENU.cheese.name, MENU.cheese.price, "رغيف + باتي + جبنة + رغيف");
      y = y + 110;
    }
    drawText("الصوص بيتحدد حسب رغبة كل زبون", 860, 540, 15, "#6b4a32");
  } else if (kind === "sauces") {
    drawPlate(420, 520, 150);
    for (let i = 0; i < SAUCES.length; i++) {
      drawSauceBottleUp(330 + i * 90, 500, SAUCES[i], 1.5);
      drawText(SAUCES[i].label, 330 + i * 90, 540, 15, "#2b1d14");
    }
    drawText("الصوصات", 860, 170, 34, "#5a2a1a");
    for (let i = 0; i < SAUCES.length; i++) {
      drawEllipse(1010, 240 + i * 52 - 8, 12, 12, SAUCES[i].color);
      drawText(SAUCES[i].label, 985, 240 + i * 52, 24, "#2b1d14", "right");
    }
    drawText("الزبون ممكن يطلب:", 1040, 420, 20, "#5a2a1a", "right");
    drawText("- صوص معين", 1040, 452, 17, "#6b4a32", "right");
    drawText("- من غير صوص خالص", 1040, 478, 17, "#6b4a32", "right");
    drawText("(ولازم تلتزم باللي يطلبه)", 1040, 504, 15, "#8a6d55", "right");
  } else if (kind === "sides") {
    drawPlate(420, 520, 150);
    drawFries(420, 505, 3.2, "cooked");
    drawText("المقبلات", 860, 170, 34, "#5a2a1a");
    bookItemRow(240, MENU.fries.name, MENU.fries.price, "بتتقلي في القلاية");
    drawText("اقليها لحد ما الشريط يبقى أخضر", 1040, 360, 17, "#6b4a32", "right");
    drawText("لو سبتها كتير هتتحرق!", 1040, 388, 17, "#b3261e", "right");
  } else {
    drawPlate(420, 520, 150);
    drawCup(350, 505, 2.6, "cola");
    drawCup(490, 505, 2.6, "orange");
    drawText("المشروبات", 860, 170, 34, "#5a2a1a");
    bookItemRow(240, MENU.cola.name, MENU.cola.price, "من ماكينة المشروبات");
    bookItemRow(350, MENU.orange.name, MENU.orange.price, "من ماكينة المشروبات");
    drawText("خد كوباية فاضية واملاها بنفسك", 1040, 480, 17, "#6b4a32", "right");
  }

  drawText((game.bookPage + 1) + " / " + spreads.length, 640, 574, 15, "#6b4a32");
  drawVignette(0);
  drawHotspotButtons();
  drawHud();
  drawMessage();
}
