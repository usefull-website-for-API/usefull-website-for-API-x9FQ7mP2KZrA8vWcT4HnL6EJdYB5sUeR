// Services data
const services = {
  anime: [
    { name: "Anime-Sama", url: "https://anime-sama.fr", icon: "https://anime-sama.fr/favicon.ico" },
    {
      name: "ADN",
      url: "https://animationdigitalnetwork.com",
      icon: "https://animationdigitalnetwork.com/favicon.ico",
    },
    {
      name: "Crunchyroll",
      url: "https://www.crunchyroll.com",
      icon: "https://www.crunchyroll.com/favicons/favicon-32x32.png",
    },
    { name: "Franime", url: "https://franime.fr", icon: "https://franime.fr/favicon.ico" },
    { name: "Voiranime", url: "https://v5.voiranime.com", icon: "https://v5.voiranime.com/favicon.ico" },
    { name: "Miruro", url: "https://www.miruro.tv", icon: "https://www.miruro.tv/favicon.ico" },
    { name: "Otakufr", url: "https://otakufr.cc", icon: "https://otakufr.cc/favicon.ico" },
    { name: "Mavanimes", url: "https://mavanimes.cc", icon: "https://mavanimes.cc/favicon.ico" },
    { name: "AnimeKO", url: "https://animeko.co", icon: "https://animeko.co/favicon.ico" },
    { name: "Animecat", url: "https://animecat.net", icon: "https://animecat.net/favicon.ico" },
    { name: "Toonanime", url: "https://www.toonanime.tv", icon: "https://www.toonanime.tv/favicon.ico" },
    { name: "Jetanime", url: "https://ww2.jetanimes.com", icon: "https://ww2.jetanimes.com/favicon.ico" },
    { name: "NekkoSama", url: "https://www.neko-sama.fr", icon: "https://www.neko-sama.fr/favicon.ico" },
    { name: "VostFree", url: "https://vostfree.ws", icon: "https://vostfree.ws/favicon.ico" },
    { name: "AnimeVostFr", url: "https://animevostfr.tv", icon: "https://animevostfr.tv/favicon.ico" },
    { name: "Sekai", url: "https://sekai.one", icon: "https://sekai.one/favicon.ico" },
  ],
  series: [
    { name: "Netflix", url: "https://www.netflix.com", icon: "https://www.netflix.com/favicon.ico" },
    { name: "Prime Video", url: "https://www.primevideo.com", icon: "https://www.primevideo.com/favicon.ico" },
    { name: "Disney+", url: "https://www.disneyplus.com", icon: "https://www.disneyplus.com/favicon.ico" },
    { name: "Coflix", url: "https://coflix.plus", icon: "https://coflix.plus/favicon.ico" },
    { name: "Cinefil", url: "https://cinefil.to", icon: "https://cinefil.to/favicon.ico" },
    { name: "PapyStreaming", url: "https://papystreaming.ws", icon: "https://papystreaming.ws/favicon.ico" },
    { name: "Empire-Streaming", url: "https://empire-streaming.co", icon: "https://empire-streaming.co/favicon.ico" },
    { name: "StreamingDivx", url: "https://www.streamingdivx.co", icon: "https://www.streamingdivx.co/favicon.ico" },
    { name: "Wiflix", url: "https://wiflix.cafe", icon: "https://wiflix.cafe/favicon.ico" },
    { name: "Serie-Streaming", url: "https://serie-streaming.my", icon: "https://serie-streaming.my/favicon.ico" },
    { name: "French-Stream", url: "https://french-stream.center", icon: "https://french-stream.center/favicon.ico" },
    { name: "HDss.to", url: "https://hdss.to", icon: "https://hdss.to/favicon.ico" },
    {
      name: "Streamcomplet",
      url: "https://www.streamcomplet.ninja",
      icon: "https://www.streamcomplet.ninja/favicon.ico",
    },
    { name: "FilmStreaming", url: "https://filmstreaming.so", icon: "https://filmstreaming.so/favicon.ico" },
    { name: "Justwatch", url: "https://www.justwatch.com", icon: "https://www.justwatch.com/favicon.ico" },
  ],
}

// State
let state = {
  language: "fr",
  adblockEnabled: false,
  showWelcome: true,
  currentTab: "anime",
  searchQuery: "",
  menuOpen: false,
  settingsOpen: false,
  currentUrl: null,
}

// Locales data
const locales = {
  fr: {
    welcome_message: "Bienvenue sur Streamix",
    close_menu: "Fermer le menu",
    settings: "Paramètres",
    close_settings: "Fermer les paramètres",
    select_service: "Sélectionner un service",
    go_home: "Accueil",
    language: "Langue",
    adblock: "Bloqueur de publicités activé",
    show_welcome: "Afficher l'écran de bienvenue",
  },
  en: {
    welcome_message: "Welcome to Streamix",
    close_menu: "Close menu",
    settings: "Settings",
    close_settings: "Close settings",
    select_service: "Select a service",
    go_home: "Home",
    language: "Language",
    adblock: "Adblock enabled",
    show_welcome: "Show welcome screen",
  },
}

// Load state from localStorage
function loadState() {
  const saved = localStorage.getItem("streamix-state")
  if (saved) {
    state = { ...state, ...JSON.parse(saved) }
  }
}

// Save state to localStorage
function saveState() {
  localStorage.setItem("streamix-state", JSON.stringify(state))
}

