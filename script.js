const loadingScreen = document.getElementById("loadingScreen");
const introScreen = document.getElementById("introScreen");
const enterButton = document.getElementById("enterButton");
const room = document.getElementById("room");
const roomImage = document.getElementById("roomImage");
const roomCanvas = document.getElementById("roomCanvas");
const focusTransition = document.getElementById("focusTransition");

/* ============================= */
/* COKE EASTER EGG */
/* ============================= */

const cokeHotspot = document.createElement("button");
cokeHotspot.id = "cokeHotspot";
cokeHotspot.type = "button";
cokeHotspot.setAttribute("aria-label", "Coke");
cokeHotspot.setAttribute("aria-describedby", "cokeComment");

const cokeComment = document.createElement("span");
cokeComment.id = "cokeComment";
cokeComment.textContent = "ahhh minum lagi";
cokeComment.setAttribute("aria-hidden", "true");

Object.assign(cokeHotspot.style, {
  position: "absolute",
  left: "18.5%",
  top: "47.5%",
  width: "5.5%",
  height: "10%",
  zIndex: "75",
  padding: "0",
  margin: "0",
  border: "0",
  outline: "none",
  background: "transparent",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  touchAction: "manipulation"
});

Object.assign(cokeComment.style, {
  position: "absolute",
  left: "16.2%",
  top: "44.5%",
  zIndex: "76",
  display: "block",
  width: "max-content",
  maxWidth: "none",
  margin: "0",
  padding: "6px 10px",
  color: "#30271d",
  background: "#f5e7b7",
  border: "1px solid rgba(80, 62, 37, 0.18)",
  borderRadius: "3px",
  boxShadow: "0 3px 8px rgba(0,0,0,.28)",
  fontFamily: "'Courier New', monospace",
  fontSize: "clamp(10px, 1vw, 14px)",
  fontWeight: "600",
  lineHeight: "1",
  letterSpacing: "0.01em",
  whiteSpace: "nowrap",
  opacity: "0",
  visibility: "hidden",
  transform: "translateY(5px) rotate(-2deg)",
  transition: "opacity .18s ease, transform .18s ease, visibility .18s ease",
  pointerEvents: "none"
});

roomCanvas.appendChild(cokeHotspot);
roomCanvas.appendChild(cokeComment);

let cokeCommentTimer = null;

function showCokeComment(autoHide = false) {
  clearTimeout(cokeCommentTimer);

  cokeComment.style.visibility = "visible";
  cokeComment.style.opacity = "1";
  cokeComment.style.transform = "translateY(0) rotate(-2deg)";
  cokeComment.setAttribute("aria-hidden", "false");

  if (autoHide) {
    cokeCommentTimer = setTimeout(() => {
      hideCokeComment();
    }, 2200);
  }
}

function hideCokeComment() {
  clearTimeout(cokeCommentTimer);

  cokeComment.style.opacity = "0";
  cokeComment.style.transform = "translateY(5px) rotate(-2deg)";
  cokeComment.setAttribute("aria-hidden", "true");

  cokeCommentTimer = setTimeout(() => {
    if (cokeComment.style.opacity === "0") {
      cokeComment.style.visibility = "hidden";
    }
  }, 180);
}

const cokeCanHover = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

if (cokeCanHover) {
  cokeHotspot.addEventListener("pointerenter", () => {
    showCokeComment(false);
  });

  cokeHotspot.addEventListener("pointerleave", () => {
    hideCokeComment();
  });

  cokeHotspot.addEventListener("focus", () => {
    showCokeComment(false);
  });

  cokeHotspot.addEventListener("blur", () => {
    hideCokeComment();
  });
} else {
  cokeHotspot.addEventListener("pointerup", (event) => {
    event.preventDefault();
    event.stopPropagation();
    showCokeComment(true);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!cokeHotspot.contains(event.target)) {
      hideCokeComment();
    }
  });
}

/* ============================= */
/* SOUND */
/* ============================= */

let audioContext = null;
let soundEnabled = true;

const soundButton = document.getElementById("soundButton");

