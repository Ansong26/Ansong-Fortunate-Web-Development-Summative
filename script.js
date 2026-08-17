/* Application data: every answer adds points to one or more BSE profiles. */
const PROFILES = {
  low: { label: "Low-Level Programming", short: "Systems", colour: "#4ed6be", feedback: "You enjoy understanding what happens beneath the interface and making software efficient, reliable and close to the machine.", next: "Try a small C or C++ exercise, then explore how memory, processors and operating systems work." },
  ar: { label: "AR/VR", short: "Immersive", colour: "#9b8cff", feedback: "You are drawn to visual, spatial and human-centred experiences where technology feels immediate and expressive.", next: "Experiment with a simple 3D scene or prototype a user journey for an immersive learning experience." },
  web: { label: "Full-Stack Web Development", short: "Web", colour: "#ff8f82", feedback: "You like turning an idea into a useful product that people can access, test and improve through the web.", next: "Build a small responsive page, then add a form, storage or a simple API-backed feature." },
  ml: { label: "Machine Learning", short: "Intelligence", colour: "#68a6ff", feedback: "You enjoy finding patterns, asking evidence-based questions and using data to make better predictions or decisions.", next: "Explore a beginner dataset and explain one pattern you find before writing any model code." }
};

/* Quiz configuration separates question content from the rendering engine. */
const QUESTIONS = [
  { text: "When you face a difficult technical problem, what sounds most satisfying?", help: "Choose the response that feels most natural to you.", options: [{ label: "Tracing the precise cause in the system", scores: { low: 3, ml: 1 } }, { label: "Sketching the experience a person should have", scores: { ar: 3, web: 1 } }, { label: "Making a useful feature work end to end", scores: { web: 3, low: 1 } }, { label: "Looking for a pattern in the evidence", scores: { ml: 3, web: 1 } }] },
  { text: "Which result would make you most proud after a group project?", help: "There is no wrong answer: this measures preference, not ability.", options: [{ label: "A fast, dependable technical core", scores: { low: 3 } }, { label: "A memorable 3D or interactive demonstration", scores: { ar: 3 } }, { label: "A polished service classmates can use today", scores: { web: 3 } }, { label: "A model that explains a useful pattern", scores: { ml: 3 } }] },
  { text: "Choose a pathway on the map that you would like to explore first.", help: "Click or use the keyboard to select a labelled pathway.", type: "hotspot", options: [{ label: "Systems", scores: { low: 3 } }, { label: "Immersive", scores: { ar: 3 } }, { label: "Web", scores: { web: 3 } }, { label: "Intelligence", scores: { ml: 3 } }] },
  { text: "A user says an app feels confusing. What would you investigate first?", help: "Think about the evidence you would want before proposing a change.", options: [{ label: "Whether the program is wasting resources", scores: { low: 2, web: 1 } }, { label: "How the visuals and movement guide attention", scores: { ar: 3 } }, { label: "Which step stops users finishing their task", scores: { web: 3 } }, { label: "Whether usage data reveals a consistent issue", scores: { ml: 3 } }] },
  { text: "Watch the short scenario. At the pause, choose the development priority you notice.", help: "The video pauses automatically at the decision point; resume it after selecting an answer.", type: "video", options: [{ label: "Make the underlying process faster and safer", scores: { low: 3 } }, { label: "Make the visual interaction more engaging", scores: { ar: 3 } }, { label: "Make the journey clearer for a typical user", scores: { web: 3 } }, { label: "Measure what users do before deciding", scores: { ml: 3 } }] },
  { text: "Which learning activity would you volunteer for?", help: "Choose the activity you would genuinely enjoy practising.", options: [{ label: "Optimising a program with limited resources", scores: { low: 3 } }, { label: "Designing a virtual exhibition", scores: { ar: 3 } }, { label: "Creating a student portal feature", scores: { web: 3 } }, { label: "Cleaning and visualising a data set", scores: { ml: 3 } }] },
  { text: "When a solution works, what is your next instinct?", help: "Your answer helps identify your preferred way to improve software.", options: [{ label: "Check its reliability in edge cases", scores: { low: 3 } }, { label: "See how it feels and looks in use", scores: { ar: 3 } }, { label: "Connect it to the rest of the product", scores: { web: 3 } }, { label: "Compare its outcome with more data", scores: { ml: 3 } }] },
  { text: "Which future problem would you be most excited to help solve?", help: "Pick the project that would make you want to learn more.", options: [{ label: "A robust tool that runs reliably on constrained devices", scores: { low: 3 } }, { label: "An interactive experience that makes learning tangible", scores: { ar: 3 } }, { label: "A web service that simplifies a real student task", scores: { web: 3 } }, { label: "A data-informed system that spots useful trends", scores: { ml: 3 } }] }
];

