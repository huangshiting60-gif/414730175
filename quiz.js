// quiz.js — EdTech Quiz 最終版（隨機題目＋10題）

const CSV_URL = 'questions.csv';
const quizRoot = document.getElementById('quiz-root');
const progressBar = document.getElementById('progressBar');
let allQuestions = [];
let currentIndex = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  if (startBtn) startBtn.addEventListener('click', initQuiz);
});

function initQuiz() {
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    startBtn.disabled = true;
    startBtn.classList.add('disabled');
  }
  if (progressBar) progressBar.style.width = '0%';
  quizRoot.innerHTML = '<div class="center">載入題庫中…</div>';

  fetch(CSV_URL)
    .then(res => res.text())
    .then(text => {
      const pool = parseCSVToQuestions(text);
      if (pool.length < 10) {
        quizRoot.innerHTML = `<p>題庫需至少 10 題，目前僅有 ${pool.length} 題。</p>`;
        if (startBtn) {
          startBtn.disabled = false;
          startBtn.classList.remove('disabled');
        }
        return;
      }

      allQuestions = shuffle(pool.slice()).slice(0, 10);
      currentIndex = 0;
      score = 0;
      renderQuestion();
    })
    .catch(err => {
      console.error(err);
      quizRoot.innerHTML = '<p>載入題庫失敗</p>';
      const startBtn = document.getElementById('startBtn');
      if (startBtn) {
        startBtn.disabled = false;
        startBtn.classList.remove('disabled');
      }
    });
}

function parseCSVToQuestions(text) {
  const rows = splitCSV(text.trim());
  if (!rows.length) return [];

  let header = rows[0].map(s => s.trim());
  let startIdx = 1;
  if (!header.some(h => /question/i.test(h))) {
    header = ['question','optionA','optionB','optionC','optionD','answer'];
    startIdx = 0;
  }

  const findIdx = (regex, fallback) => {
    const idx = header.findIndex(h => regex.test(h));
    return idx >= 0 ? idx : fallback;
  };

  const qi = findIdx(/question/i, 0);
  const ai = findIdx(/optionA/i, 1);
  const bi = findIdx(/optionB/i, 2);
  const ci = findIdx(/optionC/i, 3);
  const di = findIdx(/optionD/i, 4);
  const ansIdx = findIdx(/(answer|correctAnswer)/i, 5);

  const cleanOption = txt => (txt || '').replace(/[(),（），]/g, '').trim();
  const questions = [];

  for (let i = startIdx; i < rows.length; i++) {
    const cols = rows[i];
    if (!cols || !cols.length) continue;

    const question = (cols[qi] || '').trim();
    const optionA = (cols[ai] || '').trim();
    const optionB = (cols[bi] || '').trim();
    const optionC = (cols[ci] || '').trim();
    const optionD = (di >= 0 && di < cols.length) ? (cols[di] || '').trim() : '';
    const answer = (cols[ansIdx] || '').trim().toUpperCase();

    if (!question || !optionA || !optionB || !optionC || !'ABCD'.includes(answer)) continue;

    const options = [optionA, optionB, optionC, optionD].map(cleanOption);
    questions.push({ question, options, answer });
  }

  return questions;
}

function renderQuestion() {
  const q = allQuestions[currentIndex];
  if (!q) return renderResult();

  if (progressBar) {
    progressBar.style.width = ((currentIndex / allQuestions.length) * 100) + '%';
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'quiz-screen';

  const title = document.createElement('h2');
  title.textContent = `第 ${currentIndex + 1} 題／共 ${allQuestions.length} 題`;
  wrapper.appendChild(title);

  const qText = document.createElement('p');
  qText.textContent = q.question;
  wrapper.appendChild(qText);

  const optionsBox = document.createElement('div');
  optionsBox.className = 'options-box';

  q.options.forEach((opt, idx) => {
    if (!opt) return;
    const label = 'ABCD'[idx] || String.fromCharCode(65 + idx);
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = `${label}. ${opt}`;
    btn.addEventListener('click', () => handleAnswer(label));
    optionsBox.appendChild(btn);
  });

  wrapper.appendChild(optionsBox);
  quizRoot.innerHTML = '';
  quizRoot.appendChild(wrapper);
}

function handleAnswer(userAnswer) {
  const q = allQuestions[currentIndex];
  if (!q) return;

  if (userAnswer === q.answer) score++;
  currentIndex++;

  if (currentIndex >= allQuestions.length) {
    renderResult();
  } else {
    renderQuestion();
  }
}

function renderResult() {
  if (progressBar) progressBar.style.width = '100%';
  const resultBox = document.createElement('div');
  resultBox.className = 'quiz-result';

  const h2 = document.createElement('h2');
  h2.textContent = '作答完成';
  resultBox.appendChild(h2);

  const p = document.createElement('p');
  p.textContent = `你的分數：${score} / ${allQuestions.length}`;
  resultBox.appendChild(p);

  const restartBtn = document.createElement('button');
  restartBtn.textContent = '再做一次';
  restartBtn.className = 'cta';
  restartBtn.addEventListener('click', initQuiz);
  resultBox.appendChild(restartBtn);

  quizRoot.innerHTML = '';
  quizRoot.appendChild(resultBox);
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

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
