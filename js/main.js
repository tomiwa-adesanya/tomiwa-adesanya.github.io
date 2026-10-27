(() => {
  "use strict";

  const { owner, email, web3formsKey, socials } = window.SITE;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // ---------- Icons ----------
  const svg = (body, vb = "0 0 24 24") =>
    `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const ICON = {
    download: svg('<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19h14"/>'),
    windows: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5 10.5 4.4v7.1H3zM11.5 4.3 21 3v8.5h-9.5zM3 12.5h7.5v7.1L3 18.5zM11.5 12.5H21V21l-9.5-1.3z"/></svg>`,
    apple: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.5 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.2-.8-1.7 0-3.2 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-.9-2.4-3.8zM14 5.2c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/></svg>`,
    linux: svg('<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>'),
    file: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>'),
    shield: svg('<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>'),
    github: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>`,
    list: svg('<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>'),
    arrow: svg('<path d="M7 17 17 7M8 7h9v9"/>'),
    play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.8v14.4a.8.8 0 0 0 1.2.7l11.3-7.2a.8.8 0 0 0 0-1.4L8.2 4.1a.8.8 0 0 0-1.2.7z"/></svg>`,
    lock: svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  };
  const CTL = '<span class="win__ctl"><i class="ctl-min"></i><i class="ctl-max"></i><i class="ctl-close"></i></span>';

  // ---------- Release assets ----------
  const OS_NAME = { windows: "Windows", linux: "Linux", mac: "macOS" };

  function detectOS() {
    const ua = navigator.userAgent;
    if (/Android|iPhone|iPad|iPod/i.test(ua)) return null;
    if (/Windows/i.test(ua)) return "windows";
    if (/Mac/i.test(ua)) return "mac";
    if (/Linux|X11|CrOS/i.test(ua)) return "linux";
    return null;
  }
  const userOS = detectOS();

  // Turn a release asset filename into something a person can choose from.
  function classify(name) {
    const n = name.toLowerCase();
    const mArch = /arm64|aarch64/.test(n) ? "Apple silicon" : "Intel";
    if (/sha256|checksum/.test(n)) return { os: "sum", kind: "sum", label: "SHA-256 checksums", sub: name };
    if (/windows|win64|\.exe$|\.msi$/.test(n)) {
      if (/\.(exe|msi)$/.test(n) && /setup|install/.test(n)) return { os: "windows", kind: "installer", rank: 0, label: "Windows installer", sub: "64-bit · .exe" };
      if (/\.zip$/.test(n)) return { os: "windows", kind: "portable", rank: 1, label: "Windows portable", sub: "No install · .zip" };
      return { os: "windows", kind: "portable", rank: 1, label: "Windows executable", sub: "No install · .exe" };
    }
    if (/macos|darwin|\.pkg$|\.dmg$/.test(n)) {
      const prefer = mArch === "Apple silicon" ? 0 : 2;
      if (/\.(pkg|dmg)$/.test(n)) return { os: "mac", kind: "installer", rank: prefer, label: `macOS installer · ${mArch}`, sub: n.endsWith(".pkg") ? ".pkg" : ".dmg" };
      return { os: "mac", kind: "portable", rank: prefer + 1, label: `macOS app · ${mArch}`, sub: "No install · .zip" };
    }
    if (/\.deb$/.test(n)) return { os: "linux", kind: "installer", rank: 0, label: "Debian / Ubuntu", sub: "64-bit · .deb" };
    if (/\.rpm$/.test(n)) return { os: "linux", kind: "installer", rank: 0, label: "Fedora / RHEL", sub: "64-bit · .rpm" };
    if (/\.appimage$/.test(n)) return { os: "linux", kind: "portable", rank: 1, label: "Linux AppImage", sub: "No install · .AppImage" };
    if (/linux|\.tar\.(xz|gz)$/.test(n)) return { os: "linux", kind: "portable", rank: 1, label: "Linux portable", sub: "No install · .tar.xz" };
    return { os: "other", kind: "other", rank: 9, label: name, sub: "" };
  }

  function fmtSize(bytes) {
    if (!bytes) return "";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
  function fmtDate(iso) {
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function fallbackRelease(repo, fb) {
    return {
      tag: fb.tag,
      date: fb.date,
      url: `https://github.com/${owner}/${repo}/releases/tag/${fb.tag}`,
      assets: fb.assets.map(([name, size]) => ({ name, size, url: `https://github.com/${owner}/${repo}/releases/download/${fb.tag}/${name}` })),
      live: false,
    };
  }

  async function fetchRelease(repo) {
    const key = `release:${repo}`;
    try {
      const cached = JSON.parse(sessionStorage.getItem(key) || "null");
      if (cached && Date.now() - cached.at < 60 * 60 * 1000) return cached.data;
    } catch (_) { /* storage unavailable */ }

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const r = await res.json();
    const data = {
      tag: r.tag_name,
      date: r.published_at.slice(0, 10),
      url: r.html_url,
      assets: r.assets.map((a) => ({ name: a.name, size: a.size, url: a.browser_download_url })),
      live: true,
    };
    try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch (_) { /* ignore */ }
    return data;
  }

  function renderDownloads(p, rel) {
    const items = rel.assets.map((a) => ({ ...a, ...classify(a.name) }));
    const sums = items.find((i) => i.kind === "sum");
    const files = items.filter((i) => i.kind !== "sum").sort((a, b) => ["windows", "mac", "linux", "other"].indexOf(a.os) - ["windows", "mac", "linux", "other"].indexOf(b.os) || a.rank - b.rank);
    const forOS = (os) => files.filter((f) => f.os === os).sort((a, b) => a.rank - b.rank)[0];
    const primary = (userOS && forOS(userOS)) || forOS("windows") || files[0];
    const osIcon = (os) => ICON[os] || ICON.file;

    const primaryBtn = primary
      ? `<a class="btn btn--primary" href="${esc(primary.url)}" rel="nofollow">
           <span>${osIcon(primary.os)}Download for ${OS_NAME[primary.os] || "desktop"}</span>
           <span class="dl__size">${esc(fmtSize(primary.size))}</span>
         </a>`
      : "";
    const note = !userOS && primary ? `<p class="dl__note">You're on a phone or tablet. These are desktop downloads.</p>` : "";

    const list = files
      .map(
        (f) => `<a href="${esc(f.url)}" rel="nofollow">
          ${osIcon(f.os)}
          <span>${esc(f.label)}<small>${esc(f.sub)}</small></span>
          <span class="dl__size">${esc(fmtSize(f.size))}</span>
        </a>`
      )
      .join("");

    const platforms = [...new Set(files.map((f) => OS_NAME[f.os]).filter(Boolean))];

    return `
      <div class="dl__head">
        <span class="dl__ver"><span class="tag tag--accent">Latest</span><strong>${esc(rel.tag)}</strong></span>
        <span class="dl__date">${esc(fmtDate(rel.date))}</span>
      </div>
      <div class="dl__primary">${primaryBtn}</div>
      ${note}
      <details class="dl__more">
        <summary>All downloads · ${esc(platforms.join(", "))}</summary>
        <div class="dl__list">${list}</div>
      </details>
      <div class="dl__foot">
        <a href="${esc(rel.url)}">${ICON.list}Release notes</a>
        ${sums ? `<a href="${esc(sums.url)}" rel="nofollow">${ICON.shield}Checksums</a>` : ""}
        <a href="https://github.com/${owner}/${esc(p.release.repo)}/releases">${ICON.arrow}All versions</a>
        ${p.links.repo ? `<a href="${esc(p.links.repo)}">${ICON.github}${p.links.source ? "Source" : "GitHub"}</a>` : ""}
        ${p.links.itch ? `<a href="${esc(p.links.itch)}">${ICON.arrow}itch.io</a>` : ""}
      </div>`;
  }

  // ---------- Media ----------
  function renderMediaItem(m, p, idx) {
    if (m.type === "youtube") {
      return `<div class="stage stage--film">
          <img src="${esc(m.poster)}" alt="${esc(p.name)} film" loading="lazy">
          <button class="play" type="button" data-youtube="${esc(m.id)}" aria-label="Play the ${esc(p.name)} film">
            <span class="play__btn">${ICON.play}Play</span>
          </button>
        </div>`;
    }
    if (m.type === "video" && m.film) {
      return `<div class="stage stage--film">
          <img src="${esc(m.poster)}" alt="${esc(p.name)} film" loading="lazy">
          <button class="play" type="button" data-film="${esc(m.src)}" aria-label="Play the ${esc(p.name)} film">
            <span class="play__btn">${ICON.play}Play</span>
          </button>
        </div>`;
    }
    if (m.type === "video") {
      return `<div class="stage">
          <video src="${esc(m.src)}" poster="${esc(m.poster)}" muted loop playsinline preload="none" ${reducedMotion ? "controls" : "data-autoplay"} aria-label="${esc(p.name)} ${esc(m.label || "demo")}"></video>
        </div>`;
    }
    if (m.type === "gallery" && m.portrait) {
      return `<div class="gallery trio" data-gallery="${esc(p.id)}-${idx}">${m.images
        .map((img, i) => `<button type="button" data-i="${i}" aria-label="Open screenshot: ${esc(img.alt)}"><img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy"></button>`)
        .join("")}</div>`;
    }
    if (m.type === "gallery") {
      const first = m.images[0];
      const thumbs = m.images
        .map(
          (img, i) => `<button class="thumb" type="button" data-i="${i}" aria-label="Show screenshot ${i + 1}: ${esc(img.alt)}" ${i === 0 ? 'aria-current="true"' : ""}>
            <img src="${esc(img.src)}" alt="" loading="lazy"></button>`
        )
        .join("");
      return `<div class="gallery" data-gallery="${esc(p.id)}-${idx}">
          <div class="stage">
            <img class="stage__img" src="${esc(first.src)}" alt="${esc(first.alt)}" loading="lazy">
            <button class="stage__zoom" type="button" aria-label="Open screenshot full size"></button>
          </div>
          ${m.images.length > 1 ? `<div class="thumbs">${thumbs}</div>` : ""}
        </div>`;
    }
    return "";
  }

  function renderMedia(p) {
    if (!p.media.length) return "";
    if (p.media.length === 1) return renderMediaItem(p.media[0], p, 0);
    const label = (m) => m.label || (m.type === "gallery" ? "Screenshots" : "Video");
    const tabs = p.media
      .map((m, i) => `<button class="media__tab" type="button" role="tab" id="tab-${p.id}-${i}" aria-controls="panel-${p.id}-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(label(m))}</button>`)
      .join("");
    const panels = p.media
      .map((m, i) => `<div class="media__panel" role="tabpanel" id="panel-${p.id}-${i}" aria-labelledby="tab-${p.id}-${i}" ${i ? "hidden" : ""}>${renderMediaItem(m, p, i)}</div>`)
      .join("");
    return `<div class="media__tabs" role="tablist" aria-label="${esc(p.name)} media">${tabs}</div>${panels}`;
  }

  // ---------- Projects ----------
  function renderProject(p) {
    const fb = p.release && fallbackRelease(p.release.repo, p.release.fallback);
    const barTags = [
      p.private ? `<span class="tag tag--private">Private</span>` : "",
      p.links.source ? `<span class="tag">Open source</span>` : "",
      ...p.platforms.map((x) => `<span class="tag">${esc(x)}</span>`),
    ].join("");

    const side = p.private
      ? `<div class="private-art">
           <div>${ICON.lock}<p>Source and builds are private. Request a demo and I'll walk you through it.</p></div>
           <a class="btn btn--primary" href="${esc(p.links.demo || "#hire")}">${ICON.mail}Request a demo</a>
         </div>`
      : fb
        ? `<div class="dl" data-release="${esc(p.id)}">${renderDownloads(p, fb)}</div>`
        : "";
    const media = renderMedia(p);

    return `
      <article class="project win" id="project-${esc(p.id)}" aria-labelledby="name-${esc(p.id)}">
        <div class="win__bar">
          <span class="win__title">${p.icon ? `<img src="${esc(p.icon)}" alt="">` : ""}<strong>${esc(p.name)}</strong>${fb ? ` &mdash; <span data-ver>${esc(fb.tag)}</span>` : ""}</span>
          <span class="project__bar-meta">${barTags}</span>
          ${CTL}
        </div>
        ${media ? `<div class="project__media">${media}</div>` : ""}
        <div class="project__info">
          <div class="project__main">
            <div class="project__name">
              ${p.icon ? `<img src="${esc(p.icon)}" alt="" width="48" height="48">` : ""}
              <div><h3 id="name-${esc(p.id)}">${esc(p.name)}</h3><p class="project__tagline">${esc(p.tagline)}</p></div>
            </div>
            <p class="project__summary">${esc(p.summary)}</p>
            ${p.highlights.length ? `<ul class="features">${p.highlights.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join("")}</ul>` : ""}
            ${p.stack.length ? `<ul class="chips" aria-label="Built with">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
          </div>
          ${side ? `<div class="project__side">${side}</div>` : ""}
        </div>
      </article>`;
  }

  const projectsEl = $("#projects");
  projectsEl.innerHTML = window.PROJECTS.map(renderProject).join("");

  // Swap in live release data once it arrives. The fallback is already on screen.
  window.PROJECTS.filter((p) => p.release).forEach((p) => {
    fetchRelease(p.release.repo)
      .then((rel) => {
        const box = $(`[data-release="${p.id}"]`);
        const open = $(".dl__more", box)?.open;
        box.innerHTML = renderDownloads(p, rel);
        if (open) $(".dl__more", box).open = true;
        const ver = $(`#project-${p.id} [data-ver]`);
        if (ver) ver.textContent = rel.tag;
      })
      .catch(() => { /* keep fallback */ });
  });

  // Media tabs
  $$(".media__tabs").forEach((list) => {
    const tabs = $$(".media__tab", list);
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
    };
    list.addEventListener("click", (e) => { const t = e.target.closest(".media__tab"); if (t) select(t); });
    list.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0 || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      next.focus();
      select(next);
    });
  });

  // Galleries
  const galleryImages = {};
  window.PROJECTS.forEach((p) => p.media.forEach((m, i) => { if (m.type === "gallery") galleryImages[`${p.id}-${i}`] = m.images; }));

  $$(".gallery").forEach((g) => {
    const images = galleryImages[g.dataset.gallery];
    const img = $(".stage__img", g);
    let current = 0;
    const show = (i) => {
      if (i === current) return;
      current = i;
      $$(".thumb", g).forEach((t) => t.toggleAttribute("aria-current", +t.dataset.i === i));
      img.classList.add("is-swapping");
      const next = new Image();
      next.onload = next.onerror = () => {
        img.src = images[i].src;
        img.alt = images[i].alt;
        img.classList.remove("is-swapping");
      };
      next.src = images[i].src;
    };
    if (g.classList.contains("trio")) {
      g.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) openImages(images, +b.dataset.i); });
      return;
    }
    g.addEventListener("click", (e) => {
      const t = e.target.closest(".thumb");
      if (t) show(+t.dataset.i);
      if (e.target.closest(".stage__zoom")) openImages(images, current);
    });
  });

  // Silent looping demo videos play only while visible.
  const vids = $$("video[data-autoplay]");
  if (vids.length) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? en.target.play().catch(() => {}) : en.target.pause()));
    }, { threshold: 0.35 });
    vids.forEach((v) => vio.observe(v));
  }

  // ---------- Viewer ----------
  const viewer = $("#viewer");
  const frame = $("#viewer-frame");
  let viewerImages = null;
  let viewerIndex = 0;

  function openViewer(html, isImage) {
    frame.innerHTML = html;
    frame.classList.toggle("is-image", !!isImage);
    if (typeof viewer.showModal === "function") viewer.showModal();
    else viewer.setAttribute("open", "");
  }
  function showViewerImage() {
    const im = viewerImages[viewerIndex];
    frame.innerHTML = `<img src="${esc(im.src)}" alt="${esc(im.alt)}">`;
  }
  function openImages(images, i) {
    viewerImages = images;
    viewerIndex = i;
    openViewer("", true);
    showViewerImage();
  }
  viewer.addEventListener("close", () => { frame.innerHTML = ""; viewerImages = null; });
  viewer.addEventListener("click", (e) => {
    if (e.target === viewer || e.target.closest("[data-close]")) viewer.close();
  });
  viewer.addEventListener("keydown", (e) => {
    if (!viewerImages || !["ArrowLeft", "ArrowRight"].includes(e.key)) return;
    viewerIndex = (viewerIndex + (e.key === "ArrowRight" ? 1 : -1) + viewerImages.length) % viewerImages.length;
    showViewerImage();
  });

  projectsEl.addEventListener("click", (e) => {
    const yt = e.target.closest("[data-youtube]");
    if (yt) {
      openViewer(`<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt.dataset.youtube)}?autoplay=1&rel=0&modestbranding=1" title="Film" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`);
      return;
    }
    const film = e.target.closest("[data-film]");
    if (film) {
      openViewer(`<video src="${esc(film.dataset.film)}" controls autoplay playsinline></video>`);
      return;
    }
    const pre = e.target.closest("[data-prefill]");
    if (pre) {
      const ta = $("#hire-form textarea[name=details]");
      if (!ta.value.trim()) ta.value = pre.dataset.prefill + " ";
    }
  });

  // ---------- Archive ----------
  $("#archive").innerHTML = window.ARCHIVE.map(
    (a) => `<a class="archive__card" href="${esc(a.href)}">
        <h4>${esc(a.name)}${ICON.arrow}</h4>
        <p>${esc(a.blurb)}</p>
        <div class="tags">${a.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </a>`
  ).join("");

  // ---------- Contact details ----------
  const mail = $("#direct-mail");
  mail.href = `mailto:${email}`;
  mail.textContent = email;
  $("#socials").innerHTML = socials.map((s) => `<li><a href="${esc(s.href)}" rel="me">${esc(s.label)}</a></li>`).join("");
  $("#year").textContent = new Date().getFullYear();

  // ---------- Hire form ----------
  const form = $("#hire-form");
  const statusEl = $("#form-status");
  const submitBtn = $("button[type=submit]", form);
  if (!web3formsKey) {
    $("#form-note").textContent = "Sending opens your email app with everything filled in, so your details go straight to me and nowhere else.";
  }

  function fieldOf(el) { return el.closest(".field"); }
  function setError(field, msg) {
    field.classList.add("is-invalid");
    let err = $(".field__error", field);
    if (!err) { err = document.createElement("span"); err.className = "field__error"; field.appendChild(err); }
    err.textContent = msg;
  }
  function clearError(field) {
    field.classList.remove("is-invalid");
    $(".field__error", field)?.remove();
  }
  form.addEventListener("input", (e) => { const f = fieldOf(e.target); if (f) clearError(f); });
  form.addEventListener("change", (e) => { const f = fieldOf(e.target); if (f) clearError(f); });

  function validate() {
    let first = null;
    const fail = (el, msg) => { setError(fieldOf(el), msg); first = first || el; };
    const v = (n) => form.elements[n].value.trim();
    if (!v("name")) fail(form.elements.name, "Please add your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) fail(form.elements.email, "Please add an email I can reply to.");
    if (!form.querySelector("input[name=service]:checked")) fail(form.querySelector("input[name=service]"), "Pick the closest match.");
    if (v("details").length < 20) fail(form.elements.details, "A couple of sentences is enough to start.");
    if (first) first.focus();
    return !first;
  }

  function collect() {
    const fd = new FormData(form);
    return {
      name: fd.get("name").trim(),
      email: fd.get("email").trim(),
      company: fd.get("company").trim(),
      service: fd.get("service"),
      platforms: fd.getAll("platforms").join(", "),
      budget: fd.get("budget"),
      timeline: fd.get("timeline"),
      nda: fd.get("nda") ? "Yes" : "No",
      details: fd.get("details").trim(),
    };
  }

  function setStatus(msg, ok) {
    statusEl.textContent = msg;
    statusEl.className = `form__status ${ok ? "is-ok" : "is-err"}`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    if (form.elements.botcheck.checked) return; // bot
    if (!validate()) return;
    const d = collect();
    const subject = `Project request: ${d.service} (${d.name})`;

    if (!web3formsKey) {
      const header = [
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        d.company && `Company: ${d.company}`,
        `Service: ${d.service}`,
        d.platforms && `Platforms: ${d.platforms}`,
        d.budget && `Budget: ${d.budget}`,
        d.timeline && `Timeline: ${d.timeline}`,
        `NDA first: ${d.nda}`,
      ].filter(Boolean);
      const body = `${header.join("\n")}\n\n${d.details}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus(`Your email app should open with the request filled in. If it doesn't, email ${email} directly.`, true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject,
          from_name: "tomiwaadesanya.me",
          replyto: d.email,
          botcheck: false,
          ...d,
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || out.success === false) throw new Error(out.message || res.status);
      form.reset();
      setStatus("Thanks, your request is in. I'll reply within two working days.", true);
    } catch (_) {
      setStatus(`That didn't send. Please try again, or email ${email} directly.`, false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send request";
    }
  });

  // ---------- Installer animation ----------
  const installer = $("#installer");
  const steps = $$("[data-step]", installer);
  const bar = $(".progress__bar", installer);
  function finishInstaller() {
    steps.forEach((s) => s.classList.add("is-shown", "is-done"));
    bar.style.width = "100%";
    installer.classList.add("is-finished");
  }
  function runInstaller() {
    let i = 0;
    const tick = () => {
      if (i > 0) steps[i - 1].classList.add("is-done");
      if (i === steps.length) { bar.style.width = "100%"; setTimeout(() => installer.classList.add("is-finished"), 350); return; }
      steps[i].classList.add("is-shown");
      bar.style.width = `${((i + 0.6) / steps.length) * 100}%`;
      i++;
      setTimeout(tick, 520 + Math.random() * 380);
    };
    setTimeout(tick, 400);
  }
  if (reducedMotion) finishInstaller();
  else runInstaller();

  // ---------- Dot field ----------
  // The desktop grid behind the page. Dots near the pointer brighten and drift
  // away from it a little; everything settles back when the pointer leaves.
  (() => {
    const canvas = document.createElement("canvas");
    canvas.className = "dots";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");
    const GAP = 28, RADIUS = 150, PUSH = 7;
    const interactive = !reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let w = 0, h = 0, dpr = 1;
    const target = { x: -1e4, y: -1e4 }, pos = { x: -1e4, y: -1e4 };
    let strength = 0, goal = 0, raf = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const offY = -(window.scrollY % GAP);
      const near = [];
      ctx.fillStyle = "rgba(255,255,255,0.055)";
      ctx.beginPath();
      for (let y = GAP / 2 + offY; y < h + GAP; y += GAP) {
        const fade = 1 - Math.min(1, y / h) * 0.45;
        for (let x = GAP / 2; x < w + GAP; x += GAP) {
          const dx = x - pos.x, dy = y - pos.y;
          const d2 = dx * dx + dy * dy;
          if (strength > 0.01 && d2 < RADIUS * RADIUS) { near.push(x, y, Math.sqrt(d2), dx, dy, fade); continue; }
          ctx.rect(x - 0.6, y - 0.6, 1.2, 1.2);
        }
      }
      ctx.fill();
      for (let i = 0; i < near.length; i += 6) {
        const [x, y, d, dx, dy] = near.slice(i, i + 5);
        const t = 1 - d / RADIUS;
        const e = t * t * strength;
        const k = d > 0 ? (PUSH * e) / d : 0;
        const a = 0.055 + e * 0.55;
        ctx.fillStyle = `rgba(${Math.round(255 - 192 * e)},${Math.round(255 - 70 * e)},${Math.round(255 - 175 * e)},${a})`;
        ctx.beginPath();
        ctx.arc(x + dx * k, y + dy * k, 0.7 + e * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame() {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      strength += (goal - strength) * 0.08;
      draw();
      const moving = Math.abs(target.x - pos.x) > 0.3 || Math.abs(target.y - pos.y) > 0.3 || Math.abs(goal - strength) > 0.005;
      raf = moving ? requestAnimationFrame(frame) : 0;
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", () => (raf ? null : requestAnimationFrame(draw)), { passive: true });
    if (interactive) {
      window.addEventListener("pointermove", (e) => {
        if (pos.x < -1e3) { pos.x = e.clientX; pos.y = e.clientY; }
        target.x = e.clientX; target.y = e.clientY; goal = 1; kick();
      }, { passive: true });
      document.documentElement.addEventListener("pointerleave", () => { goal = 0; kick(); });
    }
    resize();
  })();

  // ---------- Nav state ----------
  const nav = $(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const links = $$(".nav__links a");
  const sio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => sio.observe(s));

  // ---------- Reveal on scroll ----------
  if (!reducedMotion && "IntersectionObserver" in window) {
    const targets = $$(".section__head, .project, .archive__card, .layer, .beyond__card, .phase, .includes, .hire > *");
    targets.forEach((t) => t.classList.add("reveal"));
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); rio.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach((t) => rio.observe(t));
  }
})();
