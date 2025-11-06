/* 🎯 教育科技學系互動作品 — 宇宙公轉 + 完整特效版
 * 🪐 背景：tomxor 行星+環
 * 🌌 封面：標題/姓名繞中心公轉（前亮後暗、星塵）
 * 🧭 目錄：滑鼠靠左自動滑出（作品一/作品二/作品三）
 * 🧠 測驗：CSV 題庫（10 題），亂數出題、成績、回饋、特效
 */

let appState = 'home';

// === 側邊選單 ===
const MENU_W = 100, HANDLE_W = 14;
let hoverZone = 40;
const DETAIL_CARD_W = 260, DETAIL_CARD_H = 320;
let menuX = -MENU_W + HANDLE_W, menuTarget = -MENU_W + HANDLE_W;
let MENU_BG, MENU_BG_HOVER, MENU_TEXT, MENU_ACCENT;
let sideMenuBoxes = [];
let sideMenuItems = [
  { id: 'balloon', label: "氣球爆破遊戲", type: "link", url: "balloon.html"},
  {
    id: 'notes',
    label: "上課筆記",
    type: "submenu",
    detailKey: 'notes',
    submenu: [
      {
        id: 'notesUnit1',
        label: "第一單元上課筆記",
        type: "link",
        url: "https://hackmd.io/@DVFtTMYjTmumEkY6i9d0lw/SkBeKOyhll"
      },
      {
        id: 'notesBalloonGame',
        label: "氣球爆破遊戲筆記",
        type: "link",
        url: "https://hackmd.io/@DVFtTMYjTmumEkY6i9d0lw/H1LDpAU1Zl"
      },
      {
        id: 'notesMidterm',
        label: "期中作業筆記",
        type: "link",
        url: "https://hackmd.io/@DVFtTMYjTmumEkY6i9d0lw/SkXGjMckbl"
      }
    ]
  },
  { id: 'quiz', label: "測驗系統", type: "quiz"},
  { id: 'profile', label: "自我介紹", type: "profile" },
  { 
    id: 'tku',
    label: "淡江大學", 
    type: "submenu",
    url: "https://www.tku.edu.tw/",
    submenu: [
      { id: 'et', label: "教育科技學系", type: "link", url: "https://www.et.tku.edu.tw/" }
    ]
  }
];
const SUBMENU_SHIFT_KEYS = new Set(['notes', 'notesUnit1', 'notesBalloonGame', 'notesMidterm', 'tku', 'et']);
const MENU_DETAIL_CONTENT = {
  balloon: {
    title: '氣球爆破遊戲',
    subtitle: '互動小遊戲',
    description: '在節奏感十足的宇宙背景下，瞄準並爆破氣球，挑戰你的反應力與準確度。',
    accent: '#f472b6',
    gradient: ['#ff6cab', '#7366ff'],
    badge: 'Playful Cosmos',
    emoji: '🎈',
    action: { kind: 'link', label: '立即前往', url: 'https://huangshiting60-gif.github.io/20251105/' }
  },
  notes: {
    title: '上課筆記',
    subtitle: '知識整理',
    description: '統整課堂亮點與學習心得，並依主題分門別類，讓複習更有效率。',
    accent: '#38bdf8',
    gradient: ['#38bdf8', '#818cf8'],
    badge: 'Creative Notes',
    emoji: '📝',
  },
  notesUnit1: {
    title: '第一單元上課筆記',
    subtitle: '核心概念整理',
    description: '回顧第一單元重點，包含基礎理論與操作流程，幫助快速掌握課堂內容。',
    accent: '#38bdf8',
    gradient: ['#38bdf8', '#60a5fa'],
    badge: 'Unit 1',
    emoji: '📘',
    action: { kind: 'link', label: '開啟筆記', url: 'https://hackmd.io/@DVFtTMYjTmumEkY6i9d0lw/SkBeKOyhll' }
  },
  notesBalloonGame: {
    title: '氣球爆破遊戲筆記',
    subtitle: '互動遊戲心得',
    description: '記錄遊戲規劃、程式結構與特效設計的重點筆記，整理製作心得與反思。',
    accent: '#f472b6',
    gradient: ['#f472b6', '#818cf8'],
    badge: 'Game Dev',
    emoji: '🎯',
    action: { kind: 'link', label: '開啟筆記', url: 'https://hackmd.io/@DVFtTMYjTmumEkY6i9d0lw/H1LDpAU1Zl' }
  },
  notesMidterm: {
    title: '期中作業筆記',
    subtitle: '專案設計紀錄',
    description: '整理期中作業的發想、設計流程與程式重點，方便後續檢視與延伸。',
    accent: '#fbbf24',
    gradient: ['#fbbf24', '#f97316'],
    badge: 'Midterm Notes',
    emoji: '🗂️',
    action: { kind: 'link', label: '開啟筆記', url: 'https://hackmd.io/@DVFtTMYjTmumEkY6i9d0lw/SkXGjMckbl' }
  },
  quiz: {
    title: '測驗系統',
    subtitle: '隨機出題，挑戰滿分',
    description: '十題快問快答，附即時回饋與繽紛特效，幫助你掌握 p5.js 要點。',
    accent: '#a855f7',
    gradient: ['#a855f7', '#6366f1'],
    badge: 'Ready to Quiz',
    emoji: '🧠',
    action: { kind: 'quiz', label: '開始測驗' }
  },
  profile: {
    title: '黃詩婷',
    subtitle: '學號｜414730175',
    description: '我是黃詩婷，一個重視細節、也樂於學習的新世代學生。\n我個性穩重但不失好奇，喜歡主動嘗試新事物，從挑戰中累積經驗。\n平時熱愛拍照與創作，透過鏡頭觀察生活的細節，也學會以不同角度理解世界。\n我相信學習不只是一段求知歷程，更是探索自我與成長的過程。\n期望未來能持續發揮創意與行動力，找到屬於自己的方向，並在過程中成為更有影響力的人。',
    accent: '#0ea5e9',
    badge: 'Tamkang University',
    emoji: '⭐',
    imageType: 'photo'
  },
  tku: {
    title: '淡江大學',
    subtitle: 'Tamkang University',
    description: '迎向世界的跨域養成，透過創新與實作培育全方位人才。',
    accent: '#f97316',
    gradient: ['#fb7185', '#f97316'],
    badge: 'TKU Spirit',
    emoji: '🏫',
    action: { kind: 'link', label: '造訪官網', url: 'https://www.tku.edu.tw/' }
  },
  et: {
    title: '教育科技學系',
    subtitle: 'Department of Educational Technology',
    description: '結合學習理論與科技應用，打造富有互動與創意的教學方案。',
    accent: '#22d3ee',
    gradient: ['#22d3ee', '#38bdf8'],
    badge: 'Innovate Education',
    emoji: '📚',
    action: { kind: 'link', label: '瞭解更多', url: 'https://www.et.tku.edu.tw/' }
  }
};

function getMenuDetail(key) {
  if (!key) return null;
  const base = MENU_DETAIL_CONTENT[key];
  if (!base) return null;
  const detail = Object.assign({ key, kind: key === 'profile' ? 'profile' : 'feature' }, base);
  if (detail.imageType === 'photo') detail.image = profileImg;
  return detail;
}

// === 背景（tomxor） ===
let tCounter = 100;

