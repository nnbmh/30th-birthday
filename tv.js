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
            <div class="lower-main">
              <h1>${lowerHeadline}</h1>
            </div>
            ${lowerSubline ? `<div class="lower-sub">${lowerSubline}</div>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  const slides = [
    {
      intro: true,
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
      html: anchorScene({
        label: "LIVE • UNITED KINGDOM",
        headline: "FARIS TURNS 30",
        subline: "Birthday celebrations are officially underway.",
        lowerLabel: "BREAKING NEWS",
        lowerHeadline: "Faris turns 30",
        lowerSubline: "Sources in Singapore confirm celebrations are underway",
        camera: "camera-wide"
      })
    },

    {
      html: `
        <div class="news-slide">
          <div class="news-package">
            <span class="package-kicker">BBN SPECIAL REPORT</span>
            <h1 class="package-title">THE FARIS FILES</h1>
            <p class="package-copy">Our investigation into the birthday boy has uncovered several behaviours that experts have described as... uniquely Faris.</p>
          </div>
        </div>
      `
    },

    {
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
                <strong>hobbies</strong>
                <span>rock climbing, occasional Dota</span>
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
      html: `
        <div class="news-slide">
          <div class="news-package">
            <span class="package-kicker">BBN EXCLUSIVE • SINGAPORE</span>
            <h1 class="package-title">THINGS SAYANG HAS<br>LEARNED ABOUT FARIS</h1>
            <p class="package-copy">Following extensive observation, several findings about the birthday boy have now been documented.</p>
          </div>
        </div>
      `
    },

    {
      html: `
        <div class="news-slide">
          <div class="info-board numbers-board">
            <p class="board-kicker">SAYANG'S FINDINGS • PART ONE</p>
            <h2>EVERYDAY FARIS</h2>

            <div class="info-row">
              <span>will eat almost anything</span>
              <strong>except tomatoes</strong>
            </div>

            <div class="info-row">
              <span>sardines</span>
              <strong>absolutely not</strong>
            </div>

            <div class="info-row">
              <span>other types of fish</span>
              <strong>depends how its cooked</strong>
            </div>

            <div class="info-row">
              <span>Coke Zero as a substitute</span>
              <strong>unacceptable</strong>
            </div>

            <div class="info-row">
              <span>location of vape</span>
              <strong>frequently unknown</strong>
            </div>

            <div class="info-row">
              <span>tonight's dishes</span>
              <strong>tomorrow's problem</strong>
            </div>

            <div class="info-row">
              <span>snoring volume</span>
              <strong>unfortunately loud</strong>
            </div>

            <div class="info-row">
              <span>bed allocation</span>
              <strong>Faris 75% • Sayang 25%</strong>
            </div>
          </div>
        </div>
      `
    },

    {
      html: `
        <div class="news-slide">
          <div class="info-board">
            <p class="board-kicker">SAYANG'S FINDINGS • PART TWO</p>
            <h2>THE THINGS SHE NOTICES</h2>

            <div class="info-row">
              <span>cooking</span>
              <strong>occasionally comes with spontaneous singing</strong>
            </div>

            <div class="info-row">
              <span>little finger heart</span>
              <strong>message understood immediately</strong>
            </div>

            <div class="info-row">
              <span>Discord watch parties</span>
              <strong>Faris gets completely absorbed</strong>
            </div>

            <div class="info-row">
              <span>cute expressions caught on camera</span>
              <strong>more than Faris realises</strong>
            </div>

            <div class="info-row">
              <span>Faris' official position</span>
              <strong>"I look ugly."</strong>
            </div>

            <div class="info-row">
              <span>Sayang's response</span>
              <strong>screenshots continue to be taken</strong>
            </div>
          </div>
        </div>
      `
    },

    {
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
      html: `
        <div class="news-slide">
          <div class="music-card">
            <span class="package-kicker">BBN ARCHIVE</span>
            <h2>ARCHIVED AUDIO TRANSCRIPT</h2>

            <div class="music-transcript">
              ♪ Di mana dia, anak baboy saya? ♪<br>
              ♪ Di mana dia, buah hati saya? ♪
            </div>

            <p>The performance is believed to be an unauthorised adaptation of <em>Chan Mali Chan</em>.</p>
            <p>No legal action has been taken.</p>
          </div>
        </div>
      `
    },

    {
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
              <span>calls that became 3–4am</span>
              <strong>more than sensible</strong>
            </div>

            <div class="info-row">
              <span>songs Faris mysteriously knows</span>
              <strong>apparently all of them</strong>
            </div>

            <div class="info-row">
              <span>how often Sayang misses him</span>
              <strong>more than shed like to admit</strong>
            </div>

            <div class="info-row">
              <span>hugs currently owed to Sayang</span>
              <strong>far too many</strong>
            </div>

            <div class="info-row">
              <span>times shes wished he was closer</span>
              <strong>countless</strong>
            </div>

            <div class="info-row">
              <span>likelihood shed fly all that way again</span>
              <strong>100%</strong>
            </div>
          </div>
        </div>
      `
    },

    {
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
      html: `
        <div class="news-slide">
          <div class="statement-layout">
            <span class="statement-tag">BBN EXCLUSIVE • SINGAPORE</span>

            <blockquote style="font-size:clamp(20px,2.2vw,28px);line-height:1.18;margin-top:20px;">
              “i really like how much he makes me laugh uh... even when hes not actually trying to be funny. sometimes hes genuinely funny and sometimes hes just being a complete idiot and somehow thats funny too. and when im trying to be annoyed at him but he manages to make me laugh... i cant even stay annoyed properly.<br><br>

              but i think some of my favourite moments with him are actually when he isnt paying attention to me uh... like when hes concentrating on something, randomly singing or just doing his own thing. i like watching him when hes completely being himself and doesnt even realise im looking at him.<br><br>

              sometimes ill just sit there watching him and get this really fond feeling like... aw thats my person. hes literally not even doing anything uh... hes just being faris and idk, i really like those moments.<br><br>

              he probably doesnt realise i look at him like that sometimes uh...<br><br>

              well... i guess he knows now.”
            </blockquote>

            <cite>— Sayang</cite>

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
      html: `
        <div class="news-slide">
          <div class="news-package footage-package">
            <span class="package-kicker">BBN EXCLUSIVE</span>

            <h1 class="package-title">
              FARIS:<br>
              30 YEARS IN THE MAKING
            </h1>

            <p class="package-copy">We are now receiving exclusive footage supplied by our Singapore correspondent.</p>
            <p class="package-copy">The following material concerns the birthday boy directly.</p>
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

  function renderNewsSlide() {
    currentNewsSlide = getNextVisibleSlideIndex(currentNewsSlide);

    if (currentNewsSlide >= slides.length) {
      closeBirthdayNews();
      return;
    }

    const slide = slides[currentNewsSlide];

    tvBroadcast.classList.toggle("intro-active", Boolean(slide.intro));
    newsScreen.innerHTML = slide.html;

    if (!slide.intro) {
      buildTicker();
      restartTicker();
    } else {
      newsTickerText.innerHTML = "";
    }

    if (slide.intro) {
      const introExitTimer = setTimeout(() => {
        const opening = newsScreen.querySelector(".bbn-opening");
        if (opening) opening.classList.add("leaving");
      }, 2450);

      const introAdvanceTimer = setTimeout(() => {
        currentNewsSlide = getNextVisibleSlideIndex(currentNewsSlide + 1);
        renderNewsSlide();
      }, 3000);

      tvTimers.push(introExitTimer, introAdvanceTimer);
      return;
    }

    if (slide.video) {
      const stage = document.getElementById("newsVideoStage");

      if (stage) {
        stage.appendChild(birthdayVideo);
        stage.appendChild(videoFallback);
      }

      newsNextButton.textContent = "CONTINUE ›";
      return;
    }

    if (slide.final) {
      newsNextButton.textContent = "RETURN TO ROOM";
      return;
    }

    newsNextButton.textContent = "CONTINUE ›";
  }

  function startBirthdayNews() {
    clearTVTimers();
    currentNewsSlide = getNextVisibleSlideIndex(0);

    tvPower.className = "tv-power";
    tvStatic.className = "tv-static";
    tvBroadcast.className = "tv-broadcast";

    newsScreen.innerHTML = "";
    newsTickerText.innerHTML = "";

    const staticTimer = setTimeout(() => {
      tvPower.classList.add("hidden-phase");
      tvStatic.classList.add("active");
    }, 650);

    const broadcastTimer = setTimeout(() => {
      tvStatic.classList.add("hidden-phase");
      tvBroadcast.classList.add("active");

      const revealTimer = setTimeout(() => {
        renderNewsSlide();
      }, 180);

      tvTimers.push(revealTimer);
    }, 1400);

    tvTimers.push(staticTimer, broadcastTimer);
  }

  function closeBirthdayNews() {
    clearTVTimers();

    if (birthdayVideo && !birthdayVideo.paused) {
      birthdayVideo.pause();
    }

    tvBroadcast.classList.remove("intro-active");
    tvModal.classList.remove("open");
    tvModal.setAttribute("aria-hidden", "true");

    if (typeof clearRoomFocus === "function") {
      clearRoomFocus();
    }
  }

  newsNextButton.addEventListener("click", () => {
    const slide = slides[currentNewsSlide];

    if (slide.intro) return;

    if (slide.final) {
      closeBirthdayNews();
      return;
    }

    currentNewsSlide = getNextVisibleSlideIndex(currentNewsSlide + 1);
    renderNewsSlide();
  });

  window.runTVSequence = startBirthdayNews;

  document.querySelectorAll("#tvModal [data-close]").forEach((button) => {
    button.addEventListener("click", () => {
      clearTVTimers();
      tvBroadcast.classList.remove("intro-active");

      if (birthdayVideo && !birthdayVideo.paused) {
        birthdayVideo.pause();
      }
    });
  });

  if (birthdayVideo) {
    birthdayVideo.addEventListener("ended", () => {
      newsNextButton.textContent = "CONTINUE ›";
    });
  }
})();
