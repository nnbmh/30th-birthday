const computerToast = document.getElementById("computerToast");
const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");
const taskbarDate = document.getElementById("taskbarDate");
const picturesDesktopLabel = document.querySelector('[data-app="photos"] p');
if (picturesDesktopLabel) picturesDesktopLabel.textContent = "Pictures";

let computerToastTimer = null;
let currentPhotoCollection = [];
let currentPhotoIndex = 0;
let currentPhotoFolder = "photos";

let currentExplorerLocation = null;
let explorerBackStack = [];
let explorerForwardStack = [];

function computerClick() {
  if (typeof playClick === "function") playClick();
}

function showComputerToast(message) {
  if (!computerToast) return;
  clearTimeout(computerToastTimer);
  computerToast.textContent = message;
  computerToast.classList.add("show");
  computerToastTimer = setTimeout(() => computerToast.classList.remove("show"), 2200);
}

function setComputerWindowMode(appName) {
  const explorerApps = ["thispc", "documents", "downloads", "photos", "recycle", "candid", "us"];
  appWindow.classList.toggle("explorer-mode", explorerApps.includes(appName));
}

function folderIcon() {
  return `<span class="win-folder-glyph"><span></span></span>`;
}

function fileIcon(type = "file") {
  if (type === "pdf") return `<span class="win-file-glyph win-pdf">PDF</span>`;
  if (type === "image") return `<span class="win-file-glyph win-image-glyph">▧</span>`;
  if (type === "doc") return `<span class="win-file-glyph win-doc">W</span>`;
  return `<span class="win-file-glyph">▤</span>`;
}

function getExplorerParent(location) {
  if (location === "candid" || location === "us") return "photos";
  if (location === "documents" || location === "downloads" || location === "photos") return "thispc";
  return null;
}

function getExplorerTitle(location) {
  const titles = {
    thispc: "This PC",
    documents: "Documents",
    downloads: "Downloads",
    photos: "Pictures",
    candid: "candid pics i like",
    us: "us",
    recycle: "Recycle Bin"
  };
  return titles[location] || "File Explorer";
}

function getExplorerPath(location) {
  if (location === "thispc") return `This PC`;
  if (location === "documents") return `This PC <span>›</span> Documents`;
  if (location === "downloads") return `This PC <span>›</span> Downloads`;
  if (location === "photos") return `This PC <span>›</span> Pictures`;
  if (location === "candid") return `This PC <span>›</span> Pictures <span>›</span> candid pics i like`;
  if (location === "us") return `This PC <span>›</span> Pictures <span>›</span> us`;
  if (location === "recycle") return `Recycle Bin`;
  return "";
}

function sidebar(activeLocation) {
  const active = (location) => activeLocation === location ? " active" : "";

  return `<aside class="win-sidebar">
    <div class="win-sidebar-section">
      <div class="win-sidebar-heading">Quick access</div>
      <button class="win-nav-item${active("thispc")}" data-explorer-location="thispc">
        <span class="win-nav-icon pc-nav-icon">▣</span>
        <span>This PC</span>
      </button>
      <button class="win-nav-item${active("documents")}" data-explorer-location="documents">
        <span class="win-nav-icon folder-nav-icon">▤</span>
        <span>Documents</span>
      </button>
      <button class="win-nav-item${active("downloads")}" data-explorer-location="downloads">
        <span class="win-nav-icon download-nav-icon">↓</span>
        <span>Downloads</span>
      </button>
      <button class="win-nav-item${active("photos")}" data-explorer-location="photos">
        <span class="win-nav-icon picture-nav-icon">▧</span>
        <span>Pictures</span>
      </button>
    </div>
    <div class="win-sidebar-section">
      <div class="win-sidebar-heading">This PC</div>
      <div class="win-nav-static">
        <span class="win-nav-icon">♫</span>
        <span>Music</span>
      </div>
      <div class="win-nav-static">
        <span class="win-nav-icon">▰</span>
        <span>Local Disk (C:)</span>
      </div>
    </div>
  </aside>`;
}

