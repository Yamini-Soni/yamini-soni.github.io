// ===== CUSTOM CURSOR =====
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

document.addEventListener('mousemove', (e) => {
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top = e.clientY + 'px';

  // Bot eye tracking on bot page
  if (document.getElementById('page-bot').classList.contains('active')) {
    movePupils(e.clientX, e.clientY);
  }
});

document.querySelectorAll('a, button, .orbit-item, .project-card-new, .achieve-card, .meet-bot-cta').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
});

// ===== PARTICLES BACKGROUND =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.4 + 0.1
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,140,50,${p.alpha})`;
    ctx.fill();

    particles.forEach(other => {
      const d = Math.hypot(p.x - other.x, p.y - other.y);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(255,140,50,${0.05 * (1 - d / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== PAGE NAVIGATION =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
}

function goHome() { showPage('home'); }

function goToBot() {
  showPage('bot');
  setTimeout(() => {
    botSpeak("Hi there! I'm Yami, Yamini's AI assistant. Click any topic around me or tell me what you want to explore — skills, projects, achievements, and more!");
  }, 400);
}

function backToBot() {
  showPage('bot');
  setTimeout(() => {
    const msgs = [
      "Welcome back! What else would you like to know about Yamini?",
      "I'm here! Ask me about any section or click on the topics.",
      "Back to home base! Where would you like to explore next?"
    ];
    botSpeak(msgs[Math.floor(Math.random() * msgs.length)]);
  }, 300);
}

function navigateTo(section) {
  // Highlight orbit item
  document.querySelectorAll('.orbit-item').forEach(el => el.classList.remove('active-orbit'));
  const item = document.querySelector(`[data-section="${section}"]`);
  if (item) item.classList.add('active-orbit');

  const botMessages = {
    skills: "Let me show you Yamini's technical skills — Python, ML, deep learning, and more!",
    projects: "Here are Yamini's key projects. Click any card to get the full story!",
    experience: "Yamini trained at AlgoTutor on cutting-edge Generative AI and NLP!",
    achievements: "Yamini's been recognized by Google for AI safety work. Let me show you!",
    education: "Yamini is studying CSE at LPU with an impressive 8.71 CGPA!",
    certificates: "Here are Yamini's verified certifications from Google and ITMO University!",
    contact: "Want to connect with Yamini? All her contact details are right here!",
    resume: "Download Yamini's full resume here!"
  };

  botSpeak(botMessages[section] || "Here you go!");
  setTimeout(() => showPage(section), 500);
}

// ===== BOT EYE TRACKING =====
function movePupils(mouseX, mouseY) {
  const eyes = [
    { eye: document.getElementById('eyeLeft'), pupil: document.getElementById('pupilLeft') },
    { eye: document.getElementById('eyeRight'), pupil: document.getElementById('pupilRight') }
  ];

  eyes.forEach(({ eye, pupil }) => {
    if (!eye || !pupil) return;
    const eyeRect = eye.getBoundingClientRect();
    const eyeCX = eyeRect.left + eyeRect.width / 2;
    const eyeCY = eyeRect.top + eyeRect.height / 2;
    const dx = mouseX - eyeCX;
    const dy = mouseY - eyeCY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 7;
    const nx = dist > 0 ? dx / dist : 0;
    const ny = dist > 0 ? dy / dist : 0;
    const move = Math.min(dist / 20, maxDist);
    pupil.style.transform = `translate(calc(-50% + ${nx * move}px), calc(-50% + ${ny * move}px))`;
  });
}

// ===== BOT SPEECH =====
let synth = window.speechSynthesis;
let isTalking = false;

function botSpeak(text, callback) {
  // Update bubble text
  const botTextEl = document.getElementById('botText');
  if (botTextEl) {
    botTextEl.style.opacity = 0;
    setTimeout(() => {
      botTextEl.textContent = text;
      botTextEl.style.opacity = 1;
    }, 200);
  }

  // Mouth animation
  const mouth = document.getElementById('botMouth');
  if (mouth) mouth.classList.add('talking');
  isTalking = true;

  // TTS
  if (synth) {
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1.1;
    utterance.volume = 0.85;

    // Pick a nicer voice if available
    const voices = synth.getVoices();
    const preferred = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female'));
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => {
      if (mouth) mouth.classList.remove('talking');
      isTalking = false;
      if (callback) callback();
    };

    utterance.onerror = () => {
      if (mouth) mouth.classList.remove('talking');
      isTalking = false;
    };

    // TTS sometimes needs a delay
    setTimeout(() => synth.speak(utterance), 100);
  } else {
    setTimeout(() => {
      if (mouth) mouth.classList.remove('talking');
      isTalking = false;
      if (callback) callback();
    }, text.length * 60);
  }
}

// Load voices async
if (synth) {
  synth.onvoiceschanged = () => synth.getVoices();
  synth.getVoices();
}

// ===== VOICE RECOGNITION =====
let recognition = null;
let isListening = false;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function toggleListening() {
  if (!SpeechRecognition) {
    botSpeak("Sorry, your browser doesn't support voice recognition. Try Chrome!");
    return;
  }
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  const micBtn = document.getElementById('micBtn');
  const micIcon = document.getElementById('micIcon');
  const voiceHint = document.getElementById('voiceHint');

  if (micBtn) micBtn.classList.add('listening');
  if (micIcon) micIcon.className = 'fas fa-stop';
  if (voiceHint) voiceHint.textContent = 'Listening...';
  isListening = true;

  recognition.start();

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase().trim();
    console.log('Heard:', command);
    processVoiceCommand(command);
  };

  recognition.onend = () => {
    stopListening();
  };

  recognition.onerror = (e) => {
    stopListening();
    if (e.error !== 'no-speech') {
      botSpeak("I didn't catch that. Try again!");
    }
  };
}

function stopListening() {
  isListening = false;
  const micBtn = document.getElementById('micBtn');
  const micIcon = document.getElementById('micIcon');
  const voiceHint = document.getElementById('voiceHint');

  if (micBtn) micBtn.classList.remove('listening');
  if (micIcon) micIcon.className = 'fas fa-microphone';
  if (voiceHint) voiceHint.textContent = 'Click mic to speak';

  if (recognition) {
    try { recognition.stop(); } catch(e) {}
    recognition = null;
  }
}

function processVoiceCommand(command) {
  const cmd = command.toLowerCase();

  if (cmd.includes('skill') || cmd.includes('technology') || cmd.includes('language') || cmd.includes('tech')) {
    navigateTo('skills');
  } else if (cmd.includes('project') || cmd.includes('work') || cmd.includes('build') || cmd.includes('create')) {
    navigateTo('projects');
  } else if (cmd.includes('train') || cmd.includes('intern') || cmd.includes('course') || cmd.includes('experience')) {
    navigateTo('experience');
  } else if (cmd.includes('achiev') || cmd.includes('award') || cmd.includes('google') || cmd.includes('prize')) {
    navigateTo('achievements');
  } else if (cmd.includes('edu') || cmd.includes('school') || cmd.includes('university') || cmd.includes('college') || cmd.includes('degree')) {
    navigateTo('education');
  } else if (cmd.includes('certif') || cmd.includes('certificate')) {
    navigateTo('certificates');
  } else if (cmd.includes('contact') || cmd.includes('email') || cmd.includes('reach') || cmd.includes('hire') || cmd.includes('connect') || cmd.includes('meet')) {
    navigateTo('contact');
  } else if (cmd.includes('resume') || cmd.includes('cv') || cmd.includes('download')) {
    navigateTo('resume');
  } else if (cmd.includes('home') || cmd.includes('back') || cmd.includes('go back')) {
    backToBot();
  } else if (cmd.includes('who') || cmd.includes('about') || cmd.includes('introduce') || cmd.includes('tell me about')) {
    botSpeak("Yamini is a B.Tech CSE student at LPU with a 8.71 CGPA, specializing in AI and Machine Learning. She has built projects like a Loan Default Risk Analyzer with 93.5% accuracy and was awarded by Google for AI safety work!");
  } else if (cmd.includes('hello') || cmd.includes('hi') || cmd.includes('hey')) {
    botSpeak("Hello! Great to meet you! I'm Yami, here to walk you through Yamini's amazing portfolio. What would you like to explore?");
  } else if (cmd.includes('best') || cmd.includes('highlight') || cmd.includes('impressive')) {
    botSpeak("Yamini's most impressive work includes a Loan Default Risk Analyzer with 93.5% accuracy, and she was recognized by Google for contributing to AI safety — earning over 9,500 rupees as an award!");
  } else {
    botSpeak(`I heard: "${command}". You can ask me about skills, projects, training, achievements, education, certificates, contact, or resume!`);
  }
}

// ===== PROJECT MODALS =====
const projectData = {
  loan: {
    title: "Loan Default Risk Analyzer",
    subtitle: "Financial AI · Machine Learning",
    icon: "fas fa-chart-line",
    gradient: "linear-gradient(135deg,#ff8c32,#e85d75)",
    period: "Dec 2025 – Present",
    overview: "A production-grade machine learning pipeline that predicts whether a loan applicant will default, using customer financial data and behavioral indicators.",
    highlights: [
      "Trained and compared Random Forest, XGBoost, and LightGBM algorithms",
      "Achieved maximum accuracy of 93.5% and ROC-AUC score of 0.97",
      "Optimized data preprocessing, feature selection, and model evaluation workflows",
      "Built for scalable and reliable prediction performance on real-world financial data"
    ],
    stack: ["Python", "XGBoost", "LightGBM", "Random Forest", "Pandas", "Scikit-Learn"],
    github: "https://github.com/Yamini-Soni"
  },
  gold: {
    title: "AI-Powered Gold Price Predictor",
    subtitle: "Financial AI · NLP · Real-Time Analytics",
    icon: "fas fa-coins",
    gradient: "linear-gradient(135deg,#f5c518,#ff8c32)",
    period: "Jul 2025",
    overview: "A comprehensive gold price analytics platform integrating multi-country price data, currency rates, and NLP-powered financial news sentiment analysis.",
    highlights: [
      "Consolidated multi-country gold price data through automated API pipelines (Yahoo Finance, Exchange Rate APIs)",
      "Extracted market sentiment from financial news using NLP techniques (NewsAPI)",
      "Aligned sentiment signals with short-term price movement patterns",
      "Built an interactive Streamlit dashboard with multi-market comparisons (India, USA, Dubai)"
    ],
    stack: ["Python", "NLP", "Streamlit", "Yahoo Finance API", "NewsAPI", "ML Algorithms"],
    github: "https://github.com/Yamini-Soni"
  },
  face: {
    title: "Face Recognition Attendance System",
    subtitle: "Computer Vision · Deep Learning",
    icon: "fas fa-user-circle",
    gradient: "linear-gradient(135deg,#4ecdc4,#a78bfa)",
    period: "Apr 2025",
    overview: "A real-time face recognition system using deep learning to automate attendance tracking — eliminating manual roll calls entirely.",
    highlights: [
      "Used dlib's ResNet model to generate 128-dimensional face encodings for each identity",
      "Implemented real-time face detection, encoding, and matching via webcam",
      "Achieved recognition accuracy over 90% in real-world conditions",
      "Developed a full GUI for image capture, model training, and result visualization"
    ],
    stack: ["Python", "OpenCV", "dlib", "Deep Learning", "ResNet", "GUI (Tkinter)"],
    github: "https://github.com/Yamini-Soni"
  }
};

function openProject(key) {
  const data = projectData[key];
  if (!data) return;
  const modal = document.getElementById('projectModal');
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-icon" style="background:${data.gradient}">
        <i class="${data.icon}"></i>
      </div>
      <div>
        <h2>${data.title}</h2>
        <p>${data.subtitle} · ${data.period}</p>
      </div>
    </div>
    <div class="modal-section">
      <h4>Overview</h4>
      <p>${data.overview}</p>
    </div>
    <div class="modal-section">
      <h4>What I built & how</h4>
      <ul>${data.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
    </div>
    <div class="modal-section">
      <h4>Tech Stack</h4>
      <div class="modal-tags">${data.stack.map(s => `<span>${s}</span>`).join('')}</div>
    </div>
    <a href="${data.github}" target="_blank" class="modal-link">
      <i class="fab fa-github"></i> View on GitHub
    </a>
  `;
  modal.classList.add('open');
}