// === 封面：公轉參數 ===
let orbitAngle = 0;
const ORBIT_SPEED = 0.018;   // >0 順時針；<0 逆時針
const ORBIT_R_BASE = 0.22;
const ORBIT_R_SWAY = 0.06;
const ORBIT_GLOW = 0.18;

// === 測驗 ===
const NUM_QUESTIONS = 10;
let allRows = [], quiz = [], qIdx = 0, score = 0;
let buttons = [];
let particles = [];
let toastTimer = 0, toastText = '', toastGood = true;
let shakeT = 0;
let pendingAdvance = false; // 防連點+保證特效顯示完
let profileImg = null;
let detailCardBounds = { x: 0, y: 0, w: DETAIL_CARD_W, h: DETAIL_CARD_H };
let detailHoverAmt = 0;
let detailHoverTarget = 0;
let hoverDetail = null;
let expandedDetail = null;
let overlayBounds = null;
let coverSparkles = [];
let coverLastBurst = 0;
let quizStars = [];
let quizPlanets = [];
let quizComets = [];

// 內建備援題庫（讀不到外部 CSV 時使用）
const FALLBACK_CSV = `question,optionA,optionB,optionC,optionD,answer,feedback
p5.js 的 setup 什麼時候執行？,每一幀都執行,只在開始執行一次,按滑鼠時,視窗縮放時,B,setup 只在開始呼叫一次
哪個函數會不斷重複執行?,"draw()","setup()","mousePressed()","keyTyped()",A,draw 是動畫主循環
用於載入外部檔案的函數?,"loadImage()","loadTable()","background()","fill()",B,loadTable 用於讀CSV
設定畫布大小的函數是?,"setSize()","canvas()","createCanvas()","window()",C,createCanvas 設定畫布大小
改變填色顏色的函數是?,"fill()","stroke()","rect()","color()",A,fill 控制填色
"畫布原點(0,0)在哪裡?","左上角","右下角","中心","左下角",A,左上角是原點
每幀重繪畫面要用哪個函數?,"background()","clearRect()","erase()","save()",A,background 清除舊圖
fetch() 讀檔後要怎麼取文字?,"res.json()","res.text()","res.body","res.file()",B,用 text() 取文字
JavaScript 嚴格等於運算子是哪個?,"==","=","===","!==",C,=== 比較值與型別
p5.js 畫線的函數是?,"line()","rect()","stroke()","shape()",A,line 畫線
`;

// === 載入題庫（先試讀 data/questions.csv，失敗用備援） ===
async function preload() {
  try {
    profileImg = await new Promise((resolve, reject) => {
      loadImage('assets/profile.jpg', resolve, reject);
    });
  } catch {
    profileImg = null;
  }
  try {
    const res = await fetch('data/questions.csv', { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const txt = await res.text();
    allRows = parseCSV(txt);
    if (!allRows.length) throw new Error();
  } catch {
    allRows = parseCSV(FALLBACK_CSV);
  }
}
function parseCSV(txt) {
  const table = splitCSV(txt.trim());
  if (!table.length) return [];
  const head = table[0].map(s => s.trim());
  const qi = head.findIndex(h => /question/i.test(h));
  const ai = head.findIndex(h => /optionA/i.test(h));
  const bi = head.findIndex(h => /optionB/i.test(h));
  const ci = head.findIndex(h => /optionC/i.test(h));
  const di = head.findIndex(h => /optionD/i.test(h));
  const an = head.findIndex(h => /(answer|correctAnswer)/i.test(h));
  const fb = head.findIndex(h => /feedback/i.test(h));
  if (qi < 0 || ai < 0 || bi < 0 || ci < 0 || an < 0) return [];

  const cleanOption = txt => (txt || '').replace(/[(),（），]/g, '').trim();
  const arr = [];
  for (let i = 1; i < table.length; i++) {
    const cols = table[i];
    if (!cols || !cols.length) continue;
    const question = (cols[qi] || '').trim();
    const optionA = (cols[ai] || '').trim();
    const optionB = (cols[bi] || '').trim();
    const optionC = (cols[ci] || '').trim();
    const optionD = (di >= 0 && di < cols.length) ? (cols[di] || '').trim() : '';
    const answer = (cols[an] || '').trim().toUpperCase();
    if (!question || !optionA || !optionB || !optionC || !'ABCD'.includes(answer)) continue;

    const options = [optionA, optionB, optionC, optionD].map(cleanOption);
    arr.push({
      question,
      options,
      answer,
      feedback: fb >= 0 ? (cols[fb] || '') : ''
    });
  }
  return arr;
}

function splitCSV(str) {
  const lines = [];
  let cur = [];
  let cell = '';
  let inQ = false;
  let i = 0;
  while (i < str.length) {
    const ch = str[i];
    if (inQ) {
      if (ch === '"') {
        if (str[i + 1] === '"') { cell += '"'; i += 2; continue; }
        inQ = false;
        i++;
        continue;
      } else {
        cell += ch;
        i++;
        continue;
      }
    } else {
      if (ch === '"') { inQ = true; i++; continue; }
      if (ch === ',') { cur.push(cell); cell = ''; i++; continue; }
      if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && str[i + 1] === '\n') i++;
        cur.push(cell);
        lines.push(cur);
        cur = [];
        cell = '';
        i++;
        continue;
      }
      cell += ch;
      i++;
      continue;
    }
  }
  if (cell.length || cur.length) {
    cur.push(cell);
    lines.push(cur);
  }
  return lines;
}

function initQuizDecor() {
  quizStars = Array.from({ length: 120 }, () => ({
    x: random(width),
    y: random(height),
    baseY: 0,
    size: random(1.6, 3.6),
    twinkleOffset: random(TWO_PI),
    driftSpeed: random(0.45, 1.2),
    swayDistance: random(6, 24),
    swaySpeed: random(0.004, 0.012)
  }));

  quizPlanets = [
    { xRatio: 0.16, yRatio: 0.28, radius: 46, colors: ['#f9a8d4', '#6366f1'], ring: false, floatAmp: 10, floatSpeed: 0.008, phase: random(TWO_PI) },
    { xRatio: 0.82, yRatio: 0.2, radius: 34, colors: ['#bae6fd', '#2563eb'], ring: false, floatAmp: 8, floatSpeed: 0.01, phase: random(TWO_PI) },
    { xRatio: 0.52, yRatio: 0.82, radius: 60, colors: ['#22d3ee', '#0f172a'], ring: true, floatAmp: 14, floatSpeed: 0.006, phase: random(TWO_PI) }
  ];

  quizComets = Array.from({ length: 3 }, () => createQuizComet());
}

function createQuizComet() {
  const fromLeft = random() < 0.5;
  const startX = fromLeft ? -random(60, 180) : width + random(60, 180);
  const startY = random(height * 0.18, height * 0.78);
  const speed = random(2.6, 3.6) * (fromLeft ? 1 : -1);
  return {
    x: startX,
    y: startY,
    vx: speed,
    vy: random(-0.25, 0.25),
    hue: random(188, 215),
    trail: [],
    length: floor(random(12, 22))
  };
}