function ribbon() {
  return `<div class="win-ribbon">
    <div class="win-tabs">
      <span class="win-file-tab">File</span>
      <span class="win-tab active">Home</span>
      <span class="win-tab">Share</span>
      <span class="win-tab">View</span>
    </div>
    <div class="win-command-bar">
      <div class="win-command-group">
        <span class="win-command-icon">★</span>
        <small>Pin to Quick access</small>
      </div>
      <div class="win-command-group">
        <span class="win-command-icon">⧉</span>
        <small>Copy</small>
      </div>
      <div class="win-command-group">
        <span class="win-command-icon">▣</span>
        <small>Paste</small>
      </div>
      <div class="win-command-divider"></div>
      <div class="win-command-group">
        <span class="win-command-icon">✂</span>
        <small>Cut</small>
      </div>
      <div class="win-command-group">
        <span class="win-command-icon">✎</span>
        <small>Rename</small>
      </div>
      <div class="win-command-group">
        <span class="win-command-icon">✕</span>
        <small>Delete</small>
      </div>
      <div class="win-command-divider"></div>
      <div class="win-command-group">
        <span class="win-command-icon">□</span>
        <small>New folder</small>
      </div>
      <div class="win-command-group">
        <span class="win-command-icon">✓</span>
        <small>Properties</small>
      </div>
    </div>
  </div>`;
}

function explorerChrome(location, content, itemCount = "") {
  const parent = getExplorerParent(location);
  const canBack = explorerBackStack.length > 0;
  const canForward = explorerForwardStack.length > 0;
  const canUp = Boolean(parent);

  return `<div class="windows-explorer">
    ${ribbon()}
    <div class="win-address-row">
      <div class="win-history">
        <button class="win-nav-button" data-explorer-back ${canBack ? "" : "disabled"} aria-label="Back">
          <span class="nav-arrow-left"></span>
        </button>
        <button class="win-nav-button" data-explorer-forward ${canForward ? "" : "disabled"} aria-label="Forward">
          <span class="nav-arrow-right"></span>
        </button>
        <button class="win-nav-button" data-explorer-up ${canUp ? "" : "disabled"} aria-label="Up">
          <span class="nav-arrow-up"></span>
        </button>
      </div>
      <div class="win-address-bar">${getExplorerPath(location)}</div>
      <div class="win-search-box">
        <span class="win-search-icon"></span>
        <span>Search ${getExplorerTitle(location)}</span>
      </div>
    </div>
    <div class="win-explorer-body">
      ${sidebar(location)}
      <main class="win-file-pane">${content}</main>
    </div>
    <div class="win-status-bar">
      <span>${itemCount}</span>
      <div class="win-view-buttons"><span>▤</span><span>▦</span></div>
    </div>
  </div>`;
}

function explorerFolderItem(name, location = "") {
  const attribute = location ? `data-explorer-location="${location}"` : "";
  return `<button class="win-large-item win-folder-item" ${attribute}>
    ${folderIcon()}
    <span>${name}</span>
  </button>`;
}

function explorerFileItem(name, type = "file") {
  return `<div class="win-large-item win-standard-file">
    ${fileIcon(type)}
    <span>${name}</span>
  </div>`;
}

function photoFolderItem(name, folder) {
  return `<button class="win-large-item win-folder-item" data-explorer-location="${folder}">
    ${folderIcon()}
    <span>${name}</span>
  </button>`;
}

function photoFileItem(path, name, collection, index, eager = false) {
  return `<button class="win-large-item win-photo-item" data-photo-path="${path}" data-photo-name="${name}" data-photo-collection="${collection}" data-photo-index="${index}">
    <span class="win-photo-thumb"><img src="${path}" alt="${name}" loading="${eager ? "eager" : "lazy"}" decoding="async"></span>
    <span>${name}</span>
  </button>`;
}

const standalonePhotos = [
  "IMG_1475.jpeg",
  "IMG_5852.jpeg",
  "IMG_6971.jpeg",
  "IMG_7167.jpeg",
  "IMG_7489.jpeg",
  "IMG_7546.jpeg"
];