function initAudio() {
  if (!audioContext) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioContext = new AudioContext();
  }

  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playTone(
  frequency = 440,
  duration = 0.08,
  volume = 0.025,
  type = "sine",
  delay = 0
) {
  if (!soundEnabled || !audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  const start = audioContext.currentTime + delay;

  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playClick() {
  playTone(620, 0.05, 0.018, "sine");
}

function playComputerSound() {
  playTone(220, 0.1, 0.02, "sine");
  playTone(370, 0.12, 0.018, "sine", 0.07);
  playTone(530, 0.18, 0.015, "sine", 0.15);
}

function playTVSound() {
  playTone(90, 0.07, 0.03, "square");
}

function playTypingSound() {
  playTone(760 + Math.random() * 130, 0.025, 0.006, "square");
}

function playFoundSound(count) {
  const frequency = 360 + count * 75;
  playTone(frequency, 0.1, 0.018, "sine");
}

function playFinalChime() {
  playTone(330, 0.8, 0.022, "sine");
  playTone(440, 0.9, 0.02, "sine", 0.22);
  playTone(660, 1.1, 0.018, "sine", 0.5);
}

soundButton.addEventListener("click", () => {
  initAudio();
  soundEnabled = !soundEnabled;

  if (soundEnabled) {
    soundButton.textContent = "◉ sound on";
    soundButton.classList.remove("muted");
    playClick();
  } else {
    soundButton.textContent = "○ sound off";
    soundButton.classList.add("muted");
  }
});

/* ============================= */
/* STARTUP */
/* ============================= */

function finishLoading() {
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    introScreen.classList.remove("hidden");
  }, 1500);
}

if (document.readyState === "complete") {
  finishLoading();
} else {
  window.addEventListener("load", finishLoading, { once: true });
}

enterButton.addEventListener("click", () => {
  initAudio();

  playTone(250, 0.12, 0.02, "sine");
  playTone(410, 0.28, 0.012, "sine", 0.08);

  introScreen.classList.add("hidden");
  room.classList.add("visible");
});

/* ============================= */
/* DESKTOP ROOM MOVEMENT */
/* ============================= */

if (window.matchMedia("(pointer: fine)").matches) {
  document.addEventListener("mousemove", () => {
    if (room.classList.contains("final-reveal-active")) return;
  });
}

/* ============================= */
/* MODALS */
/* ============================= */

const modalMap = {
  computer: document.getElementById("computerModal"),
  tv: document.getElementById("tvModal"),
  panda: document.getElementById("pandaModal"),
  laptop: document.getElementById("laptopModal"),
  note: document.getElementById("noteModal")
};

const hotspots = document.querySelectorAll(".hotspot");
const canHover = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;

let openingHotspot = false;

/* ============================= */
/* RESET ROOM FOCUS */
/* ============================= */

function clearRoomFocus() {
  room.classList.remove(
    "focus-computer",
    "focus-tv",
    "focus-laptop",
    "focus-panda",
    "focus-note"
  );

  roomImage.style.transform = "";
}

/* ============================= */
/* OPEN HOTSPOT */
/* ============================= */

function openHotspot(hotspot) {
  if (openingHotspot) return;

  const item = hotspot.dataset.item;
  const modal = modalMap[item];

  if (!modal) return;

  openingHotspot = true;

  hotspots.forEach((itemHotspot) => {
    itemHotspot.classList.remove("active");
  });

  initAudio();
  playClick();

  room.classList.add(`focus-${item}`);
  focusTransition.classList.add("active");

  if (item === "computer") playComputerSound();
  if (item === "tv") playTVSound();

  setTimeout(() => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    markFound(item);

    clearRoomFocus();
    focusTransition.classList.remove("active");
    openingHotspot = false;

    try {
      runModalExperience(item);
    } catch (error) {
      console.error(`Error opening ${item}:`, error);
    }
  }, 220);
}

/* ============================= */
/* HOTSPOT POINTER EVENTS */
/* ============================= */

