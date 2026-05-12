/**
 * ═══════════════════════════════════════════════════════════════
 *  PORTFOLIO APP — Dynamic Rendering, Modals, Toast System
 * ═══════════════════════════════════════════════════════════════
 *  Reads projects from Firestore and renders them dynamically.
 *  Handles modal popups for each category.
 *  Toast notifications for user feedback.
 * ═══════════════════════════════════════════════════════════════
 */

// ─── GLOBALS ────────────────────────────────────────────────
var allProjects = [];
var allCategories = [];
var currentModalCategory = null;

// Category color map (matches existing CSS classes)
var CATEGORY_COLORS = {
  'Web Design': { card: 'pc-web', pill: 'pp', cat: 'catpp', thumb: 'pt-web', num: '01' },
  'Video Editing': { card: 'pc-vid', pill: 'ppk', cat: 'catpk', thumb: 'pt-vid', num: '02' },
  'Brand Identity': { card: 'pc-gfx', pill: 'pb2', cat: 'catb', thumb: 'pt-gfx', num: '03' },
  'Python Automation': { card: 'pc-cod', pill: 'pg', cat: 'catg', thumb: 'pt-cod', num: '04' }
};

// Category descriptions
var CATEGORY_DESCRIPTIONS = {
  'Web Design': 'Modern, conversion-focused web design and development solutions that turn visitors into customers.',
  'Video Editing': 'Professional video editing, motion graphics, and content creation for engaging digital experiences.',
  'Brand Identity': 'Complete brand identity systems, logos, and visual guidelines that establish strong market presence.',
  'Python Automation': 'Custom Python automation scripts and data processing solutions that streamline business operations.'
};

// Category images (professional, modern, premium)
var CATEGORY_IMAGES = {
  'Web Design': 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Video Editing': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Brand Identity': 'https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Python Automation': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
};

// Default fallback image
var DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

var DELAY_CLASSES = ['d1', 'd2', 'd3', 'd4'];
var UNCATEGORIZED_LABEL = 'Uncategorized';

function normalizeCategoryName(category) {
  return category && String(category).trim() ? category : UNCATEGORIZED_LABEL;
}