function setup() {
  createCanvas(windowWidth, windowHeight).parent("game-container");
  textFont('ZCOOL KuaiLe');

  // 選單配色
  MENU_BG = color(17, 24, 39, 180);
  MENU_BG_HOVER = color(30, 41, 59, 210);
  MENU_TEXT = color(238);
  MENU_ACCENT = color(14, 165, 233);

  initQuizDecor();
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initQuizDecor();
}

function draw() {
  if (appState === 'home') {
    drawTomxorBackground();
    drawOrbitingTitle();
    updateCoverSparkles();
    drawSideMenu();
    return;
  }

  if (appState === 'quiz_loading') {
    drawQuizBackdrop();
    const layout = getQuizLayout();
    drawQuizPanel(layout, '#60a5fa');
    drawQuizBackButton(layout);
    fill(236); textAlign(CENTER, CENTER); textSize(22);
    text('載入題庫中...', layout.cx, layout.y + layout.h / 2 + 14);
    if (allRows.length) { buildQuiz(allRows); appState = 'quiz'; }
    drawSideMenu();
    return;
  }

  if (appState === 'quiz') {
    drawQuizBackdrop();

    // 震動特效（錯題）
    if (shakeT > 0) { push(); translate(random(-4,4), random(-4,4)); shakeT--; drawQuiz(); pop(); }
    else { drawQuiz(); }

    // 一定要在題目後畫這兩個，特效才會出現
    updateParticles();
    drawToastTop();

    drawSideMenu();
    return;
  }

  if (appState === 'result') {
    drawQuizBackdrop();
    drawResult();

    // 結果頁也保留最後一波特效
    updateParticles();
    drawToastTop();

    drawSideMenu();
    return;
  }
}