const candidPhotos = [
  "IMG_0146.jpeg",
  "IMG_0157.jpeg",
  "IMG_0172.jpeg",
  "IMG_0214.jpeg",
  "IMG_0216.jpeg",
  "IMG_0235.jpeg",
  "IMG_0259.jpeg",
  "IMG_0260.jpeg",
  "IMG_0281.jpeg",
  "IMG_0282.jpeg",
  "IMG_0526.jpeg",
  "IMG_0537.jpeg",
  "IMG_0538.jpeg",
  "IMG_0544.jpeg",
  "IMG_0545.jpeg",
  "IMG_0563.png",
  "IMG_1450.jpeg",
  "IMG_1451.jpeg",
  "IMG_5888.jpeg",
  "IMG_5895.jpeg"
];

const usPhotos = [
  "IMG_0332.png",
  "IMG_0337.jpeg",
  "IMG_0354.jpeg",
  "IMG_1491.jpeg",
  "IMG_1514.jpeg",
  "IMG_1845.jpeg",
  "IMG_1846.jpeg",
  "IMG_5900.jpeg",
  "IMG_7123.jpeg",
  "IMG_7233.jpeg",
  "IMG_7272.jpeg",
  "IMG_9208.jpeg",
  "IMG_9220.jpeg"
];

function renderThisPC() {
  return explorerChrome(
    "thispc",
    `<div class="win-section-heading">
      <span class="win-section-caret">⌄</span>
      <span>Folders</span>
      <i></i>
    </div>
    <div class="win-large-grid win-pc-folder-grid">
      ${explorerFolderItem("Documents", "documents")}
      ${explorerFolderItem("Downloads", "downloads")}
      ${explorerFolderItem("Pictures", "photos")}
      ${explorerFolderItem("Music")}
    </div>
    <div class="win-section-heading win-drive-heading">
      <span class="win-section-caret">⌄</span>
      <span>Devices and drives</span>
      <i></i>
    </div>
    <div class="win-drive-row">
      <div class="win-drive-glyph">
        <span></span>
      </div>
      <div class="win-drive-details">
        <div class="win-drive-name">Local Disk (C:)</div>
        <div class="win-drive-meter"><span></span></div>
        <small>214 GB free of 476 GB</small>
      </div>
    </div>`,
    "5 items"
  );
}

function renderDocuments() {
  return explorerChrome(
    "documents",
    `<div class="win-large-grid">
      ${explorerFolderItem("Forge Protocol")}
      ${explorerFileItem("Master CV.docx", "doc")}
      ${explorerFolderItem("Personal")}
      ${explorerFolderItem("Work")}
    </div>`,
    "4 items"
  );
}

function renderDownloads() {
  return explorerChrome(
    "downloads",
    `<div class="win-large-grid">
      ${explorerFileItem("CV - BA.pdf", "pdf")}
      ${explorerFileItem("Cover Letter - BA.pdf", "pdf")}
      ${explorerFileItem("Faris Osmanbhoy Recommendation.pdf", "pdf")}
      ${explorerFileItem("Canva Design.png", "image")}
      ${explorerFileItem("Canva Design (1).png", "image")}
      ${explorerFileItem("image_3847.jpg", "image")}
      ${explorerFileItem("IMG_20260903.png", "image")}
    </div>`,
    "7 items"
  );
}

function renderPhotosHome() {
  const items = [
    photoFolderItem("candid pics i like", "candid"),
    photoFolderItem("us", "us"),
    ...standalonePhotos.map((name, index) =>
      photoFileItem(`assets/photos/${name}`, name, "standalone", index, true)
    )
  ].join("");

  return explorerChrome(
    "photos",
    `<div class="win-large-grid">${items}</div>`,
    "8 items"
  );
}

function renderPhotoFolder(folder) {
  const isCandid = folder === "candid";
  const names = isCandid ? candidPhotos : usPhotos;
  const base = isCandid ? "assets/photos/candid/" : "assets/photos/us/";

  return explorerChrome(
    folder,
    `<div class="win-large-grid win-photo-folder-grid">
      ${names.map((name, index) => photoFileItem(`${base}${name}`, name, folder, index)).join("")}
    </div>`,
    `${names.length} items`
  );
}

function renderRecycleBin() {
  return explorerChrome(
    "recycle",
    `<div class="win-empty-folder">
      <div class="win-empty-bin">♲</div>
      <p>This folder is empty.</p>
    </div>`,
    "0 items"
  );
}