// DOM elements
const welcomeScreen = document.getElementById("welcome-screen")
const streamingFrame = document.getElementById("streaming-frame")
const homeButton = document.getElementById("home-button")
const windowControls = document.getElementById("window-controls")
const f1Menu = document.getElementById("f1-menu")
const settingsModal = document.getElementById("settings-modal")
const servicesList = document.getElementById("services-list")
const searchInput = document.getElementById("search-input")
const languageSelect = document.getElementById("language-select")
const adblockToggle = document.getElementById("adblock-toggle")
const welcomeToggle = document.getElementById("welcome-toggle")

// Initialize
function init() {
  loadState()
  updateUI()
  setupEventListeners()
  setupElectronBridge()

  // Check if in Electron
  if (window.electronAPI) {
    windowControls.classList.remove("hidden")
  }
}

// Update UI based on state
function updateUI() {
  // Update language
  updateLanguage()

  // Update settings controls
  languageSelect.value = state.language
  adblockToggle.checked = state.adblockEnabled
  welcomeToggle.checked = state.showWelcome

  // Update services list
  renderServices()

  // Update welcome screen visibility
  if (!state.showWelcome && !state.currentUrl) {
    welcomeScreen.classList.add("hidden")
  }
}

// Update language
function updateLanguage() {
  const lang = locales[state.language] || locales.fr

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n")
    if (lang[key]) {
      el.textContent = lang[key]
    }
  })

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder")
    if (lang[key]) {
      el.placeholder = lang[key]
    }
  })
}

// Render services
function renderServices() {
  const currentServices = services[state.currentTab] || []
  const filtered = currentServices.filter((s) => s.name.toLowerCase().includes(state.searchQuery.toLowerCase()))

  servicesList.innerHTML = filtered
    .map(
      (service) => `
    <div class="service-card" data-url="${service.url}">
      <img src="${service.icon}" alt="${service.name}" onerror="this.src='https://via.placeholder.com/48?text=${service.name[0]}'">
      <span>${service.name}</span>
    </div>
  `,
    )
    .join("")

  // Add click listeners
  servicesList.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectService(card.dataset.url)
    })
  })
}

// Select a service
function selectService(url) {
  state.currentUrl = url
  state.menuOpen = false
  saveState()

  welcomeScreen.classList.add("hidden")
  f1Menu.classList.add("hidden")
  streamingFrame.classList.remove("hidden")
  homeButton.classList.remove("hidden")

  // Note: Most streaming sites block iframes, so we open in new tab for web version
  // In Electron, the iframe would work better
  if (window.electronAPI) {
    streamingFrame.src = url
  } else {
    window.open(url, "_blank")
    goHome()
  }
}

// Go home
function goHome() {
  state.currentUrl = null
  saveState()

  streamingFrame.classList.add("hidden")
  streamingFrame.src = ""
  homeButton.classList.add("hidden")

  if (state.showWelcome) {
    welcomeScreen.classList.remove("hidden")
  }
}

// Toggle F1 menu
function toggleMenu() {
  state.menuOpen = !state.menuOpen
  f1Menu.classList.toggle("hidden", !state.menuOpen)

  if (state.menuOpen) {
    searchInput.focus()
  }
}

// Toggle settings
function toggleSettings() {
  state.settingsOpen = !state.settingsOpen
  settingsModal.classList.toggle("hidden", !state.settingsOpen)
}

// Setup event listeners
function setupEventListeners() {
  // F1 key
  document.addEventListener("keydown", (e) => {
    if (e.key === "F1") {
      e.preventDefault()
      toggleMenu()
    }
    if (e.key === "Escape") {
      if (state.settingsOpen) {
        toggleSettings()
      } else if (state.menuOpen) {
        toggleMenu()
      }
    }
  })

  // Menu buttons
  document.getElementById("close-menu-btn").addEventListener("click", toggleMenu)
  document.getElementById("settings-btn").addEventListener("click", () => {
    toggleMenu()
    toggleSettings()
  })

  // Settings
  document.getElementById("close-settings-btn").addEventListener("click", toggleSettings)
  settingsModal.querySelector(".modal-backdrop").addEventListener("click", toggleSettings)

  languageSelect.addEventListener("change", (e) => {
    state.language = e.target.value
    saveState()
    updateLanguage()
  })

  adblockToggle.addEventListener("change", (e) => {
    state.adblockEnabled = e.target.checked
    saveState()
  })

  welcomeToggle.addEventListener("change", (e) => {
    state.showWelcome = e.target.checked
    saveState()
  })

  // Tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")
      state.currentTab = btn.dataset.tab
      renderServices()
    })
  })

  // Search
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value
    renderServices()
  })

  // Home button
  homeButton.addEventListener("click", goHome)

  // Window controls (Electron)
  document.getElementById("minimize-btn")?.addEventListener("click", () => {
    window.electronAPI?.minimize()
  })

  document.getElementById("close-btn")?.addEventListener("click", () => {
    window.electronAPI?.close()
  })
}

// Setup Electron bridge (API for Electron to control the web app)
function setupElectronBridge() {
  window.streamixWebAPI = {
    toggleMenu,
    openSettings: () => {
      if (!state.settingsOpen) toggleSettings()
    },
    closeSettings: () => {
      if (state.settingsOpen) toggleSettings()
    },
    selectService: (url) => selectService(url),
    goHome,
    setLanguage: (lang) => {
      state.language = lang
      saveState()
      updateLanguage()
    },
    getState: () => ({ ...state }),
  }
}

// Start
init()