// === 背景（tomxor） ===
function drawTomxorBackground() {
  background(0);
  stroke(255);
  tCounter += 0.01;
  for (let i = 2000; i > 0; i -= 2) drawTomxorPoint(i, 0); // 偶數：行星
  for (let i = 1999; i > 0; i -= 2) drawTomxorPoint(i, 1); // 奇數：環

  // 霧化星雲光暈
  push();
  noStroke();
  const halo = drawingContext.createRadialGradient(width/2, height*0.5, 0, width/2, height*0.58, max(width, height) * 0.6);
  halo.addColorStop(0, 'rgba(56,189,248,0.16)');
  halo.addColorStop(0.55, 'rgba(99,102,241,0.09)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  drawingContext.fillStyle = halo;
  rect(0, 0, width, height);

  const aurora = drawingContext.createLinearGradient(width*0.2, height*0.15, width*0.8, height*0.75);
  aurora.addColorStop(0, 'rgba(14,165,233,0.05)');
  aurora.addColorStop(0.6, 'rgba(236,72,153,0.035)');
  aurora.addColorStop(1, 'rgba(37,99,235,0.04)');
  drawingContext.fillStyle = aurora;
  rect(0, 0, width, height);
  pop();
}

function drawQuizBackdrop() {
  if (!quizStars.length) initQuizDecor();

  background(6, 10, 28);

  push();
  noStroke();
  const nebula = drawingContext.createLinearGradient(0, 0, width, height * 0.9);
  nebula.addColorStop(0, 'rgba(56,189,248,0.22)');
  nebula.addColorStop(0.45, 'rgba(59,130,246,0.18)');
  nebula.addColorStop(1, 'rgba(15,23,42,0.9)');
  drawingContext.fillStyle = nebula;
  rect(0, 0, width, height);

  const glow = drawingContext.createRadialGradient(width * 0.6, height * 0.35, width * 0.05, width * 0.6, height * 0.35, width * 0.6);
  glow.addColorStop(0, 'rgba(14,165,233,0.25)');
  glow.addColorStop(0.7, 'rgba(99,102,241,0.12)');
  glow.addColorStop(1, 'rgba(15,23,42,0)');
  drawingContext.fillStyle = glow;
  rect(0, 0, width, height);
  pop();

  push();
  stroke(45, 76, 148, 30);
  strokeWeight(1);
  const grid = max(width, height) / 8;
  for (let x = -grid; x <= width + grid; x += grid) {
    const offset = sin(frameCount * 0.002 + x * 0.01) * 18;
    line(x + offset, 0, x - offset, height);
  }
  for (let y = -grid; y <= height + grid; y += grid) {
    const offset = cos(frameCount * 0.002 + y * 0.01) * 18;
    line(0, y + offset, width, y - offset);
  }
  pop();

  noStroke();
  for (const star of quizStars) {
    star.y += star.driftSpeed * 0.6;
    if (star.y - star.size > height) {
      star.y = -star.size;
      star.x = random(width);
    }

    const sway = sin(frameCount * star.swaySpeed + star.twinkleOffset) * star.swayDistance;
    const twinkle = 0.55 + 0.45 * sin(frameCount * 0.05 + star.twinkleOffset);
    const alpha = map(twinkle, 0.1, 1, 70, 210);

    fill(200 + twinkle * 35, 235, 255, alpha);
    circle(star.x + sway * 0.2, star.y, star.size * (0.8 + twinkle * 0.7));
  }

  if (!quizComets.length) quizComets = Array.from({ length: 3 }, () => createQuizComet());

  push();
  blendMode(ADD);
  for (let i = 0; i < quizComets.length; i++) {
    const comet = quizComets[i];
    comet.x += comet.vx;
    comet.y += comet.vy;
    comet.trail.unshift({ x: comet.x, y: comet.y });
    if (comet.trail.length > comet.length) comet.trail.pop();

    const outOfBounds = comet.vx > 0 ? comet.x - 180 > width : comet.x + 180 < 0;
    if (outOfBounds) {
      quizComets[i] = createQuizComet();
      continue;
    }

    for (let t = 0; t < comet.trail.length - 1; t++) {
      const curr = comet.trail[t];
      const next = comet.trail[t + 1];
      const alpha = map(t, 0, comet.trail.length - 1, 220, 0);
      stroke(120, 190, 255, alpha);
      strokeWeight(map(t, 0, comet.trail.length - 1, 3.2, 0.6));
      line(curr.x, curr.y, next.x, next.y);
    }

    noStroke();
    fill(215, 242, 255, 230);
    circle(comet.x, comet.y, 6.5);
    fill(110, 195, 255, 140);
    circle(comet.x, comet.y, 12);
  }
  pop();

  for (const planet of quizPlanets) {
    const px = planet.xRatio * width;
    const py = planet.yRatio * height + sin(frameCount * planet.floatSpeed + planet.phase) * planet.floatAmp;
    const r = planet.radius;
    const grad = drawingContext.createRadialGradient(px - r * 0.35, py - r * 0.45, r * 0.2, px, py, r);
    grad.addColorStop(0, planet.colors[0]);
    grad.addColorStop(1, planet.colors[1]);
    drawingContext.save();
    drawingContext.fillStyle = grad;
    drawingContext.beginPath();
    drawingContext.ellipse(px, py, r, r, 0, 0, Math.PI * 2);
    drawingContext.fill();
    drawingContext.restore();

    if (planet.ring) {
      push();
      translate(px, py);
      rotate(-PI / 6 + frameCount * 0.0025);
      noFill();
      stroke(148, 163, 255, 120);
      strokeWeight(2.4);
      ellipse(0, 0, r * 2.8, r * 1.5);
      stroke(56, 189, 248, 80);
      strokeWeight(1.2);
      ellipse(0, 0, r * 2.2, r * 1.1);
      const satAngle = frameCount * 0.02;
      const sx = cos(satAngle) * r * 1.6;
      const sy = sin(satAngle) * r * 0.9;
      noStroke();
      fill(148, 197, 255, 200);
      ellipse(sx, sy, 8, 8);
      pop();
    }
  }

  // 光束掃過中央，讓畫面更動態
  push();
  const sweepX = (sin(frameCount * 0.01) * 0.5 + 0.5) * width;
  const beam = drawingContext.createLinearGradient(sweepX - width * 0.2, 0, sweepX + width * 0.2, height);
  beam.addColorStop(0, 'rgba(148,163,255,0)');
  beam.addColorStop(0.5, 'rgba(148,163,255,0.08)');
  beam.addColorStop(1, 'rgba(148,163,255,0)');
  drawingContext.fillStyle = beam;
  rect(0, 0, width, height);
  pop();
}

function getQuizLayout() {
  const margin = max(width * 0.04, 24);
  const availableW = width - margin * 2;
  const availableH = height - margin * 2;
  const w = min(availableW, 860);
  let h = constrain(height * 0.7, 520, 620);
  if (h > availableH) h = availableH;
  if (h < 420) h = availableH;
  if (h <= 0) h = height * 0.75;
  const x = (width - w) / 2;
  const y = (height - h) / 2;
  return { x, y, w, h, cx: x + w / 2, bottom: y + h };
}

function drawQuizPanel(layout, accentColor) {
  const ctx = drawingContext;
  const accent = accentColor || '#60a5fa';
  const accentCol = color(accent);
  const accentR = red(accentCol);
  const accentG = green(accentCol);
  const accentB = blue(accentCol);

  ctx.save();
  roundedRectPath(ctx, layout.x, layout.y, layout.w, layout.h, 26);
  const base = ctx.createLinearGradient(layout.x, layout.y, layout.x + layout.w, layout.y + layout.h);
  base.addColorStop(0, 'rgba(16,24,45,0.95)');
  base.addColorStop(0.55, 'rgba(19,30,58,0.84)');
  base.addColorStop(1, 'rgba(28,40,70,0.78)');
  ctx.shadowColor = 'rgba(37, 99, 235, 0.35)';
  ctx.shadowBlur = 36;
  ctx.fillStyle = base;
  ctx.fill();
  ctx.shadowBlur = 0;

  const accentGlow = ctx.createLinearGradient(layout.x, layout.y, layout.x + layout.w, layout.y);
  accentGlow.addColorStop(0, `rgba(${accentR},${accentG},${accentB},0.18)`);
  accentGlow.addColorStop(1, `rgba(${accentR},${accentG},${accentB},0.08)`);
  ctx.fillStyle = accentGlow;
  ctx.fill();

  ctx.strokeStyle = 'rgba(148,163,255,0.28)';
  ctx.lineWidth = 1.1;
  ctx.stroke();

  const highlight = ctx.createLinearGradient(layout.x, layout.y, layout.x, layout.y + layout.h);
  highlight.addColorStop(0, 'rgba(255,255,255,0.12)');
  highlight.addColorStop(0.35, 'rgba(255,255,255,0.02)');
  highlight.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = highlight;
  ctx.fill();
  ctx.restore();

  push();
  blendMode(ADD);
  noStroke();
  rectMode(CORNER);
  for (let i = 0; i < 3; i++) {
    const offset = sin(frameCount * 0.018 + i * 1.7) * 16;
    const stripeY = layout.y + layout.h * (0.25 + i * 0.27) + offset;
    fill(accentR, accentG, accentB, 22);
    rect(layout.x + 28, stripeY, layout.w - 56, 18, 9);
  }
  fill(accentR, accentG, accentB, 14);
  rect(layout.x + 40, layout.y + layout.h * 0.12, layout.w - 80, 12, 8);
  pop();

  push();
  noFill();
  stroke(accentR, accentG, accentB, 96);
  strokeWeight(1);
  rect(layout.x + 6, layout.y + 6, layout.w - 12, layout.h - 12, 18);
  stroke(accentR, accentG, accentB, 72);
  rect(layout.x + 10, layout.y + 10, layout.w - 20, layout.h - 20, 16);
  pop();

  push();
  noStroke();
  fill(accentR, accentG, accentB, 18);
  ellipse(layout.x + layout.w * 0.18, layout.y - 26, layout.w * 0.32, 70);
  fill(accentR, accentG, accentB, 12);
  ellipse(layout.x + layout.w * 0.82, layout.bottom + 28, layout.w * 0.34, 80);
  pop();
}

function drawQuizBackButton(layout) {
  const bw = min(layout.w * 0.38, 168);
  const bh = 44;
  const cx = layout.x + bw / 2 + 34;
  const cy = layout.y + bh / 2 + 32;
  drawBtn(cx, cy, bw, bh, '回首頁', () => {
    pendingAdvance = false;
    toastTimer = 0;
    shakeT = 0;
    appState = 'home';
  }, '#38bdf8');
  return cy + bh / 2;
}

function roundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function estimateLineCount(textValue, wrapWidth, fontSize) {
  if (!textValue) return 1;
  push();
  textSize(fontSize);
  let lines = 1;
  let lineWidth = 0;
  for (let i = 0; i < textValue.length; i++) {
    const ch = textValue[i];
    if (ch === '\\n') {
      lines++;
      lineWidth = 0;
      continue;
    }
    const w = textWidth(ch);
    if (lineWidth + w > wrapWidth && lineWidth > 0) {
      lines++;
      lineWidth = w;
    } else {
      lineWidth += w;
    }
  }
  pop();
  return lines;
}

function drawTomxorPoint(i, p) {
  const r = tCounter / cos(tCounter / i) + p * (tCounter / 2 + (i % tCounter));
  const a = tCounter / 9 + i * i;
  const x = width / 2 + r * sin(a) * cos((1 - p) * i / tCounter);
  const y = height / 2 + r * cos(a + p * 2);
  const s = 1 - cos(a);
  strokeWeight(s);
  point(x, y);
}

// === 封面：繞宇宙公轉（前亮後暗＋星塵） ===
function drawOrbitingTitle() {
  const cx = width / 2, cy = height / 2;
  const title = '教育科技学系';
  const subtitle = '414730175 黃詩婷';
  const titleSize = min(width, height) * 0.09;
  const subtitleSize = min(width, height) * 0.035;

  orbitAngle += ORBIT_SPEED;

  const base = min(width, height);
  const r0 = base * ORBIT_R_BASE, rAmp = base * ORBIT_R_SWAY;
  const a1 = orbitAngle, a2 = orbitAngle + 0.7;
  const r1 = r0 + rAmp * sin(a1 * 1.3);
  const r2 = r0 * 0.78 + rAmp * sin(a2 * 1.4);
  const z1 = sin(a1), z2 = sin(a2);
  const s1 = map(z1, -1, 1, 0.82, 1.18);
  const s2 = map(z2, -1, 1, 0.82, 1.12);
  const alpha1 = map(z1, -1, 1, 140, 255);
  const alpha2 = map(z2, -1, 1, 120, 230);
  const glow1 = map(z1, -1, 1, ORBIT_GLOW * 0.4, ORBIT_GLOW);
  const glow2 = map(z2, -1, 1, ORBIT_GLOW * 0.4, ORBIT_GLOW * 0.85);

  const x1 = cx + r1 * cos(a1);
  const y1 = cy + r1 * sin(a1);
  const x2 = cx + r2 * cos(a2);
  const y2 = cy + r2 * sin(a2);

  // 星塵（主標尾端）
  noFill();
  stroke(255, 100);
  for (let i = 0; i < 50; i++) {
    const da = -i * 0.03;
    const ar = a1 + da;
    point(cx + (r1 + random(-2,2)) * cos(ar), cy + (r1 + random(-2,2)) * sin(ar));
  }
  noStroke();

  // 依深度排序，避免互遮突兀
  const order = z1 >= z2 ? [2, 1] : [1, 2];
  for (const which of order) {
    if (which === 1) {
      push(); translate(x1, y1); scale(s1);
      textAlign(CENTER, CENTER);
      fill(255, alpha1);
      textSize(titleSize);
      text(title, 0, 0);
      noFill();
      stroke(255, alpha1 * glow1);
      strokeWeight(2);
      ellipse(0, 0, titleSize * 1.6, titleSize * 0.54);
      pop();
    } else {
      push(); translate(x2, y2); scale(s2);
      textAlign(CENTER, CENTER);
      fill(255, alpha2);
      textSize(subtitleSize);
      text(subtitle, 0, 0);
      noFill();
      stroke(255, alpha2 * glow2);
      strokeWeight(1.4);
      ellipse(0, 0, subtitleSize * 4.2, subtitleSize * 1.1);
      pop();
    }

    // Tamkang University with pulsating effect
    const tkBaseSize = subtitleSize * 1.2;
    const pulse = sin(frameCount * 0.05);
    const tkSize = tkBaseSize + pulse * 2;
    const tkAlpha = 180 + pulse * 40;

    const mixAmt = (sin(frameCount * 0.04) + 1) * 0.5;
    const tkMix = lerpColor(color(96, 165, 250), color(244, 114, 182), mixAmt);
    tkMix.setAlpha(tkAlpha);
    fill(tkMix);
    textSize(tkSize);
    text('Tamkang University', cx, height * 0.9);
  }

  // 互動提示
  const hintPulse = (sin(frameCount * 0.05) + 1) * 0.5;
  const hintAlpha = lerp(70, 160, hintPulse);
  const hintSize = min(width, height) * 0.024;
  const hintY = height * 0.82;
  const hintW = min(width * 0.68, 520);

  push();
  translate(cx - hintW / 2, hintY - hintSize * 1.4);
  const hintBgAlpha = lerp(40, 90, hintPulse);
  fill(15, 23, 42, hintBgAlpha);
  rect(0, 0, hintW, hintSize * 2.4, 18);
  fill(255, hintAlpha);
  textAlign(CENTER, CENTER);
  textSize(hintSize);
  text('將滑鼠移到左側，展開宇宙選單探索每個作品', hintW / 2, hintSize * 1.18);
  pop();
}

function updateCoverSparkles() {
  const now = millis();
  const interval = expandedDetail ? 7200 : random(4200, 6400);
  const readyForBurst = now > 2000 && (coverLastBurst === 0 || now - coverLastBurst > interval);
  if (readyForBurst) {
    spawnCoverBurst(width / 2, height / 2);
    coverLastBurst = now;
  }

  for (let i = coverSparkles.length - 1; i >= 0; i--) {
    const sp = coverSparkles[i];
    sp.x += sp.vx;
    sp.y += sp.vy;
    sp.vx *= 0.98;
    sp.vy *= 0.985;
    sp.roll += sp.spin;
    sp.life--;

    const fade = map(sp.life, sp.maxLife, 0, 1, 0);
    const alpha = constrain(fade * 140, 0, 140);
    const glow = constrain(fade * 70, 0, 70);

    if (alpha <= 0) {
      coverSparkles.splice(i, 1);
      continue;
    }

    push();
    translate(sp.x, sp.y);
    rotate(sp.roll);
    noStroke();
    fill(sp.color[0], sp.color[1], sp.color[2], glow);
    ellipse(0, 0, sp.size * 2.8, sp.size * 1.4);
    fill(sp.color[0], sp.color[1], sp.color[2], alpha);
    ellipse(0, 0, sp.size, sp.size);
    pop();
  }

  if (coverSparkles.length > 140) coverSparkles.splice(0, coverSparkles.length - 140);
}

function spawnCoverBurst(cx, cy) {
  for (let i = 0; i < 16; i++) {
    const ang = random(TWO_PI);
    const speed = random(0.5, 1.4);
    const palette = random([
      [56, 189, 248],
      [125, 211, 252],
      [129, 140, 248],
      [236, 181, 255]
    ]);
    const lifetime = random(80, 140);
    coverSparkles.push({
      x: cx + cos(ang) * random(12, 40),
      y: cy + sin(ang) * random(12, 40),
      vx: cos(ang) * speed,
      vy: sin(ang) * speed * 0.6 - random(0.15, 0.4),
      life: lifetime,
      maxLife: lifetime,
      size: random(5, 11),
      roll: random(TWO_PI),
      spin: random(-0.06, 0.06),
      color: palette
    });
  }
}

// === 側邊選單 ===
function drawSideMenu() {
  const baseHover = max(36, min(width * 0.06, 54));
  hoverZone = lerp(hoverZone, baseHover, 0.12);
  const tentativeCardX = menuX + MENU_W + 16;
  const tentativeCardY = height / 2 - DETAIL_CARD_H / 2;
  const mouseInCard = mouseX >= tentativeCardX && mouseX <= tentativeCardX + DETAIL_CARD_W && mouseY >= tentativeCardY && mouseY <= tentativeCardY + DETAIL_CARD_H;

  const nearEdge = mouseX < hoverZone;
  const insideMenu = mouseX >= menuX && mouseX <= menuX + MENU_W;
  const keepOpen = nearEdge || insideMenu || mouseInCard || !!expandedDetail;
  menuTarget = keepOpen ? 0 : (-MENU_W + HANDLE_W);
  menuX = lerp(menuX, menuTarget, 0.15);

  detailCardBounds = {
    x: menuX + MENU_W + 16,
    y: height / 2 - DETAIL_CARD_H / 2,
    w: DETAIL_CARD_W,
    h: DETAIL_CARD_H
  };

  if (!expandedDetail) overlayBounds = null;

  rectMode(CORNER);
  noStroke(); fill(MENU_BG); rect(menuX, 0, MENU_W, height);
  fill(MENU_ACCENT); rect(menuX - 1, height/2 - 40, HANDLE_W, 80, 6);
  stroke(255); strokeWeight(2);
  for (let i=0;i<3;i++) line(menuX+4, height/2-20+i*10, menuX+10, height/2-20+i*10);
  noStroke();

  const itemH = 36, gap = 12;
  let totalH = 0;
  sideMenuItems.forEach(item => {
    totalH += itemH + gap;
  });
  totalH -= gap;

  let y = height / 2 - totalH / 2;
  sideMenuBoxes = [];

  let hoverDetailKey = null;

  textAlign(LEFT, CENTER); textSize(14);
  for (let i = 0; i < sideMenuItems.length; i++) {
    const item = sideMenuItems[i];
    const box = { x: menuX, y, w: MENU_W, h: itemH, i, detailKey: item.detailKey || item.id || null, itemRef: item };
    const isHover = mouseX >= box.x && mouseX <= box.x + box.w && mouseY >= box.y && mouseY <= box.y + box.h;

    fill(isHover ? MENU_BG_HOVER : MENU_BG);
    rect(box.x, box.y, box.w, box.h);
    if (isHover) {
      fill(MENU_ACCENT);
      rect(box.x, box.y, 3, box.h);
      hoverDetailKey = box.detailKey;
    }
    fill(MENU_TEXT);
    text(item.label, box.x + 16, box.y + box.h / 2);
    sideMenuBoxes.push(box);

    if (item.type === 'submenu') {
      const submenuHover = isHover || (mouseX > menuX + MENU_W && mouseX < menuX + MENU_W * 2 && mouseY > y && mouseY < y + item.submenu.length * (itemH + gap));
      if (submenuHover) {
        for (let j = 0; j < item.submenu.length; j++) {
          const subItem = item.submenu[j];
          const subBox = { x: menuX + MENU_W, y: y + j * (itemH + gap), w: MENU_W, h: itemH, i, j, detailKey: subItem.detailKey || subItem.id || null, itemRef: subItem };
          const isSubHover = mouseX >= subBox.x && mouseX <= subBox.x + subBox.w && mouseY >= subBox.y && mouseY <= subBox.y + subBox.h;
          fill(isSubHover ? MENU_BG_HOVER : MENU_BG);
          rect(subBox.x, subBox.y, subBox.w, subBox.h);
          if (isSubHover) {
            fill(MENU_ACCENT);
            rect(subBox.x, subBox.y, 3, subBox.h);
            hoverDetailKey = subBox.detailKey;
          }
          fill(MENU_TEXT);
          text(subItem.label, subBox.x + 16, subBox.y + subBox.h / 2);
          sideMenuBoxes.push(subBox);
        }
      }
    }
    y += itemH + gap;
  }

  hoverDetail = hoverDetailKey ? getMenuDetail(hoverDetailKey) : null;
  const needsSubmenuShift = hoverDetail && SUBMENU_SHIFT_KEYS.has(hoverDetail.key);
  const desiredCardX = menuX + MENU_W + 16 + (needsSubmenuShift ? MENU_W + 24 : 0);
  const maxCardX = width - DETAIL_CARD_W - 20;
  detailCardBounds.x = min(desiredCardX, maxCardX);
  detailHoverTarget = hoverDetail ? 1 : 0;
  if (expandedDetail) detailHoverTarget = 0;
  detailHoverAmt = expandedDetail ? 0 : lerp(detailHoverAmt, detailHoverTarget, 0.16);
  if (!expandedDetail && detailHoverAmt > 0.01 && hoverDetail) drawDetailCard(detailCardBounds, detailHoverAmt, hoverDetail);
  if (expandedDetail) drawDetailOverlay(expandedDetail);
}
function drawDetailCard(bounds, reveal, detail) {
  if (!detail) return;
  const ease = reveal < 1 ? pow(reveal, 0.85) : 1;
  const cx = bounds.x + bounds.w / 2;
  const cy = bounds.y + bounds.h / 2;
  const dx = constrain((mouseX - cx) / (bounds.w / 2), -1, 1);
  const dy = constrain((mouseY - cy) / (bounds.h / 2), -1, 1);
  const pad = 18;
  const mediaH = bounds.h * 0.52;
  const mediaW = bounds.w - pad * 2;
  const wobble = ease * 4;
  const accent = color(detail.accent || '#0ea5e9');
  const accentSoft = lerpColor(color(255), accent, constrain(0.35 + ease * 0.45, 0, 1));

  push();
  translate(cx, cy);
  const scaleAmt = map(ease, 0, 1, 0.82, 1);
  scale(scaleAmt);
  rotate(radians(dx * 2));
  translate(-bounds.w / 2, -bounds.h / 2);
  rectMode(CORNER);

  drawingContext.save();
  const shadowCol = `rgba(${red(accent)},${green(accent)},${blue(accent)},${0.16 + ease * 0.32})`;
  drawingContext.shadowColor = shadowCol;
  drawingContext.shadowBlur = 30 * ease;
  fill(24, 35, 54, 220);
  rect(0, 0, bounds.w, bounds.h, 20);
  drawingContext.shadowBlur = 0;

  const mediaShiftX = dx * wobble;
  const mediaShiftY = dy * wobble;
  if (detail.image && detail.imageType === 'photo') {
    push();
    translate(pad + mediaShiftX, pad + mediaShiftY);
    imageMode(CENTER);
    const ratio = detail.image.width / detail.image.height;
    let drawW = mediaW;
    let drawH = mediaH;
    if (drawW / drawH > ratio) drawW = drawH * ratio;
    else drawH = drawW / ratio;
    translate(mediaW / 2, mediaH / 2);
    scale(map(ease, 0, 1, 1.08, 1));
    image(detail.image, 0, 0, drawW, drawH);
    pop();
  } else {
    const gStart = color(detail.gradient && detail.gradient[0] ? detail.gradient[0] : detail.accent || '#4f46e5');
    const gEnd = color(detail.gradient && detail.gradient[1] ? detail.gradient[1] : '#1d4ed8');
    push();
    translate(pad + mediaShiftX, pad + mediaShiftY);
    noStroke();
    for (let i = 0; i <= 1.01; i += 0.04) {
      const col = lerpColor(gStart, gEnd, i);
      fill(red(col), green(col), blue(col), 220);
      rect(0, i * mediaH, mediaW, mediaH * 0.08, 12);
    }
    if (detail.emoji) {
      fill(255, 230);
      textAlign(CENTER, CENTER);
      textSize(mediaH * 0.45);
      text(detail.emoji, mediaW / 2, mediaH / 2 + 6);
    }
    pop();
  }

  const textX = pad;
  const textY = pad + mediaH + 20;
  const tilt = dx * 0.2;

  const titleSize = detail.kind === 'profile' ? 26 : 22;
  const subtitleSize = detail.kind === 'profile' ? 16 : 14;
  const bodySize = detail.kind === 'profile' ? 14.5 : 12.5;
  const bodyLeading = detail.kind === 'profile' ? 22 : 18;

  fill(accentSoft);
  textAlign(LEFT, TOP);
  textSize(titleSize);
  text(detail.title || '', textX, textY);

  if (detail.subtitle) {
    fill(220, 200 + ease * 40);
    textSize(subtitleSize);
    text(detail.subtitle, textX, textY + 30);
  }

  const bodyOffset = detail.subtitle ? 54 : 32;
  const bodyText = (detail.description || '').replace(/\n/g, '\n');
  if (bodyText) {
    fill(200, 190, 255, 150 + ease * 70);
    textSize(bodySize);
    textLeading(bodyLeading);
    const maxHeight = detail.kind === 'profile' ? bounds.h * 0.42 : bounds.h * 0.36;
    const lines = bodyText.split('\n');
    let drawn = 0;
    for (let i = 0; i < lines.length; i++) {
      const yy = textY + bodyOffset + drawn * bodyLeading;
      if (yy - (textY + bodyOffset) > maxHeight) {
        fill(200, 190, 255, 120 + ease * 40);
        text('⋯', textX, yy);
        break;
      }
      text(lines[i], textX, yy, bounds.w - pad * 2);
      drawn++;
    }
  }

  const orbitR = map(ease, 0, 1, 54, 68);
  const lum = map(sin(frameCount * 0.06 + tilt), -1, 1, 0.4, 0.9);
  const orbitCx = bounds.w - pad - 36;
  const orbitCy = textY + 18;
  noFill();
  stroke(red(accent), green(accent), blue(accent), 150 * ease);
  strokeWeight(1.6);
  ellipse(orbitCx, orbitCy, orbitR * 2, orbitR * 0.6);

  noStroke();
  const sparkle = map(ease, 0, 1, 6, 12);
  for (let i = 0; i < sparkle; i++) {
    const ang = TWO_PI * i / sparkle + frameCount * 0.04;
    const px = orbitCx + cos(ang) * orbitR * 0.9;
    const py = orbitCy + sin(ang) * orbitR * 0.3;
    const size = 3 + sin(frameCount * 0.12 + i) * 1.4;
    fill(red(accent), green(accent), blue(accent), (140 + i * 8) * ease * lum);
    ellipse(px, py, size, size);
  }

  if (detail.badge) {
    fill(255, 220 * ease);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(detail.badge, orbitCx, orbitCy + 1);
  }

  drawingContext.restore();
  pop();
}
function drawDetailOverlay(state) {
  const key = typeof state === 'string' ? state : state?.key;
  const detail = getMenuDetail(key);
  if (!detail) {
    expandedDetail = null;
    return;
  }

  overlayBounds = null;

  push();
  noStroke();
  rectMode(CORNER);
  fill(0, 200);
  rect(0, 0, width, height);
  pop();

  const overlayW = min(width * 0.7, detail.kind === 'profile' ? 560 : 520);
  const overlayH = min(height * 0.82, detail.kind === 'profile' ? 640 : 600);
  const bounds = {
    x: width / 2 - overlayW / 2,
    y: height / 2 - overlayH / 2,
    w: overlayW,
    h: overlayH
  };
  overlayBounds = bounds;

  drawDetailCard(bounds, 1, detail);

  const hint = detail.closeHint || '點擊背景即可關閉';
  const hintY = min(height - 80, bounds.y + bounds.h + 32);
  push();
  textAlign(CENTER, CENTER);
  textSize(14);
  fill(220, 190);
  text(hint, width / 2, hintY);
  pop();

  if (detail.action) {
    const btnY = min(height - 36, hintY + 42);
    drawBtn(width / 2, btnY, min(width * 0.4, 220), 50, detail.action.label || '前往', () => {
      triggerDetailAction(detail, detail.action);
    });
  }
}
function triggerDetailAction(detail, action) {
  if (!action) return;
  expandedDetail = null;
  if (fullscreen()) fullscreen(false);
  if (action.kind === 'link' && action.url) {
    window.location.href = action.url;
  } else if (action.kind === 'quiz') {
    appState = 'quiz_loading';
  }
}
function mousePressed() {
  if (expandedDetail) {
    if (overlayBounds && mouseX >= overlayBounds.x && mouseX <= overlayBounds.x + overlayBounds.w && mouseY >= overlayBounds.y && mouseY <= overlayBounds.y + overlayBounds.h) {
      return;
    }
    expandedDetail = null;
    if (fullscreen()) fullscreen(false);
    return;
  }

  const insideDetailCard = hoverDetail && mouseX >= detailCardBounds.x && mouseX <= detailCardBounds.x + detailCardBounds.w && mouseY >= detailCardBounds.y && mouseY <= detailCardBounds.y + detailCardBounds.h;
  if (insideDetailCard && hoverDetail) {
    if (hoverDetail.action && hoverDetail.kind !== 'profile') {
      triggerDetailAction(hoverDetail, hoverDetail.action);
    } else {
      expandedDetail = { key: hoverDetail.key };
      if (!fullscreen()) fullscreen(true);
    }
    return;
  }

  for (const box of sideMenuBoxes) {
    if (mouseX >= box.x && mouseX <= box.x + box.w && mouseY >= box.y && mouseY <= box.y + box.h) {
      const detailKey = box.detailKey || box.itemRef?.id || (typeof box.i === 'number' ? sideMenuItems[box.i]?.id : null);
      const detail = detailKey ? getMenuDetail(detailKey) : null;
      if (detail) {
        if (detail.action && detail.kind !== 'profile') {
          triggerDetailAction(detail, detail.action);
        } else {
          expandedDetail = { key: detail.key };
          if (!fullscreen()) fullscreen(true);
        }
        return;
      }
      const item = box.itemRef || (typeof box.i === 'number' ? sideMenuItems[box.i] : null);
      if (!item) return;
      if (item.type === 'link' && item.url) {
        window.location.href = item.url;
      } else if (item.type === 'quiz') {
        appState = 'quiz_loading';
      } else if (item.type === 'submenu' && item.url) {
        window.location.href = item.url;
      }
      return;
    }
  }

  if (appState === 'quiz') {
    for (const btn of buttons) if (btn.hit(mouseX, mouseY)) checkAnswer(btn);
  }
}
function touchStarted(){ mousePressed(); }
function touchMoved() {
  // 防止觸控拖曳時選單閃爍
  hoverZone = max(hoverZone, 60);
  return false;
}

// === 測驗 ===
function buildQuiz(rows){
  const pool = shuffle(rows.slice());
  quiz = pool.slice(0, NUM_QUESTIONS);
  qIdx=0; score=0; buttons=[]; particles=[]; toastTimer=0; shakeT=0; pendingAdvance=false;
}
function drawQuiz(){
  const q = quiz[qIdx];
  const layout = getQuizLayout();
  drawQuizPanel(layout, '#60a5fa');
  const navBottom = drawQuizBackButton(layout);

  const wrapWidth = layout.w - 72;
  const textX = layout.x + 36;
  let textY = navBottom + 28;

  fill(226); textAlign(LEFT, TOP); textSize(20);
  text(`第 ${qIdx+1} 題／共 ${quiz.length} 題`, textX, textY);

  textSize(28);
  textLeading(36);
  textWrap(WORD);
  textY += 44;
  fill(246);
  text(q.question, textX, textY, wrapWidth);

  const questionLines = estimateLineCount(q.question, wrapWidth, 28);
  const questionHeight = questionLines * 36;

  let buttonsTop = textY + questionHeight + 28;
  const buttonHeight = 60;
  const buttonGap = 18;
  const totalButtonsHeight = buttonHeight * 4 + buttonGap * 3;
  const maxButtonsTop = layout.bottom - totalButtonsHeight - 40;
  const minButtonsTop = layout.y + 120;
  if (maxButtonsTop <= minButtonsTop) {
    buttonsTop = max(layout.y + 80, layout.bottom - totalButtonsHeight - 36);
  } else {
    buttonsTop = constrain(buttonsTop, minButtonsTop, maxButtonsTop);
  }

  ensureButtons(4);
  const labels = ['A', 'B', 'C', 'D'];
  const bw = min(wrapWidth, 640);
  const bx = layout.cx;

  for (let i = 0; i < 4; i++) {
    const by = buttonsTop + i * (buttonHeight + buttonGap) + buttonHeight / 2;
    buttons[i].set(bx, by, bw, buttonHeight, `${labels[i]}. ${q.options[i]}`);
    buttons[i].draw();
  }
}
function checkAnswer(btn){
  if (pendingAdvance) return;
  const q = quiz[qIdx];
  const picked = btn.label.slice(0,1);
  const correct = picked === q.answer;

  makeToast(correct ? '答對了！' : `答錯了：${q.feedback || ''}`, correct);

  if (correct){
    score++;
    for (let i=0;i<60;i++) particles.push(new Particle(width/2, 0));
  } else {
    shakeT = 18; // 約 300ms 震動
  }

  // 保證特效可見：延遲 800ms 再換題
  pendingAdvance = true;
  setTimeout(() => {
    qIdx++;
    if (qIdx >= quiz.length) appState = 'result';
    pendingAdvance = false;
  }, 800);
}

// === 結果 ===
function drawResult(){
  const layout = getQuizLayout();
  drawQuizPanel(layout, '#a855f7');
  const navBottom = drawQuizBackButton(layout);

  fill(248); textAlign(CENTER, TOP);
  const percent = Math.round((score / quiz.length) * 100);
  const msg = percent === 100 ? '滿分！太棒了 🎉' :
              percent >= 70 ? '很不錯！繼續努力 👍' :
              percent >= 40 ? '還可以，再加油 💪' : '重考一次吧！💡';

  textSize(52);
  text(`${score}/${quiz.length}`, layout.cx, navBottom + 52);
  textSize(24);
  textLeading(34);
  text(`${percent} 分\n${msg}`, layout.cx, navBottom + 120);

  const primaryWidth = min(layout.w * 0.45, 260);
  const secondaryWidth = min(layout.w * 0.4, 220);
  drawBtn(layout.cx, layout.bottom - 118, primaryWidth, 56, '再測一次', ()=>{ buildQuiz(allRows); appState='quiz'; }, '#60a5fa');
  drawBtn(layout.cx, layout.bottom - 50, secondaryWidth, 46, '返回首頁', ()=>{ appState='home'; }, '#a855f7');
}

// === UI / 元件 ===
class ChoiceButton{
  constructor(){ this.x=this.y=this.w=this.h=0; this.label=''; }
  set(x,y,w,h,label){ this.x=x; this.y=y; this.w=w; this.h=h; this.label=label; }
  draw(){
    const hover = mouseX>=this.x-this.w/2 && mouseX<=this.x+this.w/2 && mouseY>=this.y-this.h/2 && mouseY<=this.y+this.h/2;
    push(); translate(this.x,this.y); rectMode(CENTER);
    const baseCol = hover ? color(56, 189, 248, 180) : color(15, 23, 42, 180);
    const grad = drawingContext.createLinearGradient(-this.w/2, -this.h/2, this.w/2, this.h/2);
    if (hover) {
      grad.addColorStop(0, 'rgba(56,189,248,0.7)');
      grad.addColorStop(1, 'rgba(129,140,248,0.7)');
    } else {
      grad.addColorStop(0, 'rgba(15,23,42,0.55)');
      grad.addColorStop(1, 'rgba(30,41,59,0.55)');
    }
    drawingContext.fillStyle = grad;
    noStroke();
    rect(0,0,this.w,this.h,14);
    if (hover) {
      drawingContext.shadowColor = 'rgba(56,189,248,0.35)';
      drawingContext.shadowBlur = 18;
      rect(0,0,this.w,this.h,14);
      drawingContext.shadowBlur = 0;
    }
    fill(255);
    textAlign(CENTER,CENTER);
    textSize(18);
    text(this.label,0,2);
    pop();
  }
  hit(mx,my){ return mx>=this.x-this.w/2 && mx<=this.x+this.w/2 && my>=this.y-this.h/2 && my<=this.y+this.h/2; }
}
function ensureButtons(n){ while(buttons.length<n) buttons.push(new ChoiceButton()); }

// 粒子（彩帶）
class Particle{
  constructor(x,y){
    this.x=x+random(-40,40); this.y=y+random(-10,20);
    this.vx=random(-2.4,2.4); this.vy=random(1.6,4.8);
    this.life=70+random(30); this.size=random(3.5,8.5);
    const palette = random([
      color(56,189,248),
      color(129,140,248),
      color(236,181,255),
      color(45,212,191)
    ]);
    this.c = palette;
  }
  update(){ this.x+=this.vx; this.y+=this.vy; this.vy+=0.12; this.life--; }
  draw(){ noStroke(); fill(this.c); circle(this.x,this.y,this.size); }
  get dead(){ return this.life<=0 || this.y>height+50; }
}
function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    particles[i].update(); particles[i].draw();
    if (particles[i].dead) particles.splice(i,1);
  }
  if (particles.length > 220) particles.splice(0, particles.length - 220);
}