hotspots.forEach((hotspot) => {
  if (canHover) {
    hotspot.addEventListener("pointerenter", () => {
      hotspots.forEach((itemHotspot) => {
        itemHotspot.classList.remove("active");
      });

      hotspot.classList.add("active");
    });

    hotspot.addEventListener("pointerleave", () => {
      hotspot.classList.remove("active");
    });
  }

  hotspot.addEventListener("pointerdown", () => {
    hotspots.forEach((itemHotspot) => {
      itemHotspot.classList.remove("active");
    });
  });

  hotspot.addEventListener("pointerup", (event) => {
    event.preventDefault();

    hotspots.forEach((itemHotspot) => {
      itemHotspot.classList.remove("active");
    });

    openHotspot(hotspot);
  });

  hotspot.addEventListener("pointercancel", () => {
    hotspot.classList.remove("active");
  });
});

/* ============================= */
/* INDIVIDUAL EXPERIENCES */
/* ============================= */

function runModalExperience(item) {
  if (item === "computer") runComputerBoot();
  if (item === "tv") runTVSequence();
  if (item === "laptop") runAIConversation();
  if (item === "panda") resetPanda();
}

/* ============================= */
/* COMPUTER BOOT */
/* ============================= */

const computerBoot = document.getElementById("computerBoot");

function runComputerBoot() {
  computerBoot.classList.remove("finished");

  /*
    While the Windows boot screen is visible, prepare Pictures.
    Faris never sees this work happening.
  */
  if (typeof prepareAllPictures === "function") {
    prepareAllPictures();
  }

  setTimeout(() => {
    computerBoot.classList.add("finished");
  }, 1400);
}

/* ============================= */
/* VIDEO DETECTION */
/* ============================= */

const birthdayVideo = document.getElementById("birthdayVideo");
const videoFallback = document.getElementById("videoFallback");

birthdayVideo.addEventListener("loadedmetadata", () => {
  birthdayVideo.classList.add("ready");
  videoFallback.classList.add("video-ready");
});

/* ============================= */
/* AI CONVERSATION */
/* ============================= */

const laptopModal = document.getElementById("laptopModal");
const aiConversation = document.getElementById("aiConversation");
const aiRevealMessages = document.querySelectorAll(
  "#aiConversation .reveal-message"
);

let aiTimers = [];
let aiCloseTimer = null;

const aiMessageDelays = [
  1000,
  2600,
  4200,
  5500,
  7000,
  8800,
  10400,
  12100,
  13700,
  15300,
  16900,
  18500,
  20400,
  22100,
  23900,
  25800,
  27500,
  29200,
  31000,
  32800
];

function clearAITimers() {
  aiTimers.forEach((timer) => clearTimeout(timer));
  aiTimers = [];

  if (aiCloseTimer) {
    clearTimeout(aiCloseTimer);
    aiCloseTimer = null;
  }
}

function closeLaptopAutomatically() {
  if (!laptopModal.classList.contains("open")) return;

  laptopModal.classList.remove("open");
  laptopModal.setAttribute("aria-hidden", "true");

  clearRoomFocus();
  focusTransition.classList.remove("active");
  openingHotspot = false;

  hotspots.forEach((hotspot) => {
    hotspot.style.pointerEvents = "";
    hotspot.disabled = false;
    hotspot.classList.remove("active");
  });

  if (foundItems.size === 5 && !finalShown) {
    setTimeout(() => {
      startFinalReveal();
    }, 350);
  }
}

function scrollAIToMessage(message) {
  const conversationRect = aiConversation.getBoundingClientRect();
  const messageRect = message.getBoundingClientRect();

  const currentTop = aiConversation.scrollTop;
  const targetTop =
    currentTop +
    messageRect.bottom -
    conversationRect.bottom +
    28;

  if (messageRect.bottom > conversationRect.bottom - 20) {
    aiConversation.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth"
    });
  }
}

function runAIConversation() {
  clearAITimers();

  aiRevealMessages.forEach((message) => {
    message.classList.remove("revealed");
  });

  aiConversation.scrollTop = 0;

  aiRevealMessages.forEach((message, index) => {
    const delay = aiMessageDelays[index] ?? 1000 + index * 1700;

    const timer = setTimeout(() => {
      message.classList.add("revealed");
      playTypingBurst();

      setTimeout(() => {
        scrollAIToMessage(message);
      }, 120);

      if (index === aiRevealMessages.length - 1) {
        aiCloseTimer = setTimeout(() => {
          closeLaptopAutomatically();
        }, 3000);
      }
    }, delay);

    aiTimers.push(timer);
  });
}

