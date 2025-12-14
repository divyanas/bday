// Personalization
const ALLOWED_NAMES = ["Ranjith", "Ranjith Mama", "MAMA", "Ranjith mama", "mama", "Mama", "ranjith mama"]; // add more variations
const BIRTHDAY_AT = new Date(Date.UTC(2025, 11, 13, 18, 30, 0)); // Dec is month 11 (0-based)
console.log("Target (local):", new Date(BIRTHDAY_AT).toString());
console.log("Target (UTC):", new Date(BIRTHDAY_AT).toUTCString());
let hasCelebrated = false;

// Elements
const gate = document.getElementById("gate");
const content = document.getElementById("content");
const form = document.getElementById("unlock-form");
const input = document.getElementById("unlock-input");
const gateError = document.getElementById("gate-error");
const heroName = document.getElementById("hero-name");
const heroSub = document.getElementById("hero-sub");
const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");
const confettiCanvas = document.getElementById("confetti");
const celebrateBtn = document.getElementById("celebrate-btn");
const muteBtn = document.getElementById("mute-btn");
const audio = document.getElementById("bg-audio");
const typewriterEl = document.getElementById("typewriter");
const downloadLetterBtn = document.getElementById("download-letter");
const themeToggle = document.getElementById("theme-toggle");
const footerName = document.getElementById("footer-name");
const scrollTopBtn = document.getElementById("scroll-top");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalCaption = document.getElementById("modal-caption");
const modalClose = document.getElementById("modal-close");
const SENDER_NAME = "APPU"; // <-- your name here


// Gate / Unlock
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = (input.value || "").trim().toLowerCase();
  if (!val) {
    gateError.textContent = "Please enter your name.";
    return;
  }
  const ok = ALLOWED_NAMES.includes(val);
  if (!ok) {
    gateError.textContent = "Hmm, that doesn't seem right. Try your nickname?";
    return;
  }

  // Change button style
  const unlockBtn = document.getElementById("unlock-btn");
  unlockBtn.textContent = "Unlocked 🎉";
  unlockBtn.classList.add("unlocked");

  // Reveal content
  localStorage.setItem("bdayName", val);
  heroName.textContent = `Happy Birthday, ${capitalize(val)}!`;
  footerName.textContent = SENDER_NAME; // ✅ now always your name
  gate.classList.add("hidden");
  content.classList.remove("hidden");
  startExperience();
});

function capitalize(s) { return s.slice(0,1).toUpperCase() + s.slice(1); }

// Countdown
function startCountdown() {
  function tick() {
    const now = new Date();
    const diff = BIRTHDAY_AT - now;
    if (diff <= 0) {
      clearInterval(countdownInterval);
      setCountdown(0);
      // Do NOT auto-celebrate here.
      heroSub.textContent = "It’s time. Press the button to celebrate! 🎂";
      return;
    }
    setCountdown(diff);
  }
  tick();
  countdownInterval = setInterval(tick, 1000);
}

function setCountdown(ms) {
  const seconds = Math.floor(ms / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  dEl.textContent = String(days).padStart(2, "0");
  hEl.textContent = String(hours).padStart(2, "0");
  mEl.textContent = String(minutes).padStart(2, "0");
  sEl.textContent = String(secs).padStart(2, "0");
}

// Confetti
const ctx = confettiCanvas.getContext("2d");
let confettiPieces = [];

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function fireConfetti(duration = 3000) {
  const colors = ["#ff8fab", "#ffd3b6", "#80d0ff", "#fce38a", "#b4f8c8"];
  const count = 220;
  confettiPieces = Array.from({ length: count }).map(() => ({
    x: Math.random() * confettiCanvas.width,
    y: -10 - Math.random() * 40,
    r: 4 + Math.random() * 6,
    c: colors[Math.floor(Math.random() * colors.length)],
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 3,
    rot: Math.random() * Math.PI * 2,
    vr: -0.05 + Math.random() * 0.1
  }));

  const start = performance.now();
  function animate(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
      ctx.restore();
    });
    if (elapsed < duration) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
  requestAnimationFrame(animate);
}

// Balloons
const balloonCanvas = document.getElementById("balloons");
const bctx = balloonCanvas.getContext("2d");

function resizeBalloonCanvas() {
  balloonCanvas.width = window.innerWidth;
  balloonCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeBalloonCanvas);
resizeBalloonCanvas();

