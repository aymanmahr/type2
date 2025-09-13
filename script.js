const wordsBank = "time speed typing test random accuracy javascript coding monkey type keyboard practice skill words challenge".split(" ");

const textArea = document.getElementById("textArea");
const input = document.getElementById("input");
const startBtn = document.getElementById("startBtn");
const wpmEl = document.getElementById("wpm");
const accEl = document.getElementById("acc");
const timeLeftEl = document.getElementById("timeLeft");
const timeSelect = document.getElementById("time");

let timer = null;
let totalTime = 30;
let timeLeft = 30;
let words = [];
let currentWordIndex = 0;
let currentCharIndex = 0;
let typedChars = 0;
let mistakes = 0;

function getWords(count = 30) {
  let out = [];
  for (let i = 0; i < count; i++) {
    out.push(wordsBank[Math.floor(Math.random() * wordsBank.length)]);
  }
  return out;
}

function renderWords() {
  textArea.innerHTML = "";
  words.forEach((word, wi) => {
    word.split("").forEach((ch, ci) => {
      let span = document.createElement("span");
      span.textContent = ch;
      span.id = `w${wi}c${ci}`;
      textArea.appendChild(span);
    });
    let space = document.createElement("span");
    space.textContent = " ";
    textArea.appendChild(space);
  });
  highlightCurrent();
}

function highlightCurrent() {
  document.querySelectorAll(".current").forEach(el => el.classList.remove("current"));
  let currentSpan = document.getElementById(`w${currentWordIndex}c${currentCharIndex}`);
  if (currentSpan) currentSpan.classList.add("current");
}

function startTest() {
  resetTest();
  totalTime = parseInt(timeSelect.value, 10);
  timeLeft = totalTime;
  timeLeftEl.textContent = timeLeft;
  words = getWords(40);
  renderWords();
  input.disabled = false;
  input.focus();

  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = timeLeft;
    if (timeLeft <= 0) endTest();
  }, 1000);
}

function endTest() {
  clearInterval(timer);
  input.disabled = true;
  calculateStats();

  // Wait 2 seconds then auto-restart
  setTimeout(() => {
    startTest();
  }, 2000);
}


function resetTest() {
  clearInterval(timer);
  currentWordIndex = 0;
  currentCharIndex = 0;
  typedChars = 0;
  mistakes = 0;
  input.value = "";
  wpmEl.textContent = "0";
  accEl.textContent = "100%";
  textArea.innerHTML = "";
}

function handleInput(e) {
  if (timeLeft <= 0) return;

  let char = e.data;
  if (!char) return; // for backspace etc.

  let targetSpan = document.getElementById(`w${currentWordIndex}c${currentCharIndex}`);
  if (!targetSpan) return;

  typedChars++;

  if (char === targetSpan.textContent) {
    targetSpan.classList.add("correct");
    currentCharIndex++;
  } else {
    targetSpan.style.color = "red";
    mistakes++;
    currentCharIndex++;
  }

  if (currentCharIndex >= words[currentWordIndex].length) {
    currentWordIndex++;
    currentCharIndex = 0;
  }

  highlightCurrent();
  calculateStats();
}

function calculateStats() {
  let minutes = (totalTime - timeLeft) / 60;
  let wpm = Math.round(((typedChars / 5) / minutes) || 0);
  let accuracy = typedChars ? Math.round(((typedChars - mistakes) / typedChars) * 100) : 100;

  wpmEl.textContent = wpm;
  accEl.textContent = accuracy + "%";
}

startBtn.addEventListener("click", startTest);
input.addEventListener("input", handleInput);