function isValidExternalLink(url) {
  if (!url) return false;
  try {
    var trimmed = String(url).trim();
    if (!trimmed || trimmed === '#') return false;
    var parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (error) {
    return false;
  }
}


// ─── FALLBACK DATA (used when Firebase isn't configured yet) ──
var FALLBACK_PROJECTS = [
  { id:'fb1', title:'SaaS Platform — Complete UI Overhaul', category:'Web Design', categoryNum:'01', categoryColor:'purple', tagline:'Turned a 78% bounce rate into a 3.2× conversion machine through design-driven strategy.', problem:"Client's page had 78% bounce rate. Visitors left without any meaningful action.", solution:'Full redesign in Figma → Webflow with modern hierarchy, trust signals & micro-interactions.', tools:['Figma','Webflow','CSS3','JavaScript'], imageUrl:'work/screenshots/saas-1.png', liveDemo:'#', order:1, isFeatured:true },
  { id:'fb2', title:'Portfolio Website — Modern Redesign', category:'Web Design', categoryNum:'01', categoryColor:'purple', tagline:'Custom coded portfolio with smooth animations and interactive case study system.', problem:"Freelance designer had an outdated WordPress site that wasn't converting leads.", solution:'Built a custom coded portfolio with smooth animations, interactive case study system, and contact form.', tools:['HTML','CSS','JavaScript','GSAP'], imageUrl:null, liveDemo:'#', order:2, isFeatured:false },
  { id:'fb3', title:'E-Commerce Landing Page', category:'Web Design', categoryNum:'01', categoryColor:'purple', tagline:'Mobile-first redesign for a fashion startup with optimized checkout flow.', problem:"Fashion startup's landing page had poor mobile experience, losing 40% of mobile traffic.", solution:'Redesigned with mobile-first approach, optimized images, lazy loading, and streamlined checkout flow.', tools:['HTML','CSS','JavaScript','Shopify'], imageUrl:null, liveDemo:'#', order:3, isFeatured:false },
  { id:'fb4', title:'Tech Creator — 0 to 45K Subs', category:'Video Editing', categoryNum:'02', categoryColor:'pink', tagline:'Full editing pipeline — hooks, motion graphics, color grading & thumbnails. 2M+ views.', problem:'Raw footage, no visual identity, poor retention. Under 300 views per video.', solution:'Full editing system — hooks, motion graphics, color grading & optimized thumbnails.', tools:['Premiere Pro','After Effects','Photoshop'], imageUrl:'work/screenshots/youtube-1.png', liveDemo:'#', order:1, isFeatured:true },
  { id:'fb5', title:'Product Launch Campaign Video', category:'Video Editing', categoryNum:'02', categoryColor:'pink', tagline:'Cinematic 90-second launch video with motion graphics and voiceover.', problem:'SaaS company needed a cinematic product launch video but had zero video content.', solution:'Produced a 90-second launch video with motion graphics, voiceover sync, and platform cuts.', tools:['DaVinci Resolve','After Effects','Audition'], imageUrl:null, liveDemo:'#', order:2, isFeatured:false },
  { id:'fb6', title:'Instagram Reels Strategy', category:'Video Editing', categoryNum:'02', categoryColor:'pink', tagline:'Hook-first editing with trend audio, dynamic text overlays, and visual branding.', problem:"Fitness brand's reels were getting under 500 views with no engagement.", solution:'Created hook-first editing style with trend audio, dynamic text overlays, and visual branding.', tools:['CapCut','Premiere Pro','Canva'], imageUrl:null, liveDemo:'#', order:3, isFeatured:false },
  { id:'fb7', title:'Lifestyle Brand — Identity System', category:'Brand Identity', categoryNum:'03', categoryColor:'blue', tagline:'Complete brand system — logo, palette, 20+ social templates. First reel hit 250K+ views.', problem:'Wellness startup needed full identity — logo, palette, templates — for social launch.', solution:'Logo system, 20+ social templates, thumbnail library & brand guidelines in Figma + Canva.', tools:['Figma','Illustrator','Canva'], imageUrl:'work/screenshots/brand-1.png', liveDemo:'#', order:1, isFeatured:true },
  { id:'fb8', title:'Tech Startup — Brand Refresh', category:'Brand Identity', categoryNum:'03', categoryColor:'blue', tagline:'Bold identity with custom wordmark, neon color system, icon library.', problem:'AI startup looked generic. No personality, zero brand recognition in a crowded market.', solution:'Created bold identity with custom wordmark, neon color system, icon library, and pitch deck.', tools:['Figma','Illustrator','Photoshop'], imageUrl:null, liveDemo:'#', order:2, isFeatured:false },
  { id:'fb9', title:'Food Delivery — Visual Identity', category:'Brand Identity', categoryNum:'03', categoryColor:'blue', tagline:'Unified brand system with warm palette, custom illustrations, packaging design.', problem:'Local food delivery service had inconsistent branding across app, social, and packaging.', solution:'Unified brand system with warm palette, custom illustrations, packaging design, and templates.', tools:['Illustrator','Canva','Photoshop'], imageUrl:null, liveDemo:'#', order:3, isFeatured:false },
  { id:'fb10', title:'E-Commerce Intel — Price Monitor & Alert Bot', category:'Python Automation', categoryNum:'04', categoryColor:'green', tagline:'Python scraper with Sheets API reporting & Telegram alerts. 100+ hrs saved/month.', problem:'Client tracked 500+ competitor prices manually across 8 sites — 4 hours every morning.', solution:'Python scraper (Selenium + BS4), Sheets API reporting, Telegram bot with price-drop alerts.', tools:['Python','Selenium','BeautifulSoup','Telegram API'], imageUrl:'work/screenshots/bot-1.png', liveDemo:'#', order:1, isFeatured:true },
  { id:'fb11', title:'Social Media Auto-Scheduler', category:'Python Automation', categoryNum:'04', categoryColor:'green', tagline:'Automated posting across 5 client accounts with weekly report generation.', problem:'Marketing agency spent 6+ hours weekly manually posting across 5 client accounts.', solution:'Built Python automation with API integrations for scheduled posting and weekly report generation.', tools:['Python','REST APIs','Automation'], imageUrl:null, liveDemo:'#', order:2, isFeatured:false },
  { id:'fb12', title:'Data Pipeline Dashboard', category:'Python Automation', categoryNum:'04', categoryColor:'green', tagline:'Real-time Streamlit dashboard pulling from multiple APIs.', problem:"E-commerce client had sales data scattered across Shopify, Google Ads, and email platforms.", solution:'Python ETL pipeline pulling from multiple APIs into a real-time Streamlit dashboard.', tools:['Python','Streamlit','Pandas','APIs'], imageUrl:null, liveDemo:'#', order:3, isFeatured:false }
];

var firebaseReady = false;
var firestoreListenerActive = false;
var firestoreLoadedSuccessfully = false;

/**
 * Check if Firebase is properly configured (not placeholder values).
 */
function isFirebaseConfigured() {
  try {
    if (typeof firebase === 'undefined' || typeof db === 'undefined') return false;
    var config = firebase.app().options;
    if (!config.apiKey || config.apiKey === 'YOUR_API_KEY_HERE') return false;
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Log a Firestore issue and show a toast once.
 */
function handleFirestoreLoadIssue(message, error) {
  console.error('Firestore load issue:', message, error || 'no error object');
  var toastMessage = 'Could not load saved projects from Firestore.';
  if (message) toastMessage += ' ' + message;
  showToast(toastMessage, 'error', 7000);
}

/**
 * Load projects — from Firebase if configured, otherwise from fallback data.
 */
function initProjectListener() {
  console.log('🔍 Checking Firebase configuration...');
  if (!isFirebaseConfigured()) {
    console.log('⚠️ Firebase not configured — using fallback data');
    allProjects = FALLBACK_PROJECTS.slice();
    renderMainPageCards();
    return;
  }

  console.log('✅ Firebase configured, initializing Firestore listener...');
  firebaseReady = true;
  firestoreListenerActive = true;

  db.collection('portfolioProjects')
    .orderBy('categoryNum')
    .onSnapshot(function (snapshot) {
      console.log('📡 Firestore snapshot received, document count:', snapshot.docs.length);
      allProjects = [];
      snapshot.forEach(function (doc) {
        var data = doc.data();
        data.id = doc.id;
        allProjects.push(data);
        console.log('📄 Loaded project from Firestore:', data.title, '(ID:', data.id + ')');
      });

      if (allProjects.length === 0) {
        console.warn('⚠️ Firestore returned no projects. Falling back to static data so the site remains populated.');
        allProjects = FALLBACK_PROJECTS.slice();
      } else {
        firestoreLoadedSuccessfully = true;
        allProjects.sort(function (a, b) {
          var catA = a.categoryNum || '';
          var catB = b.categoryNum || '';
          if (catA < catB) return -1;
          if (catA > catB) return 1;
          var orderA = parseInt(a.order, 10) || 0;
          var orderB = parseInt(b.order, 10) || 0;
          return orderA - orderB;
        });
        console.log('✅ Loaded', allProjects.length, 'projects from Firestore');
      }

      renderMainPageCards();
      if (currentModalCategory) {
        renderModalProjects(currentModalCategory);
      }
      console.log('🎯 Projects rendering complete, total projects:', allProjects.length);
    }, function (error) {
      console.error('❌ Error fetching projects from Firestore:', error.code, error.message);
      handleFirestoreLoadIssue(error.message || 'Unexpected Firestore error', error);
      firestoreListenerActive = false;
      if (!allProjects.length) {
        console.warn('⚠️ Firestore is configured but could not be loaded. Using fallback data to keep the UI intact.');
        allProjects = FALLBACK_PROJECTS.slice();
      } else {
        console.warn('⚠️ Firestore is configured but could not be loaded. Keeping previously loaded projects.');
      }
      renderMainPageCards();
    });
}

/**
 * Fetch all categories from Firestore.
 */
function initCategoryListener() {
  if (!isFirebaseConfigured()) return;

  db.collection('categories')
    .orderBy('order')
    .onSnapshot(function (snapshot) {
      allCategories = [];
      snapshot.forEach(function (doc) {
        var data = doc.data();
        data.id = doc.id;
        allCategories.push(data);
      });
      console.log('✓ Categories loaded:', allCategories.length);
    }, function (error) {
      console.error('Error fetching categories:', error);
    });
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 2: RENDER MAIN PAGE PROJECT CARDS
// ═══════════════════════════════════════════════════════════════

/**
 * Group projects by category and render ONE category overview card per category
 * on the main page. These cards open the category modal on click.
 */
function renderMainPageCards() {
  var grid = document.getElementById('projects-grid');
  if (!grid) return;

  // Group projects by category, including uncategorized projects.
  var grouped = {};
  allProjects.forEach(function (p) {
    var key = normalizeCategoryName(p.category);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  });

  // Define category order, preserving known categories first.
  var categoryOrder = ['Web Design', 'Video Editing', 'Brand Identity', 'Python Automation'];
  Object.keys(grouped).forEach(function (catName) {
    if (categoryOrder.indexOf(catName) === -1) {
      categoryOrder.push(catName);
    }
  });

  var html = '';

  categoryOrder.forEach(function (catName, index) {
    var projects = grouped[catName];
    if (!projects || projects.length === 0) return;

    var colors = CATEGORY_COLORS[catName] || CATEGORY_COLORS['Web Design'];
    var delay = DELAY_CLASSES[index] || '';
    var num = colors.num;

    // Collect all unique tools from projects in this category
    var allTools = new Set();
    projects.forEach(function (p) {
      if (p.tools && p.tools.length) {
        p.tools.forEach(function (t) { allTools.add(t); });
      }
    });
    var toolsArray = Array.from(allTools);
    var toolsHTML = '';
    toolsArray.slice(0, 6).forEach(function (t) { // Show up to 6 tools
      toolsHTML += '<span class="tpil">' + escapeHTML(t) + '</span>';
    });

    // Get category description
    var description = CATEGORY_DESCRIPTIONS[catName] || 'Professional services in ' + catName.toLowerCase() + ' for modern businesses.';

    // Get category image
    var imageUrl = CATEGORY_IMAGES[catName] || DEFAULT_CATEGORY_IMAGE;

    html += '<div class="pj-link-dynamic" data-category="' + escapeHTML(catName) + '" onclick="openCategoryModal(\'' + escapeHTML(catName) + '\')">';
    html += '  <div class="pjcard ' + colors.card + ' sr ' + delay + ' tilt-card">';
    html += '    <div class="pth ' + colors.thumb + '">';
    html += '      <img src="' + escapeHTML(imageUrl) + '" alt="' + escapeHTML(catName) + ' category preview" class="category-image" loading="lazy" onerror="this.src=\'' + escapeHTML(DEFAULT_CATEGORY_IMAGE) + '\'">';
    html += '      <div class="pnum ' + colors.pill + '">' + num + '</div>';
    html += '      <h3 class="category-title">' + escapeHTML(catName) + '</h3>';
    html += '    </div>';
    html += '    <div class="pb3">';
    html += '      <div class="tpils">' + toolsHTML + '</div>';
    html += '      <p class="category-description">' + escapeHTML(description) + '</p>';
    html += '      <span class="pcta">View All Projects &#8594;</span>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
  });

  grid.innerHTML = html;

  // Re-init scroll reveal for new cards
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  grid.querySelectorAll('.sr').forEach(function (el) { io.observe(el); });

  // Re-init tilt effect
  grid.querySelectorAll('.tilt-card').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      var dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      el.style.animation = 'none';
      el.style.transform = 'perspective(900px) rotateY(' + dx * 7 + 'deg) rotateX(' + (-dy * 7) + 'deg) translateY(-8px)';
      el.style.transition = 'transform 0.08s ease';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
      el.style.transition = 'transform 0.6s var(--ease)';
      setTimeout(function () { el.style.animation = ''; }, 600);
    });
  });

  // Re-init cursor hover for new links
  grid.querySelectorAll('a,.pj-link-dynamic,.tilt-card').forEach(function (el) {
    el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
  });
}


