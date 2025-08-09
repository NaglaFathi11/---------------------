// =================== إعدادات الأسئلة ===================
const allQuestions = {
  behavior: [
    {
      q: "ما هي عاصمة مصر؟",
      options: ["القاهرة", "الإسكندرية", "الأقصر", "أسوان"],
      answer: 0,
    },
    {
      q: "ما هو أكبر نهر في العالم؟",
      options: ["النيل", "الأمازون", "الدانوب", "اليانغتسي"],
      answer: 1,
    },
  ],
  job: [
    { q: "ما هو دورك في الوظيفة؟", options: ["إدارة", "دعم"], answer: 0 },
  ],
  iq_images: [
    { q: "اختر الصورة المناسبة للنمط", options: ["A", "B", "C", "D"], answer: 2 },
  ],
  iq_sequences: [
    { q: "اكمل: 2, 4, 6, ?", options: ["7", "8", "9", "10"], answer: 1 },
  ],
  arabic: [
    { q: "مرادف \"ذكي\"؟", options: ["غبي", "نبيه", "كسول", "مغرور"], answer: 1 },
  ],
  english: [
    { q: "Synonym of 'smart'?", options: ["Dumb", "Clever", "Lazy", "Mean"], answer: 1 },
  ],
  general: [
    { q: "أين تقع الأهرامات؟", options: ["القاهرة", "الجيزة", "الأقصر"], answer: 1 },
  ],
  computer_ar: [
    { q: "ما هو نظام التشغيل؟", options: ["ويندوز", "ورد"], answer: 0 },
  ],
  computer_en: [
    { q: "What is an OS?", options: ["Windows", "Excel"], answer: 0 },
  ],
  specialization: [
    { q: "ما هي لغة تصميم المواقع؟", options: ["HTML", "C++"], answer: 0 },
  ],
};

const sectionOrder = [
  "behavior",
  "job",
  "iq_images",
  "iq_sequences",
  "arabic",
  "english",
  "general",
  "computer_ar",
  "specialization",
];

let currentSectionIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let timer;
let sectionDone = {
  arabic: false,
  english: false,
};

// ================ بداية الامتحان ===================
function startExam() {
  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("start-button").style.display = "none";
  document.getElementById("section-screen").classList.remove("hidden");
}

function startBehaviorTest() {
  document.getElementById("section-screen").classList.add("hidden");
  launchQuiz("behavior");
}

function launchQuiz(sectionKey) {
  currentSection = sectionKey;
  currentQuestionIndex = 0;
  score = 0;
  showQuizScreen();
  loadQuestion();
  startTimer();
}

function showQuizScreen() {
  document.getElementById("quiz-screen").classList.remove("hidden");
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("next-section-screen").classList.add("hidden");
}

function loadQuestion() {
  const question = allQuestions[currentSection][currentQuestionIndex];
  const container = document.getElementById("question-container");
  container.innerHTML = `
    <p>${question.q}</p>
    ${question.options
      .map(
        (opt, i) =>
          `<label><input type="radio" name="answer" value="${i}" /> ${opt}</label><br />`
      )
      .join("")}
  `;
}

function nextQuestion() {
  const selected = document.querySelector("input[name='answer']:checked");
  if (selected) {
    const value = parseInt(selected.value);
    if (value === allQuestions[currentSection][currentQuestionIndex].answer) {
      score++;
    }
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < allQuestions[currentSection].length) {
    loadQuestion();
  } else {
    endQuiz();
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") nextQuestion();
});

function startTimer() {
  clearInterval(timer);
  const totalQuestions = allQuestions[currentSection].length;
  let time = totalQuestions * 30; // 30 ثانية للسؤال
  const timerDiv = document.getElementById("timer");

  timerDiv.textContent = `الوقت: ${time}`;

  timer = setInterval(() => {
    time--;
    timerDiv.textContent = `الوقت: ${time}`;
    if (time <= 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timer);
  document.getElementById("quiz-screen").classList.add("hidden");

  // لو كفايات لغوية
  if (currentSection === "arabic" || currentSection === "english") {
    sectionDone[currentSection] = true;
    if (sectionDone.arabic && sectionDone.english) {
      nextSection();
    } else {
      showLanguageChoice();
      return;
    }
  }

  document.getElementById("result-screen").classList.remove("hidden");
  setTimeout(() => showNextSectionScreen(), 1000);
}

function showNextSectionScreen() {
  document.getElementById("result-screen").classList.add("hidden");
  const screen = document.getElementById("next-section-screen");
  screen.classList.remove("hidden");
  screen.innerHTML = `
    <h2>انتهى المحور: ${translateSection(currentSection)}</h2>
    <p>يبدأ المحور التالي خلال <span id="countdown">5</span> ثواني</p>
    <button onclick="nextSection()">ابدأ الآن</button>
  `;
  let c = 5;
  const countdown = setInterval(() => {
    c--;
    document.getElementById("countdown").textContent = c;
    if (c === 0) {
      clearInterval(countdown);
      nextSection();
    }
  }, 1000);
}

function nextSection() {
  document.getElementById("next-section-screen").classList.add("hidden");
  currentSectionIndex++;
  const next = sectionOrder[currentSectionIndex];
  if (!next) {
    alert("انتهت جميع المحاور!");
    return;
  }
  if (next === "arabic" || next === "english") {
    showLanguageChoice();
  } else {
    launchQuiz(next);
  }
}

function showLanguageChoice() {
  const container = document.getElementById("result-screen");
  container.classList.remove("hidden");
  container.innerHTML = `
    <h2>اختر اختبار اللغة:</h2>
    <button onclick="launchQuiz('arabic')" ${
      sectionDone.arabic ? "disabled" : ""
    }>اختبار العربي</button>
    <button onclick="launchQuiz('english')" ${
      sectionDone.english ? "disabled" : ""
    }>اختبار الإنجليزي</button>
  `;
}

function translateSection(key) {
  const map = {
    behavior: "جدارات سلوكية",
    job: "جدارات وظيفية",
    iq_images: "اختبار صور",
    iq_sequences: "اختبار متتاليات",
    arabic: "كفايات لغوية - عربي",
    english: "كفايات لغوية - إنجليزي",
    general: "معلومات عامة",
    computer_ar: "حاسب عربي",
    computer_en: "حاسب إنجليزي",
    specialization: "التخصص",
  };
  return map[key] || key;
}
