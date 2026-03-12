/* ══════════════════════════════════════
   YAMINI SONI — PORTFOLIO SCRIPT
   Clean, structured, voice-powered
══════════════════════════════════════ */

// ── CURSOR ──────────────────────────────
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

document.addEventListener('mousemove', e => {
  dot.style.left  = e.clientX + 'px';
  dot.style.top   = e.clientY + 'px';
  ring.style.left = e.clientX + 'px';
  ring.style.top  = e.clientY + 'px';
  if (document.getElementById('page-bot').classList.contains('active')) {
    trackEyes(e.clientX, e.clientY);
  }
});

document.querySelectorAll('a, button, .proj-card, .topic-btn, .ach-card, .edu-card-new, .cert-card-new').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('grow'));
  el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
});


// ── CANVAS BG (warm cream particles) ────
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

const pts = Array.from({ length: 48 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random() - 0.5) * 0.35,
  vy: (Math.random() - 0.5) * 0.35,
  r: Math.random() * 2.2 + 0.6,
}));

function drawBg() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(232,132,90,0.18)';
    ctx.fill();
    pts.forEach(q => {
      const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(212,168,75,${0.04 * (1 - d / 110)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawBg);
}
drawBg();


// ── NAVIGATION ──────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) {
    page.classList.add('active');
    if (id !== 'home' && id !== 'bot') animateSkillBars();
  }
}

function goHome()   { showPage('home'); }

function goToBot() {
  showPage('bot');
  setTimeout(() => botSpeak("Hi there! I'm Yami. I can walk you through Yamini's work, skills, and background. What would you like to explore?"), 350);
}

function backToBot() {
  showPage('bot');
  const replies = [
    "Back here! What would you like to explore next?",
    "I'm here. Click a topic or just ask me anything about Yamini!",
    "Welcome back! What else can I help you with?"
  ];
  setTimeout(() => botSpeak(replies[Math.floor(Math.random() * replies.length)]), 300);
}

function navigateTo(section) {
  const intro = {
    skills:       "Here are Yamini's technical skills across languages, ML, and tools!",
    projects:     "These are Yamini's key AI and ML projects. Click any card for the full story!",
    experience:   "Yamini completed an intensive NLP and GenAI training program. Let me show you!",
    achievements: "Yamini has been recognized by Google for her AI safety contributions!",
    education:    "Yamini is pursuing her B.Tech in CSE at LPU. Here's her academic background!",
    certificates: "Here are Yamini's verified certifications from Google, ITMO, and more!",
    resume:       "Here's an overview of Yamini's full resume!",
    contact:      "Yamini is open to internships and collaborations. Here's how to reach her!"
  };
  botSpeak(intro[section] || "Here you go!");
  setTimeout(() => showPage(section), 480);
}


// ── BOT EYE TRACKING ────────────────────
function trackEyes(mx, my) {
  [['eyeLeft','pupilLeft'], ['eyeRight','pupilRight']].forEach(([eid, pid]) => {
    const eye   = document.getElementById(eid);
    const pupil = document.getElementById(pid);
    if (!eye || !pupil) return;
    const r   = eye.getBoundingClientRect();
    const cx  = r.left + r.width / 2;
    const cy  = r.top  + r.height / 2;
    const dx  = mx - cx, dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const max  = 6;
    const nx   = dist > 0 ? dx / dist : 0;
    const ny   = dist > 0 ? dy / dist : 0;
    const move = Math.min(dist / 18, max);
    pupil.style.transform = `translate(calc(-50% + ${nx * move}px), calc(-50% + ${ny * move}px))`;
  });
}


// ── BOT SPEECH ──────────────────────────
const synth = window.speechSynthesis;
let speaking = false;

function botSpeak(text, cb) {
  // Update bubble
  const el = document.getElementById('botText');
  if (el) {
    el.style.transition = 'opacity 0.18s';
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = text; el.style.opacity = '1'; }, 180);
  }

  // Mouth
  const mouth = document.getElementById('botMouth');
  if (mouth) mouth.classList.add('speaking');
  speaking = true;

  if (synth) {
    synth.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate   = 1.0;
    utt.pitch  = 1.1;
    utt.volume = 0.9;
    const voices = synth.getVoices();
    const nice = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Google UK English Female') ||
      v.name.includes('Female')
    );
    if (nice) utt.voice = nice;
    utt.onend = utt.onerror = () => {
      if (mouth) mouth.classList.remove('speaking');
      speaking = false;
      if (cb) cb();
    };
    setTimeout(() => synth.speak(utt), 80);
  } else {
    setTimeout(() => {
      if (mouth) mouth.classList.remove('speaking');
      speaking = false;
      if (cb) cb();
    }, text.length * 55);
  }
}

if (synth) { synth.onvoiceschanged = () => synth.getVoices(); synth.getVoices(); }


// ── VOICE RECOGNITION ───────────────────
let recog = null;
let listening = false;
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

function toggleListening() {
  if (!SR) { botSpeak("Voice isn't available in this browser. Please try Chrome!"); return; }
  listening ? stopListen() : startListen();
}

