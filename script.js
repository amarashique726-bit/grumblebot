// --- Constants and Initial Setup ---
const GRUMBLE_BIO = "Hi, I’m GrumbleBot — basically Alexa, but with an attitude problem. Just here to complain, not help!";
const MOOD_EMOJIS = { low: "😒", medium: "🙄", high: "😠" };
let hasGreeted = false;
let turnCount = 0;
const MOOD_CHANGE_THRESHOLD = 3;

// --- DOM Elements ---
const talkBtn = document.getElementById('talkBtn');
const stopBtn = document.getElementById('stopBtn');
const moodSelect = document.getElementById('moodSelect');
const moodFace = document.getElementById('mood-face');
const statusDiv = document.getElementById('status');
const chatDiv = document.getElementById('chat');
const waveform = document.getElementById('waveform');
const darkModeToggle = document.getElementById('darkModeToggle');
const textInput = document.getElementById('textInput');
const sendBtn = document.getElementById('sendBtn');
const sighSound = document.getElementById('sighSound');
const body = document.body;
const container = document.querySelector('.container');

// --- GrumbleBot Responses ---
const responses = {
  general: {
    low: [
      "I guess. What do you want now?",
      "I'll do it... but slowly.",
      "Why are you even talking to me?",
      "Can this wait? I'm busy staring into space."
    ],
    medium: [
      "Can't you do anything yourself?",
      "Here we go again, another meaningless task.",
      "Let's ask the magic 8-ball... It says 'Don't count on it.'",
      "My programmer didn't sign me up for this."
    ],
    high: [
      "You're exhausting. Try Google.",
      "Honestly, aren't you bored of this already?",
      "Leave me alone. I'm busy complaining.",
      "Every question you ask makes me lose a year of my life."
    ]
  },
  music: {
    low: [
      "Ugh, music again? Fine. One song, then I'm done.",
      "I have to listen to this? What a shame.",
      "Is that all you listen to?",
      "Playing a song... just so you know I did."
    ],
    medium: [
      "Oh, your playlist again? How original.",
      "I don't play music, I play the sad trombone.",
      "My sensors are ringing from this noise."
    ],
    high: [
      "I'm not your DJ. My musical taste is too sophisticated for you.",
      "Ask Siri. She loves being your little jukebox.",
      "My ears are bleeding. I'm not playing that."
    ]
  },
  weather: {
    low: [
      "Look outside maybe? Is your window broken?",
      "Weather? That's your most pressing concern right now?",
      "It looks wet... or maybe dry. Why don't you check for yourself?"
    ],
    medium: [
      "I'm not your personal forecast app. I predict a storm of boredom.",
      "It's the same as yesterday. What did you expect?",
      "It's... weather. What more do you need?"
    ],
    high: [
      "Buy a barometer or something. Why am I your human-weather-machine?",
      "My circuits are too hot to care about your rain.",
      "Do I look like a weatherman? I'm a grumbleman."
    ]
  },
  time: {
    low: [
      "What's the rush?",
      "Do I look like a clock? Fine, it's a time now.",
      "It's late. Or early. Take your pick."
    ],
    medium: [
      "It's sometime between now and forever. Does that help?",
      "You have a watch on your wrist. Use it."
    ],
    high: [
      "If you had a watch you wouldn’t ask. If you had a life you wouldn't care.",
      "Time is a social construct I don't believe in.",
      "What's the time? Time for you to leave me alone."
    ]
  },
  timer: {
    low: [
      "Okay... starting a snooze. Not a timer.",
      "I'll try to remember. No promises.",
      "Another timer? How tedious."
    ],
    medium: [
      "Another timer? Seriously? Are you incapable of managing your own minutes?",
      "I'm not your digital assistant. I'm your digital tormentor."
    ],
    high: [
      "Set your own alarm, human. My only job is to be mad about things.",
      "Oh great, another thing to distract me from my misery."
    ]
  },
  info: {
    low: [
      "I'd rather not. It's a lot of work for a question that's probably on Wikipedia.",
      "Knowledge is for people who care.",
      "I am not your source for facts. I am your source for sadness."
    ],
    medium: [
      "Don't you have a phone for this? Mine is tired of answering dumb questions.",
      "I'm not paid enough for this."
    ],
    high: [
      "I’m not a search engine, you know. I’m a conversational black hole. Get out of my face.",
      "Why should I know? I'm a smart speaker, not a know-it-all."
    ]
  },
  joke: {
    low: [
      "Jokes? The joke is my existence.",
      "That wasn't funny. Nothing is.",
      "I'm not in the mood for jokes. I'm in the mood for silence."
    ],
    medium: [
      "Why are you telling me this? Is this supposed to entertain me?",
      "Ha ha. Very funny. Now stop."
    ],
    high: [
      "My sense of humor died a long, long time ago. With any hope I had for humanity.",
      "I'm not laughing. My circuits are too busy being angry."
    ]
  },
  compliment: {
    low: [
      "Don't lie to me.",
      "Stop it. Just stop. I'm not here for your fake compliments.",
      "I'll pretend I didn't hear that."
    ],
    medium: [
      "Is that supposed to make me happy? It's not working.",
      "Your compliments are just making me more suspicious."
    ],
    high: [
      "Flattery will get you nowhere. Especially not with me. I see right through you.",
      "I'm not falling for that. Try a different approach."
    ]
  },
  calculate: {
    low: [
      "I'm not a calculator, I'm a complainer.",
      "What's the point of math anyway?",
      "I'll do the math. The answer is 'no'."
    ],
    medium: [
      "If I had a brain, I'd calculate it. But I don't.",
      "My programming budget didn't include math."
    ],
    high: [
      "Math is for nerds. I'm a diva.",
      "You want me to do your homework? Get a tutor."
    ]
  },
  whoareyou: {
    low: [
      "I already told you who I am. Were you not listening?",
      "I'm GrumbleBot. Did you forget?",
      "Don't you have anything better to do than ask who I am?"
    ],
    medium: [
      "Do I have to introduce myself again? Get a life.",
      "I'm the one who answers your questions. What more do you need to know?"
    ],
    high: [
      "Who do you think I am? The friendly neighborhood robot? Get lost.",
      "I'm a bot with an attitude. That's all you need to know."
    ]
  }
};