// 按鈕（防長按重複觸發）
function drawBtn(cx,cy,w,h,label,onClick,accentColor='#60a5fa'){
  const hover = mouseX>=cx-w/2 && mouseX<=cx+w/2 && mouseY>=cy-h/2 && mouseY<=cy+h/2;
  push();
  const accent = color(accentColor);
  const r = red(accent), g = green(accent), b = blue(accent);
  const tint = (factor, alpha) => `rgba(${Math.min(r*factor,255)},${Math.min(g*factor,255)},${Math.min(b*factor,255)},${alpha})`;

  drawingContext.save();
  const grad = drawingContext.createLinearGradient(cx - w/2, cy, cx + w/2, cy);
  if (hover) {
    grad.addColorStop(0, tint(1.05, 0.96));
    grad.addColorStop(1, tint(0.72, 0.95));
  } else {
    grad.addColorStop(0, tint(0.68, 0.88));
    grad.addColorStop(1, tint(0.54, 0.86));
  }
  drawingContext.shadowColor = `rgba(${r},${g},${b},${hover?0.38:0.24})`;
  drawingContext.shadowBlur = hover ? 28 : 18;
  roundedRectPath(drawingContext, cx - w/2, cy - h/2, w, h, 18);
  drawingContext.fillStyle = grad;
  drawingContext.fill();
  drawingContext.shadowBlur = 0;
  drawingContext.strokeStyle = `rgba(${r},${g},${b},${hover?0.34:0.22})`;
  drawingContext.lineWidth = 1.2;
  drawingContext.stroke();
  drawingContext.restore();

  fill(255);
  textAlign(CENTER,CENTER);
  textSize(18);
  text(label,cx,cy+1);
  pop();
  if (hover && mouseIsPressed && !drawBtn._pressed) { drawBtn._pressed = true; onClick && onClick(); }
  if (!mouseIsPressed) drawBtn._pressed = false;
}

// Toast（答對/答錯提示）
function makeToast(txt,good){ toastText=txt; toastGood=!!good; toastTimer=60; }
function drawToastTop(){
  if (toastTimer<=0) return;
  const y = height*0.12;
  fill(toastGood ? 'rgba(78,205,196,0.95)' : 'rgba(255,99,71,0.95)');
  rectMode(CENTER); rect(width/2, y, Math.min(width*0.7, 640), 44, 10);
  fill(0); textAlign(CENTER,CENTER); textSize(16); text(toastText, width/2, y+1);
  toastTimer--;
}

// 工具
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
