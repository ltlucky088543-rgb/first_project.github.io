/*
  site.js — builds every page from the two data files.
  You normally don't need to edit this file: change data/site-info.js
  and data/projects.js instead.
*/
(() => {
  "use strict";

  const main = document.getElementById("main");

  // Stop early with a helpful message if a data file has a typo.
  if (!window.SITE || !Array.isArray(window.PROJECTS)) {
    const file = !window.SITE ? "data/site-info.js" : "data/projects.js";
    main.innerHTML = `
      <div class="container"><div class="error-box" role="alert">
        <h1>Couldn't read ${file}</h1>
        <p>This usually means a small typo in that file — a missing comma between items,
        a missing quote, or an extra bracket.</p>
        <p>Press <code>F12</code> and open the <strong>Console</strong> tab to see which line has the problem.</p>
      </div></div>`;
    return;
  }

  const SITE = window.SITE;
  const PROJECTS = window.PROJECTS.filter((p) => p && p.id && !p.hidden);

  const PHASES = {
    plan: { label: "Plan", text: "Define the problem, do research, and set goals." },
    design: { label: "Design", text: "Sketch the interface and structure before coding." },
    build: { label: "Build", text: "Write code in small steps that each work." },
    test: { label: "Test", text: "Try it with real people and tricky cases." },
    fix: { label: "Fix", text: "Track down what broke and explain the fix." },
    reflect: { label: "Reflect", text: "Look back at what worked and what I'd change." },
  };

  const LINK_TYPES = {
    demo: "Live demo",
    code: "View code",
    video: "Watch video",
  };

  const ICON = {
    arrow: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>',
    back: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4"/></svg>',
    external: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3h4v4M13 3L7 9M12 9.5V13H3V4h3.5"/></svg>',
    code: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5"/></svg>',
    video: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3.5v9l7-4.5z"/></svg>',
    mail: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="M2.5 4.5L8 9l5.5-4.5"/></svg>',
    check: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>',
    sun: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="3"/><path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06"/></svg>',
    moon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M13.5 9.6A5.5 5.5 0 0 1 6.4 2.5a5.5 5.5 0 1 0 7.1 7.1z"/></svg>',
  };

  /* ---------- Text helpers ---------- */

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // Inline formatting: `code`, **bold**, *italic*, [link](url)
  function inline(text) {
    return String(text ?? "")
      .split(/(`[^`]+`)/g)
      .map((part, i) => {
        if (i % 2) return `<code>${esc(part.slice(1, -1))}</code>`;
        return esc(part)
          .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
          .replace(/\*([^*]+)\*/g, "<em>$1</em>")
          .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => {
            if (/^\s*javascript:/i.test(url)) return label;
            const external = /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : "";
            return `<a href="${url}"${external}>${label}</a>`;
          });
      })
      .join("");
  }

  // Paragraphs are separated by a blank line; lines starting with "- " become a list.
  function md(text) {
    if (Array.isArray(text)) text = text.join("\n\n");
    if (!text) return "";
    const out = [];
    let para = [];
    let list = [];
    const flushPara = () => { if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`); para = []; };
    const flushList = () => { if (list.length) out.push(`<ul>${list.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`); list = []; };
    for (const raw of String(text).split("\n")) {
      const line = raw.trim();
      if (!line) { flushPara(); flushList(); }
      else if (/^[-*]\s+/.test(line)) { flushPara(); list.push(line.replace(/^[-*]\s+/, "")); }
      else { flushList(); para.push(line); }
    }
    flushPara();
    flushList();
    return out.join("");
  }

  // Removes the shared indentation from code snippets written inside the data file.
  function dedent(text) {
    const lines = String(text || "").replace(/\t/g, "  ").replace(/^\s*\n/, "").replace(/\s+$/, "").split("\n");
    const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
    const cut = indents.length ? Math.min(...indents) : 0;
    return lines.map((l) => l.slice(cut)).join("\n");
  }

  /* ---------- Date helpers ---------- */

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // "2025-09-14" → "Sep 14, 2025", "2025-09" → "Sep 2025"
  function fmtDate(value) {
    if (!value) return "";
    const [y, m, d] = String(value).split("-").map(Number);
    if (!m) return String(y);
    return d ? `${MONTHS[m - 1]} ${d}, ${y}` : `${MONTHS[m - 1]} ${y}`;
  }

  function fmtRange(p) {
    const end = p.end ? fmtDate(p.end) : "Present";
    if (!p.start) return end;
    const s = String(p.start).split("-");
    const e = String(p.end || "").split("-");
    if (p.end && s.length === 2 && e.length === 2 && s[0] === e[0]) return `${MONTHS[s[1] - 1]} – ${end}`;
    return `${fmtDate(p.start)} – ${end}`;
  }

  /* ---------- Project helpers ---------- */

  const inProgress = (p) => !p.end || /progress/i.test(p.status || "");
  const statusText = (p) => p.status || (p.end ? "Completed" : "In progress");
  const statusBadge = (p) =>
    `<span class="status" data-status="${inProgress(p) ? "in-progress" : "done"}">${esc(statusText(p))}</span>`;
  const projectUrl = (p) => `project.html?id=${encodeURIComponent(p.id)}`;
  const plural = (n, word, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

  const phaseKey = (phase) => {
    const key = String(phase || "").trim().toLowerCase();
    return key in PHASES ? key : "other";
  };
  const phaseLabel = (phase) => (PHASES[phaseKey(phase)] || {}).label || String(phase || "Note");
  const phaseChip = (phase, extra = "") =>
    `<span class="phase" data-phase="${phaseKey(phase)}">${esc(phaseLabel(phase))}${extra}</span>`;

  const initialsOf = (text) =>
    String(text || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const hueFor = (p) =>
    Number.isFinite(p.hue) ? p.hue : [...String(p.id)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);

  // Dev-log entries in date order, numbered from 1.
  const sortedLog = (p) =>
    (p.log || [])
      .map((e, i) => ({ ...e, order: i }))
      .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")) || a.order - b.order)
      .map((e, i) => ({ ...e, n: i + 1 }));

  // Newest first; in-progress projects (no end date) go to the top.
  PROJECTS.sort(
    (a, b) =>
      String(b.end || "9999").localeCompare(String(a.end || "9999")) ||
      String(b.start || "").localeCompare(String(a.start || ""))
  );

  const allEntries = () =>
    PROJECTS.flatMap((p) => sortedLog(p).map((e) => ({ ...e, project: p })))
      .filter((e) => e.date)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const needsSetup = () => !SITE.name || SITE.name === "Your Name" || PROJECTS.some((p) => p.example);

  /* ---------- Shared pieces ---------- */

  function cover(p) {
    if (p.cover) {
      return `<div class="cover"><img src="${esc(p.cover)}" alt="${esc(p.coverAlt || `Screenshot of ${p.title}`)}" loading="lazy"></div>`;
    }
    return `<div class="cover cover-art" style="--h:${hueFor(p)}" aria-hidden="true">
      <span class="art-label">${esc((p.tags || []).slice(0, 3).join(" · "))}</span>
      <span class="art-initials">${esc(initialsOf(p.title))}</span>
    </div>`;
  }

  function tagList(p, linked) {
    const tags = (p.tags || []).map((t) =>
      linked
        ? `<li><a class="tag" href="projects.html?tag=${encodeURIComponent(t)}">${esc(t)}</a></li>`
        : `<li><span class="tag">${esc(t)}</span></li>`
    );
    if (p.example) tags.unshift('<li><span class="tag tag-example">Example</span></li>');
    return tags.length ? `<ul class="tags" aria-label="Technologies">${tags.join("")}</ul>` : "";
  }

  function projectCard(p) {
    const entries = (p.log || []).length;
    return `<article class="project-card">
      ${cover(p)}
      <div class="card-body">
        <div class="card-meta">${statusBadge(p)}<span aria-hidden="true">·</span><span>${esc(fmtRange(p))}</span></div>
        <h3><a href="${projectUrl(p)}">${esc(p.title)}</a></h3>
        <p>${esc(p.summary)}</p>
        ${tagList(p, false)}
        <div class="card-foot">
          <span class="mono-muted">${plural(entries, "log entry", "log entries")}${p.hours ? ` · ${esc(p.hours)} h` : ""}</span>
          <span class="card-cta">Read the dev log ${ICON.arrow}</span>
        </div>
      </div>
    </article>`;
  }

  function renderHeader(page) {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    const home = page === "home" ? "" : "index.html";
    const items = [
      { href: "projects.html", label: "Projects", current: page === "projects" || page === "project" },
      { href: `${home}#about`, label: "About" },
      { href: `${home}#contact`, label: "Contact" },
    ];
    const notice = needsSetup()
      ? `<div class="notice" role="note"><div class="container">
          <strong>Setup</strong>
          <span>This site still shows example content. Replace it in <code>data/site-info.js</code> and <code>data/projects.js</code> before you share the link.</span>
        </div></div>`
      : "";
    mount.outerHTML = `${notice}
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="${esc(SITE.name)}, home">
            <span class="brand-mark" aria-hidden="true">${esc(SITE.initials || initialsOf(SITE.name))}</span>
            <span class="brand-name">${esc(SITE.name)}</span>
          </a>
          <nav class="nav" aria-label="Main">
            ${items.map((it) => `<a href="${it.href}"${it.current ? ' aria-current="page"' : ""}>${it.label}</a>`).join("")}
          </nav>
          <button class="icon-btn theme-toggle" type="button"></button>
        </div>
      </header>`;
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;
    const latest = allEntries()[0];
    mount.outerHTML = `<footer class="site-footer">
      <div class="container footer-inner">
        <span>© ${new Date().getFullYear()} ${esc(SITE.name)}</span>
        <span>${latest ? `Last dev-log entry ${esc(fmtDate(latest.date))} · ` : ""}Made with HTML, CSS &amp; JavaScript</span>
      </div>
    </footer>`;
  }

  function setupThemeToggle() {
    const btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const current = () => document.documentElement.dataset.theme || (media.matches ? "dark" : "light");
    const paint = () => {
      const dark = current() === "dark";
      const label = dark ? "Switch to light theme" : "Switch to dark theme";
      btn.innerHTML = dark ? ICON.sun : ICON.moon;
      btn.setAttribute("aria-label", label);
      btn.title = label;
    };
    btn.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: theme lasts this visit only */ }
      paint();
    });
    if (media.addEventListener) media.addEventListener("change", paint);
    paint();
  }

  /* ---------- Home page ---------- */

  function renderHome() {
    document.title = `${SITE.name} · Project portfolio`;
    const entries = allEntries();
    const latest = entries[0];
    const hours = PROJECTS.reduce((sum, p) => sum + (Number(p.hours) || 0), 0);
    const tech = new Set(PROJECTS.flatMap((p) => p.tags || []));
    const featured = PROJECTS.filter((p) => p.featured);
    const shown = featured.length ? featured : PROJECTS.slice(0, 3);
    const links = (SITE.links || []).filter((l) => l && l.url);

    main.innerHTML = `
      <section class="hero">
        <div class="container hero-grid">
          <div>
            <p class="eyebrow">${esc(SITE.role)}</p>
            <h1>${inline(SITE.headline)}</h1>
            <p class="lead">${inline(SITE.intro)}</p>
            <div class="actions">
              <a class="btn btn-primary" href="projects.html">See my projects ${ICON.arrow}</a>
              <a class="btn" href="#contact">Get in touch</a>
            </div>
          </div>
          <aside class="notebook" aria-label="Portfolio at a glance">
            <p class="notebook-title">Portfolio at a glance</p>
            <dl class="stat-list">
              <div><dt>Projects</dt><dd>${PROJECTS.length}</dd></div>
              <div><dt>Hours of work</dt><dd>${hours}</dd></div>
              <div><dt>Dev-log entries</dt><dd>${entries.length}</dd></div>
              <div><dt>Technologies</dt><dd>${tech.size}</dd></div>
            </dl>
            ${latest ? `<p class="notebook-foot">
              <span class="mono-muted">Latest entry · ${esc(fmtDate(latest.date))}</span>
              <a href="${projectUrl(latest.project)}#entry-${latest.n}">${esc(latest.title)}</a>
              <span>${esc(latest.project.title)}</span>
            </p>` : ""}
          </aside>
        </div>
      </section>

      <section class="section" id="projects">
        <div class="container">
          <div class="section-head">
            <div>
              <h2>Featured projects</h2>
              <p>Each project links to a full development log: the problem, the plan, what broke, and what I learned.</p>
            </div>
            <a class="link-arrow" href="projects.html">All projects ${ICON.arrow}</a>
          </div>
          ${shown.length
            ? `<div class="card-grid">${shown.map(projectCard).join("")}</div>`
            : '<p class="lead">No projects yet. Add your first one in <code>data/projects.js</code>.</p>'}
        </div>
      </section>

      ${entries.length ? `
      <section class="section" id="devlog">
        <div class="container">
          <div class="section-head">
            <div>
              <h2>Latest from the dev log</h2>
              <p>Recent entries across all my projects, newest first.</p>
            </div>
          </div>
          <ol class="activity">
            ${entries.slice(0, 5).map((e) => `
              <li><a href="${projectUrl(e.project)}#entry-${e.n}">
                <time datetime="${esc(e.date)}">${esc(fmtDate(e.date))}</time>
                ${phaseChip(e.phase)}
                <span class="a-main"><span class="a-title">${esc(e.title)}</span><span class="a-project">${esc(e.project.title)}</span></span>
                <span class="a-arrow">${ICON.arrow}</span>
              </a></li>`).join("")}
          </ol>
        </div>
      </section>` : ""}

      <section class="section" id="process">
        <div class="container">
          <div class="section-head">
            <div>
              <h2>How I document my work</h2>
              <p>${inline(SITE.processIntro || "Every project page has a dated development log. Each entry is tagged with the stage of work it belongs to, so you can see how a project actually came together, including the mistakes.")}</p>
            </div>
          </div>
          <ol class="process">
            ${Object.entries(PHASES).map(([key, ph]) => `<li data-phase="${key}">${phaseChip(key)}<p>${esc(ph.text)}</p></li>`).join("")}
          </ol>
        </div>
      </section>

      <section class="section" id="about">
        <div class="container about-grid">
          <div>
            <p class="eyebrow">About</p>
            <h2>${esc(SITE.aboutTitle || "About me")}</h2>
            <div class="prose">${md(SITE.about)}</div>
          </div>
          <div>
            ${(SITE.facts || []).length ? `<dl class="facts">
              ${SITE.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${inline(f.value)}</dd></div>`).join("")}
            </dl>` : ""}
            ${(SITE.skills || []).length ? `<div class="skills">
              ${SITE.skills.map((g) => `<div>
                <h3>${esc(g.group)}</h3>
                <ul class="tags">${(g.items || []).map((s) => `<li><span class="tag">${esc(s)}</span></li>`).join("")}</ul>
              </div>`).join("")}
            </div>` : ""}
          </div>
        </div>
      </section>

      <section class="section" id="contact">
        <div class="container">
          <div class="contact-card">
            <div>
              <h2>${esc(SITE.contactTitle || "Let's talk")}</h2>
              <p>${inline(SITE.contactText || "Questions about a project? I'm happy to walk through how I built it.")}</p>
            </div>
            <div class="actions">
              ${SITE.email ? `<a class="btn btn-primary" href="mailto:${esc(SITE.email)}">${ICON.mail} ${esc(SITE.email)}</a>` : ""}
              ${links.map((l) => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${ICON.external}</a>`).join("")}
            </div>
          </div>
        </div>
      </section>`;
  }

  /* ---------- All projects page ---------- */

  function renderProjects() {
    document.title = `Projects · ${SITE.name}`;
    const counts = new Map();
    PROJECTS.forEach((p) => (p.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    const tags = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b));

    let active = new URLSearchParams(location.search).get("tag");
    if (!counts.has(active)) active = null;

    main.innerHTML = `
      <section class="container page-head">
        <p class="eyebrow">Portfolio</p>
        <h1>Projects</h1>
        <p class="lead">${inline(SITE.projectsIntro || "Everything I've built, newest first. Open any project to read its development log.")}</p>
      </section>
      <section class="container page-body">
        ${tags.length ? `<div class="filters" role="group" aria-label="Filter by technology">
          <button class="chip" type="button" data-tag="">All<span class="count">${PROJECTS.length}</span></button>
          ${tags.map((t) => `<button class="chip" type="button" data-tag="${esc(t)}">${esc(t)}<span class="count">${counts.get(t)}</span></button>`).join("")}
        </div>` : ""}
        <p class="result-count" aria-live="polite"></p>
        <div class="card-grid"></div>
      </section>`;

    const grid = main.querySelector(".card-grid");
    const countEl = main.querySelector(".result-count");
    const chips = [...main.querySelectorAll(".chip")];

    function apply() {
      const list = active ? PROJECTS.filter((p) => (p.tags || []).includes(active)) : PROJECTS;
      grid.innerHTML = list.length
        ? list.map(projectCard).join("")
        : '<p class="lead">No projects yet. Add your first one in <code>data/projects.js</code>.</p>';
      countEl.textContent = active ? `${plural(list.length, "project")} using ${active}` : plural(list.length, "project");
      chips.forEach((c) => c.setAttribute("aria-pressed", String((c.dataset.tag || null) === active)));
      try {
        history.replaceState(null, "", active ? `?tag=${encodeURIComponent(active)}` : location.pathname);
      } catch (e) { /* some browsers block this on file:// pages */ }
    }

    chips.forEach((c) => c.addEventListener("click", () => { active = c.dataset.tag || null; apply(); }));
    apply();
  }

  /* ---------- Single project page ---------- */

  function goalHtml(goal) {
    const g = typeof goal === "string" ? { text: goal } : goal;
    const state = g.done === true ? "done" : g.done === false ? "todo" : "plain";
    return `<li class="${state}">
      <span class="check">${state === "done" ? ICON.check : ""}</span>
      <span>${inline(g.text)}${g.note ? `<span class="goal-note">(${esc(g.note)})</span>` : ""}
      <span class="visually-hidden">${state === "done" ? " — done" : state === "todo" ? " — not done yet" : ""}</span></span>
    </li>`;
  }

  function entryHtml(e) {
    const images = e.images || (e.image ? [{ src: e.image, caption: e.caption, alt: e.alt }] : []);
    const code = e.code ? (typeof e.code === "string" ? { text: e.code } : e.code) : null;
    return `<li class="entry" id="entry-${e.n}" data-phase="${phaseKey(e.phase)}">
      <div class="entry-head">
        ${phaseChip(e.phase)}
        ${e.date ? `<time datetime="${esc(e.date)}">${esc(fmtDate(e.date))}</time>` : ""}
        ${e.hours ? `<span class="entry-hours">· ${esc(e.hours)} h</span>` : ""}
        <a class="entry-anchor" href="#entry-${e.n}" aria-label="Link to entry ${e.n}">#${e.n}</a>
      </div>
      <h3>${esc(e.title)}</h3>
      <div class="prose">${md(e.body)}</div>
      ${images.length ? `<div class="figures${images.length > 1 ? " two" : ""}">
        ${images.map((img) => `<figure>
          <img src="${esc(img.src)}" alt="${esc(img.alt || img.caption || "")}" loading="lazy">
          ${img.caption ? `<figcaption>${inline(img.caption)}</figcaption>` : ""}
        </figure>`).join("")}
      </div>` : ""}
      ${code ? `<div class="code">
        ${code.file ? `<div class="code-label">${esc(code.file)}</div>` : ""}
        <pre><code>${esc(dedent(code.text))}</code></pre>
      </div>` : ""}
    </li>`;
  }

  function renderProject() {
    const id = new URLSearchParams(location.search).get("id");
    const index = PROJECTS.findIndex((p) => p.id === id);

    if (index < 0) {
      document.title = `Project not found · ${SITE.name}`;
      main.innerHTML = `<section class="container empty">
        <p class="eyebrow">Not found</p>
        <h1>That project doesn't exist</h1>
        <p class="lead">The link may be out of date, or the project's <code>id</code> was changed.</p>
        <div class="actions"><a class="btn btn-primary" href="projects.html">See all projects ${ICON.arrow}</a></div>
      </section>`;
      return;
    }

    const p = PROJECTS[index];
    document.title = `${p.title} · ${SITE.name}`;
    const log = sortedLog(p);
    const goals = p.goals || [];
    const challenges = p.challenges || [];
    const learned = p.learned || [];
    const next = p.next || [];

    const phaseCounts = {};
    log.forEach((e) => { const k = phaseKey(e.phase); phaseCounts[k] = (phaseCounts[k] || 0) + 1; });
    const phasesUsed = [...Object.keys(PHASES), "other"].filter((k) => phaseCounts[k]);
    const labelFor = (k) => (PHASES[k] ? PHASES[k].label : "Note");

    const linkOrder = Object.keys(LINK_TYPES);
    const links = Object.entries(p.links || {})
      .filter(([, url]) => url)
      .sort(([a], [b]) => (linkOrder.indexOf(a) + 1 || 99) - (linkOrder.indexOf(b) + 1 || 99));

    const sections = [];
    if (p.problem) sections.push({ id: "problem", title: "The problem", html: `<div class="prose">${md(p.problem)}</div>` });
    if (goals.length) sections.push({ id: "goals", title: "Goals", html: `<ul class="checklist">${goals.map(goalHtml).join("")}</ul>` });
    if (log.length) {
      sections.push({
        id: "devlog",
        title: "Development log",
        html: `${phasesUsed.length > 1 ? `<div class="phase-filter" role="group" aria-label="Filter log by phase">
            <button class="chip" type="button" data-filter="all" aria-pressed="true">All<span class="count">${log.length}</span></button>
            ${phasesUsed.map((k) => `<button class="chip" type="button" data-filter="${k}" data-phase="${k}" aria-pressed="false"><span class="dot"></span>${labelFor(k)}<span class="count">${phaseCounts[k]}</span></button>`).join("")}
          </div>` : ""}
          <ol class="timeline">${log.map(entryHtml).join("")}</ol>`,
      });
    }
    if (challenges.length) {
      sections.push({
        id: "challenges",
        title: "Challenges &amp; solutions",
        html: `<div class="challenges">${challenges.map((c) => `<div class="challenge">
          <div><p class="label label-problem">Problem</p><div class="prose">${md(c.problem)}</div></div>
          <div><p class="label label-solution">Solution</p><div class="prose">${md(c.solution)}</div></div>
        </div>`).join("")}</div>`,
      });
    }
    if (learned.length) sections.push({ id: "learned", title: "What I learned", html: `<ol class="learned">${learned.map((l) => `<li><span>${inline(l)}</span></li>`).join("")}</ol>` });
    if (next.length) sections.push({ id: "next", title: "What's next", html: `<div class="prose"><ul>${next.map((n) => `<li>${inline(n)}</li>`).join("")}</ul></div>` });

    const newer = PROJECTS[index - 1];
    const older = PROJECTS[index + 1];

    main.innerHTML = `
      <article>
        <header class="container project-hero">
          <a class="back" href="projects.html">${ICON.back} All projects</a>
          <div class="project-hero-meta">${statusBadge(p)}<span>${esc(fmtRange(p))}</span>${p.role ? `<span>${esc(p.role)}</span>` : ""}</div>
          <h1>${esc(p.title)}</h1>
          <p class="lead">${inline(p.summary)}</p>
          ${tagList(p, true)}
          ${links.length ? `<div class="actions">${links.map(([type, url], i) => `<a class="btn${i === 0 ? " btn-primary" : ""}" href="${esc(url)}" target="_blank" rel="noopener">${ICON[type] || ICON.external} ${esc(LINK_TYPES[type] || type)}</a>`).join("")}</div>` : ""}
        </header>

        <div class="container hero-cover">${cover(p)}</div>

        <div class="container project-layout">
          <aside class="project-aside">
            <div class="glance">
              <p class="aside-title">At a glance</p>
              <dl>
                <div><dt>Timeline</dt><dd>${esc(fmtRange(p))}</dd></div>
                <div><dt>Status</dt><dd>${statusBadge(p)}</dd></div>
                ${p.role ? `<div><dt>Role</dt><dd>${esc(p.role)}</dd></div>` : ""}
                ${p.hours ? `<div><dt>Time spent</dt><dd>About ${esc(p.hours)} hours</dd></div>` : ""}
                ${(p.tags || []).length ? `<div><dt>Built with</dt><dd>${esc(p.tags.join(", "))}</dd></div>` : ""}
                ${log.length ? `<div class="glance-process">
                  <dt>Process · ${plural(log.length, "log entry", "log entries")}</dt>
                  <dd>
                    <div class="phase-bar" aria-hidden="true">${phasesUsed.map((k) => `<span data-phase="${k}" style="flex:${phaseCounts[k]}" title="${labelFor(k)}: ${phaseCounts[k]}"></span>`).join("")}</div>
                    <div class="phase-summary">${phasesUsed.map((k) => phaseChip(k, ` ${phaseCounts[k]}`)).join("")}</div>
                  </dd>
                </div>` : ""}
              </dl>
            </div>
            ${sections.length > 1 ? `<nav class="toc" aria-label="On this page">
              <p class="aside-title">On this page</p>
              <ol>${sections.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join("")}</ol>
            </nav>` : ""}
          </aside>

          <div class="project-main">
            ${sections.map((s, i) => `<section id="${s.id}" aria-labelledby="${s.id}-title">
              <h2 id="${s.id}-title"><span class="section-num">${String(i + 1).padStart(2, "0")}</span>${s.title}</h2>
              ${s.html}
            </section>`).join("")}
          </div>
        </div>

        ${newer || older ? `<nav class="container pager" aria-label="More projects">
          ${newer ? `<a class="prev" href="${projectUrl(newer)}"><span class="dir">${ICON.back} Newer project</span><span class="t">${esc(newer.title)}</span></a>` : "<span></span>"}
          ${older ? `<a class="next" href="${projectUrl(older)}"><span class="dir">Older project ${ICON.arrow}</span><span class="t">${esc(older.title)}</span></a>` : ""}
        </nav>` : ""}
      </article>`;

    // Phase filter for the timeline
    const filter = main.querySelector(".phase-filter");
    if (filter) {
      filter.addEventListener("click", (ev) => {
        const btn = ev.target.closest("button[data-filter]");
        if (!btn) return;
        const key = btn.dataset.filter;
        filter.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        main.querySelectorAll(".entry").forEach((li) => { li.hidden = key !== "all" && li.dataset.phase !== key; });
      });
    }

    // Highlight the current section in "On this page"
    const tocLinks = [...main.querySelectorAll(".toc a")];
    if (tocLinks.length && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((items) => {
        items.forEach((item) => {
          if (!item.isIntersecting) return;
          tocLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${item.target.id}`));
        });
      }, { rootMargin: "-25% 0px -65% 0px" });
      sections.forEach((s) => observer.observe(document.getElementById(s.id)));
    }
  }

  /* ---------- Start ---------- */

  const page = document.body.dataset.page;
  renderHeader(page);
  if (page === "home") renderHome();
  else if (page === "projects") renderProjects();
  else if (page === "project") renderProject();
  renderFooter();
  setupThemeToggle();

  // Content is built after load, so jump to #links ourselves.
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
})();
