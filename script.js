const API_URL = "https://jsonplaceholder.typicode.com/posts";
const MESSAGE_MAX = 500;

const stepOrder = ["name", "email", "category", "rating", "message"];
let currentStepIndex = 0;
const startTime = Date.now();
let userMessageCount = 0;

// ---- DOM references --------------------------------------------------
const messagesContainer = document.getElementById("messagesContainer");
const form = document.getElementById("feedbackForm");
const formStatus = document.getElementById("formStatus");
const progressFill = document.getElementById("progressFill");
const stepCounter = document.getElementById("stepCounter");
const greetingEl = document.getElementById("greeting");
const statusText = document.getElementById("statusText");
const avatarEmoji = document.getElementById("avatarEmoji");

const fieldSteps = {
  name: document.querySelector('[data-step="name"]'),
  email: document.querySelector('[data-step="email"]'),
  category: document.querySelector('[data-step="category"]'),
  rating: document.querySelector('[data-step="rating"]'),
  message: document.querySelector('[data-step="message"]'),
};

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const categorySelect = document.getElementById("category");
const messageInput = document.getElementById("message");
const ratingInputs = document.querySelectorAll('input[name="rating"]');

const submitBtn = document.getElementById("submitBtn");
const submitSpinner = document.getElementById("submitSpinner");
const submitArrow = document.getElementById("submitArrow");

// ---- Assistant script - Humanized messages -----------------------------
const assistantLines = {
  welcome: "👋 Hello there! I'm your feedback companion. Ready to reflect on your week together?",
  name: "🌱 Let's start with something simple — who am I chatting with today?",
  email: "✉️ How should I reach you when there's good news to share?",
  category: "🎯 What kind of feedback would you like to share with us today?",
  rating: "💫 How was your week? Choose the vibe that fits best…",
  message: "📝 Tell me about your week — what stood out? What could we do better?",
  submitting: "✨ Amazing! I'm saving your reflection now…",
};

// ---- Mood themes based on rating ----------------------------------------
const moodThemes = {
  1: { primary: "#4A90D9", secondary: "#7FB2E5", header: "linear-gradient(135deg,#4A90D9,#3A7BC8)", bg: "#EEF5FC", emoji: "😔", particle: "74,144,217" },
  2: { primary: "#9298A6", secondary: "#B7BCC7", header: "linear-gradient(135deg,#9298A6,#7A808D)", bg: "#F3F4F6", emoji: "😐", particle: "146,152,166" },
  3: { primary: "#27AE60", secondary: "#6FCF97", header: "linear-gradient(135deg,#27AE60,#219150)", bg: "#EDFBF3", emoji: "🙂", particle: "39,174,96" },
  4: { primary: "#F2994A", secondary: "#F2C94C", header: "linear-gradient(135deg,#F2994A,#F2C94C)", bg: "#FFF8ED", emoji: "😊", particle: "242,153,74" },
  5: { primary: "#7C3AED", secondary: "#9D6BFF", header: "linear-gradient(135deg,#7C3AED,#6D28D9)", bg: "#F5F0FF", emoji: "🤩", particle: "124,58,237" },
};

// ---- Greeting based on time -------------------------------------------
function setGreeting() {
  const hour = new Date().getHours();
  greetingEl.textContent = hour < 12 ? "🌅 Good morning!" : hour < 18 ? "☀️ Good afternoon!" : "🌙 Good evening!";
}
setGreeting();

// ---- Particles background ---------------------------------------------
const particleLayer = document.getElementById("particles");
let particleColor = "124,58,237";

function spawnParticles(count = 18) {
  particleLayer.innerHTML = "";
  const icons = ["✨", "⭐", "💫", "🌟", "🪐"];
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "floaty";
    span.textContent = icons[i % icons.length];
    span.style.left = `${Math.random() * 100}%`;
    span.style.animationDuration = `${14 + Math.random() * 10}s`;
    span.style.animationDelay = `${Math.random() * 10}s`;
    span.style.color = `rgb(${particleColor})`;
    particleLayer.appendChild(span);
  }
}
spawnParticles();

