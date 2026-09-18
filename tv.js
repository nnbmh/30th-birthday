(() => {
  const tvModal = document.getElementById("tvModal");
  const tvPower = document.getElementById("tvPower");
  const tvStatic = document.getElementById("tvStatic");
  const tvBroadcast = document.getElementById("tvBroadcast");
  const newsScreen = document.getElementById("newsScreen");
  const newsNextButton = document.getElementById("newsNextButton");
  const newsTickerText = document.getElementById("newsTickerText");
  const birthdayVideo = document.getElementById("birthdayVideo");
  const videoFallback = document.getElementById("videoFallback");

  let currentNewsSlide = 0;
  let tvTimers = [];
  let slideTimer = null;
  let slideStartedAt = 0;
  let slideRemaining = 0;
  let isPaused = false;
  let tvSequenceToken = 0;

  /* =========================================================
     PRELOAD BBN NEWSROOM
     Prevents the anchor background flashing/glitching the
     first time an anchor slide appears.
     ========================================================= */

  const anchorImage = new Image();
  let anchorImageReady = false;

  const anchorImagePromise = new Promise((resolve) => {
    const finish = () => {
      anchorImageReady = true;
      resolve();
    };

    anchorImage.onload = async () => {
      if (typeof anchorImage.decode === "function") {
        try {
          await anchorImage.decode();
        } catch (error) {}
      }

      finish();
    };

    anchorImage.onerror = finish;
    anchorImage.src = "assets/bbn-anchor.png";

    if (anchorImage.complete && anchorImage.naturalWidth > 0) {
      if (typeof anchorImage.decode === "function") {
        anchorImage.decode().catch(() => {}).finally(finish);
      } else {
        finish();
      }
    }
  });

  /* Also ask the browser to begin fetching it immediately. */
  if (!document.querySelector('link[data-bbn-anchor-preload]')) {
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "image";
    preload.href = "assets/bbn-anchor.png";
    preload.dataset.bbnAnchorPreload = "true";
    document.head.appendChild(preload);
  }

  const tickerHeadlines = [
    "FARIS TURNS 30",
    "BREAKING NEWS FROM THE UNITED KINGDOM",
    "SAYANG MONITORING SITUATION FROM MILES AWAY",
    "BIRTHDAY BOY REPORTED TO BE IN GOOD SPIRITS",
    "RANDOM OBJECTS ADVISED TO REMAIN VIGILANT",
    "MUSICAL IDENTIFICATION RATE REMAINS ANNOYINGLY HIGH",
    "LATE-NIGHT DISCORD ACTIVITY CONTINUES",
    "MORE BIRTHDAY COVERAGE TO FOLLOW"
  ];

  function anchorScene({
    label,
    headline,
    subline,
    lowerLabel,
    lowerHeadline,
    lowerSubline = "",
    camera = "camera-wide"
  }) {
    return `
      <div class="news-slide">
        <div class="broadcast-scene">
          <div class="studio-camera ${camera}">
            <div class="studio-side-panel">
              <p class="small-label">${label}</p>
              <h2>${headline}</h2>
              ${subline ? `<p>${subline}</p>` : ""}
            </div>
          </div>

          <div class="anchor-label">BBN NEWSROOM • LIVE</div>

          <div class="lower-third">
            <div class="lower-breaking">${lowerLabel}</div>
            <div class="lower-main"><h1>${lowerHeadline}</h1></div>
            ${lowerSubline ? `<div class="lower-sub">${lowerSubline}</div>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  function observationCard(title, text) {
    return `
      <div style="
        padding:22px 24px;
        border:1px solid rgba(255,255,255,.13);
        background:rgba(255,255,255,.045);
      ">
        <span style="
          display:block;
          margin-bottom:13px;
          color:#e3c454;
          font-size:10px;
          font-weight:900;
          letter-spacing:.12em;
          text-transform:uppercase;
        ">${title}</span>

        <p style="
          margin:0;
          color:rgba(255,255,255,.9);
          font-size:clamp(14px,1.4vw,18px);
          line-height:1.48;
        ">${text}</p>
      </div>
    `;
  }

  const slides = [
    {
      intro: true,
      duration: 3000,
      html: `
        <div class="news-slide bbn-opening-slide">
          <div class="bbn-opening">
            <div class="bbn-opening-grid"></div>
            <div class="bbn-opening-sweep sweep-one"></div>
            <div class="bbn-opening-sweep sweep-two"></div>

            <div class="bbn-globe" aria-hidden="true">
              <div class="globe-ring globe-ring-one"></div>
              <div class="globe-ring globe-ring-two"></div>
              <div class="globe-ring globe-ring-three"></div>
              <div class="globe-axis"></div>
            </div>

            <div class="bbn-opening-copy">
              <div class="bbn-opening-network">
                <span class="bbn-opening-live-dot"></span>
                <span>BABOY BROADCASTING NETWORK</span>
              </div>

              <div class="bbn-opening-logo">BBN</div>
              <div class="bbn-opening-rule"></div>
              <p class="bbn-opening-special">SPECIAL REPORT</p>
              <h1>BREAKING NEWS</h1>
            </div>

            <div class="bbn-opening-bottom">
              <span>18 SEP 2026</span>
              <span>BBN NEWSROOM</span>
            </div>
          </div>
        </div>
      `
    },

    {
      duration: 4500,
      html: anchorScene({
        label: "LIVE • UNITED KINGDOM",
        headline: "FARIS TURNS 30",
        subline: "Birthday celebrations are officially underway.",
        lowerLabel: "BIRTHDAY WATCH",
        lowerHeadline: "Special coverage now live",
        lowerSubline: "Singapore correspondent closely monitoring developments",
        camera: "camera-wide"
      })
    },

    {
      duration: 4500,
      html: `
        <div class="news-slide">
          <div class="news-package" style="padding-top:48px;">
            <span class="package-kicker" style="margin-bottom:30px;">
              BBN SPECIAL REPORT
            </span>

            <h1 class="package-title" style="
              max-width:900px;
              margin-bottom:24px;
              font-size:clamp(42px,5vw,66px);
              line-height:.98;
            ">
              THE FARIS FILES
            </h1>

            <div style="
              position:relative;
              z-index:2;
              width:min(780px,75%);
              height:4px;
              margin:0 0 28px;
              background:#e3c454;
            "></div>

            <p class="package-copy" style="
              max-width:850px;
              margin:0;
              font-size:clamp(17px,1.8vw,23px);
              line-height:1.45;
            ">
              Our investigation into the birthday boy has uncovered several behaviours that experts have described as... uniquely Faris.
            </p>
          </div>
        </div>
      `
    },

    {
      duration: 5000,
      html: `
        <div class="news-slide">
          <div class="profile-package">
            <div class="subject-visual">
              <span class="subject-status">SUBJECT IDENTIFIED</span>

              <div class="subject-name">
                <strong>FARIS</strong>
                <span>United Kingdom • Age 30</span>
              </div>
            </div>

            <div class="profile-data">
              <h2>SUBJECT PROFILE</h2>

              <div class="profile-row">
                <strong>age</strong>
                <span>30</span>
              </div>

              <div class="profile-row">
                <strong>location</strong>
                <span>United Kingdom</span>
              </div>

              <div class="profile-row">
                <strong>known weaknesses</strong>
                <span>steak, cheese, Coke, McSpicy</span>
              </div>

              <div class="profile-row">
                <strong>musical knowledge</strong>
                <span>suspiciously extensive</span>
              </div>

              <div class="profile-row">
                <strong>time required to do anything</strong>
                <span>longer than necessary</span>
              </div>

              <div class="profile-row">
                <strong>chewing random objects</strong>
                <span>concerning</span>
              </div>

              <div class="profile-row">
                <strong>relationship status</strong>
                <span>very taken</span>
              </div>
            </div>
          </div>
        </div>
      `
    },

    {
      duration: 4500,
      html: anchorScene({
        label: "DEVELOPING",
        headline: "Random objects remain at risk",
        subline: "Investigators continue to examine unusual chewing behaviour.",
        lowerLabel: "DEVELOPING",
        lowerHeadline: "Random objects advised to remain vigilant",
        camera: "camera-medium"
      })
    },

    {
      duration: 5000,
      html: `
        <div class="news-slide">
          <div class="news-package" style="padding-top:48px;">
            <span class="package-kicker" style="margin-bottom:30px;">
              BBN EXCLUSIVE • SINGAPORE
            </span>

            <h1 class="package-title" style="
              max-width:900px;
              margin-bottom:24px;
              font-size:clamp(42px,5vw,66px);
              line-height:.98;
            ">
              THINGS SAYANG HAS<br>
              LEARNED ABOUT FARIS
            </h1>

            <div style="
              position:relative;
              z-index:2;
              width:min(780px,75%);
              height:4px;
              margin:0 0 28px;
              background:#e3c454;
            "></div>

            <p class="package-copy" style="
              max-width:850px;
              margin:0;
              font-size:clamp(17px,1.8vw,23px);
              line-height:1.45;
            ">
              Following extensive observation, several findings about the birthday boy have now been documented.
            </p>
          </div>
        </div>
      `
    },

    {
      duration: 16000,
      html: `
        <div class="news-slide">
          <div class="info-board" style="
            padding:30px 42px 34px;
            overflow:hidden;
          ">
            <p class="board-kicker" style="margin-bottom:24px;">
              SAYANG'S FINDINGS • PART ONE
            </p>

            <h2 style="
              margin:0 0 24px;
              padding-bottom:16px;
              font-size:clamp(30px,3.7vw,46px);
            ">
              EVERYDAY FARIS
            </h2>

            <div style="
              display:grid;
              grid-template-columns:repeat(2,1fr);
              gap:16px;
              margin-top:4px;
            ">
              ${observationCard(
                "FOOD RULES",
                "he'll eat pretty much anything... except tomatoes. sardines and tuna are also a definite no, although other fish might be acceptable depending on how it's cooked. and do not offer him Coke Zero as a replacement for Coke."
              )}

              ${observationCard(
                "THE MISSING VAPE",
                "somehow his vape is always missing...
                where did he leave it this time? nobody knows."
              )}

              ${observationCard(
                "TOMORROW'S PROBLEM",
                "the dishes can apparently wait until tomorrow. according to Faris anyway."
              )}

              ${observationCard(
                "SLEEPING NEXT TO FARIS",
                "he snores loudly and somehow manages to occupy about 3/4 of the bed. 
                Sayang survives on the remaining 1/4."
              )}
            </div>
          </div>
        </div>
      `
    },

    {
      duration: 16000,
      html: `
        <div class="news-slide">
          <div class="info-board" style="
            padding:30px 42px 34px;
            overflow:hidden;
          ">
            <p class="board-kicker" style="margin-bottom:24px;">
              SAYANG'S FINDINGS • PART TWO
            </p>

            <h2 style="
              margin:0 0 24px;
              padding-bottom:16px;
              font-size:clamp(30px,3.7vw,46px);
            ">
              THE THINGS SHE NOTICES
            </h2>

            <div style="
              display:grid;
              grid-template-columns:repeat(3,1fr);
              gap:16px;
              margin-top:4px;
            ">
              ${observationCard(
                "WHEN HES COOKING",
                "every now and then he'll randomly start singing while he's cooking... which i've gotten very used to by now."
              )}

              ${observationCard(
                "THAT LITTLE HEART",
                "sometimes he'll just smile at me and make that little heart with his thumb and index finger. i already know exactly what he means when he does it."
              )}

              ${observationCard(
                "WHEN WE'RE WATCHING SHOWS",
                "he'll get completely focused on what's happening and start making all these little expressions without realising it. whenever i catch one i find cute, i take a screenshot.<br><br><span style='color:rgba(255,255,255,.65);'>he says they look ugly... i keep taking them anyway.</span>"
              )}
            </div>
          </div>
        </div>
      `
    },

    {
      duration: 4500,
      html: anchorScene({
        label: "CULTURE DESK",
        headline: "Unusual musical ability identified",
        subline: "Recognition rate remains suspiciously high.",
        lowerLabel: "ANALYSIS",
        lowerHeadline: "Musical identification rate",
        lowerSubline: "annoyingly high",
        camera: "camera-medium"
      })
    },

    {
      duration: 4500,
      html: `
        <div class="news-slide">
          <div class="music-card">
            <span class="package-kicker">BBN ARCHIVE</span>
            <h2>ARCHIVED AUDIO TRANSCRIPT</h2>

            <div class="music-transcript">
              ♪ Di mana dia, anak baboy saya? ♪<br>
              ♪ Di mana dia, buah hati saya? ♪
            </div>

            <p>
              The performance is believed to be an unauthorised adaptation of
              <em>Chan Mali Chan</em>.
            </p>

            <p>No legal action has been taken.</p>
          </div>
        </div>
      `
    },

    {
      duration: 4500,
      html: `
        <div class="news-slide">
          <div class="info-board numbers-board">
            <p class="board-kicker">BBN DATA DESK</p>
            <h2>FARIS BY THE NUMBERS</h2>

            <div class="info-row">
              <span>countries explored together</span>
              <strong>4</strong>
            </div>

            <div class="info-row">
              <span>distance between Faris & Sayang</span>
              <strong>miles away</strong>
            </div>

            <div class="info-row">
              <span>flights Sayang has taken over</span>
              <strong>3</strong>
            </div>

            <div class="info-row">
              <span>Discord calls</span>
              <strong>too many to count</strong>
            </div>

            <div class="info-row">
              <span>songs Faris mysteriously knows</span>
              <strong>apparently all of them</strong>
            </div>

            <div class="info-row">
              <span>how often Sayang misses him</span>
              <strong>more than she'd like to admit</strong>
            </div>

            <div class="info-row">
              <span>hugs currently owed to Sayang</span>
              <strong>far too many</strong>
            </div>

            <div class="info-row">
              <span>times she's wished he was closer</span>
              <strong>countless</strong>
            </div>

            <div class="info-row">
              <span>likelihood she'd fly all that way again</span>
              <strong>100%</strong>
            </div>
          </div>
        </div>
      `
    },

    {
      duration: 4500,
      html: anchorScene({
        label: "DISTANCE REPORT",
        headline: "Miles apart",
        subline: "Late-night Discord activity continues despite the distance.",
        lowerLabel: "LATE NIGHT",
        lowerHeadline: "Both parties occasionally forget what time it is",
        camera: "camera-wide"
      })
    },

    {
      duration: 30000,
      html: `
        <div class="news-slide">
          <div class="statement-layout" style="padding-top:30px;">
            <span class="statement-tag">BBN EXCLUSIVE • SINGAPORE</span>

            <blockquote style="
              max-width:1050px;
              margin:18px 0 10px;
              font-size:clamp(15px,1.65vw,20px);
              font-weight:650;
              line-height:1.3;
            ">
              “i really like how much he makes me laugh uh... even when he's not actually trying to be funny. sometimes he's genuinely funny and sometimes he's just being a complete idiot and somehow that's funny too. and when i'm trying to be annoyed at him but he manages to make me laugh... i can't even stay annoyed properly.<br><br>

              but i think some of my favourite moments with him are actually when he isn't paying attention to me uh... like when he's concentrating on something, randomly singing or just doing his own thing. i like watching him when he's completely being himself and doesn't even realise i'm looking at him.<br><br>

              sometimes i'll just sit there watching him and get this really fond feeling like... awww that's my person. he's literally not even doing anything uh... he's just being Faris and idk... i really like those moments.<br><br>

              he probably doesn't realise i look at him like that sometimes uh...<br><br>

              well... i guess he knows now.”
            </blockquote>

            <cite style="font-size:14px;">— Sayang</cite>

            <div class="lower-third">
              <div class="lower-breaking">EXCLUSIVE</div>
              <div class="lower-main">
                <h1>THE RECORD SPEAKS FOR ITSELF</h1>
              </div>
              <div class="lower-sub">No further comment required</div>
            </div>
          </div>
        </div>
      `
    },

    {
      hidden: true,
      duration: 7000,
      html: `
        <div class="news-slide">
          <div class="news-package footage-package">
            <span class="package-kicker">BBN EXCLUSIVE</span>

            <h1 class="package-title">
              FARIS:<br>
              30 YEARS IN THE MAKING
            </h1>

            <p class="package-copy">
              We are now receiving exclusive footage supplied by our Singapore correspondent.
            </p>

            <p class="package-copy">
              The following material concerns the birthday boy directly.
            </p>
          </div>
        </div>
      `
    },

    {
      hidden: true,
      video: true,
      html: `
        <div class="news-slide">
          <div class="news-video-stage" id="newsVideoStage"></div>

          <div class="lower-third">
            <div class="lower-breaking">EXCLUSIVE FOOTAGE</div>
            <div class="lower-main">
              <h1>Faris: 30 Years in the Making</h1>
            </div>
          </div>
        </div>
      `
    },

    {
      final: true,
      html: `
        <div class="news-slide">
          <div class="final-broadcast">
            <div>
              <p class="final-kicker">BBN SPECIAL COVERAGE</p>

              <h1>
                HAPPY 30TH<br>
                BIRTHDAY, FARIS
              </h1>

              <p>This concludes our special birthday coverage.</p>
              <p>Further celebrations are expected throughout the day.</p>
            </div>
          </div>
        </div>
      `
    }
  ];

  function clearTVTimers() {
    tvTimers.forEach((timer) => clearTimeout(timer));
    tvTimers = [];

    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }
  }

  function getNextVisibleSlideIndex(fromIndex) {
    let index = fromIndex;

    while (index < slides.length && slides[index].hidden) {
      index += 1;
    }

    return index;
  }

  function buildTicker() {
    const text = tickerHeadlines.join(" • ") + " • ";

    newsTickerText.innerHTML = `
      <span class="ticker-copy">${text}</span>
      <span class="ticker-copy" aria-hidden="true">${text}</span>
    `;
  }

  function restartTicker() {
    newsTickerText.style.animation = "none";
    void newsTickerText.offsetWidth;
    newsTickerText.style.animation = "";
  }

  function setBroadcastPaused(paused) {
    isPaused = paused;
    tvBroadcast.classList.toggle("broadcast-paused", paused);

    const animatedElements = tvBroadcast.querySelectorAll("*");

    animatedElements.forEach((element) => {
      element.style.animationPlayState = paused ? "paused" : "";
    });

    if (birthdayVideo && paused && !birthdayVideo.paused) {
      birthdayVideo.pause();
    }

    const slide = slides[currentNewsSlide];

    if (!slide || slide.final) return;

    newsNextButton.textContent = paused ? "▶ RESUME" : "❚❚ PAUSE";
  }

  function scheduleSlideAdvance(duration) {
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }

    slideRemaining = duration;
    slideStartedAt = performance.now();

    slideTimer = setTimeout(() => {
      slideTimer = null;

      if (isPaused) return;

      currentNewsSlide = getNextVisibleSlideIndex(currentNewsSlide + 1);
      renderNewsSlide();
    }, duration);
  }

  function pauseBroadcast() {
    if (isPaused) return;

    if (slideTimer) {
      const elapsed = performance.now() - slideStartedAt;
      slideRemaining = Math.max(0, slideRemaining - elapsed);

      clearTimeout(slideTimer);
      slideTimer = null;
    }

    setBroadcastPaused(true);
  }

  function resumeBroadcast() {
    if (!isPaused) return;

    setBroadcastPaused(false);

    const slide = slides[currentNewsSlide];

    if (!slide || slide.final) return;

    const remaining = Math.max(250, slideRemaining);

    slideStartedAt = performance.now();

    slideTimer = setTimeout(() => {
      slideTimer = null;

      currentNewsSlide = getNextVisibleSlideIndex(currentNewsSlide + 1);
      renderNewsSlide();
    }, remaining);
  }

  function renderNewsSlide() {
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }

    currentNewsSlide = getNextVisibleSlideIndex(currentNewsSlide);

    if (currentNewsSlide >= slides.length) {
      closeBirthdayNews();
      return;
    }

    const slide = slides[currentNewsSlide];

    isPaused = false;

    tvBroadcast.classList.remove("broadcast-paused");

    tvBroadcast.classList.toggle("intro-active", Boolean(slide.intro));

    newsScreen.innerHTML = slide.html;

    if (!slide.intro) {
      buildTicker();
      restartTicker();
    } else {
      newsTickerText.innerHTML = "";
    }

    if (slide.video) {
      const stage = document.getElementById("newsVideoStage");

      if (stage) {
        stage.appendChild(birthdayVideo);
        stage.appendChild(videoFallback);
      }

      newsNextButton.textContent = "❚❚ PAUSE";

      if (birthdayVideo) {
        birthdayVideo.currentTime = 0;

        const playPromise = birthdayVideo.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      }

      return;
    }

    if (slide.final) {
      newsNextButton.textContent = "RETURN TO ROOM";
      return;
    }

    newsNextButton.textContent = "❚❚ PAUSE";

    if (slide.intro) {
      const introExitTimer = setTimeout(() => {
        if (isPaused) return;

        const opening = newsScreen.querySelector(".bbn-opening");

        if (opening) {
          opening.classList.add("leaving");
        }
      }, 2450);

      tvTimers.push(introExitTimer);
    }

    scheduleSlideAdvance(slide.duration || 8000);
  }

  function beginTVAnimation(sequenceToken) {
    if (sequenceToken !== tvSequenceToken) return;

    const staticTimer = setTimeout(() => {
      if (sequenceToken !== tvSequenceToken) return;

      tvPower.classList.add("hidden-phase");
      tvStatic.classList.add("active");
    }, 650);

    const broadcastTimer = setTimeout(() => {
      if (sequenceToken !== tvSequenceToken) return;

      tvStatic.classList.add("hidden-phase");
      tvBroadcast.classList.add("active");

      const revealTimer = setTimeout(() => {
        if (sequenceToken !== tvSequenceToken) return;
        renderNewsSlide();
      }, 180);

      tvTimers.push(revealTimer);
    }, 1400);

    tvTimers.push(staticTimer, broadcastTimer);
  }

  async function startBirthdayNews() {
    clearTVTimers();

    const sequenceToken = ++tvSequenceToken;

    currentNewsSlide = 0;
    isPaused = false;
    slideRemaining = 0;

    tvPower.className = "tv-power";
    tvStatic.className = "tv-static";
    tvBroadcast.className = "tv-broadcast";

    newsScreen.innerHTML = "";
    newsTickerText.innerHTML = "";

    /*
      Wait for the newsroom image BEFORE the TV sequence begins.
      Normally this resolves instantly because we started loading
      the image as soon as tv.js itself loaded.
    */
    if (!anchorImageReady) {
      await anchorImagePromise;
    }

    if (sequenceToken !== tvSequenceToken) return;

    /*
      Give the browser one paint after decoding so the decoded
      image is available to the CSS background compositor before
      the first anchor slide can appear.
    */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (sequenceToken !== tvSequenceToken) return;
        beginTVAnimation(sequenceToken);
      });
    });
  }

  function closeBirthdayNews() {
    ++tvSequenceToken;
    clearTVTimers();

    isPaused = false;
    slideRemaining = 0;

    if (birthdayVideo && !birthdayVideo.paused) {
      birthdayVideo.pause();
    }

    tvBroadcast.classList.remove("intro-active", "broadcast-paused");

    tvModal.classList.remove("open");
    tvModal.setAttribute("aria-hidden", "true");

    if (typeof clearRoomFocus === "function") {
      clearRoomFocus();
    }
  }

  newsNextButton.addEventListener("click", () => {
    const slide = slides[currentNewsSlide];

    if (!slide) return;

    if (slide.final) {
      closeBirthdayNews();
      return;
    }

    if (isPaused) {
      resumeBroadcast();
    } else {
      pauseBroadcast();
    }
  });

  window.runTVSequence = startBirthdayNews;

  document.querySelectorAll("#tvModal [data-close]").forEach((button) => {
    button.addEventListener("click", () => {
      ++tvSequenceToken;
      clearTVTimers();

      isPaused = false;
      slideRemaining = 0;

      tvBroadcast.classList.remove("intro-active", "broadcast-paused");

      if (birthdayVideo && !birthdayVideo.paused) {
        birthdayVideo.pause();
      }
    });
  });

  if (birthdayVideo) {
    birthdayVideo.addEventListener("ended", () => {
      if (slides[currentNewsSlide]?.video) {
        currentNewsSlide = getNextVisibleSlideIndex(currentNewsSlide + 1);
        renderNewsSlide();
      }
    });
  }
})();