function closeProject() {
  document.getElementById('projectModal').classList.remove('open');
}

// Close modal on backdrop click
document.getElementById('projectModal')?.addEventListener('click', (e) => {
  if (e.target === document.getElementById('projectModal')) closeProject();
});

// ===== BOT IDLE BEHAVIOR =====
const idleMessages = [
  "Did you know Yamini's Loan Default model hits 93.5% accuracy? Pretty impressive!",
  "Ask me about Yamini's Google achievement — she earned ₹9,540 for AI safety work!",
  "Yamini is actively looking for AI/ML internships. Check out the Contact section!",
  "Yamini scored 95.6% in her class 12 PCM exams. Top of her class!",
  "Want to see Yamini's projects? Click 'Projects' or just say it!",
  "Yamini is proficient in Python, XGBoost, OpenCV, and NLP. Ask me about her skills!",
];

let idleTimer = null;

function resetIdleTimer() {
  clearTimeout(idleTimer);
  if (document.getElementById('page-bot').classList.contains('active')) {
    idleTimer = setTimeout(() => {
      if (!isTalking && !isListening) {
        const msg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
        botSpeak(msg);
      }
      resetIdleTimer();
    }, 12000);
  }
}

document.addEventListener('click', resetIdleTimer);
document.addEventListener('keypress', resetIdleTimer);

// ===== ORBIT ANIMATION STAGGER =====
document.querySelectorAll('.orbit-item').forEach((item, i) => {
  item.style.animationDelay = `${i * 0.1}s`;
});

// ===== INIT =====
window.addEventListener('load', () => {
  // Welcome animation on home
  const heroName = document.querySelector('.hero-name');
  if (heroName) heroName.style.opacity = '0';
  setTimeout(() => {
    if (heroName) {
      heroName.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroName.style.opacity = '1';
    }
  }, 200);
});

// Trigger idle when bot page becomes visible
const botPageObserver = new MutationObserver(() => {
  if (document.getElementById('page-bot').classList.contains('active')) {
    resetIdleTimer();
  } else {
    clearTimeout(idleTimer);
  }
});
const botPage = document.getElementById('page-bot');
if (botPage) botPageObserver.observe(botPage, { attributes: true, attributeFilter: ['class'] });