function fireBalloons(duration = 5000) {
  const colors = ["#ff8fab", "#ffd3b6", "#80d0ff", "#fce38a", "#b4f8c8"];
  const balloons = Array.from({ length: 15 }).map(() => ({
    x: Math.random() * balloonCanvas.width,
    y: balloonCanvas.height + 50,
    r: 20 + Math.random() * 15,
    c: colors[Math.floor(Math.random() * colors.length)],
    vy: 1 + Math.random() * 2
  }));

  const start = performance.now();
  function animate(now) {
    const elapsed = now - start;
    bctx.clearRect(0, 0, balloonCanvas.width, balloonCanvas.height);
    balloons.forEach(b => {
      b.y -= b.vy;
      // balloon
      bctx.beginPath();
      bctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      bctx.fillStyle = b.c;
      bctx.fill();
      // string
      bctx.beginPath();
      bctx.moveTo(b.x, b.y + b.r);
      bctx.lineTo(b.x, b.y + b.r + 30);
      bctx.strokeStyle = "#555";
      bctx.stroke();
    });
    if (elapsed < duration) requestAnimationFrame(animate);
    else bctx.clearRect(0, 0, balloonCanvas.width, balloonCanvas.height);
  }
  requestAnimationFrame(animate);
}

// Typewriter
const LINES = [
  "Today, the world gets a little brighter—because it’s you.",
  "You’ve turned small moments into big memories, and I love that about you.",
  "For every laugh, every late-night talk, and every gentle silence—thank you.",
  "So here’s to new stories, softer mornings, and a year that feels like you."
];

function typeWriter(lines = LINES, speed = 40) {
  typewriterEl.textContent = "";
  let line = 0, char = 0;
  let current = "";
  function step() {
    if (line >= lines.length) return;
    current = lines[line].slice(0, char++);
    typewriterEl.textContent = lines.slice(0, line).join("\n") + (line ? "\n" : "") + current + "▌";
    if (char > lines[line].length) {
      line++; char = 0;
      setTimeout(step, 400);
    } else {
      setTimeout(step, speed);
    }
  }
  step();
}

// Download letter
downloadLetterBtn.addEventListener("click", () => {
  const birthdayName = capitalize(localStorage.getItem("bdayName") || "You");
  const text =
`Dear ${birthdayName},

On your birthday, I want to remind you how deeply loved you are.
For the way you walk into a room and make everything softer,
for the lightness you carry, and the care you share so freely.

May this year feel gentle on your soul,
and may you always find me rooting for you.

With lots of love,
${SENDER_NAME}`;
  
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `letter_for_${birthdayName.toLowerCase()}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Audio controls
muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? "Unmute 🔇" : "Mute 🔈";
});

// Celebration flow
function autoCelebrate() {
  if (hasCelebrated) return;
  hasCelebrated = true;

  heroSub.textContent = "It’s time. Happy Birthday! 🎂";
  fireConfetti(5000);
  fireBalloons(5000);
  safePlayAudio();
  typeWriter();
}
celebrateBtn.addEventListener("click", () => {
  if (!hasCelebrated) hasCelebrated = true;
  heroSub.textContent = "You pressed the magic button. Let’s celebrate!";
  fireConfetti(4000);
  fireBalloons(5000);
  safePlayAudio();
  typeWriter();
});
function safePlayAudio() {
  audio.play().catch(() => {
    // Some browsers need user interaction; toggle button helps.
  });
}

// Theme toggle
let dark = true;
themeToggle.addEventListener("click", () => {
  dark = !dark;
  document.documentElement.style.setProperty("--bg", dark ? "#0f1220" : "#f7f7fb");
  document.documentElement.style.setProperty("--fg", dark ? "#e9e9ef" : "#1a1a22");
  themeToggle.textContent = dark ? "☀️" : "🌙";
});

// Gallery modal
document.querySelectorAll(".card img").forEach(img => {
  img.addEventListener("click", () => {
    const caption = img.parentElement.dataset.caption || "";
    modalImg.src = img.src;
    modalImg.alt = img.alt || "";
    modalCaption.textContent = caption;
    modal.classList.remove("hidden");
  });
});
modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

// Scroll top
scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Start experience after unlock
function startExperience() {
  startCountdown();
  // Prefill name if saved
  const saved = localStorage.getItem("bdayName");
  if (saved) {
    heroName.textContent = `Happy Birthday, ${capitalize(saved)}!`;
    footerName.textContent = SENDER_NAME;   // ✅ always your name
  }
}

// Envelope reveal
const envelope = document.getElementById("envelope");
const photos = document.getElementById("photo-stack");
const quote = document.querySelector(".reveal-quote");

envelope.addEventListener("click", () => {
  envelope.classList.add("open");      // open the flap
  photos.classList.remove("hidden");   // show photos below
  quote.textContent = "Memories revealed 💕";

});