function startListen() {
  recog = new SR();
  recog.continuous = false;
  recog.lang = 'en-US';

  const btn   = document.getElementById('micBtn');
  const icon  = document.getElementById('micIcon');
  const label = document.getElementById('micLabel');

  if (btn)   btn.classList.add('on');
  if (icon)  icon.className = 'fas fa-stop';
  if (label) label.textContent = 'Listening…';
  listening = true;

  recog.start();

  recog.onresult = e => {
    const cmd = e.results[0][0].transcript.toLowerCase().trim();
    handleVoice(cmd);
  };
  recog.onend   = () => stopListen();
  recog.onerror = (e) => {
    stopListen();
    if (e.error !== 'no-speech') botSpeak("I didn't catch that. Try again!");
  };
}

function stopListen() {
  listening = false;
  const btn   = document.getElementById('micBtn');
  const icon  = document.getElementById('micIcon');
  const label = document.getElementById('micLabel');
  if (btn)   btn.classList.remove('on');
  if (icon)  icon.className = 'fas fa-microphone';
  if (label) label.textContent = 'Speak to me';
  if (recog) { try { recog.stop(); } catch(e){} recog = null; }
}

function handleVoice(cmd) {
  if (cmd.includes('skill') || cmd.includes('tech') || cmd.includes('language') || cmd.includes('tool'))
    return navigateTo('skills');
  if (cmd.includes('project') || cmd.includes('build') || cmd.includes('work') || cmd.includes('made'))
    return navigateTo('projects');
  if (cmd.includes('train') || cmd.includes('course') || cmd.includes('internship description') || cmd.includes('experience'))
    return navigateTo('experience');
  if (cmd.includes('achiev') || cmd.includes('award') || cmd.includes('google') || cmd.includes('prize') || cmd.includes('recognition'))
    return navigateTo('achievements');
  if (cmd.includes('edu') || cmd.includes('school') || cmd.includes('college') || cmd.includes('university') || cmd.includes('degree'))
    return navigateTo('education');
  if (cmd.includes('certif'))
    return navigateTo('certificates');
  if (cmd.includes('resume') || cmd.includes('cv'))
    return navigateTo('resume');
  if (cmd.includes('contact') || cmd.includes('hire') || cmd.includes('reach') || cmd.includes('email') || cmd.includes('connect') || cmd.includes('meet'))
    return navigateTo('contact');
  if (cmd.includes('back') || cmd.includes('home') || cmd.includes('menu'))
    return backToBot();
  if (cmd.includes('who') || cmd.includes('about') || cmd.includes('introduce') || cmd.includes('tell me'))
    return botSpeak("Yamini is a B.Tech Computer Science student at LPU, specialising in AI and Machine Learning. She builds real-world systems — from financial risk models to computer vision pipelines — and is actively seeking internships and collaborations.");
  if (cmd.includes('hello') || cmd.includes('hi') || cmd.includes('hey'))
    return botSpeak("Hello! Great to meet you. I'm here to help you explore Yamini's portfolio. What would you like to know?");

  botSpeak(`I heard: "${cmd}". Try asking about skills, projects, training, achievements, education, certificates, or contact!`);
}


// ── PROJECT MODALS ──────────────────────
const projectData = {
  loan: {
    title: 'Loan Default Risk Analyzer',
    sub: 'Financial AI · Machine Learning · Dec 2025',
    icon: 'fas fa-chart-line',
    grad: 'linear-gradient(135deg,#e8845a,#e85a7a)',
    overview: 'A machine learning pipeline that predicts whether a loan applicant will default, using customer financial data and behavioral indicators.',
    points: [
      'Trained and compared Random Forest, XGBoost, and LightGBM algorithms on financial datasets',
      'Achieved maximum accuracy of 93.5% and ROC-AUC score of 0.97',
      'Optimized data preprocessing, feature selection, and model evaluation for scalability',
      'Produced actionable risk scores to support loan approval decisions',
    ],
    stack: ['Python', 'XGBoost', 'LightGBM', 'Random Forest', 'Scikit-Learn', 'Pandas', 'NumPy'],
    gh: 'https://github.com/Yamini-Soni',
  },
  gold: {
    title: 'AI-Powered Gold Price Predictor',
    sub: 'Financial AI · NLP · Real-Time APIs · Jul 2025',
    icon: 'fas fa-coins',
    grad: 'linear-gradient(135deg,#d4a84b,#e8845a)',
    overview: 'A multi-country gold price analytics platform that combines live data pipelines with NLP-driven sentiment analysis from financial news.',
    points: [
      'Automated multi-country price data collection via Yahoo Finance and Exchange Rate APIs',
      'Extracted market sentiment from financial news using NLP techniques (NewsAPI)',
      'Aligned sentiment signals with short-term gold price movement patterns',
      'Built an interactive Streamlit dashboard comparing India, USA, and Dubai markets in real time',
    ],
    stack: ['Python', 'NLP', 'Streamlit', 'Yahoo Finance API', 'NewsAPI', 'ML Algorithms', 'Pandas'],
    gh: 'https://github.com/Yamini-Soni',
  },
  face: {
    title: 'Face Recognition Attendance System',
    sub: 'Computer Vision · Deep Learning · Apr 2025',
    icon: 'fas fa-user-circle',
    grad: 'linear-gradient(135deg,#5a8ee8,#7dbc8c)',
    overview: 'A real-time attendance system using deep learning face recognition — eliminating manual roll calls with over 90% recognition accuracy.',
    points: [
      'Used dlib's ResNet model to generate 128-dimensional face encodings for each identity',
      'Implemented real-time face detection, encoding, and matching via webcam feed',
      'Automated attendance logging triggered on successful face match',
      'Built a full GUI for image capture, model training, and live recognition visualization',
    ],
    stack: ['Python', 'OpenCV', 'dlib', 'ResNet', 'Deep Learning', 'Tkinter GUI'],
    gh: 'https://github.com/Yamini-Soni',
  },
  os: {
    title: 'OS Process Visualization Tool',
    sub: 'Systems · Visualization · 2024',
    icon: 'fas fa-microchip',
    grad: 'linear-gradient(135deg,#a47fd0,#5a8ee8)',
    overview: 'An interactive dashboard that visualizes CPU scheduling algorithms with animated Gantt charts, helping understand OS concepts clearly.',
    points: [
      'Implemented FCFS, SJF, Round Robin, and Priority scheduling algorithms',
      'Rendered animated Gantt chart timelines for each algorithm output',
      'Added side-by-side algorithm comparison with turnaround and waiting time metrics',
      'Built as an educational tool to make OS concepts visually intuitive',
    ],
    stack: ['Python', 'Visualization', 'OS Concepts', 'Data Structures'],
    gh: 'https://github.com/Yamini-Soni',
  },
};