/**
 * Initialize image sliders for dynamically rendered cards.
 */
function initDynamicSliders(container) {
  var sliders = container.querySelectorAll('.pj-slider');
  if (!sliders.length) return;

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var slider = entry.target;
      if (entry.isIntersecting) {
        if (!slider._intervalId) startDynSlider(slider);
      } else {
        if (slider._intervalId) {
          clearInterval(slider._intervalId);
          slider._intervalId = null;
        }
      }
    });
  }, { threshold: 0.15 });

  function startDynSlider(slider) {
    var images = slider.querySelectorAll('img');
    var dots = slider.querySelectorAll('.pj-slider-dot');
    if (images.length < 2) return;
    var interval = parseInt(slider.dataset.interval) || 3000;
    var current = 0;
    slider._intervalId = setInterval(function () {
      images[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (current + 1) % images.length;
      images[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }, interval);
  }

  sliders.forEach(function (s) { obs.observe(s); });
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 3: MODAL POPUP SYSTEM
// ═══════════════════════════════════════════════════════════════

/**
 * Open the category modal showing all projects in that category.
 */
function openCategoryModal(categoryName) {
  currentModalCategory = categoryName;
  var overlay = document.getElementById('project-modal-overlay');
  var modal = document.getElementById('project-modal');

  if (!overlay || !modal) return;

  // Set category title
  var colors = CATEGORY_COLORS[categoryName] || {};
  document.getElementById('modal-category-title').textContent = categoryName;
  document.getElementById('modal-category-num').textContent = colors.num || '01';

  // Render projects
  renderModalProjects(categoryName);

  // Show modal
  overlay.classList.add('active');
  document.body.classList.add('modal-open');

  // Focus trap
  setTimeout(function () {
    var closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

/**
 * Close the category modal.
 */
function closeCategoryModal() {
  var overlay = document.getElementById('project-modal-overlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.classList.remove('modal-open');
  currentModalCategory = null;
}

/**
 * Render project cards inside the modal for a given category.
 */
function renderModalProjects(categoryName) {
  var container = document.getElementById('modal-projects-grid');
  if (!container) return;

  var catProjects = allProjects.filter(function (p) {
    return normalizeCategoryName(p.category) === categoryName;
  });

  var isAdmin = document.body.classList.contains('admin-mode');

  var addBtnHTML = '';
  if (isAdmin) {
    addBtnHTML = '<button class="admin-only admin-add-btn" onclick="openAddProjectForm(\'' + escapeHTML(categoryName) + '\')">';
    addBtnHTML += '<span class="admin-add-icon">+</span> Add Project';
    addBtnHTML += '</button>';
  }

  var html = addBtnHTML;

  if (catProjects.length === 0) {
    html += '<div class="modal-empty">No projects in this category yet.</div>';
    container.innerHTML = html;
    return;
  }

  catProjects.forEach(function (project) {
    var toolsHTML = '';
    if (project.tools && project.tools.length) {
      project.tools.forEach(function (t) {
        toolsHTML += '<span class="modal-tool-tag">' + escapeHTML(t) + '</span>';
      });
    }

    var imgHTML = '';
    if (project.imageUrl) {
      imgHTML = '<div class="modal-card-image"><img src="' + escapeHTML(project.imageUrl) + '" alt="' + escapeHTML(project.title) + '" loading="lazy" /></div>';
    } else {
      imgHTML = '<div class="modal-card-image modal-card-placeholder"><div class="placeholder-icon">📂</div></div>';
    }

    var demoBtn = '';
    if (isValidExternalLink(project.liveDemo)) {
      demoBtn = '<a href="' + escapeHTML(project.liveDemo) + '" class="modal-btn modal-btn-demo" target="_blank" rel="noopener">🔗 Live Demo</a>';
    } else {
      demoBtn = '<span class="modal-btn modal-btn-disabled">No Demo Link</span>';
    }

    var githubBtn = '';
    if (isValidExternalLink(project.github)) {
      githubBtn = '<a href="' + escapeHTML(project.github) + '" class="modal-btn modal-btn-github" target="_blank" rel="noopener">💻 GitHub</a>';
    }

    var adminBtns = '';
    if (isAdmin) {
      adminBtns = '<div class="admin-only modal-admin-actions">';
      adminBtns += '<button class="admin-icon-btn admin-edit-btn" onclick="event.stopPropagation(); openEditProjectForm(\'' + project.id + '\')" title="Edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>';
      adminBtns += '<button class="admin-icon-btn admin-delete-btn" onclick="event.stopPropagation(); confirmDeleteProject(\'' + project.id + '\', \'' + escapeHTML(project.title) + '\')" title="Delete"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>';
      adminBtns += '</div>';
    }

    html += '<div class="modal-project-card" data-project-id="' + project.id + '">';
    html += adminBtns;
    html += imgHTML;
    html += '<div class="modal-card-body">';
    html += '  <h3 class="modal-card-title">' + escapeHTML(project.title) + '</h3>';
    if (project.problem) {
      html += '  <div class="modal-card-section"><span class="modal-label">Problem:</span> ' + escapeHTML(project.problem) + '</div>';
    }
    if (project.solution) {
      html += '  <div class="modal-card-section"><span class="modal-label">Solution:</span> ' + escapeHTML(project.solution) + '</div>';
    }
    html += '  <div class="modal-card-tools">' + toolsHTML + '</div>';
    html += '  <div class="modal-card-actions demo-action">' + demoBtn + githubBtn + '</div>';
    html += '</div>';
    html += '</div>';
  });

  container.innerHTML = html;
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 4: TOAST NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════════════════════

/**
 * Show a toast notification.
 * @param {string} message - The message to display
 * @param {string} type - 'success' | 'error' | 'info'
 */
function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('portfolio-toast-container');
  if (!container) return;

  var toast = document.createElement('div');
  toast.className = 'portfolio-toast toast-' + type;

  var icon = '💬';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-msg">' + escapeHTML(message) + '</span>';
  container.appendChild(toast);

  // Trigger animation
  setTimeout(function () { toast.classList.add('show'); }, 10);

  // Auto dismiss
  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 400);
  }, 3500);
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 5: UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Escape HTML to prevent XSS.
 */
function escapeHTML(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}




















/**
 * Handle keyboard shortcuts for modals
 */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    // Close project modal
    var projectModal = document.getElementById('project-modal-overlay');
    if (projectModal && projectModal.classList.contains('active')) {
      closeProjectModal();
    }
  }
});



/**
 * Initialize the portfolio app after Firebase is ready.
 */
function initPortfolioApp() {
  // Start listening to Firestore
  initProjectListener();
  initCategoryListener();

  // Modal close handlers
  var overlay = document.getElementById('project-modal-overlay');
  if (overlay) {
    // Click overlay background to close
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('project-modal-backdrop')) {
        closeCategoryModal();
      }
    });
  }

  // ESC key to close any open modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      // Close category modal
      if (currentModalCategory) closeCategoryModal();
      // Close admin form modal
      var formModal = document.getElementById('admin-form-overlay');
      if (formModal && formModal.classList.contains('active')) closeAdminForm();
      // Close login modal
      var loginModal = document.getElementById('admin-login-overlay');
      if (loginModal && loginModal.classList.contains('active')) closeLoginModal();
      // Close delete confirmation
      var deleteModal = document.getElementById('delete-confirm-overlay');
      if (deleteModal && deleteModal.classList.contains('active')) closeDeleteConfirm();
    }
  });

  console.log('✓ Portfolio app initialized');
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPortfolioApp);
} else {
  initPortfolioApp();
}