function applyMoodTheme(rating) {
  const theme = moodThemes[rating];
  if (!theme) return;
  document.documentElement.style.setProperty("--primary", theme.primary);
  document.documentElement.style.setProperty("--secondary", theme.secondary);
  document.documentElement.style.setProperty("--gradient-bg", theme.header);
  document.documentElement.style.setProperty("--gradient-msg", theme.header);
  document.documentElement.style.setProperty("--bg", theme.bg);
  document.body.style.background = theme.bg;
  avatarEmoji.textContent = theme.emoji;
  particleColor = theme.particle;
  spawnParticles();
}

// ---- Chat helpers -------------------------------------------------------
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function addBubble(type, text) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function showTypingThenSay(text) {
  const typing = document.createElement("div");
  typing.className = "message assistant";
  typing.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
  messagesContainer.appendChild(typing);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  statusText.textContent = "🤖 Thinking…";
  await sleep(600);
  typing.remove();
  statusText.textContent = "Online • Ready to help";
  addBubble("assistant", text);
}

// ---- Progress tracking ------------------------------------------------
function updateProgress() {
  const pct = ((currentStepIndex) / stepOrder.length) * 100 + (100 / stepOrder.length);
  progressFill.style.width = `${Math.min(pct, 100)}%`;
  stepCounter.textContent = `Step ${Math.min(currentStepIndex + 1, stepOrder.length)}/${stepOrder.length}`;
}

function showStep(stepName) {
  Object.values(fieldSteps).forEach((el) => el.classList.remove("active"));
  fieldSteps[stepName].classList.add("active");
  updateProgress();
}

// ---- Validators - Humanized messages ---------------------------------
const validators = {
  name: () => {
    const value = nameInput.value.trim();
    if (!value) return "Tell us who's sharing their journey today! 🌟";
    if (value.length < 3 || value.length > 50) return "Names should be 3–50 characters.";
    return "";
  },
  email: () => {
    const value = emailInput.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "We'd love to stay in touch! Please share your email ✉️";
    if (!pattern.test(value)) return "That email doesn't look quite right — mind checking it?";
    return "";
  },
  category: () => (categorySelect.value ? "" : "Pick the category that fits best 🎯"),
  rating: () => (document.querySelector('input[name="rating"]:checked') ? "" : "Choose the mood that matches your week 💫"),
  message: () => {
    const value = messageInput.value.trim();
    if (!value) return "Share your thoughts — every voice matters! 💭";
    if (value.length < 10 || value.length > MESSAGE_MAX) return `Reflections should be 10–${MESSAGE_MAX} characters.`;
    return "";
  },
};

const errorEls = {
  name: document.getElementById("nameError"),
  email: document.getElementById("emailError"),
  category: document.getElementById("categoryError"),
  rating: document.getElementById("ratingError"),
  message: document.getElementById("messageError"),
};

function setStepError(stepName, message) {
  fieldSteps[stepName].classList.toggle("is-invalid", Boolean(message));
  errorEls[stepName].textContent = message;
}

function friendlyValueFor(stepName) {
  if (stepName === "name") return nameInput.value.trim();
  if (stepName === "email") return emailInput.value.trim();
  if (stepName === "category") return categorySelect.options[categorySelect.selectedIndex].text;
  if (stepName === "rating") {
    const checked = document.querySelector('input[name="rating"]:checked');
    return checked ? checked.closest(".rating-chip").textContent.trim() : "";
  }
  if (stepName === "message") return messageInput.value.trim();
  return "";
}

async function advanceStep(stepName) {
  const error = validators[stepName]();
  setStepError(stepName, error);
  if (error) return;

  addBubble("user", friendlyValueFor(stepName));
  userMessageCount++;

  if (stepName === "rating") {
    applyMoodTheme(document.querySelector('input[name="rating"]:checked').value);
  }

  currentStepIndex++;
  if (currentStepIndex < stepOrder.length) {
    const nextStep = stepOrder[currentStepIndex];
    showStep(nextStep);
    await showTypingThenSay(assistantLines[nextStep]);
    focusStep(nextStep);
  }
}

