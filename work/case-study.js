/**
 * ─── CASE STUDY ENGINE v2.0 ──────────────────────────────────
 *
 * HOW ADMIN MODE WORKS:
 *   Double-click the footer "ASHISH" logo OR press Ctrl+Shift+A
 *   → A password modal appears → enter password → admin controls show.
 *   Admin flag stored in localStorage so it persists across sessions.
 *   Click "Logout" in the admin bar to exit admin mode.
 *
 * HOW DATA IS STORED:
 *   - Project text edits: localStorage["portfolio_edits"]
 *     Format: { "projectId_0": { title, problem, solution }, ... }
 *   - Uploaded images:    localStorage["portfolio_images"]
 *     Format: { "projectId_0": ["data:image/..."], ... }
 *
 * HOW TO EXTEND PROJECTS:
 *   Add entries to categoryProjects[] in projects-data.js.
 *   Each needs: title, image, problem, solution, tools[], liveDemo, github.
 * ──────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ═══ CONFIG ═══════════════════════════════════════════════ */
  const ADMIN_PASS = 'ashish2025';
  const SK = { admin: 'portfolio_admin_auth', edits: 'portfolio_edits', images: 'portfolio_images' };

  /* ═══ THEME INIT ═══════════════════════════════════════════ */
  if (localStorage.getItem('theme') === 'light' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    document.body.classList.add('light-mode');
  }

  /* ═══ DATA ════════════════════════════════════════════════ */
  const projectId = document.body.getAttribute('data-project');
  if (!projectId || !PROJECTS_DATA[projectId]) return;
  const P = PROJECTS_DATA[projectId];
  const C = P.categoryColor;

  /* ═══ STORAGE HELPERS ═════════════════════════════════════ */
  function getStore(key) { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; } }
  function setStore(key, obj) { localStorage.setItem(key, JSON.stringify(obj)); }
  function projKey(i) { return projectId + '_' + i; }

  function getEdits(i) { return getStore(SK.edits)[projKey(i)] || null; }
  function saveEdits(i, data) { const s = getStore(SK.edits); s[projKey(i)] = data; setStore(SK.edits, s); }

  function getImages(i) { return getStore(SK.images)[projKey(i)] || []; }
  function addImage(i, dataUrl) { const s = getStore(SK.images); if (!s[projKey(i)]) s[projKey(i)] = []; s[projKey(i)].push(dataUrl); setStore(SK.images, s); }

  /* ═══ ADMIN MODULE ════════════════════════════════════════ */
  const isAdmin = () => localStorage.getItem(SK.admin) === 'true';

  function adminLogin(pw) {
    if (pw === ADMIN_PASS) { localStorage.setItem(SK.admin, 'true'); return true; }
    return false;
  }

  function adminLogout() { localStorage.removeItem(SK.admin); location.reload(); }

  function initAdmin() {
    if (isAdmin()) document.body.classList.add('admin-mode');
    createAdminBar();
    createAdminModal();
    attachAdminTriggers();
  }

  function createAdminBar() {
    const bar = document.createElement('div');
    bar.id = 'admin-bar';
    bar.className = 'cs-admin-bar';
    bar.innerHTML = '<div class="cs-admin-bar-inner"><span class="cs-admin-badge">🔐 Admin Mode</span><button id="admin-logout" class="cs-admin-logout">Logout</button></div>';
    document.body.prepend(bar);
    document.getElementById('admin-logout').addEventListener('click', adminLogout);
  }

  function createAdminModal() {
    const m = document.createElement('div');
    m.id = 'admin-modal';
    m.className = 'cs-admin-modal';
    m.innerHTML = `<div class="cs-modal-bg"></div><div class="cs-modal-box">
      <h3>🔒 Admin Login</h3><p>Enter password to enable editing.</p>
      <input type="password" id="admin-pw" placeholder="Password" autocomplete="off"/>
      <div id="admin-err" class="cs-modal-err"></div>
      <div class="cs-modal-btns"><button id="admin-cancel" class="cs-mbtn cs-mbtn-cancel">Cancel</button><button id="admin-go" class="cs-mbtn cs-mbtn-login">Login</button></div>
    </div>`;
    document.body.appendChild(m);
    document.getElementById('admin-cancel').addEventListener('click', hideModal);
    m.querySelector('.cs-modal-bg').addEventListener('click', hideModal);
    document.getElementById('admin-go').addEventListener('click', tryLogin);
    document.getElementById('admin-pw').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  }

  function showModal() { document.getElementById('admin-modal').classList.add('active'); document.getElementById('admin-pw').focus(); }
  function hideModal() { const m = document.getElementById('admin-modal'); m.classList.remove('active'); document.getElementById('admin-pw').value = ''; document.getElementById('admin-err').textContent = ''; }

  function tryLogin() {
    const pw = document.getElementById('admin-pw').value;
    if (adminLogin(pw)) { hideModal(); location.reload(); }
    else { document.getElementById('admin-err').textContent = 'Wrong password.'; document.getElementById('admin-pw').value = ''; }
  }

  function attachAdminTriggers() {
    // Double-click footer logo
    const logo = document.querySelector('.cs-footer-logo');
    if (logo) logo.addEventListener('dblclick', e => { e.preventDefault(); isAdmin() ? adminLogout() : showModal(); });
    // Ctrl+Shift+A
    document.addEventListener('keydown', e => { if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); if (!isAdmin()) showModal(); } });
  }

  /* ═══ IMAGE SLIDER ════════════════════════════════════════ */
  function initSlider(container) {
    const slides = container.querySelectorAll('.cs-slide');
    const dots = container.querySelector('.cs-slider-dots');
    if (slides.length <= 1) { container.classList.add('single'); return; }
    // Build dots
    dots.innerHTML = Array.from(slides).map((_, i) => `<span class="cs-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`).join('');
    let cur = 0;
    function goTo(n) {
      slides[cur].classList.remove('active');
      dots.children[cur].classList.remove('active');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('active');
      dots.children[cur].classList.add('active');
    }
    container.querySelector('.cs-arrow-prev').addEventListener('click', () => goTo(cur - 1));
    container.querySelector('.cs-arrow-next').addEventListener('click', () => goTo(cur + 1));
    dots.addEventListener('click', e => { if (e.target.dataset.i !== undefined) goTo(+e.target.dataset.i); });
  }

  /* ═══ INLINE EDITING (Admin only) ═════════════════════════ */
  function attachEditing(card, projIndex) {
    const editBtn = card.querySelector('.cs-edit-btn');
    const saveBtn = card.querySelector('.cs-save-btn');
    const cancelBtn = card.querySelector('.cs-cancel-btn');
    const titleEl = card.querySelector('.cs-pcard-title');
    const problemEl = card.querySelector('[data-field="problem"]');
    const solutionEl = card.querySelector('[data-field="solution"]');
    const editActions = card.querySelector('.cs-edit-actions');
    let origData = {};

    editBtn.addEventListener('click', () => {
      origData = { title: titleEl.textContent, problem: problemEl.textContent, solution: solutionEl.textContent };
      [titleEl, problemEl, solutionEl].forEach(el => { el.contentEditable = 'true'; el.classList.add('editing'); });
      editActions.style.display = 'flex';
      editBtn.style.display = 'none';
    });

    saveBtn.addEventListener('click', () => {
      saveEdits(projIndex, { title: titleEl.textContent.trim(), problem: problemEl.textContent.trim(), solution: solutionEl.textContent.trim() });
      exitEdit(card);
    });

    cancelBtn.addEventListener('click', () => {
      titleEl.textContent = origData.title;
      problemEl.textContent = origData.problem;
      solutionEl.textContent = origData.solution;
      exitEdit(card);
    });
  }

  function exitEdit(card) {
    card.querySelectorAll('[contenteditable]').forEach(el => { el.contentEditable = 'false'; el.classList.remove('editing'); });
    const ea = card.querySelector('.cs-edit-actions'); if (ea) ea.style.display = 'none';
    const eb = card.querySelector('.cs-edit-btn'); if (eb) eb.style.display = '';
  }

  /* ═══ IMAGE UPLOAD (Admin only) ═══════════════════════════ */
  function attachUpload(card, projIndex) {
    const addBtn = card.querySelector('.cs-add-img-btn');
    const fileInput = card.querySelector('.cs-img-input');
    if (!addBtn || !fileInput) return;

    addBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        addImage(projIndex, e.target.result);
        rebuildSlider(card, projIndex);
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    });
  }

  function rebuildSlider(card, projIndex) {
    const proj = P.categoryProjects[projIndex];
    const sliderEl = card.querySelector('.cs-pcard-slider');
    const allImages = buildImageList(proj, projIndex);
    const track = sliderEl.querySelector('.cs-slider-track');
    track.innerHTML = allImages.map((src, i) =>
      `<div class="cs-slide${i === 0 ? ' active' : ''}"><img src="${src}" alt="Screenshot" loading="lazy"/></div>`
    ).join('') || `<div class="cs-slide active"><div class="cs-pcard-placeholder ${C}"><span>Coming Soon</span></div></div>`;
    sliderEl.classList.remove('single');
    initSlider(sliderEl);
  }

  function buildImageList(proj, index) {
    const imgs = [];
    if (proj.image) imgs.push(proj.image);
    const extra = getImages(index);
    return imgs.concat(extra);
  }

  /* ═══ PAGE TRANSITION ═════════════════════════════════════ */
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    const numEl = overlay.querySelector('.transition-num');
    const labelEl = overlay.querySelector('.transition-label');
    if (numEl) numEl.textContent = P.num;
    if (labelEl) labelEl.textContent = P.category;
    setTimeout(() => { overlay.classList.add('fade-out'); setTimeout(() => { overlay.style.display = 'none'; }, 700); }, 600);
  }

  /* ═══ SECTION 1: HERO ═════════════════════════════════════ */
  const heroSection = document.getElementById('cs-hero');
  if (heroSection) {
    const heroBg = heroSection.querySelector('.cs-hero-bg');
    if (heroBg) heroBg.classList.add(C);
    const numBadge = document.getElementById('cs-hero-num');
    if (numBadge) { numBadge.textContent = P.num; numBadge.classList.add(C); }
    const catLabel = document.getElementById('cs-hero-cat');
    if (catLabel) { catLabel.textContent = '// ' + P.category; catLabel.classList.add(C); }
    const titleEl = document.getElementById('cs-hero-title');
    if (titleEl) titleEl.textContent = P.category + ' Projects';
    const taglineEl = document.getElementById('cs-hero-tagline');
    if (taglineEl) taglineEl.textContent = P.tagline;
  }

  /* ═══ SECTION 2: PROJECT CARDS (with slider, editing, tools) ══ */
  const projectListEl = document.getElementById('cs-project-list');
  const projectsLabel = document.getElementById('cs-projects-label');
  const projectsLine = document.getElementById('cs-projects-line');
  if (projectsLabel) projectsLabel.classList.add(C);
  if (projectsLine) projectsLine.classList.add(C);

  if (projectListEl && P.categoryProjects) {
    projectListEl.innerHTML = P.categoryProjects.map((proj, i) => {
      // Merge localStorage edits
      const edits = getEdits(i);
      const title = edits?.title || proj.title;
      const problem = edits?.problem || proj.problem;
      const solution = edits?.solution || proj.solution;

      // Build image slider slides
      const allImages = buildImageList(proj, i);
      let slidesHTML;
      if (allImages.length > 0) {
        slidesHTML = allImages.map((src, si) => `<div class="cs-slide${si === 0 ? ' active' : ''}"><img src="${src}" alt="${title}" loading="lazy"/></div>`).join('');
      } else {
        slidesHTML = `<div class="cs-slide active"><div class="cs-pcard-placeholder ${C}"><span>Coming Soon</span></div></div>`;
      }

      // Buttons
      const demoBtn = proj.liveDemo ? `<a href="${proj.liveDemo}" class="cs-pcard-btn cs-pcard-btn-demo" target="_blank" rel="noopener">Live Demo ↗</a>` : '';

      // Tools badges
      const toolsHTML = (proj.tools || []).map(t => `<span class="cs-tool-pill ${C}">${t}</span>`).join('');

      return `
      <div class="cs-pcard cs-sr d${(i % 3) + 1}" data-proj-key="${projKey(i)}">
        <!-- IMAGE SLIDER -->
        <div class="cs-pcard-slider">
          <div class="cs-slider-track">${slidesHTML}</div>
          <button class="cs-arrow-prev cs-slider-arrow" aria-label="Previous">‹</button>
          <button class="cs-arrow-next cs-slider-arrow" aria-label="Next">›</button>
          <div class="cs-slider-dots"></div>
          <button class="cs-admin-ctrl cs-add-img-btn" title="Add Image">+ Add Image</button>
          <input type="file" class="cs-img-input" accept="image/*" hidden/>
        </div>
        <!-- CARD BODY -->
        <div class="cs-pcard-body">
          <div class="cs-pcard-header">
            <h3 class="cs-pcard-title">${title}</h3>
            <button class="cs-admin-ctrl cs-edit-btn" title="Edit">✏️</button>
          </div>
          <div class="cs-pcard-section"><div class="cs-pcard-label ${C}">Problem</div><p class="cs-pcard-text" data-field="problem">${problem}</p></div>
          <div class="cs-pcard-section"><div class="cs-pcard-label ${C}">Solution</div><p class="cs-pcard-text" data-field="solution">${solution}</p></div>
          <div class="cs-pcard-buttons">${demoBtn}</div>
          <div class="cs-pcard-tools">${toolsHTML}</div>
          <div class="cs-edit-actions cs-admin-ctrl" style="display:none;">
            <button class="cs-save-btn">✓ Save</button>
            <button class="cs-cancel-btn">✕ Cancel</button>
          </div>
        </div>
      </div>`;
    }).join('');

    // Initialize sliders, editing, uploads
    projectListEl.querySelectorAll('.cs-pcard').forEach((card, i) => {
      initSlider(card.querySelector('.cs-pcard-slider'));
      attachEditing(card, i);
      attachUpload(card, i);
    });
  }

  /* ═══ SECTION 3: GALLERY ══════════════════════════════════ */
  const galleryLabel = document.getElementById('cs-gallery-label');
  const galleryLine = document.getElementById('cs-gallery-line');
  const galleryContainer = document.getElementById('cs-gallery');
  if (galleryLabel) galleryLabel.classList.add(C);
  if (galleryLine) galleryLine.classList.add(C);
  if (galleryContainer) {
    if (P.screenshots && P.screenshots.length > 0) {
      galleryContainer.innerHTML = P.screenshots.map(src => `<div class="cs-gallery-item ${C} cs-sr"><img src="${src}" alt="Screenshot" loading="lazy"/></div>`).join('');
    } else {
      galleryContainer.innerHTML = [1, 2, 3].map(n => `<div class="cs-gallery-item ${C} cs-sr d${n}"><div class="cs-gallery-placeholder ${C}">// Preview ${n}</div></div>`).join('');
    }
  }

  /* ═══ SECTION 4: TOOLS GRID ═══════════════════════════════ */
  const toolsLabel = document.getElementById('cs-tools-label');
  const toolsLine = document.getElementById('cs-tools-line');
  const toolsGrid = document.getElementById('cs-tools-grid');
  if (toolsLabel) toolsLabel.classList.add(C);
  if (toolsLine) toolsLine.classList.add(C);
  if (toolsGrid) {
    toolsGrid.innerHTML = P.tools.map((t, i) => `<div class="cs-tool-card cs-glass ${C} cs-sr d${(i % 6) + 1}"><div class="cs-tool-name">${t.name}</div><div class="cs-tool-desc">${t.desc}</div></div>`).join('');
  }

  /* ═══ SECTION 5: RESULTS ══════════════════════════════════ */
  const resultsLabel = document.getElementById('cs-results-label');
  const resultsLine = document.getElementById('cs-results-line');
  const resultsGrid = document.getElementById('cs-results-grid');
  if (resultsLabel) resultsLabel.classList.add(C);
  if (resultsLine) resultsLine.classList.add(C);
  if (resultsGrid) {
    resultsGrid.innerHTML = P.results.map((r, i) => `<div class="cs-result-card cs-glass ${C} cs-sr d${(i % 4) + 1}"><div class="cs-result-icon">${r.icon}</div><div class="cs-result-metric">${r.metric}</div><div class="cs-result-values"><span class="cs-result-before">${r.before}</span><span class="cs-result-arrow ${C}">→</span><span class="cs-result-after ${C}">${r.after}</span></div></div>`).join('');
  }

  /* ═══ NAVIGATION ══════════════════════════════════════════ */
  if (P.prevProject && PROJECTS_DATA[P.prevProject]) {
    const prev = PROJECTS_DATA[P.prevProject], link = document.getElementById('cs-prev');
    if (link) { link.href = P.prevProject + '.html'; link.querySelector('.cs-nav-title').textContent = prev.category; }
  }
  if (P.nextProject && PROJECTS_DATA[P.nextProject]) {
    const next = PROJECTS_DATA[P.nextProject], link = document.getElementById('cs-next');
    if (link) { link.href = P.nextProject + '.html'; link.querySelector('.cs-nav-title').textContent = next.category; }
  }

  /* ═══ PAGE TITLE ══════════════════════════════════════════ */
  document.title = P.category + ' Projects — Ashish';

  /* ═══ SCROLL REVEAL ═══════════════════════════════════════ */
  const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.1 });
  document.querySelectorAll('.cs-sr').forEach(el => obs.observe(el));

  /* ═══ BACK NAV FLAG ═══════════════════════════════════════ */
  const backBtn = document.getElementById('cs-back');
  if (backBtn) backBtn.addEventListener('click', () => sessionStorage.setItem('fromProject', 'true'));
  document.querySelectorAll('.cs-nav-link').forEach(l => l.addEventListener('click', () => sessionStorage.setItem('fromProject', 'true')));

  /* ═══ INIT ADMIN ══════════════════════════════════════════ */
  initAdmin();

})();
