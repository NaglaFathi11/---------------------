// عناصر واجهة المستخدم
const welcomeScreen = document.getElementById("welcome-screen");
const sectionScreen = document.getElementById("section-screen");
const quizScreen = document.getElementById("quiz-screen");
const languageScreen = document.getElementById("language-screen");
const resultScreen = document.getElementById("result-screen");
const nextSectionScreen = document.getElementById("next-section-screen");

let currentSection = null;
let questionIndex = 0;
let currentQuestions = [];
let completedSections = new Set();
let timerInterval = null;

// أسئلة تجريبية لكل محور
const questions = {
  behavior: [
    { q: "سؤال جدارات سلوكية 1؟", options: ["أ", "ب", "ج"], answer: 0 },
    { q: "سؤال جدارات سلوكية 2؟", options: ["أ", "ب", "ج"], answer: 1 }
  ],
  job: [
    { q: "سؤال جدارات وظيفية 1؟", options: ["أ", "ب", "ج"], answer: 0 }
  ],
  iq_images: [
    { q: "سؤال ذكاء صور 1؟", options: ["أ", "ب"], answer: 0 }
  ],
  iq_sequences: [
    { q: "سؤال ذكاء متتاليات 1؟", options: ["1", "2"], answer: 1 }
  ],
  lang_ar: [
    { q: "سؤال عربي 1؟", options: ["أ", "ب"], answer: 0 }
  ],
  lang_en: [
    { q: "English Q1?", options: ["A", "B"], answer: 1 }
  ],
  general: [
    { q: "سؤال معلومات عامة 1؟", options: ["أ", "ب"], answer: 0 }
  ],
  computer: [
    { q: "سؤال حاسب 1؟", options: ["أ", "ب"], answer: 0 }
  ],
  specialization: [
    { q: "سؤال تخصص 1؟", options: ["أ", "ب"], answer: 1 }
  ]
};

// بدء الامتحان من شاشة الترحيب
function startExam() {
  welcomeScreen.classList.add("hidden");
  sectionScreen.classList.remove("hidden");
}

// بدء أي محور
function startSection(sectionId) {
  if (completedSections.has(sectionId)) return; // لا يبدأ لو تم من قبل

  currentSection = sectionId;
  questionIndex = 0;

  // حالة خاصة لـ IQ: يبدأ بالصور
  if (sectionId === "iq") {
    currentQuestions = [...questions.iq_images];
  } else if (sectionId === "language") {
    sectionScreen.classList.add("hidden");
    languageScreen.classList.remove("hidden");
    return;
  } else {
    currentQuestions = [...questions[sectionId]];
  }

  sectionScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  showQuestion();
  startTimer(60); // 60 ثانية كمثال
}

// عرض السؤال الحالي
function showQuestion() {
  const container = document.getElementById("question-container");
  const q = currentQuestions[questionIndex];
  container.innerHTML = `
    <div>${q.q}</div>
    ${q.options.map((opt, i) => `<button onclick="nextQuestion(${i})">${opt}</button>`).join("<br>")}
  `;
}

// التالي
function nextQuestion(selected) {
  questionIndex++;
  if (questionIndex < currentQuestions.length) {
    showQuestion();
  } else {
    clearInterval(timerInterval);

    // لو في IQ (صور → متتاليات)
    if (currentSection === "iq" && currentQuestions === questions.iq_images) {
      currentQuestions = [...questions.iq_sequences];
      questionIndex = 0;
      showQuestion();
      startTimer(60);
      return;
    }

    completedSections.add(currentSection);
    showNextSectionScreen();
  }
}

// المؤقت
function startTimer(seconds) {
  const timerEl = document.getElementById("timer");
  let time = seconds;
  timerEl.textContent = `الوقت: ${time}`;
  timerInterval = setInterval(() => {
    time--;
    timerEl.textContent = `الوقت: ${time}`;
    if (time <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

// شاشة "انتهى المحور"
function showNextSectionScreen() {
  quizScreen.classList.add("hidden");
  languageScreen.classList.add("hidden");
  nextSectionScreen.classList.remove("hidden");

  const allSections = ["behavior","job","iq","language","general","computer","specialization"];
  const currentIndex = allSections.indexOf(currentSection);
  const nextId = allSections[currentIndex + 1];

  if (nextId) {
    const nextEl = document.querySelector(`#${nextId} img`);
    const nextName = document.querySelector(`#${nextId} li`).textContent;

    nextSectionScreen.innerHTML = `
      <h2>انتهى المحور</h2>
      <p>المحور القادم:</p>
      <img src="${nextEl.src}" alt="${nextName}">
      <h3>${nextName}</h3>
      <button onclick="goToSectionScreen()">الذهاب لاختيار المحور</button>
    `;
  } else {
    nextSectionScreen.innerHTML = `<h2>انتهت كل المحاور ✅</h2>`;
  }

  // تعطيل المحور اللي خلص
  document.querySelector(`#${currentSection} li`).classList.remove("active_test");
  document.querySelector(`#${currentSection} li`).classList.add("disactive_test");
}

// رجوع لقائمة المحاور
function goToSectionScreen() {
  nextSectionScreen.classList.add("hidden");
  sectionScreen.classList.remove("hidden");
}

// أحداث اختيار المحاور
document.querySelectorAll(".test_description").forEach(item => {
  item.addEventListener("click", () => {
    startSection(item.id);
  });
});

// أحداث اختيار اللغة
document.getElementById("lang-ar").addEventListener("click", () => {
  currentSection = "lang_ar";
  currentQuestions = [...questions.lang_ar];
  questionIndex = 0;
  languageScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  showQuestion();
  startTimer(60);
});

document.getElementById("lang-en").addEventListener("click", () => {
  currentSection = "lang_en";
  currentQuestions = [...questions.lang_en];
  questionIndex = 0;
  languageScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  showQuestion();
  startTimer(60);
});
