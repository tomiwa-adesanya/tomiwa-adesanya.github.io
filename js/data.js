// Site content. Edit this file to add projects, swap media or change contact details.
//
// media.type:
//   "youtube" -> { id, poster }             opens the film in a player
//   "video"   -> { src, poster, film? }     local .mp4; film:true opens it with sound in a player,
//                                            otherwise it loops silently in place
//   "gallery" -> { images: [{ src, alt }] } screenshot viewer with thumbnails
// Put the film first in `media` so it's the first tab.
//
// release.repo is read live from the GitHub API (latest release). release.fallback is
// shown if the API can't be reached, so keep it roughly current.

window.SITE = {
  owner: "tomiwa-adesanya",
  email: "a.tomiwa.tech@gmail.com",

  // Paste a Web3Forms access key here to send the hire form straight to your inbox.
  // Leave empty and the form falls back to opening the visitor's email app.
  web3formsKey: "eb193e6c-4cbf-4b9a-a84c-7cd4ee43b4e5",

  socials: [
    { label: "GitHub", href: "https://github.com/tomiwa-adesanya" },
    { label: "X", href: "https://x.com/_tomiwaadesanya" },
    { label: "itch.io", href: "https://tomiwa-adesanya.itch.io" },
  ],
};

window.PROJECTS = [
  {
    id: "lanforge",
    name: "LanForge",
    icon: "assets/projects/lanforge/icon.webp",
    tagline: "Local network file sharing, chat and hosting for Windows and Linux.",
    summary:
      "LanForge connects computers on the same Wi-Fi network so they can share files, chat and host folders for each other directly, with no accounts, no cloud and no internet connection. It also scans the network to show which web services are running and where.",
    highlights: [
      ["Encrypted by default", "Every transfer and message is encrypted, and both devices verify each other before any data moves."],
      ["Reliable transfers", "Send many files in one go. Interrupted transfers resume, and every file is checksum-verified on arrival."],
      ["Chat with attachments", "Message any device on the network and send files straight into the conversation."],
      ["Instant file server", "Host any folder as a password-protected page that phones and laptops can open in a browser."],
    ],
    stack: ["Python", "pywebview", "Flask", "TLS", "Nuitka", "Inno Setup"],
    platforms: ["Windows", "Linux"],
    links: { repo: "https://github.com/tomiwa-adesanya/lanforge" },
    media: [
      { type: "youtube", id: "cA528cvTrV4", poster: "assets/projects/lanforge/film-thumbnail.webp", label: "Film" },
      {
        type: "gallery",
        images: [
          { src: "assets/projects/lanforge/dashboard.webp", alt: "LanForge dashboard showing nearby devices, running servers and saved addresses" },
          { src: "assets/projects/lanforge/send-file.webp", alt: "Sending several files to another computer" },
          { src: "assets/projects/lanforge/chat.webp", alt: "Encrypted chat between two LanForge devices" },
          { src: "assets/projects/lanforge/transfers.webp", alt: "Transfers page with in-progress and completed transfers" },
          { src: "assets/projects/lanforge/my-servers.webp", alt: "Hosting folders as local web servers" },
        ],
      },
    ],
    release: {
      repo: "lanforge",
      fallback: {
        tag: "v2.0.0",
        date: "2026-10-20",
        assets: [
          ["lanforge-v2.0.0-windows-x64-setup.exe", 24837781],
          ["lanforge-v2.0.0-windows-x64-standalone.zip", 21992321],
          ["lanforge_2.0.0_amd64.deb", 44643008],
          ["lanforge-v2.0.0-linux-x64-standalone.tar.xz", 44586064],
          ["SHA256SUMS.txt", 414],
        ],
      },
    },
  },
  {
    id: "markdown-notebook",
    name: "Markdown Notebook",
    icon: "assets/projects/markdown-notebook/icon.webp",
    tagline: "An offline desktop editor for markdown files.",
    summary:
      "Markdown Notebook is an offline desktop app for writing, previewing and organising markdown (.md) files on Windows and Linux. Edit your .md files side by side with a live preview, keep them organised in a built-in library, and export any file to HTML or PDF. No account, no internet connection.",
    highlights: [
      ["Folder workspaces", "Open any folder and edit files where they live, or keep notes in a built-in library with a recoverable recycle bin."],
      ["Rich rendering", "Mermaid diagrams, KaTeX equations and highlighted code render live and carry through to HTML and PDF export."],
      ["Windows integration", "File association, an Explorer right-click Convert menu, and an optional system-tray mode for instant reopening."],
      ["Actively maintained", "Regular releases since launch, with an in-app notice whenever a new version is available."],
    ],
    stack: ["Python", "pywebview", "Flask", "JavaScript", "Nuitka", "Inno Setup"],
    platforms: ["Windows", "Linux"],
    links: { repo: "https://github.com/tomiwa-adesanya/markdown-notebook" },
    media: [
      { type: "video", film: true, src: "assets/projects/markdown-notebook/film.mp4", poster: "assets/projects/markdown-notebook/film-poster.webp", label: "Film" },
      {
        type: "gallery",
        images: [
          { src: "assets/projects/markdown-notebook/editor-dark.webp", alt: "Live preview with a rendered sequence diagram and the library sidebar, dark theme" },
          { src: "assets/projects/markdown-notebook/split-view-light.webp", alt: "Split editor and preview, light theme" },
          { src: "assets/projects/markdown-notebook/floating-library.webp", alt: "The library as a floating browser" },
          { src: "assets/projects/markdown-notebook/settings-panel.webp", alt: "Settings panel" },
        ],
      },
    ],
    release: {
      repo: "markdown-notebook",
      fallback: {
        tag: "v1.8.0",
        date: "2026-08-20",
        assets: [
          ["markdown-notebook-1.8.0-windows-x64-setup.exe", 25213045],
          ["markdown-notebook-1.8.0-windows-x64-standalone.zip", 22490923],
          ["markdown-notebook-1.8.0-linux-x64.deb", 37548926],
          ["markdown-notebook-1.8.0-linux-x64.tar.xz", 37544428],
        ],
      },
    },
  },
  {
    id: "falconmailer",
    name: "FalconMailer",
    private: true,
    icon: null,
    tagline: "Personalised email campaigns, sent from your own inbox.",
    summary:
      "FalconMailer is a professional campaign manager for running outreach from your own email account. Write a message once and send it to a whole list with every email personalised to its recipient, or send to batches of recipients at a time using CC and BCC.",
    highlights: [
      ["Per-recipient personalisation", "Each email is filled in with the recipient's own details, so every message reads one-to-one."],
      ["Batch sending with CC and BCC", "Reach groups of recipients in batches, with CC for copied addresses and BCC for hidden ones."],
      ["Your own account", "Emails go out from your own address, so replies come straight back to the inbox you already use."],
      ["Campaigns in one place", "Contact lists, messages and sends organised together from first draft to final batch."],
    ],
    stack: [],
    platforms: [],
    links: { demo: "mailto:falconmailer.tech@gmail.com?subject=FalconMailer%20demo%20request" },
    media: [
      { type: "video", film: true, src: "assets/projects/falconmailer/film.mp4", poster: "assets/projects/falconmailer/film-poster.webp", label: "Film" },
    ],
    release: null,
  },
  {
    id: "snakeee",
    name: "Snakeee",
    icon: "assets/projects/snakeee/icon.webp",
    tagline: "Party snake for everyone on the same Wi-Fi.",
    summary:
      "The snake from your first phone, rebuilt as a party game for up to twelve players on the same Wi-Fi. One person hosts, everyone else joins in seconds, and the host sets the rules for every round. No accounts, no servers, no internet. Free and open source.",
    highlights: [
      ["Cut, don't crash", "Ram a rival and you slice off their tail. The severed piece turns into food, and the scramble to grab it begins."],
      ["Arenas with secret exits", "Link arenas into a grid and slip off one edge into the next. Everyone knows which arena you're in, but not where."],
      ["Power-ups and poisons", "Speed bursts, ghosting through snakes and food magnets, up against poisons that shrink you or flip your controls."],
      ["Bots that bite back", "Three difficulty tiers with adjustable aggression, so even a room of two turns into chaos."],
    ],
    stack: ["Python", "WebSockets", "pywebview", "JavaScript", "pytest", "Nuitka"],
    platforms: ["Windows", "Linux", "macOS"],
    links: { repo: "https://github.com/tomiwa-adesanya/snakeee", source: true, itch: "https://tomiwa-adesanya.itch.io/snakeee" },
    media: [
      { type: "youtube", id: "L3B7O8-L-Mw", poster: "assets/projects/snakeee/film-poster.webp", label: "Trailer" },
      { type: "video", src: "assets/projects/snakeee/demo.mp4", poster: "assets/projects/snakeee/demo-poster.webp", label: "Gameplay" },
    ],
    release: {
      repo: "snakeee",
      fallback: {
        tag: "v0.1.0",
        date: "2026-09-20",
        assets: [
          ["snakeee-v0.1.0-windows-x64-setup.exe", 19137858],
          ["snakeee-v0.1.0-windows-x64-standlalone.zip", 16418026],
          ["snakeee_0.1.0_amd64.deb", 29333172],
          ["snakeee-v0.1.0-linux-x64-standalone.tar.xz", 29334116],
          ["snakeee-v0.1.0-macos-arm64-setup.pkg", 18163041],
          ["snakeee-v0.1.0-macos-arm64.zip", 18198885],
          ["snakeee-v0.1.0-macos-x64-setup.pkg", 20118676],
          ["snakeee-v0.1.0-macos-x64.zip", 20161752],
        ],
      },
    },
  },
  {
    id: "todo",
    name: "ToDo",
    icon: "assets/projects/todo/icon.webp",
    tagline: "A clean task manager, and the starter kit behind my other apps.",
    summary:
      "A clean, simple to-do list for everyday tasks. It also serves as my open reference project, showing how a Python desktop app should be structured, wired together and compiled into a single executable, for other developers to build on.",
    highlights: [
      ["Organised tasks", "Categories, priorities and due dates, with light and dark themes."],
      ["Works offline", "Tasks are stored on the device in SQLite, so nothing depends on a connection."],
      ["Single executable", "Compiled to one native binary per platform, with no runtime to install."],
      ["Open reference", "Documented from folder layout to build script, and ready to fork as a starting point."],
    ],
    stack: ["Python", "Flask", "pywebview", "SQLite", "Nuitka"],
    platforms: ["Windows", "Linux"],
    links: { repo: "https://github.com/tomiwa-adesanya/todo-desktop-app", source: true },
    media: [
      {
        type: "gallery",
        portrait: true,
        images: [
          { src: "assets/projects/todo/tasks-dark.webp", alt: "Task list, dark theme" },
          { src: "assets/projects/todo/new-task-modal.webp", alt: "New task dialog" },
          { src: "assets/projects/todo/empty-light.webp", alt: "Empty state, light theme" },
        ],
      },
    ],
    release: {
      repo: "todo-desktop-app",
      fallback: {
        tag: "v1.0.0",
        date: "2026-07-26",
        assets: [
          ["ToDo-v1.0.0-windows-x64-standalone.zip", 16332153],
          ["ToDo-v1.0.0-linux-x64.tar.xz", 23804244],
        ],
      },
    },
  },
];

window.ARCHIVE = [
  {
    name: "Arduino SevenSegmentDisplay",
    blurb: "A small C++ library that makes driving a seven-segment display a one-line job.",
    tags: ["C++", "Arduino"],
    href: "https://github.com/tomiwa-adesanya/Arduino-Seven-Segment-Display",
  },
  {
    name: "Unit Converter",
    blurb: "Quick conversions across a dozen physical quantities, as a web app and a Windows app.",
    tags: ["JavaScript", "Python"],
    href: "https://github.com/tomiwa-adesanya/unit-converter-web",
  },
  {
    name: "RasterConvert",
    blurb: "A desktop tool for switching images between raster formats.",
    tags: ["Python", "GUI"],
    href: "https://github.com/tomiwa-adesanya/RasterConvert",
  },
  {
    name: "SimpleCalc",
    blurb: "A desktop calculator written in Java Swing.",
    tags: ["Java", "Swing"],
    href: "https://github.com/tomiwa-adesanya/SimpleCalc-Java-Swing-Project",
  },
];