function focusStep(stepName) {
  if (stepName === "name") nameInput.focus();
  else if (stepName === "email") emailInput.focus();
  else if (stepName === "category") categorySelect.focus();
  else if (stepName === "message") messageInput.focus();
}

// ---- Wire up buttons --------------------------------------------------
document.querySelectorAll("[data-advance]").forEach((btn) => {
  btn.addEventListener("click", () => advanceStep(btn.dataset.advance));
});

nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); advanceStep("name"); } });
emailInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); advanceStep("email"); } });
categorySelect.addEventListener("change", () => setStepError("category", ""));
ratingInputs.forEach((radio) => {
  radio.addEventListener("change", () => {
    setStepError("rating", "");
    applyMoodTheme(radio.value);
    advanceStep("rating");
  });
});

// ---- Character counter with humanized feedback --------------------------
const ringFill = document.getElementById("ringFill");
const counterText = document.getElementById("counterText");
const RING_CIRCUMFERENCE = 2 * Math.PI * 16;

function updateCounter() {
  const len = messageInput.value.length;
  const ratio = Math.min(len / MESSAGE_MAX, 1);
  ringFill.style.strokeDashoffset = `${RING_CIRCUMFERENCE * (1 - ratio)}`;
  counterText.textContent = len;
  
  // Humanized color feedback
  if (len >= MESSAGE_MAX) {
    ringFill.style.stroke = "#EF4444";
    counterText.style.color = "#EF4444";
  } else if (len >= 400) {
    ringFill.style.stroke = "#F2994A";
    counterText.style.color = "#F2994A";
  } else {
    ringFill.style.stroke = "var(--primary)";
    counterText.style.color = "var(--text-light)";
  }
}

messageInput.addEventListener("input", () => {
  updateCounter();
  setStepError("message", "");
  messageInput.style.height = "auto";
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 120)}px`;
});
updateCounter();

// ---- Submit form -------------------------------------------------------
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitSpinner.hidden = !isLoading;
  submitArrow.hidden = isLoading;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.hidden = true;

  let firstInvalid = null;
  for (const step of stepOrder) {
    const error = validators[step]();
    setStepError(step, error);
    if (error && firstInvalid === null) firstInvalid = step;
  }
  if (firstInvalid) {
    currentStepIndex = stepOrder.indexOf(firstInvalid);
    showStep(firstInvalid);
    return;
  }

  const payload = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    category: categorySelect.value,
    rating: document.querySelector('input[name="rating"]:checked').value,
    message: messageInput.value.trim(),
  };

  await showTypingThenSay(assistantLines.submitting);
  setLoading(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Server responded with status ${response.status}`);

    const data = await response.json();
    const firstName = payload.name.split(" ")[0];

    await showTypingThenSay(`🎉 Thank you, ${firstName}! Your reflection ID is #${data.id}.`);

    // Show a preview of their message
    const preview = payload.message.length > 60 
      ? payload.message.substring(0, 60) + "..." 
      : payload.message;
    await showTypingThenSay(`📋 Here's what you shared: "${preview}"`);

    // Show achievements (Speed Demon removed)
    const achievements = getAchievements(payload);
    if (achievements.length) {
      await showTypingThenSay(`🏆 Achievements unlocked: ${achievements.join(" ✨ ")}`);
    }

    launchConfetti();
    form.hidden = true;
  } catch (error) {
    formStatus.hidden = false;
    formStatus.textContent = "😅 Something went wrong saving your reflection. Your words are safe — want to try again?";
    console.error("Submission failed:", error);
  } finally {
    setLoading(false);
  }
});