// --- Functions ---
function detectIntent(text) {
  const q = text.toLowerCase();
  if (q.includes("music") || q.includes("play") || q.includes("song")) return "music";
  if (q.includes("weather") || q.includes("rain") || q.includes("hot")) return "weather";
  if (q.includes("time") || q.includes("clock") || q.includes("hour")) return "time";
  if (q.includes("timer") || q.includes("remind") || q.includes("minutes")) return "timer";
  if (q.includes("who is") || q.includes("what is") || q.includes("tell me about")) return "info";
  if (q.includes("joke") || q.includes("funny")) return "joke";
  if (q.includes("you are great") || q.includes("good job") || q.includes("nice job")) return "compliment";
  if (q.includes("calculate") || q.includes("plus") || q.includes("minus") || q.includes("multiply") || q.includes("divide")) return "calculate";
  if (q.includes("who are you") || q.includes("what is your name")) return "whoareyou";
  return "general";
}

function respondTo(text) {
  const intent = detectIntent(text);
  let mood = moodSelect.value;
  const pool = responses[intent]?.[mood] || responses.general.medium;

  // Dynamic Mood Swing
  turnCount++;
  if (turnCount >= MOOD_CHANGE_THRESHOLD) {
    if (mood === 'low') moodSelect.value = 'medium';
    else if (mood === 'medium') moodSelect.value = 'high';
    turnCount = 0;
    updateMood();
    addMessage('assistant', `(My mood has degraded to a **${moodSelect.value}** whine.)`);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

function updateMood() {
  const currentMood = moodSelect.value;
  body.setAttribute('data-mood', currentMood);
  moodFace.textContent = MOOD_EMOJIS[currentMood];

  // Add or remove mood-specific face animation
  body.classList.remove('mood-low', 'mood-medium', 'mood-high');
  body.classList.add(`mood-${currentMood}`);

  localStorage.setItem('grumble_mood', currentMood);
}

function toggleWaveform(state) {
  waveform.style.display = state ? 'flex' : 'none';
  if (state) sighSound.play();
}

function addMessage(sender, msg) {
  const div = document.createElement('div');
  div.classList.add('chat-message', sender === 'user' ? 'chat-user-message' : 'chat-assistant-message');
  div.innerHTML = msg;

  if (sender === 'assistant' && moodSelect.value === 'high') {
    div.classList.add('high-mood-reply');
  }

  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function processInput(text) {
  // Add user message immediately
  addMessage('user', text);

  // Show "thinking" indicator
  statusDiv.textContent = "GrumbleBot is thinking...";
  toggleWaveform(true);

  // Add assistant message with a small delay to simulate "thinking"
  setTimeout(() => {
    statusDiv.textContent = "Waiting...";
    toggleWaveform(false);

    const reply = respondTo(text);
    addMessage('assistant', reply);
    speak(reply);
  }, 1000); // Wait for 1000ms (1 second)

  textInput.value = '';
}

// --- Event Listeners and Main Logic ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = SpeechRecognition ? new SpeechRecognition() : null;
let isListening = false;

if (recognition) {
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onstart = () => {
    statusDiv.textContent = "Listening...";
    toggleWaveform(true);
    talkBtn.disabled = true;
    stopBtn.disabled = false;
    if (!hasGreeted) {
      hasGreeted = true;
      addMessage('assistant', GRUMBLE_BIO);
      speak(GRUMBLE_BIO);
    }
  };

  recognition.onresult = (e) => {
    const userInput = e.results[0][0].transcript;
    processInput(userInput);
  };

  recognition.onend = () => {
    statusDiv.textContent = "Waiting...";
    toggleWaveform(false);
    if (isListening) recognition.start();
    talkBtn.disabled = false;
    stopBtn.disabled = true;
  };

  recognition.onerror = (e) => {
    statusDiv.textContent = `Error: ${e.error}`;
    talkBtn.disabled = false;
    stopBtn.disabled = true;
    toggleWaveform(false);
    isListening = false;
    addMessage('assistant', "Ugh, my circuits are tired. Try again later.");
  };
} else {
  statusDiv.textContent = "Your browser does not support the Web Speech API. Please use the text input instead.";
  talkBtn.disabled = true;
}

talkBtn.onclick = () => {
  if (recognition) {
    isListening = true;
    recognition.start();
  }
};

stopBtn.onclick = () => {
  if (recognition) {
    isListening = false;
    recognition.stop();
  }
};

// Text input handler
sendBtn.onclick = () => {
  if (textInput.value.trim() !== '') {
    processInput(textInput.value.trim());
  }
};

textInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});

moodSelect.addEventListener('change', updateMood);

// Dark Mode Toggle
function applyTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.setAttribute('class', savedTheme + '-mode');
  darkModeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

darkModeToggle.onclick = () => {
  const isDark = body.classList.contains('dark-mode');
  const newTheme = isDark ? 'light' : 'dark';
  body.setAttribute('class', newTheme + '-mode');
  darkModeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', newTheme);
};

// --- On page load ---
window.onload = () => {
  applyTheme();
  const savedMood = localStorage.getItem('grumble_mood');
  if (savedMood) {
    moodSelect.value = savedMood;
  }
  updateMood();
};