function openProject(key) {
  const d = projectData[key];
  if (!d) return;
  document.getElementById('modalBody').innerHTML = `
    <div class="m-header">
      <div class="m-icon" style="background:${d.grad}"><i class="${d.icon}"></i></div>
      <div><h2>${d.title}</h2><p>${d.sub}</p></div>
    </div>
    <div class="m-section">
      <div class="m-section-label">Overview</div>
      <p>${d.overview}</p>
    </div>
    <div class="m-section">
      <div class="m-section-label">What was built & how</div>
      <ul>${d.points.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>
    <div class="m-section">
      <div class="m-section-label">Tech stack</div>
      <div class="m-chips">${d.stack.map(s => `<span>${s}</span>`).join('')}</div>
    </div>
    <a href="${d.gh}" target="_blank" class="m-gh-link"><i class="fab fa-github"></i> View on GitHub</a>
  `;
  document.getElementById('projModal').classList.add('open');
}

function closeProject() {
  document.getElementById('projModal').classList.remove('open');
}

document.getElementById('projModal')?.addEventListener('click', e => {
  if (e.target === document.getElementById('projModal')) closeProject();
});


// ── SKILL BAR ANIMATION ─────────────────
let skillsAnimated = false;

function animateSkillBars() {
  if (document.getElementById('page-skills').classList.contains('active') && !skillsAnimated) {
    skillsAnimated = true;
    document.querySelectorAll('.sk-bar').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = bar.style.getPropertyValue('--p') || getComputedStyle(bar).getPropertyValue('--p');
      }, i * 80);
    });
  }
}

// Watch for skills page becoming active
const skillsPage = document.getElementById('page-skills');
if (skillsPage) {
  new MutationObserver(() => {
    if (skillsPage.classList.contains('active')) {
      setTimeout(animateSkillBars, 100);
    }
  }).observe(skillsPage, { attributes: true, attributeFilter: ['class'] });
}


// ── BOT IDLE PROMPTS ────────────────────
const idlePrompts = [
  "Yamini is actively seeking internships and collaborations in AI and ML. Want to see her contact details?",
  "Yamini's Loan Default Analyzer achieves a 93.5% accuracy — want to see how it was built?",
  "Yamini was recognized by Google for contributing to AI safety research. Check out her achievements!",
  "Want to see Yamini's skills, projects, or training background? Just ask or click a topic!",
  "Yamini is trained in Generative AI, NLP, and Transformers. Ask me about her training!",
];

let idleTimer = null;
let idleIdx   = 0;

function resetIdle() {
  clearTimeout(idleTimer);
  if (!document.getElementById('page-bot').classList.contains('active')) return;
  idleTimer = setTimeout(() => {
    if (!speaking && !listening) {
      botSpeak(idlePrompts[idleIdx % idlePrompts.length]);
      idleIdx++;
    }
    resetIdle();
  }, 14000);
}

document.addEventListener('click',    resetIdle);
document.addEventListener('keypress', resetIdle);

new MutationObserver(() => {
  if (document.getElementById('page-bot').classList.contains('active')) resetIdle();
  else clearTimeout(idleTimer);
}).observe(document.getElementById('page-bot'), { attributes: true, attributeFilter: ['class'] });


// ── INIT ────────────────────────────────
window.addEventListener('load', () => {
  // Stagger home text in
  const els = document.querySelectorAll('.home-badge, .home-h1, .home-sub, .home-links, .home-stats');
  els.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
});