/* Central state prevents disconnected global variables and makes resets predictable. */
const state = { profile: {}, answers: Array(QUESTIONS.length).fill(null), questionIndex: 0, secondsLeft: 10, timerId: null, startedAt: 0, locked: false, timedOut: false, videoPauseShown: false };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

/* Regex rules meet the assessment's custom name, institution and phone requirements. */
const RULES = {
  fullName: { test: (value) => /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,60}$/.test(value.trim()), message: "Use 2-60 letters, spaces, apostrophes or hyphens only." },
  email: { test: (value) => /^[a-z]{1}\.[a-z]+@alustudent\.com$/i.test(value.trim()), message:"Use your ALU email, for example f.lastname@alustudent.com." },
  phone: { test: (value) => /^(?:\+230[ -]?)?[245789]\d{3}[ -]?\d{4}$/.test(value.trim()), message: "Use a valid Mauritian number, e.g. +230 5123 4567." },
  goal: { test: (value) => value.trim().length >= 12 && value.trim().length <= 180, message: "Write a goal between 12 and 180 characters." },
  contactName: { test: (value) => /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,60}$/.test(value.trim()), message: "Use 2-60 letters, spaces, apostrophes or hyphens only." },
  contactEmail: { test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()), message: "Enter a valid email address." },
  message: { test: (value) => value.trim().length >= 15 && value.trim().length <= 500, message: "Write a message between 15 and 500 characters." }
};

/* Validation updates the input class and its adjacent live error message together. */
function validateField(input) {
  const rule = RULES[input.name];
  const valid = rule.test(input.value);
  input.classList.toggle("is-valid", valid); input.classList.toggle("is-invalid", !valid);
  $("#" + input.getAttribute("aria-describedby")).textContent = valid ? "" : rule.message;
  return valid;
}
function wireValidation(form) { form.querySelectorAll("input, textarea").forEach((input) => input.addEventListener("input", () => validateField(input))); }
function validateForm(form) { return [...form.querySelectorAll("input, textarea")].map(validateField).every(Boolean); }

