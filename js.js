const allQuestions = {
  behavior: [
    { q: "ما هي عاصمة مصر؟", options: ["القاهرة", "الإسكندرية", "الأقصر", "أسوان"], answer: 0 },
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
    { q: "مرادف 'ذكي'؟", options: ["غبي", "نبيه", "كسول", "مغرور"], answer: 1 },
  ],
  english: [
    { q: "Synonym of 'smart'?", options: ["Dumb", "Clever", "Lazy", "Mean"], answer: 1 },
  ],
  general: [
    { q: "أين تقع الأهرامات؟", options: ["القاهرة", "الجيزة", "الأقصر"], answer: 1 },
  ],
  computer: [
    { q: "ما هو نظام التشغيل؟", options: ["ويندوز", "ورد"], answer: 0 },
  ],
  specialization: [
    { q: "ما هي لغة تصميم المواقع؟", options: ["HTML", "C++"], answer: 0 },
  ],
};

const sectionOrder = ["behavior", "job", "iq", "language", "general", "computer", "specialization"];

let currentSectionIndex = 0;
let currentQuestionIndex = 0;
let currentSection = "";
let score = 0;
let timer;
let completedSections = {};

function startExam() {
  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("section-screen").classList.remove("hidden");
  document.querySelectorAll(".test_description").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.id;
      if (!completedSections[id]) startSection(id);
    });
  });
}

function startSection(id) {
  if (id === "iq") {
    currentSection = "iq_images";
    startQuiz();
  } else if (id === "language") {
    showLanguageChoice();
  } else {
    currentSection = id;
    startQuiz();
  }
}

function startQuiz() {
  document.getElementById("section-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  loadQuestion();
}

function loadQuestion() {
  const q = allQuestions[currentSection][currentQuestionIndex];
  document.getElementById("question-container").innerHTML = `
    <p>${q.q}</p>
    ${q.options.map((opt, i) => `<label><input type="radio" name="answer" value="${i}"> ${opt}</label><br>`).join("")}
  `;
}

function nextQuestion() {
  const selected = document.querySelector("input[name='answer']:checked");
  if (selected && parseInt(selected.value) === allQuestions[currentSection][currentQuestionIndex].answer) {
    score++;
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < allQuestions[currentSection].length) {
    loadQuestion();
  } else {
    if (currentSection === "iq_images") {
      currentSection = "iq_sequences";
      currentQuestionIndex = 0;
      loadQuestion();
    } else {
      endQuiz();
    }
  }
}

function endQuiz() {
  completedSections[currentSection] = true;
  if (currentSection === "iq_sequences") completedSections["iq"] = true;
  if (currentSection === "arabic" || currentSection === "english") {
    if (completedSections["arabic"] && completedSections["english"]) {
      showNextSection();
    } else {
      showLanguageChoice();
    }
  } else {
    showNextSection();
  }
}

function showNextSection() {
  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("next-section-screen").classList.remove("hidden");
  const nextSectionId = sectionOrder.find(s => !completedSections[s]);
  if (!nextSectionId) {
    document.getElementById("next-section-screen").innerHTML = `<h2>انتهت جميع المحاور</h2>`;
    return;
  }
  document.getElementById("next-section-screen").innerHTML = `
    <h2>انتهى المحور</h2>
    <p>المحور التالي:</p>
    <div class="test_description">
      <img src="${document.getElementById(nextSectionId).querySelector("img").src}" />
      <li class="active_test">${document.getElementById(nextSectionId).querySelector("li").textContent}</li>
    </div>
    <button onclick="startSection('${nextSectionId}')">ابدأ الآن</button>
  `;
}

function showLanguageChoice() {
  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");
  document.getElementById("result-screen").innerHTML = `
    <h2>اختر اختبار اللغة:</h2>
    <div class="language-icons">
      <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Flag_of_Egypt.svg" 
           width="100" onclick="currentSection='arabic'; startQuiz()" ${completedSections["arabic"] ? "style='opacity:0.5;pointer-events:none;'" : ""}>
      <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" 
           width="100" onclick="currentSection='english'; startQuiz()" ${completedSections["english"] ? "style='opacity:0.5;pointer-events:none;'" : ""}>
    </div>
  `;
}