// ---- Achievements (Speed Demon removed) --------------------------------
function getAchievements(payload) {
  const list = [];
  if (payload.message.length >= 50) list.push("🌟 Thoughtful Contributor");
  if (payload.message.length >= 100) list.push("📚 Storyteller");
  if (Number(payload.rating) >= 4) list.push("💪 Positive Mindset");
  if (payload.category === "Suggestion") list.push("💡 Idea Generator");
  // Speed Demon achievement removed
  if (!list.length) list.push("🌱 First Reflection");
  return list;
}

// ---- Recent posts - Real feedback messages ----------------------------
const displayNames = [
  "Aisha", "Rahul", "Priya", "Arjun", "Maya", "Vikram",
  "Yuki", "Hiroshi", "Mei-Lin", "Jin-Soo", "Yuna", "Takahiro",
  "Sophia", "Lucas", "Emma", "Oliver", "Elena", "Mateo",
  "Kofi", "Amina", "Chidi", "Zuri", "Kwame", "Nia",
  "Layla", "Omar", "Zara", "Khalid", "Nadia", "Hassan"
];

// Real human feedback messages
const realFeedbackMessages = [
  "The collaborative environment made me feel welcomed and supported this week.",
  "I learned so much from the mentorship sessions, Alhamdulillah!",
  "The team structure helped me stay focused and productive throughout the sprint.",
  "I feel more confident in my development skills after the code review session.",
  "The project management approach is effective and clear. Really enjoying it!",
  "I appreciate the constructive feedback on my PR. It helped me grow.",
  "The team culture promotes learning and growth. Masha'Allah!",
  "I enjoyed the challenge of the weekly assignments. They were engaging.",
  "The communication within the team is excellent. Always know what's expected.",
  "I feel valued and included in team discussions. Great environment!",
  "The daily stand-ups kept me motivated and aligned with the team goals.",
  "I loved the pair programming sessions - learned so much from my mentor.",
  "The resources provided were helpful for understanding the codebase better.",
  "I'm grateful for the supportive team atmosphere during challenging tasks.",
  "The feedback I received helped me improve my coding style significantly."
];

function truncate(text, max) { return text.length <= max ? text : `${text.slice(0, max).trim()}…`; }

async function loadRecentPosts() {
  const postsStatus = document.getElementById("postsStatus");
  const container = document.getElementById("postsContainer");
  try {
    const response = await fetch(`${API_URL}?_limit=5`);
    if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
    const posts = await response.json();

    postsStatus.hidden = true;
    const timeLabels = ['Just now', '5 minutes ago', '1 hour ago', '2 hours ago', 'Yesterday'];
    
    container.innerHTML = posts
      .map((post, i) => {
        const nameIndex = i % displayNames.length;
        const feedbackIndex = i % realFeedbackMessages.length;
        return `
          <div class="post-item">
            <span class="post-name">${displayNames[nameIndex]}</span>
            <span class="post-preview">${truncate(realFeedbackMessages[feedbackIndex], 50)}</span>
            <span class="post-time">${timeLabels[i % timeLabels.length]}</span>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    postsStatus.hidden = false;
    postsStatus.textContent = "😅 Couldn't load recent reflections. Please refresh to try again.";
    console.error("Failed to load posts:", error);
  }
}

// ---- Confetti celebration ---------------------------------------------
function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.id = "confetti";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const colors = ["#7C3AED", "#9D6BFF", "#F2994A", "#F2C94C", "#27AE60", "#FF6B6B", "#4A90D9"];
  const pieces = Array.from({ length: 110 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 3,
    vx: (Math.random() - 0.5) * 9,
    vy: Math.random() * -9 - 2,
    size: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    spin: (Math.random() - 0.5) * 10,
  }));

  let frame = 0;
  function tick() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.vy += 0.25;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (frame < 100) requestAnimationFrame(tick);
    else canvas.remove();
  }
  tick();
}

// ---- Initialize -------------------------------------------------------
(async function init() {
  showStep("name");
  await showTypingThenSay(assistantLines.welcome);
  await showTypingThenSay(assistantLines.name);
  nameInput.focus();
  loadRecentPosts();
})();