function playTypingBurst() {
  if (!soundEnabled) return;

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      playTypingSound();
    }, i * 35);
  }
}

/* ============================= */
/* PANDA / OREO DELIVERY */
/* ============================= */

const openPandaDelivery = document.getElementById("openPandaDelivery");
const pandaMessage = document.getElementById("pandaMessage");
const pandaDelivery = document.querySelector(".panda-delivery");
const pandaCharacter = document.querySelector(".panda-character");
const oreoLabel = document.querySelector(".oreo-label");
const deliveryDetails = document.querySelector(".delivery-details");
const pandaEyebrow = document.querySelector(
  ".panda-delivery .eyebrow"
);

function resetPanda() {
  pandaMessage.classList.add("hidden");
  openPandaDelivery.classList.remove("hidden");

  pandaCharacter.classList.remove("hidden");
  oreoLabel.classList.remove("hidden");
  deliveryDetails.classList.remove("hidden");
  pandaEyebrow.classList.remove("hidden");

  if (pandaDelivery) {
    pandaDelivery.scrollTop = 0;
  }
}

openPandaDelivery.addEventListener("click", () => {
  playClick();

  pandaEyebrow.classList.add("hidden");
  pandaCharacter.classList.add("hidden");
  oreoLabel.classList.add("hidden");
  deliveryDetails.classList.add("hidden");
  openPandaDelivery.classList.add("hidden");

  pandaMessage.classList.remove("hidden");

  playTone(520, 0.1, 0.015, "sine");
  playTone(690, 0.14, 0.013, "sine", 0.08);

  if (pandaDelivery) {
    pandaDelivery.scrollTop = 0;
  }
});

/* ============================= */
/* CLOSE MODALS */
/* ============================= */

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");

    if (!modal) return;

    playClick();

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    if (modal === laptopModal) {
      clearAITimers();
    }

    if (birthdayVideo && !birthdayVideo.paused) {
      birthdayVideo.pause();
    }

    clearRoomFocus();
    focusTransition.classList.remove("active");
    openingHotspot = false;

    hotspots.forEach((hotspot) => {
      hotspot.style.pointerEvents = "";
      hotspot.disabled = false;
      hotspot.classList.remove("active");
    });

    if (foundItems.size === 5 && !finalShown) {
      setTimeout(() => {
        startFinalReveal();
      }, 350);
    }
  });
});

/* ============================= */
/* HELP */
/* ============================= */

const helpButton = document.getElementById("helpButton");
const helpModal = document.getElementById("helpModal");

helpButton.addEventListener("click", () => {
  playClick();

  helpModal.classList.add("open");
  helpModal.setAttribute("aria-hidden", "false");
});

/* ============================= */
/* CLOCK */
/* ============================= */

const computerTime = document.getElementById("computerTime");
const taskbarTime = document.getElementById("taskbarTime");

function updateClock() {
  const now = new Date();

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  computerTime.textContent = time;
  taskbarTime.textContent = time;
}

updateClock();
setInterval(updateClock, 30000);

/* ============================= */
/* DISCOVERIES */
/* ============================= */

const foundItems = new Set();
const progressText = document.getElementById("progressText");
const progressDots = document.querySelectorAll(
  ".progress-dots span"
);

function markFound(item) {
  if (foundItems.has(item)) return;

  foundItems.add(item);

  const count = foundItems.size;

  progressText.textContent = `${count} / 5 found`;

  progressDots.forEach((dot, index) => {
    if (index < count) {
      dot.classList.add("found");
    }
  });

  playFoundSound(count);
}

/* ============================= */
/* COMPUTER APPS */
/* ============================= */

const appWindow = document.getElementById("appWindow");
const appTitle = document.getElementById("appTitle");
const appContent = document.getElementById("appContent");
const closeApp = document.getElementById("closeApp");

