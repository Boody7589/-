// ===== art.js: أدوات الرسم + البرجر + الشخصيات + الواجهة العلوية =====

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const FONT = "Cairo, Arial, sans-serif";

// صور اللعبة (اللوجو وشاشة التحميل) - لو الملف مش موجود اللعبة بتكمل عادي
const IMAGES = {};

function loadImage(key, src) {
  if (typeof Image === "undefined") {
    return;
  }
  const img = new Image();
  img.src = src;
  IMAGES[key] = img;
}

function imageReady(key) {
  const img = IMAGES[key];
  return !!img && img.complete && img.naturalWidth > 0;
}

const hasData = typeof IMAGE_DATA !== "undefined";
loadImage("logo", hasData ? IMAGE_DATA.logo : "logo.png");
loadImage("loading", hasData ? IMAGE_DATA.loading : "loading.jpg");

// أزرار الواجهة العلوية (ملء الشاشة / الصوت / القائمة)
const HUD_BOXES = {
  full: { x: 880, y: 12, w: 40, h: 40 },
  sound: { x: 928, y: 12, w: 40, h: 40 },
  menu: { x: 976, y: 12, w: 40, h: 40 }
};

// ---------- أدوات رسم عامة ----------

function roundRectPath(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fillRound(x, y, w, h, r, fill) {
  roundRectPath(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function vGradient(y1, y2, c1, c2) {
  const g = ctx.createLinearGradient(0, y1, 0, y2);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

function withShadow(blur, offsetY, color, drawFn) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetY = offsetY;
  drawFn();
  ctx.restore();
}

function drawText(text, x, y, size, color, align) {
  ctx.fillStyle = color;
  ctx.font = "bold " + size + "px " + FONT;
  ctx.textAlign = align || "center";
  ctx.fillText(text, x, y);
}

function drawEllipse(cx, cy, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawButton(box, label, color, textColor, hovered, size) {
  const fs = size || 22;
  const r = Math.min(14, box.h / 2);
  withShadow(hovered ? 20 : 10, 4, "rgba(0,0,0,0.45)", function () {
    fillRound(box.x, box.y, box.w, box.h, r, color);
  });
  roundRectPath(box.x, box.y, box.w, box.h, r);
  const g = ctx.createLinearGradient(0, box.y, 0, box.y + box.h);
  g.addColorStop(0, "rgba(255,255,255,0.28)");
  g.addColorStop(0.5, "rgba(255,255,255,0.04)");
  g.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = "rgba(26,17,11,0.85)";
  ctx.lineWidth = 3;
  ctx.stroke();
  if (hovered) {
    fillRound(box.x, box.y, box.w, box.h, r, "rgba(255,255,255,0.2)");
  }
  drawText(label, box.x + box.w / 2, box.y + box.h / 2 + fs * 0.36, fs, textColor);
}

// بيرسم كل الأزرار اللي ليها label في المشهد الحالي
function drawHotspotButtons() {
  const list = getHotspots();
  for (let i = 0; i < list.length; i++) {
    const h = list[i];
    if (h.label) {
      drawButton(h.box, h.label, h.color, h.textColor, game.hover === h.name, h.size);
    }
  }
}

// ---------- الواجهة العلوية ----------

function clockText() {
  const h = Math.floor(game.minutes / 60);
  const m = Math.floor(game.minutes % 60);
  const suffix = h >= 12 ? "م" : "ص";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + ":" + (m < 10 ? "0" : "") + m + " " + suffix;
}

function drawHudIcons() {
  const names = ["full", "sound", "menu"];
  for (let i = 0; i < names.length; i++) {
    const b = HUD_BOXES[names[i]];
    const hot = game.hover === "hud-" + names[i];
    fillRound(b.x, b.y, b.w, b.h, 10, hot ? "#5a3a26" : "#3a2819");
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    if (names[i] === "full") {
      ctx.moveTo(b.x + 11, b.y + 18); ctx.lineTo(b.x + 11, b.y + 11); ctx.lineTo(b.x + 18, b.y + 11);
      ctx.moveTo(b.x + 22, b.y + 11); ctx.lineTo(b.x + 29, b.y + 11); ctx.lineTo(b.x + 29, b.y + 18);
      ctx.moveTo(b.x + 29, b.y + 22); ctx.lineTo(b.x + 29, b.y + 29); ctx.lineTo(b.x + 22, b.y + 29);
      ctx.moveTo(b.x + 18, b.y + 29); ctx.lineTo(b.x + 11, b.y + 29); ctx.lineTo(b.x + 11, b.y + 22);
    } else if (names[i] === "sound") {
      ctx.moveTo(b.x + 10, b.y + 16); ctx.lineTo(b.x + 16, b.y + 16); ctx.lineTo(b.x + 23, b.y + 10);
      ctx.lineTo(b.x + 23, b.y + 30); ctx.lineTo(b.x + 16, b.y + 24); ctx.lineTo(b.x + 10, b.y + 24);
      ctx.closePath();
      if (audioSettings.sfx || audioSettings.music) {
        ctx.moveTo(b.x + 28, b.y + 14);
        ctx.arc(b.x + 24, b.y + 20, 6, -0.9, 0.9);
      } else {
        ctx.moveTo(b.x + 28, b.y + 14); ctx.lineTo(b.x + 35, b.y + 26);
        ctx.moveTo(b.x + 35, b.y + 14); ctx.lineTo(b.x + 28, b.y + 26);
      }
    } else {
      ctx.moveTo(b.x + 10, b.y + 12); ctx.lineTo(b.x + 30, b.y + 12);
      ctx.moveTo(b.x + 10, b.y + 20); ctx.lineTo(b.x + 30, b.y + 20);
      ctx.moveTo(b.x + 10, b.y + 28); ctx.lineTo(b.x + 30, b.y + 28);
    }
    ctx.stroke();
  }
}

function drawHud() {
  ctx.fillStyle = vGradient(0, 64, "#2b1d14", "#1a110b");
  ctx.fillRect(0, 0, 1280, 64);
  ctx.fillStyle = "#f2b134";
  ctx.fillRect(0, 62, 1280, 2);
  if (imageReady("logo")) {
    ctx.drawImage(IMAGES.logo, 14, 6, 52, 52);
  }
  drawText("برجر الحريف", imageReady("logo") ? 76 : 28, 42, 26, "#f2b134", "left");

  // اليوم والساعة وشريط تقدم اليوم
  drawText("اليوم " + game.day + "  -  " + clockText(), 640, 34, 20, "#fff3df");
  const frac = Math.min(1, Math.max(0, (game.minutes - DAY_START) / (DAY_END - DAY_START)));
  fillRound(540, 44, 200, 8, 4, "#3a2819");
  fillRound(540, 44, Math.max(8, 200 * frac), 8, 4, "#f2b134");

  // التقييم
  drawStar(786, 32, 11, "#f2b134");
  const avg = averageRating();
  drawText(avg === null ? "-" : avg.toFixed(1), 804, 40, 18, "#fff3df", "left");

  drawHudIcons();
  drawEllipse(1240, 32, 14, 14, "#f2b134");
  drawText("E", 1240, 38, 16, "#2b1d14");
  drawText(game.cash + " EGP", 1214, 41, 20, "#fff3df", "right");
}

function drawMessage() {
  if (game.message === null) {
    return;
  }
  withShadow(14, 4, "rgba(0,0,0,0.5)", function () {
    fillRound(430, 74, 420, 38, 19, "#1a110b");
  });
  drawText(game.message.text, 640, 100, 20, game.message.color);
}

// ---------- البرجر والطبق ----------

function drawPlate(cx, cy, rx) {
  withShadow(16, 8, "rgba(0,0,0,0.35)", function () {
    drawEllipse(cx, cy, rx, rx * 0.2, "#f4ece0");
  });
  drawEllipse(cx, cy, rx * 0.78, rx * 0.14, "#e3d8c6");
}

function pattyColors(doneness) {
  if (doneness === "raw") {
    return ["#d77a72", "#a8483f"];
  }
  if (doneness === "burnt") {
    return ["#3a251a", "#1a110b"];
  }
  return ["#8a5230", "#5a3017"];
}

function layerHeight(L, i, scale) {
  if (L.type === "bun") {
    return (i === 0 ? 32 : 58) * scale;
  }
  if (L.type === "sauce") {
    return 12 * scale;
  }
  if (L.type === "cheese") {
    return 9 * scale;
  }
  return 28 * scale;
}

// ارتفاع قمة البرجر (بنستخدمه عشان نعرف الصوص ينزل فين)
function burgerTopY(layers, baseY, scale) {
  let y = baseY;
  for (let i = 0; i < layers.length; i++) {
    y = y - layerHeight(layers[i], i, scale) + 3 * scale;
  }
  return y;
}

// بيرسم البرجر من تحت لفوق حسب الطبقات
function outlineLayer(scale) {
  ctx.strokeStyle = "rgba(58,33,18,0.7)";
  ctx.lineWidth = Math.max(1.2, 2 * scale);
  ctx.stroke();
}

// بيرسم البرجر من تحت لفوق حسب الطبقات (بخطوط خارجية زي اللوجو)
function drawBurger(cx, baseY, layers, scale) {
  let y = baseY;
  const w = 170 * scale;

  for (let i = 0; i < layers.length; i++) {
    const L = layers[i];
    const h = layerHeight(L, i, scale);
    y = y - h;

    if (L.type === "bun" && i === 0) {
      fillRound(cx - w / 2, y, w, h, 16 * scale, vGradient(y, y + h, "#e0953f", "#b8691f"));
      outlineLayer(scale);
    } else if (L.type === "bun") {
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, y + h);
      ctx.bezierCurveTo(cx - w / 2, y - h * 0.35, cx + w / 2, y - h * 0.35, cx + w / 2, y + h);
      ctx.closePath();
      ctx.fillStyle = vGradient(y, y + h, "#f0a94d", "#c97a30");
      ctx.fill();
      outlineLayer(scale);
      fillRound(cx - w * 0.3, y + h * 0.12, w * 0.3, h * 0.12, h * 0.06, "rgba(255,255,255,0.3)");
      const seeds = [[-0.22, 0.45], [0, 0.25], [0.22, 0.45], [-0.1, 0.62], [0.12, 0.62]];
      for (let k = 0; k < seeds.length; k++) {
        drawEllipse(cx + w * seeds[k][0], y + h * seeds[k][1], 5 * scale, 2.6 * scale, "#fff3df");
      }
    } else if (L.type === "sauce") {
      fillRound(cx - w * 0.46, y, w * 0.92, h, 6 * scale, L.color || "#d62f2a");
      outlineLayer(scale);
      fillRound(cx - w * 0.4, y + 2 * scale, w * 0.8, 3 * scale, 2, "rgba(255,255,255,0.35)");
    } else if (L.type === "cheese") {
      fillRound(cx - w * 0.52, y, w * 1.04, h, 3 * scale, "#f2c230");
      outlineLayer(scale);
      ctx.fillStyle = "#f2c230";
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.3, y + h);
      ctx.lineTo(cx - w * 0.2, y + h + 9 * scale);
      ctx.lineTo(cx - w * 0.1, y + h);
      ctx.closePath();
      ctx.fill();
      fillRound(cx - w * 0.45, y + 1.5 * scale, w * 0.9, 2 * scale, 1, "rgba(255,255,255,0.4)");
    } else if (L.type === "patty") {
      const colors = pattyColors(L.doneness);
      fillRound(cx - w * 0.48, y, w * 0.96, h, 13 * scale, vGradient(y, y + h, colors[0], colors[1]));
      outlineLayer(scale);
      if (L.doneness === "cooked" && scale > 0.5) {
        ctx.strokeStyle = "rgba(0,0,0,0.22)";
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        for (let k = -2; k <= 2; k++) {
          ctx.moveTo(cx + k * 22 * scale - 6 * scale, y + 6 * scale);
          ctx.lineTo(cx + k * 22 * scale + 6 * scale, y + h - 6 * scale);
        }
        ctx.stroke();
      }
    }
    y = y + 3 * scale;
  }
  return y;
}

// ---------- الشخصيات (الزباين) ----------

const CHARACTERS = [
  { id: "man", style: "short", skin: "#f3d9b4", skinDark: "#d9b88c", hair: "#2b1a12",
    shirt: ["#e23b34", "#a81f1b"], collar: true, mul: 1.0, say: "لو سمحت عايز:" },
  { id: "girl-hijab", style: "hijab", skin: "#f6dcc0", skinDark: "#e0bf9c", hair: "#2b1a12",
    scarf: ["#2f8f8a", "#1f635f"], shirt: ["#f2b134", "#c98a1a"], mul: 1.1, say: "ممكن أطلب؟" },
  { id: "girl-long", style: "long", skin: "#f0cfa8", skinDark: "#d8b088", hair: "#4a2a18",
    shirt: ["#7d5be0", "#4a2fa0"], mul: 1.0, say: "من فضلك:" },
  { id: "man-beard", style: "short", beard: true, glasses: true, skin: "#e0b88a", skinDark: "#c49a6c",
    hair: "#1a1a1a", mouth: "#f0b8a8", shirt: ["#3d6fbf", "#274a88"], collar: true, mul: 0.9, say: "عايز:" },
  { id: "grandpa", style: "bald", glasses: true, mustache: "#eeeeee", wrinkles: true, skin: "#e6c39a",
    skinDark: "#c9a37a", hair: "#eeeeee", brow: "#9a9a9a", shirt: ["#c9b48a", "#a08a5c"], collar: true,
    mul: 1.4, say: "يا ابني عايز:" },
  { id: "grandma", style: "hijab", wrinkles: true, skin: "#ecd0ae", skinDark: "#d2b08a", hair: "#dddddd",
    brow: "#9a9a9a", scarf: ["#d9cfe8", "#b3a5cf"], shirt: ["#8a5fb0", "#613b86"], mul: 1.4,
    say: "عايزة يا حبيبي:" }
];

function drawCustomerRaw(c) {
  const look = c.look;
  const ratio = c.patience / c.maxPatience;
  const hijab = look.style === "hijab";
  const faceRx = hijab ? 56 : 62;
  const faceRy = hijab ? 62 : 70;
  const faceCy = hijab ? 304 : 298;

  // خلفية الراس (شعر طويل أو طرحة)
  if (look.style === "long") {
    fillRound(566, 236, 148, 190, 56, look.hair);
  }
  if (hijab) {
    drawEllipse(640, 300, 82, 94, look.scarf[1]);
  }

  // رقبة وجسم
  fillRound(618, 340, 44, 50, 12, look.skinDark);
  withShadow(20, 8, "rgba(0,0,0,0.4)", function () {
    fillRound(540, 372, 200, 170, 54, vGradient(372, 542, look.shirt[0], look.shirt[1]));
  });
  strokeRound(540, 372, 200, 170, 54, "rgba(58,33,18,0.6)", 3);
  if (look.collar) {
    ctx.fillStyle = "#fff3df";
    ctx.beginPath();
    ctx.moveTo(606, 372);
    ctx.lineTo(640, 414);
    ctx.lineTo(674, 372);
    ctx.closePath();
    ctx.fill();
  }
  if (hijab) {
    drawEllipse(640, 404, 86, 50, look.scarf[0]);
    ctx.strokeStyle = look.scarf[1];
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(600, 392); ctx.lineTo(590, 436);
    ctx.moveTo(680, 392); ctx.lineTo(690, 436);
    ctx.stroke();
  }

  // الوش
  if (!hijab) {
    drawEllipse(578, 304, 11, 18, look.skinDark);
    drawEllipse(702, 304, 11, 18, look.skinDark);
  }
  const skin = ctx.createRadialGradient(625, 280, 10, 640, faceCy, 80);
  skin.addColorStop(0, look.skin);
  skin.addColorStop(1, look.skinDark);
  drawEllipse(640, faceCy, faceRx, faceRy, skin);
  ctx.strokeStyle = "rgba(58,33,18,0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(640, faceCy, faceRx, faceRy, 0, 0, Math.PI * 2);
  ctx.stroke();

  // الشعر أو الطرحة قدام
  if (look.style === "short" || look.style === "long") {
    ctx.fillStyle = look.hair;
    ctx.beginPath();
    ctx.ellipse(640, 262, 66, 46, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  } else if (look.style === "bald") {
    drawEllipse(580, 290, 10, 24, look.hair);
    drawEllipse(700, 290, 10, 24, look.hair);
    drawEllipse(622, 246, 18, 7, "rgba(255,255,255,0.3)");
  } else {
    ctx.fillStyle = look.scarf[0];
    ctx.beginPath();
    ctx.ellipse(640, 264, 64, 36, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    drawEllipse(640, 366, 48, 14, look.scarf[0]);
  }

  // دقن
  if (look.beard) {
    ctx.fillStyle = look.hair;
    ctx.beginPath();
    ctx.ellipse(640, 330, 60, 46, 0, 0, Math.PI);
    ctx.fill();
  }

  // تجاعيد
  if (look.wrinkles) {
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (!hijab) {
      ctx.moveTo(612, 260); ctx.lineTo(668, 260);
      ctx.moveTo(618, 269); ctx.lineTo(662, 269);
    }
    ctx.moveTo(594, 298); ctx.lineTo(586, 294);
    ctx.moveTo(594, 303); ctx.lineTo(586, 306);
    ctx.moveTo(686, 298); ctx.lineTo(694, 294);
    ctx.moveTo(686, 303); ctx.lineTo(694, 306);
    ctx.stroke();
  }

  // العيون
  const blink = game.time % 4 < 0.12 ? 0.15 : 1;
  drawEllipse(615, 300, 10, 8 * blink, "#ffffff");
  drawEllipse(665, 300, 10, 8 * blink, "#ffffff");
  drawEllipse(615, 301, 4.5, 4.5 * blink, "#2b1a12");
  drawEllipse(665, 301, 4.5, 4.5 * blink, "#2b1a12");
  if (look.glasses) {
    ctx.strokeStyle = "#2b1d14";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(615, 300, 15, 0, Math.PI * 2);
    ctx.moveTo(694, 300);
    ctx.arc(665, 300, 15, 0, Math.PI * 2);
    ctx.moveTo(630, 300); ctx.lineTo(650, 300);
    ctx.stroke();
  }

  // مناخير
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(640, 306); ctx.lineTo(635, 320); ctx.lineTo(645, 320);
  ctx.stroke();

  // الحواجب حسب مزاج الزبون
  ctx.strokeStyle = look.brow || look.hair;
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (ratio > 0.25) {
    ctx.moveTo(601, 281); ctx.lineTo(629, 281);
    ctx.moveTo(651, 281); ctx.lineTo(679, 281);
  } else {
    ctx.moveTo(601, 274); ctx.lineTo(629, 286);
    ctx.moveTo(679, 274); ctx.lineTo(651, 286);
  }
  ctx.stroke();

  if (look.mustache) {
    fillRound(614, 311, 52, 10, 5, look.mustache);
  }

  // الفم حسب المزاج
  ctx.strokeStyle = look.mouth || "#7a2f22";
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (ratio > 0.5) {
    ctx.arc(640, 322, 16, 0.15 * Math.PI, 0.85 * Math.PI);
  } else if (ratio > 0.25) {
    ctx.moveTo(626, 334); ctx.lineTo(654, 334);
  } else {
    ctx.arc(640, 346, 16, 1.15 * Math.PI, 1.85 * Math.PI);
  }
  ctx.stroke();

  // فقاعة الكلام (بتعرض الطلب كله)
  withShadow(14, 4, "rgba(0,0,0,0.35)", function () {
    fillRound(470, 118, 340, 64, 18, "#fff3df");
  });
  ctx.fillStyle = "#fff3df";
  ctx.beginPath();
  ctx.moveTo(622, 180);
  ctx.lineTo(658, 180);
  ctx.lineTo(640, 200);
  ctx.closePath();
  ctx.fill();
  if (c.state === "ordering") {
    drawText(look.say, 640, 135, 13, "#6b4a32");
    const lines = c.order.lines;
    if (c.order.text.length > 30) {
      const half = Math.ceil(lines.length / 2);
      drawText(lines.slice(0, half).join(" + "), 640, 154, 15, "#2b1d14");
      drawText(lines.slice(half).join(" + "), 640, 174, 15, "#2b1d14");
    } else {
      drawText(c.order.text, 640, 164, 18, "#2b1d14");
    }
  } else {
    drawText("مستني طلبي...", 640, 160, 22, "#2b1d14");
  }

  // شريط الصبر
  fillRound(540, 206, 200, 12, 6, "#2b1d14");
  let barColor = "#5aa335";
  if (ratio <= 0.25) {
    barColor = "#d62f2a";
  } else if (ratio <= 0.5) {
    barColor = "#f2b134";
  }
  fillRound(540, 206, Math.max(12, 200 * ratio), 12, 6, barColor);
}

// ---------- بطاطس ومشروبات وصينية ----------

function drawFries(cx, baseY, scale, doneness) {
  let col = "#e8b53a";
  if (doneness === "raw") {
    col = "#f3e3a0";
  } else if (doneness === "burnt") {
    col = "#6b4a1a";
  }
  for (let k = 0; k < 7; k++) {
    const x = cx - 24 * scale + k * 8 * scale;
    const extra = ((k * 5) % 12) * scale;
    fillRound(x, baseY - 34 * scale - extra - 10 * scale, 6 * scale, (28 * scale) + extra, 2, col);
  }
  ctx.beginPath();
  ctx.moveTo(cx - 28 * scale, baseY - 34 * scale);
  ctx.lineTo(cx + 28 * scale, baseY - 34 * scale);
  ctx.lineTo(cx + 22 * scale, baseY);
  ctx.lineTo(cx - 22 * scale, baseY);
  ctx.closePath();
  ctx.fillStyle = "#d62f2a";
  ctx.fill();
  fillRound(cx - 22 * scale, baseY - 22 * scale, 44 * scale, 10 * scale, 2, "#fff3df");
}

function drawCup(cx, baseY, scale, drink, fill) {
  const s = scale;
  const f = fill === undefined ? 1 : fill;
  const liquid = drink === "cola" ? "#4a2615" : "#f08a1c";
  if (f >= 1) {
    ctx.strokeStyle = "#fff3df";
    ctx.lineWidth = 3 * s;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(cx + 6 * s, baseY - 66 * s);
    ctx.lineTo(cx + 12 * s, baseY - 92 * s);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx - 22 * s, baseY - 62 * s);
  ctx.lineTo(cx + 22 * s, baseY - 62 * s);
  ctx.lineTo(cx + 16 * s, baseY);
  ctx.lineTo(cx - 16 * s, baseY);
  ctx.closePath();
  ctx.fillStyle = "#fff3df";
  ctx.fill();
  if (drink && f > 0) {
    const h = 46 * s * f;
    const hw = 16 * s + 6 * s * (h / (62 * s));
    ctx.beginPath();
    ctx.moveTo(cx - hw, baseY - h);
    ctx.lineTo(cx + hw, baseY - h);
    ctx.lineTo(cx + 16 * s, baseY);
    ctx.lineTo(cx - 16 * s, baseY);
    ctx.closePath();
    ctx.fillStyle = liquid;
    ctx.fill();
  }
  if (f >= 1) {
    fillRound(cx - 25 * s, baseY - 70 * s, 50 * s, 9 * s, 4 * s, "#d62f2a");
  }
}

// بيرسم كل حاجة على الصينية: البرجر في النص والبطاطس شمال والمشروب يمين
function drawTrayItems(tray, cx, baseY, scale) {
  let burgers = 0;
  for (let i = 0; i < tray.length; i++) {
    if (tray[i].kind === "burger") {
      burgers = burgers + 1;
    }
  }
  let b = 0;
  let f = 0;
  let d = 0;
  for (let i = 0; i < tray.length; i++) {
    const t = tray[i];
    if (t.kind === "burger") {
      drawBurger(cx + (b - (burgers - 1) / 2) * 90 * scale, baseY, t.layers, scale);
      b = b + 1;
    } else if (t.kind === "fries") {
      drawFries(cx - 125 * scale - f * 34 * scale, baseY, scale * 1.3, t.doneness);
      f = f + 1;
    } else {
      drawCup(cx + 125 * scale + d * 34 * scale, baseY, scale * 1.3, t.drink);
      d = d + 1;
    }
  }
}

// ---------- نجمة ومقفول وزبون بياكل ----------

function drawStar(cx, cy, r, color) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const x = cx + Math.cos(ang) * rad;
    const y = cy + Math.sin(ang) * rad;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// 5 نجوم، المملية بالدهبي والباقي رمادي
function drawStars(cx, cy, r, filled) {
  for (let i = 0; i < 5; i++) {
    drawStar(cx + (i - 2) * r * 2.3, cy, r, i < filled ? "#f2b134" : "#5a6a74");
  }
}

function drawLockOverlay(x, y, w, h, r, label) {
  fillRound(x, y, w, h, r, "rgba(20,14,10,0.8)");
  const cx = x + w / 2;
  const cy = y + h / 2 - 8;
  ctx.strokeStyle = "#f2b134";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy - 6, 8, Math.PI, Math.PI * 2);
  ctx.stroke();
  fillRound(cx - 12, cy - 6, 24, 18, 4, "#f2b134");
  drawText(label, cx, cy + 34, 15, "#fff3df");
}

// زبون صغير قاعد على ترابيزة وبياكل
function drawMiniDiner(x, tableY, look, t) {
  const bob = Math.sin(t * 6) * 2;
  const hijab = look.style === "hijab";
  fillRound(x - 22, tableY - 38 + bob, 44, 40, 14, look.shirt[0]);
  const hy = tableY - 54 + bob;
  if (hijab) {
    drawEllipse(x, hy, 20, 23, look.scarf[1]);
  }
  drawEllipse(x, hy + 1, hijab ? 14 : 16, hijab ? 16 : 18, look.skin);
  ctx.fillStyle = hijab ? look.scarf[0] : look.hair;
  if (look.style !== "bald") {
    ctx.beginPath();
    ctx.ellipse(x, hy - 4, hijab ? 16 : 18, hijab ? 11 : 12, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  }
  drawEllipse(x - 6, hy + 2, 2, 2, "#2b1a12");
  drawEllipse(x + 6, hy + 2, 2, 2, "#2b1a12");
}

// ---------- لمسات الجرافيكس ----------

function strokeRound(x, y, w, h, r, color, lw) {
  roundRectPath(x, y, w, h, r);
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.stroke();
}

// الزبون بيدخل من الشمال وبيتنفس وهو واقف
function drawCustomer(c) {
  const e = c.enter === undefined ? 1 : c.enter;
  const ease = 1 - Math.pow(1 - e, 3);
  ctx.save();
  ctx.translate(-(1 - ease) * 320, Math.sin(game.time * 2) * 1.5 + Math.abs(Math.sin(game.time * 12)) * (1 - ease) * 8);
  drawCustomerRaw(c);
  ctx.restore();
}

// ضلال خفيفة على أطراف الشاشة
function drawVignette() {
  const g = ctx.createRadialGradient(640, 380, 380, 640, 380, 820);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(10,5,2,0.45)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 64, 1280, 656);
}

// بخار طالع من الأكل
function drawSteam(x, y, strength) {
  for (let k = 0; k < 4; k++) {
    const phase = (game.time * 0.8 + k * 0.25) % 1;
    const px = x + Math.sin(phase * 6 + k * 2) * 8;
    const py = y - phase * 60;
    const r = 6 + phase * 12;
    drawEllipse(px, py, r, r, "rgba(255,255,255," + ((1 - phase) * 0.35 * strength).toFixed(3) + ")");
  }
}