function renderExplorerLocation(location) {
  if (location === "thispc") return renderThisPC();
  if (location === "documents") return renderDocuments();
  if (location === "downloads") return renderDownloads();
  if (location === "photos") return renderPhotosHome();
  if (location === "candid" || location === "us") return renderPhotoFolder(location);
  if (location === "recycle") return renderRecycleBin();
  return renderThisPC();
}

function navigateExplorer(location, addHistory = true) {
  if (!location) return;

  if (addHistory && currentExplorerLocation && currentExplorerLocation !== location) {
    explorerBackStack.push(currentExplorerLocation);
    explorerForwardStack = [];
  }

  currentExplorerLocation = location;
  currentPhotoFolder = location === "candid" || location === "us" ? location : "photos";

  setComputerWindowMode(location);
  appTitle.textContent = getExplorerTitle(location);
  appContent.innerHTML = renderExplorerLocation(location);
  appWindow.classList.add("open");
  computerClick();
}

function explorerBack() {
  if (!explorerBackStack.length) return;

  const destination = explorerBackStack.pop();

  if (currentExplorerLocation) {
    explorerForwardStack.push(currentExplorerLocation);
  }

  currentExplorerLocation = destination;
  currentPhotoFolder = destination === "candid" || destination === "us" ? destination : "photos";
  appTitle.textContent = getExplorerTitle(destination);
  appContent.innerHTML = renderExplorerLocation(destination);
  computerClick();
}

function explorerForward() {
  if (!explorerForwardStack.length) return;

  const destination = explorerForwardStack.pop();

  if (currentExplorerLocation) {
    explorerBackStack.push(currentExplorerLocation);
  }

  currentExplorerLocation = destination;
  currentPhotoFolder = destination === "candid" || destination === "us" ? destination : "photos";
  appTitle.textContent = getExplorerTitle(destination);
  appContent.innerHTML = renderExplorerLocation(destination);
  computerClick();
}

function explorerUp() {
  const parent = getExplorerParent(currentExplorerLocation);
  if (!parent) return;
  navigateExplorer(parent, true);
}

function getPhotoCollection(collection) {
  if (collection === "candid") {
    return candidPhotos.map((name) => ({
      name,
      path: `assets/photos/candid/${name}`
    }));
  }

  if (collection === "us") {
    return usPhotos.map((name) => ({
      name,
      path: `assets/photos/us/${name}`
    }));
  }

  return standalonePhotos.map((name) => ({
    name,
    path: `assets/photos/${name}`
  }));
}

function preloadPictureThumbnails() {
  standalonePhotos.forEach((name) => {
    const image = new Image();
    image.src = `assets/photos/${name}`;
  });
}

if ("requestIdleCallback" in window) {
  requestIdleCallback(preloadPictureThumbnails, { timeout: 1500 });
} else {
  setTimeout(preloadPictureThumbnails, 500);
}

function renderPhotoViewer() {
  const photo = currentPhotoCollection[currentPhotoIndex];
  if (!photo) return;

  appContent.innerHTML = `<div class="windows-photo-viewer">
    <div class="win-photo-viewer-top">
      <button type="button" data-photo-viewer-back aria-label="Back">←</button>
      <span>${photo.name}</span>
      <small>${currentPhotoIndex + 1} of ${currentPhotoCollection.length}</small>
    </div>
    <div class="win-photo-viewer-stage">
      <button type="button" class="win-viewer-arrow win-viewer-left" data-photo-prev aria-label="Previous">‹</button>
      <img src="${photo.path}" alt="${photo.name}">
      <button type="button" class="win-viewer-arrow win-viewer-right" data-photo-next aria-label="Next">›</button>
    </div>
    <div class="win-photo-viewer-bottom">
      <span>－</span>
      <span>＋</span>
      <span>↻</span>
      <span>♡</span>
      <span>⋯</span>
    </div>
  </div>`;
}

function openPhoto(collection, index) {
  currentPhotoCollection = getPhotoCollection(collection);
  currentPhotoIndex = Number(index);
  currentPhotoFolder = collection;
  appTitle.textContent = currentPhotoCollection[currentPhotoIndex].name;
  renderPhotoViewer();
  computerClick();
}