/* View routing preserves one-page simplicity while exposing the required four views. */
function showView(id) {
  $$(".view").forEach((view) => { const active = view.id === id; view.hidden = !active; view.classList.toggle("is-visible", active); });
  $$(".nav-link").forEach((link) => link.classList.toggle("is-active", link.dataset.viewTarget === id));
  if (id === "results") requestAnimationFrame(() => animateChart(state.scores));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* Starting and resetting maintain a single timer and clean quiz state. */
function resetQuiz() {
  clearInterval(state.timerId); Object.assign(state, { answers: Array(QUESTIONS.length).fill(null), questionIndex: 0, secondsLeft: 120, timerId: null, startedAt: 0, locked: false, timedOut: false, videoPauseShown: false, scores: null });
}
function startQuiz(event) {
  event.preventDefault();
  const form = $("#profile-form"); if (!validateForm(form)) return;
  state.profile = Object.fromEntries(new FormData(form)); resetQuiz(); state.startedAt = Date.now();
  $$("[data-view-target='quiz'], [data-view-target='results']").forEach((button) => { button.disabled = false; });
  showView("quiz"); renderQuestion(); startTimer();
}

/* Timer uses setInterval/clearInterval and locks the interface immediately on expiry. */
function startTimer() {
  clearInterval(state.timerId); updateTimer();
  state.timerId = setInterval(() => { state.secondsLeft -= 1; updateTimer(); if (state.secondsLeft <= 0) finishByTimeout(); }, 1000);
}
function updateTimer() { const minutes = Math.floor(state.secondsLeft / 60); const seconds = String(state.secondsLeft % 60).padStart(2, "0"); $("#timer").textContent = `${minutes}:${seconds}`; }
function finishByTimeout() { state.timedOut = true; state.locked = true; clearInterval(state.timerId); $("#timeout-banner").hidden = false; submitQuiz(); }

/* Rendering uses generated buttons so options are keyboard-accessible and data-driven. */
function renderQuestion() {
  const question = QUESTIONS[state.questionIndex]; const selected = state.answers[state.questionIndex];
  $("#question-counter").textContent = `Question ${state.questionIndex + 1} of ${QUESTIONS.length}`; $("#progress-bar").style.width = `${((state.questionIndex + 1) / QUESTIONS.length) * 100}%`;
  $("#quiz-title").textContent = question.text; $("#question-help").textContent = question.help;
  renderMedia(question); const options = $("#answer-options"); options.innerHTML = "";
  question.options.forEach((option, index) => { const button = document.createElement("button"); button.type = "button"; button.className = "answer-option" + (selected === index ? " is-selected" : ""); button.setAttribute("role", "radio"); button.setAttribute("aria-checked", String(selected === index)); button.textContent = option.label; button.disabled = state.locked; button.addEventListener("click", () => chooseAnswer(index)); options.append(button); });
  $("#previous-question").disabled = state.questionIndex === 0 || state.locked; const next = $("#next-question"); next.disabled = selected === null || state.locked; next.textContent = state.questionIndex === QUESTIONS.length - 1 ? "See my results →" : "Next question →";
}
function chooseAnswer(index) { if (state.locked) return; state.answers[state.questionIndex] = index; renderQuestion(); }

/* Media renderer adds two rubric media types with clean, scoped listeners. */
function renderMedia(question) {
  const media = $("#question-media"); media.innerHTML = "";
  if (question.type === "hotspot") {
    const wrap = document.createElement("div"); wrap.className = "hotspot-wrap"; wrap.innerHTML = '<img class="hotspot-map" src="assets/images/specialisation-map.svg" alt="Four selectable BSE pathways: Systems, Immersive, Web and Intelligence.">';
    [["low", 0], ["ar", 1], ["web", 2], ["ml", 3]].forEach(([choice, index]) => { const button = document.createElement("button"); button.type = "button"; button.className = "hotspot" + (state.answers[state.questionIndex] === index ? " is-selected" : ""); button.dataset.choice = choice; button.textContent = question.options[index].label; button.disabled = state.locked; button.addEventListener("click", () => chooseAnswer(index)); wrap.append(button); }); media.append(wrap);
  }
  if (question.type === "video") {
    const card = document.createElement("div"); card.className = "media-card"; card.innerHTML = '<video id="scenario-video" controls preload="metadata"><source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">Your browser cannot play this video.</video><p id="video-prompt" class="media-prompt" hidden>Decision point reached. Select an answer, then resume the video if you wish.</p>';
    const video = card.querySelector("video"); video.addEventListener("timeupdate", () => { if (!state.videoPauseShown && video.currentTime >= 2.5) { state.videoPauseShown = true; video.pause(); card.querySelector("#video-prompt").hidden = false; } }); media.append(card);
  }
}

/* Quiz navigation keeps an answer available when students review earlier questions. */
function nextQuestion() { if (state.answers[state.questionIndex] === null || state.locked) return; if (state.questionIndex === QUESTIONS.length - 1) { submitQuiz(); return; } state.questionIndex += 1; renderQuestion(); }
function previousQuestion() { if (state.questionIndex === 0 || state.locked) return; state.questionIndex -= 1; renderQuestion(); }

/* Scoring combines category sums with transparent speed and consecutive-choice bonuses. */
function calculateScores() {
  const scores = Object.fromEntries(Object.keys(PROFILES).map((key) => [key, 0])); let previousTop = null; let streak = 0;
  state.answers.forEach((answerIndex, questionIndex) => { if (answerIndex === null) return; const answer = QUESTIONS[questionIndex].options[answerIndex]; const top = Object.entries(answer.scores).sort((a, b) => b[1] - a[1])[0][0]; streak = top === previousTop ? streak + 1 : 1; previousTop = top; Object.entries(answer.scores).forEach(([profile, value]) => { scores[profile] += value + (streak >= 2 && profile === top ? .5 : 0); }); });
  const answered = state.answers.filter((answer) => answer !== null).length; const speedBonus = !state.timedOut && answered === QUESTIONS.length ? Math.max(0, Math.min(2, state.secondsLeft / 60)) : 0; const winner = Object.keys(scores).reduce((best, key) => scores[key] > scores[best] ? key : best, "low"); scores[winner] += speedBonus;
  return { scores, answered, speedBonus, winner };
}
function submitQuiz() { if (!state.locked) { state.locked = true; clearInterval(state.timerId); } const result = calculateScores(); state.scores = result.scores; const total = Object.values(result.scores).reduce((sum, value) => sum + value, 0); const percent = total ? Math.round((result.scores[result.winner] / total) * 100) : 0; const profile = PROFILES[result.winner]; $("#result-percent").textContent = `${percent}%`; $("#results-title").textContent = profile.label; $("#result-feedback").textContent = `${state.profile.fullName}, ${profile.feedback}`; $("#recommendation-text").textContent = profile.next; $("#score-detail").textContent = `${result.answered}/8 questions answered${result.speedBonus ? ` · ${result.speedBonus.toFixed(1)} speed bonus added` : ""}${state.timedOut ? " · Time expired, so unanswered questions were recorded as blank." : ""}`; showView("results"); }

/* Canvas animation draws a responsive radar chart without any external library. */
function animateChart(scores) {
  if (!scores) return; const canvas = $("#profile-chart"); const context = canvas.getContext("2d"); const ratio = window.devicePixelRatio || 1; const cssWidth = canvas.clientWidth; canvas.width = Math.round(cssWidth * ratio); canvas.height = Math.round(Math.min(cssWidth * .62, 500) * ratio); context.scale(ratio, ratio); const width = cssWidth; const height = canvas.height / ratio; const values = Object.keys(PROFILES).map((key) => scores[key]); const max = Math.max(10, ...values); const start = performance.now();
  function draw(now) { const progress = Math.min(1, (now - start) / 700); context.clearRect(0, 0, width, height); const cx = width / 2, cy = height / 2 + 12, radius = Math.min(width, height) * .31; const keys = Object.keys(PROFILES); context.lineWidth = 1; context.strokeStyle = "#dce1ed"; for (let ring = 1; ring <= 4; ring++) { context.beginPath(); keys.forEach((key, index) => { const angle = -Math.PI / 2 + index * Math.PI / 2; const x = cx + Math.cos(angle) * radius * ring / 4, y = cy + Math.sin(angle) * radius * ring / 4; index ? context.lineTo(x, y) : context.moveTo(x, y); }); context.closePath(); context.stroke(); } context.font = "700 13px system-ui"; context.fillStyle = "#5f6f88"; context.textAlign = "center"; keys.forEach((key, index) => { const angle = -Math.PI / 2 + index * Math.PI / 2; const x = cx + Math.cos(angle) * (radius + 28), y = cy + Math.sin(angle) * (radius + 28) + 5; context.fillText(PROFILES[key].short, x, y); }); context.beginPath(); keys.forEach((key, index) => { const angle = -Math.PI / 2 + index * Math.PI / 2; const value = (scores[key] / max) * radius * progress; const x = cx + Math.cos(angle) * value, y = cy + Math.sin(angle) * value; index ? context.lineTo(x, y) : context.moveTo(x, y); }); context.closePath(); context.fillStyle = "rgba(104,87,233,.25)"; context.fill(); context.strokeStyle = "#6857e9"; context.lineWidth = 3; context.stroke(); if (progress < 1) requestAnimationFrame(draw); } requestAnimationFrame(draw);
}

/* Contact form reuses the validator but stays local because no server is required. */
function submitFeedback(event) { event.preventDefault(); const form = event.currentTarget; if (!validateForm(form)) return; $("#feedback-success").hidden = false; form.reset(); form.querySelectorAll("input, textarea").forEach((field) => field.classList.remove("is-valid")); }

/* Initial listeners are registered once after DOM parsing completes. */
document.addEventListener("DOMContentLoaded", () => { wireValidation($("#profile-form")); wireValidation($("#feedback-form")); $("#profile-form").addEventListener("submit", startQuiz); $("#feedback-form").addEventListener("submit", submitFeedback); $("#next-question").addEventListener("click", nextQuestion); $("#previous-question").addEventListener("click", previousQuestion); $("#restart-quiz").addEventListener("click", () => { resetQuiz(); showView("landing"); }); $$('[data-view-target]').forEach((button) => button.addEventListener("click", () => { if (!button.disabled) showView(button.dataset.viewTarget); })); window.addEventListener("resize", () => { if (!$("#results").hidden) animateChart(state.scores); }); });