closeApp.addEventListener("click", () => {
  playClick();
  appWindow.classList.remove("open");
});

/* ============================= */
/* FINAL REVEAL */
/* ============================= */

const finalModal = document.getElementById("finalModal");
const finalCounter = document.getElementById("finalCounter");
const finalHeading = document.getElementById("finalHeading");
const finalSubtext = document.getElementById("finalSubtext");
const openFinalButton = document.getElementById("openFinalButton");
const birthdayMessage = document.getElementById("birthdayMessage");
const closeBirthdayMessage = document.getElementById(
  "closeBirthdayMessage"
);

let finalShown = false;

const replayBirthdayButton = document.createElement("button");
replayBirthdayButton.id = "replayBirthdayButton";
replayBirthdayButton.textContent = "♡ birthday message";

Object.assign(replayBirthdayButton.style, {
  position: "absolute",
  right: "20px",
  bottom: "55px",
  zIndex: "80",
  padding: "9px 13px",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: "999px",
  background: "rgba(0,0,0,0.42)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color: "white",
  fontFamily: "monospace",
  fontSize: "9px",
  cursor: "pointer",
  opacity: "0",
  visibility: "hidden",
  transition: "opacity .4s ease"
});

room.appendChild(replayBirthdayButton);

function showBirthdayReplayButton() {
  replayBirthdayButton.style.visibility = "visible";

  requestAnimationFrame(() => {
    replayBirthdayButton.style.opacity = "0.72";
  });
}

function restoreRoomAfterFinal() {
  room.classList.remove(
    "final-reveal-active",
    "final-lights",
    "focus-computer",
    "focus-tv",
    "focus-laptop",
    "focus-panda",
    "focus-note"
  );

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modal.style.pointerEvents = "";
  });

  appWindow.classList.remove("open");
  focusTransition.classList.remove("active");
  openingHotspot = false;

  hotspots.forEach((hotspot) => {
    hotspot.disabled = false;
    hotspot.style.pointerEvents = "auto";
    hotspot.classList.remove("active");
  });

  roomImage.style.transform = "";
  room.style.pointerEvents = "auto";

  showBirthdayReplayButton();
}

function startFinalReveal() {
  if (finalShown) return;

  finalShown = true;

  document.querySelectorAll(".modal.open").forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });

  appWindow.classList.remove("open");

  room.classList.add("final-reveal-active", "final-lights");

  finalModal.classList.add("open");
  finalModal.setAttribute("aria-hidden", "false");

  finalCounter.textContent = "5 / 5 FOUND";
  finalHeading.textContent = "";
  finalSubtext.textContent = "";

  finalCounter.classList.remove("visible");
  finalHeading.classList.remove("visible", "fade");
  finalSubtext.classList.remove("visible");
  openFinalButton.classList.remove("visible");

  playFinalChime();

  setTimeout(() => {
    finalCounter.classList.add("visible");
  }, 350);

  setTimeout(() => {
    finalHeading.textContent = "you actually found everything...";
    finalHeading.classList.add("visible");
  }, 1000);

  setTimeout(() => {
    finalSubtext.textContent = "of course you did. nosy.";
    finalSubtext.classList.add("visible");
  }, 2400);

  setTimeout(() => {
    finalSubtext.classList.remove("visible");
  }, 3350);

  setTimeout(() => {
    finalSubtext.textContent = "theres one more thing, sayang.";
    finalSubtext.classList.add("visible");
  }, 3900);

  setTimeout(() => {
    openFinalButton.classList.add("visible");
  }, 4700);
}

openFinalButton.addEventListener("click", () => {
  playClick();

  finalModal.classList.remove("open");
  finalModal.setAttribute("aria-hidden", "true");
  room.classList.remove("final-reveal-active", "final-lights");
  birthdayMessage.classList.remove("hidden");
});

closeBirthdayMessage.addEventListener("click", () => {
  playClick();

  birthdayMessage.classList.add("hidden");
  restoreRoomAfterFinal();
});

replayBirthdayButton.addEventListener("click", () => {
  playClick();
  birthdayMessage.classList.remove("hidden");
});