function showPreviousPhoto() {
  if (!currentPhotoCollection.length) return;
  currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotoCollection.length) % currentPhotoCollection.length;
  appTitle.textContent = currentPhotoCollection[currentPhotoIndex].name;
  renderPhotoViewer();
  computerClick();
}

function showNextPhoto() {
  if (!currentPhotoCollection.length) return;
  currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotoCollection.length;
  appTitle.textContent = currentPhotoCollection[currentPhotoIndex].name;
  renderPhotoViewer();
  computerClick();
}

const computerAppData = {
  chrome: {
    title: "Google Chrome",
    content: `<div class="fake-app">
      <div class="fake-app-logo">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="27" fill="#fff"/>
          <path d="M32 32L9 32A27 27 0 0 1 50 13z" fill="#ea4335"/>
          <path d="M32 32l12 21A27 27 0 0 1 9 32z" fill="#34a853"/>
          <path d="M32 32l18-19A27 27 0 0 1 44 53z" fill="#fbbc05"/>
          <circle cx="32" cy="32" r="11" fill="#4285f4"/>
        </svg>
      </div>
      <h2>Google Chrome</h2>
      <p>Internet access unavailable during birthday maintenance.</p>
    </div>`
  },

  discord: {
    title: "Discord",
    content: `<div class="fake-app">
      <div class="fake-app-logo">
        <svg viewBox="0 0 64 64">
          <rect x="6" y="6" width="52" height="52" rx="13" fill="#5865f2"/>
          <path d="M22 22c7-5 13-5 20 0 4 6 6 12 7 19-5 4-9 6-13 7l-2-4c3-1 5-2 7-4-7 4-12 4-19 0 2 2 4 3 7 4l-2 4c-4-1-8-3-13-7 1-7 3-13 8-19z" fill="white"/>
        </svg>
      </div>
      <h2>Discord</h2>
      <p>already enough hours logged here.</p>
    </div>`
  },

  spotify: {
    title: "Spotify",
    content: `<div class="fake-app">
      <div class="fake-app-logo">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="27" fill="#1ed760"/>
          <path d="M18 25c11-3 24-2 34 3M20 34c9-2 20-1 29 3M22 42c8-1 16 0 23 3" fill="none" stroke="#111" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
      <h2>Spotify</h2>
      <p>Playback unavailable.</p>
    </div>`
  },

  steam: {
    title: "Steam",
    content: `<div class="fake-app">
      <div class="fake-app-logo">
        <svg viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="27" fill="#15344c"/>
          <circle cx="42" cy="22" r="9" fill="none" stroke="white" stroke-width="4"/>
          <circle cx="20" cy="42" r="7" fill="none" stroke="white" stroke-width="4"/>
          <path d="M26 39l10-11 8 3" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/>
        </svg>
      </div>
      <h2>Steam</h2>
      <p>connection unavailable.</p>
    </div>`
  },

  birthday: {
    title: "birthday.txt",
    content: `<div class="birthday-pc-file">
      <p class="eyebrow">BIRTHDAY.TXT</p>
      <h2>Happy birthday sayang ♡</h2>
      <p>I wonder where you are rn when you’re reading this... like how much have you already found? What have you clicked on? Have you laughed at anything yet? Have you judged me? Actually don’t answer the last one.</p>
      <p>I’ve been thinking abt this moment alot while putting everything together uh bb. I kept imagining you finally getting to go through it and wondering what your reaction would be to everything.</p>
      <p>I think you’re gonna laugh at some parts. I think there’s gonna be at least one “wtf sayang”... and I’m really hoping there’s gonna be lots of that stupid big smile I love seeing on you.</p>
      <p>I wish I could actually see all of it uh... because your reactions are literally one of the things I’ve been looking forward to the most.</p>
      <p>I hope you’re enjoying everything so far bb. Take your time and look through everything okay... there’s still more for you to find.</p>
      <p>And when you’re done, come find me. I wanna hear what you thought abt everything... all the little things you noticed and all the reactions I didn’t get to see.</p>
      <p>Happy birthday my sayang ♡</p>
      <p>Enjoy the rest of your little birthday surprise.</p>
    </div>`
  },

  message: {
    title: "DO NOT OPEN.txt",
    content: `<div class="birthday-pc-file">
      <p class="eyebrow">DO NOT OPEN</p>
      <h2>faris...</h2>
      <p>the file literally said do not open.</p>
      <p>but since youre here now...</p>
      <p>i miss you alot uh bb.</p>
      <p>i miss being able to just reach over and touch you whenever i want... your cuddles, having you next to me and not having a stupid screen between us.</p>
      <p>okay enough. close this now.</p>
    </div>`
  },

  classified: {
    title: "CLASSIFIED",
    content: `<div class="birthday-pc-file">
      <p class="eyebrow">RESTRICTED FILE</p>
      <h2>ACCESS DENIED</h2>
      <p>clearance level insufficient.</p>
      <p>nice try, Faris.</p>
      <p>maybe theres something else in the room you havent found yet.</p>
    </div>`
  }
};

function openComputerApp(appName) {
  const explorerLocations = ["thispc", "documents", "downloads", "photos", "recycle"];

  if (explorerLocations.includes(appName)) {
    explorerBackStack = [];
    explorerForwardStack = [];
    currentExplorerLocation = null;
    navigateExplorer(appName, false);
    return;
  }

  const data = computerAppData[appName];
  if (!data) return;

  computerClick();
  if (startMenu) startMenu.classList.remove("open");

  setComputerWindowMode(appName);
  appTitle.textContent = data.title;
  appContent.innerHTML = data.content;
  appWindow.classList.add("open");
}

document.querySelectorAll("[data-computer-app]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openComputerApp(button.dataset.computerApp);
  });
});

document.querySelectorAll("[data-app]").forEach((button) => {
  button.addEventListener("click", (event) => {
    const appName = button.dataset.app;
    event.stopPropagation();

    if (appName === "photos") {
      explorerBackStack = [];
      explorerForwardStack = [];
      currentExplorerLocation = null;
      navigateExplorer("photos", false);
      return;
    }

    openComputerApp(appName);
  });
});

appContent.addEventListener("click", (event) => {
  const locationButton = event.target.closest("[data-explorer-location]");
  if (locationButton) {
    navigateExplorer(locationButton.dataset.explorerLocation, true);
    return;
  }

  if (event.target.closest("[data-explorer-back]")) {
    explorerBack();
    return;
  }

  if (event.target.closest("[data-explorer-forward]")) {
    explorerForward();
    return;
  }

  if (event.target.closest("[data-explorer-up]")) {
    explorerUp();
    return;
  }

  const photoButton = event.target.closest("[data-photo-path]");
  if (photoButton) {
    openPhoto(photoButton.dataset.photoCollection, photoButton.dataset.photoIndex);
    return;
  }

  if (event.target.closest("[data-photo-viewer-back]")) {
    const destination = currentPhotoFolder === "candid" || currentPhotoFolder === "us"
      ? currentPhotoFolder
      : "photos";

    currentExplorerLocation = destination;
    appTitle.textContent = getExplorerTitle(destination);
    appContent.innerHTML = renderExplorerLocation(destination);
    computerClick();
    return;
  }

  if (event.target.closest("[data-photo-prev]")) {
    showPreviousPhoto();
    return;
  }

  if (event.target.closest("[data-photo-next]")) {
    showNextPhoto();
  }
});

if (startButton && startMenu) {
  startButton.addEventListener("click", (event) => {
    event.stopPropagation();
    computerClick();
    startMenu.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    if (!startMenu.contains(event.target) && event.target !== startButton) {
      startMenu.classList.remove("open");
    }
  });
}

const searchButton = document.querySelector(".taskbar-search");

if (searchButton) {
  searchButton.addEventListener("click", () => {
    computerClick();
    showComputerToast("Search indexing is taking longer than expected.");
  });
}

function updateComputerDate() {
  if (!taskbarDate) return;

  const now = new Date();
  taskbarDate.textContent = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

updateComputerDate();
setInterval(updateComputerDate, 60000);
