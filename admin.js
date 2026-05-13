/**
 * ═══════════════════════════════════════════════════════════════
 *  ADMIN SYSTEM — Authentication + CRUD + Project Management
 * ═══════════════════════════════════════════════════════════════
 *  Handles admin login, add/edit/delete projects, image upload.
 *  All admin UI is hidden unless authenticated.
 *
 *  HOW TO ACCESS ADMIN:
 *  → Navigate to yoursite.com/#admin
 *  → Or triple-click the footer logo "Ashish."
 * ═══════════════════════════════════════════════════════════════
 */

// ─── ADMIN STATE ────────────────────────────────────────────
var isAdminMode = false;
var editingProjectId = null;

// ═══════════════════════════════════════════════════════════════
//  SECTION 1: AUTHENTICATION
// ═══════════════════════════════════════════════════════════════

/**
 * Check if user is already logged in on page load.
 */
function checkAuthState() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      console.log('✓ Admin logged in:', user.email);
      enableAdminMode();
      loadPortfolioImages();
    } else {
      disableAdminMode();
    }
  });
}

/**
 * Show the login modal.
 */
function openLoginModal() {
  var overlay = document.getElementById('admin-login-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.classList.add('modal-open');
    setTimeout(function () {
      var emailInput = document.getElementById('admin-email');
      if (emailInput) emailInput.focus();
    }, 200);
  }
}

/**
 * Close the login modal.
 */
function closeLoginModal() {
  var overlay = document.getElementById('admin-login-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    if (!currentModalCategory) {
      document.body.classList.remove('modal-open');
    }
  }
  // Clear form
  var form = document.getElementById('admin-login-form');
  if (form) form.reset();
  var errorEl = document.getElementById('login-error');
  if (errorEl) errorEl.textContent = '';
}

/**
 * Handle login form submission.
 */
function handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('admin-email').value.trim();
  var password = document.getElementById('admin-password').value;
  var errorEl = document.getElementById('login-error');
  var submitBtn = document.getElementById('login-submit-btn');

  if (!email || !password) {
    errorEl.textContent = 'Please enter email and password.';
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Signing in...';

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      closeLoginModal();
      showToast('Welcome back, Admin!', 'success');
    })
    .catch(function (error) {
      var msg = 'Login failed.';
      if (error.code === 'auth/user-not-found') msg = 'Account not found.';
      if (error.code === 'auth/wrong-password') msg = 'Wrong password.';
      if (error.code === 'auth/invalid-email') msg = 'Invalid email format.';
      if (error.code === 'auth/invalid-credential') msg = 'Invalid credentials.';
      errorEl.textContent = msg;
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    });
}

/**
 * Handle logout.
 */
function handleLogout() {
  auth.signOut().then(function () {
    showToast('Logged out successfully.', 'info');
  });
}

/**
 * Enable admin mode — show admin UI elements.
 */
function enableAdminMode() {
  isAdminMode = true;
  document.body.classList.add('admin-mode');

  // Show admin toolbar
  var toolbar = document.getElementById('admin-toolbar');
  if (toolbar) toolbar.classList.add('visible');

  // Re-render modal if open (to show edit/delete buttons)
  if (currentModalCategory) {
    renderModalProjects(currentModalCategory);
  }
}

/**
 * Disable admin mode — hide admin UI elements.
 */
function disableAdminMode() {
  isAdminMode = false;
  document.body.classList.remove('admin-mode');

  var toolbar = document.getElementById('admin-toolbar');
  if (toolbar) toolbar.classList.remove('visible');

  if (currentModalCategory) {
    renderModalProjects(currentModalCategory);
  }
}

/**
 * Toggle admin mode on/off (preview as normal user).
 */
function toggleAdminMode() {
  if (document.body.classList.contains('admin-mode')) {
    document.body.classList.remove('admin-mode');
    if (currentModalCategory) renderModalProjects(currentModalCategory);
    showToast('Admin view OFF — previewing as visitor', 'info');
  } else {
    document.body.classList.add('admin-mode');
    if (currentModalCategory) renderModalProjects(currentModalCategory);
    showToast('Admin view ON', 'success');
  }
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 2: ADD / EDIT PROJECT FORM
// ═══════════════════════════════════════════════════════════════

/**
 * Open the add project form.
 */
function openAddProjectForm(category) {
  editingProjectId = null;
  var overlay = document.getElementById('admin-form-overlay');
  if (!overlay) return;

  // Set form title
  document.getElementById('form-modal-title').textContent = 'Add New Project';
  document.getElementById('form-submit-btn').textContent = 'Add Project';

  // Reset form
  var form = document.getElementById('project-form');
  form.reset();

  // Pre-select category
  document.getElementById('form-category').value = category || 'Web Design';
  document.getElementById('form-github-link').value = '';

  // Clear image preview
  var preview = document.getElementById('form-image-preview');
  preview.innerHTML = '';
  preview.style.display = 'none';

  // Clear tools
  renderFormTools([]);

  // Show form
  overlay.classList.add('active');
}

/**
 * Open the edit project form with existing data.
 */
function openEditProjectForm(projectId) {
  editingProjectId = projectId;

  // Find project data
  var project = allProjects.find(function (p) { return p.id === projectId; });
  if (!project) {
    showToast('Project not found.', 'error');
    return;
  }

  var overlay = document.getElementById('admin-form-overlay');
  if (!overlay) return;

  // Set form title
  document.getElementById('form-modal-title').textContent = 'Edit Project';
  document.getElementById('form-submit-btn').textContent = 'Save Changes';

  // Fill form with existing data
  document.getElementById('form-title').value = project.title || '';
  document.getElementById('form-category').value = project.category || 'Web Design';
  document.getElementById('form-tagline').value = project.tagline || '';
  document.getElementById('form-problem').value = project.problem || '';
  document.getElementById('form-solution').value = project.solution || '';
  document.getElementById('form-demo-link').value = project.liveDemo || '';
  document.getElementById('form-github-link').value = project.github || '';
  document.getElementById('form-order').value = project.order || 1;
  document.getElementById('form-featured').checked = project.isFeatured || false;

  // Show current image
  var preview = document.getElementById('form-image-preview');
  if (project.imageUrl) {
    preview.innerHTML = '<img src="' + escapeHTML(project.imageUrl) + '" alt="Current image" /><button type="button" class="preview-remove-btn" onclick="clearImagePreview()">✕</button>';
    preview.style.display = 'block';
  } else {
    preview.innerHTML = '';
    preview.style.display = 'none';
  }

  // Render tools
  renderFormTools(project.tools || []);

  // Show form
  overlay.classList.add('active');
}

/**
 * Close the add/edit form modal.
 */
function closeAdminForm() {
  var overlay = document.getElementById('admin-form-overlay');
  if (overlay) overlay.classList.remove('active');
  editingProjectId = null;
}

/**
 * Handle project form submission (add or edit).
 */
function handleProjectSubmit(e) {
  e.preventDefault();

  var title = document.getElementById('form-title').value.trim();
  var category = document.getElementById('form-category').value;
  var tagline = document.getElementById('form-tagline').value.trim();
  var problem = document.getElementById('form-problem').value.trim();
  var solution = document.getElementById('form-solution').value.trim();
  var demoLink = document.getElementById('form-demo-link').value.trim();
  var githubLink = document.getElementById('form-github-link').value.trim();
  var order = parseInt(document.getElementById('form-order').value) || 1;
  var isFeatured = document.getElementById('form-featured').checked;
  var fileInput = document.getElementById('form-image-file');

  console.log('📋 Form submitted:', { title, category, demoLink, githubLink, editingProjectId });

  if (!title) {
    showToast('Project title is required.', 'error');
    return;
  }

  var colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['Web Design'];
  var submitBtn = document.getElementById('form-submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  // Collect tools from tags
  var toolTags = document.querySelectorAll('#form-tools-list .tool-tag-text');
  var tools = [];
  toolTags.forEach(function (el) { tools.push(el.textContent.trim()); });

  var normalizedDemoLink = normalizeExternalUrl(demoLink);
  var normalizedGithubLink = githubLink ? normalizeExternalUrl(githubLink) : null;

  if (demoLink && !normalizedDemoLink) {
    showToast('Invalid Live Demo URL. Please enter a valid https:// URL.', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = editingProjectId ? 'Save Changes' : 'Add Project';
    console.error('Invalid Live Demo URL:', demoLink);
    return;
  }

  if (githubLink && !normalizedGithubLink) {
    showToast('Invalid GitHub URL. Please enter a valid https:// URL.', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = editingProjectId ? 'Save Changes' : 'Add Project';
    console.error('Invalid GitHub URL:', githubLink);
    return;
  }

  var projectData = {
    title: title,
    category: category,
    categoryNum: colors.num,
    categoryColor: getCategoryColorName(category),
    tagline: tagline,
    problem: problem,
    solution: solution,
    liveDemo: normalizedDemoLink,
    github: normalizedGithubLink,
    tools: tools,
    order: order,
    isFeatured: isFeatured,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  console.log('📦 Prepared project data for save:', projectData);

  // Check if there's a new image to upload
  var file = fileInput && fileInput.files[0];

 if (projectImageBase64) {

  // Save base64 image directly
  projectData.imageUrl = projectImageBase64;
}

return saveProject(projectData);
}

/**
 * Save project to Firestore (create or update).
 */
function saveProject(data) {
  var submitBtn = document.getElementById('form-submit-btn');

  // Check authentication
  if (!auth.currentUser) {
    console.error('Save attempted without authentication');
    showToast('Please log in to save changes.', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = editingProjectId ? 'Save Changes' : 'Add Project';
    return Promise.reject(new Error('Not authenticated'));
  }

  console.log('📦 Final data to save to Firestore:', data);

  if (editingProjectId) {
    // UPDATE existing project
    console.log('📝 Updating project in Firestore:', editingProjectId);
    return db.collection('portfolioProjects').doc(editingProjectId).set(data, { merge: true })
      .then(function () {
        console.log('✓ Firestore update successful for:', editingProjectId);
        showToast('Changes saved successfully!', 'success');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';

        // Update local state immediately so UI reflects changes without waiting on snapshot.
        var existingIndex = allProjects.findIndex(function (p) { return p.id === editingProjectId; });
        var savedProject = Object.assign({}, allProjects[existingIndex] || {}, data, { id: editingProjectId });
        if (existingIndex > -1) {
          allProjects[existingIndex] = savedProject;
        } else {
          allProjects.push(savedProject);
        }
        renderMainPageCards();
        if (currentModalCategory) {
          if (normalizeCategoryName(savedProject.category) === currentModalCategory) {
            renderModalProjects(currentModalCategory);
          } else {
            closeCategoryModal();
          }
        }

        setTimeout(function () {
          closeAdminForm();
        }, 300);
      })
      .catch(function (error) {
        console.error('❌ Firestore update failed:', error.code, error.message);
        console.log('Error details:', error);
        showToast('Failed to save changes: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';
      });
  } else {
    // CREATE new project
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    console.log('📝 Creating new project in Firestore:', data);
    return db.collection('portfolioProjects').add(data)
      .then(function (docRef) {
        console.log('✓ Firestore create successful, ID:', docRef.id);
        showToast('Project added successfully!', 'success');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Project';

        var newProject = Object.assign({}, data, { id: docRef.id });
        allProjects.push(newProject);
        renderMainPageCards();
        if (currentModalCategory) {
          renderModalProjects(currentModalCategory);
        }

        setTimeout(function () {
          closeAdminForm();
        }, 300);
      })
      .catch(function (error) {
        console.error('❌ Firestore create failed:', error.code, error.message);
        console.log('Error details:', error);
        showToast('Failed to add: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Project';
      });
  }
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 3: DELETE PROJECT
// ═══════════════════════════════════════════════════════════════

var pendingDeleteId = null;
var pendingDeleteTitle = '';

/**
 * Show delete confirmation dialog.
 */
function confirmDeleteProject(projectId, title) {
  pendingDeleteId = projectId;
  pendingDeleteTitle = title;

  document.getElementById('delete-project-name').textContent = title;
  var overlay = document.getElementById('delete-confirm-overlay');
  if (overlay) overlay.classList.add('active');
}

/**
 * Close delete confirmation.
 */
function closeDeleteConfirm() {
  var overlay = document.getElementById('delete-confirm-overlay');
  if (overlay) overlay.classList.remove('active');
  pendingDeleteId = null;
  pendingDeleteTitle = '';
}

/**
 * Execute the delete after confirmation.
 */
function executeDeleteProject() {
  if (!pendingDeleteId) return;

  var project = allProjects.find(function (p) { return p.id === pendingDeleteId; });
  var btn = document.getElementById('delete-confirm-btn');
  btn.disabled = true;
  btn.textContent = 'Deleting...';

  // Delete from Firestore
  db.collection('portfolioProjects').doc(pendingDeleteId).delete()
    .then(function () {
      // Also delete image from Storage if exists
      if (project && project.imageUrl && project.imageUrl.includes('firebase')) {
        var imageRef = storage.refFromURL(project.imageUrl);
        imageRef.delete().catch(function () {
          // Image may already be deleted, ignore
        });
      }
      showToast('Project "' + pendingDeleteTitle + '" deleted.', 'success');
      closeDeleteConfirm();
    })
    .catch(function (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete: ' + error.message, 'error');
    })
    .finally(function () {
      btn.disabled = false;
      btn.textContent = 'Delete';
    });
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 4: IMAGE UPLOAD
// ═══════════════════════════════════════════════════════════════

/**
 * Upload a project image to Firebase Storage.
 * Returns a Promise with the download URL.
 */
function uploadProjectImage(file, projectId) {
  // Validate file type
  var validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (validTypes.indexOf(file.type) === -1) {
    return Promise.reject(new Error('Invalid file type. Use JPG, PNG, WebP, or GIF.'));
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return Promise.reject(new Error('File too large. Max 5MB.'));
  }

  var timestamp = Date.now();
  var ext = file.name.split('.').pop();
  var path = 'project-images/' + projectId + '_' + timestamp + '.' + ext;
  var ref = storage.ref(path);

  return ref.put(file).then(function (snapshot) {
    return snapshot.ref.getDownloadURL();
  });
}

/**
 * Handle image file input change — show preview.
 */
function handleImagePreview(input) {
  var preview = document.getElementById('form-image-preview');
  if (!preview) return;

  if (input.files && input.files[0]) {
    var file = input.files[0];

    // Validate
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image too large (max 5MB).', 'error');
      input.value = '';
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      preview.innerHTML = '<img src="' + e.target.result + '" alt="Preview" /><button type="button" class="preview-remove-btn" onclick="clearImagePreview()">✕</button>';
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

/**
 * Clear the image preview and file input.
 */
function clearImagePreview() {
  var preview = document.getElementById('form-image-preview');
  if (preview) {
    preview.innerHTML = '';
    preview.style.display = 'none';
  }
  var fileInput = document.getElementById('form-image-file');
  if (fileInput) fileInput.value = '';
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 5: TOOLS TAG INPUT
// ═══════════════════════════════════════════════════════════════

/**
 * Render tool tags in the form.
 */
function renderFormTools(tools) {
  var container = document.getElementById('form-tools-list');
  if (!container) return;

  var html = '';
  tools.forEach(function (tool, i) {
    html += '<span class="tool-tag">';
    html += '<span class="tool-tag-text">' + escapeHTML(tool) + '</span>';
    html += '<button type="button" class="tool-tag-remove" onclick="removeFormTool(this)">✕</button>';
    html += '</span>';
  });
  container.innerHTML = html;
}

/**
 * Add a tool tag from the input field.
 */
function addFormTool() {
  var input = document.getElementById('form-tool-input');
  var value = input.value.trim();
  if (!value) return;

  var container = document.getElementById('form-tools-list');
  var tag = document.createElement('span');
  tag.className = 'tool-tag';
  tag.innerHTML = '<span class="tool-tag-text">' + escapeHTML(value) + '</span><button type="button" class="tool-tag-remove" onclick="removeFormTool(this)">✕</button>';
  container.appendChild(tag);

  input.value = '';
  input.focus();
}

/**
 * Remove a tool tag.
 */
function removeFormTool(btn) {
  btn.parentElement.remove();
}

/**
 * Handle Enter key in tool input.
 */
function handleToolKeydown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    addFormTool();
  }
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 6: UTILITY HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Get the color name for CSS class mapping.
 */
function getCategoryColorName(category) {
  var map = {
    'Web Design': 'purple',
    'Video Editing': 'pink',
    'Brand Identity': 'blue',
    'Python Automation': 'green'
  };
  return map[category] || 'purple';
}

function normalizeExternalUrl(rawUrl) {
  if (!rawUrl) return null;
  var trimmed = String(rawUrl).trim();
  if (!trimmed || trimmed === '#') return null;
  try {
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
    }
    var parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch (error) {
    return null;
  }
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 7: ADMIN TRIGGERS
// ═══════════════════════════════════════════════════════════════

/**
 * Set up admin access triggers.
 * - URL hash: /#admin
 * - Triple-click on footer logo
 */
function initAdminTriggers() {
  // Check URL hash on load
  if (window.location.hash === '#admin') {
    var user = auth.currentUser;
    if (user) {
      enableAdminMode();
    } else {
      openLoginModal();
    }
  }

  // Listen for hash changes
  window.addEventListener('hashchange', function () {
    if (window.location.hash === '#admin') {
      var user = auth.currentUser;
      if (user) {
        enableAdminMode();
      } else {
        openLoginModal();
      }
    }
  });

  // Triple-click on footer logo
  var footerLogo = document.querySelector('.flogo');
  if (footerLogo) {
    var clickCount = 0;
    var clickTimer = null;

    footerLogo.addEventListener('click', function () {
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(function () { clickCount = 0; }, 500);

      if (clickCount >= 3) {
        clickCount = 0;
        var user = auth.currentUser;
        if (user) {
          enableAdminMode();
          showToast('Admin mode activated!', 'success');
        } else {
          openLoginModal();
        }
      }
    });
  }
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 8: INITIALIZATION
// ═══════════════════════════════════════════════════════════════

function initAdminSystem() {
  checkAuthState();
  initAdminTriggers();

  // Login form handler
  var loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Project form handler
  var projectForm = document.getElementById('project-form');
  if (projectForm) {
    projectForm.addEventListener('submit', handleProjectSubmit);
  }

  // Image file input handler
  var imageInput = document.getElementById('form-image-file');
  if (imageInput) {
    imageInput.addEventListener('change', function () {
      handleImagePreview(this);
    });
  }

  // Tool input Enter key
  var toolInput = document.getElementById('form-tool-input');
  if (toolInput) {
    toolInput.addEventListener('keydown', handleToolKeydown);
  }

  console.log('✓ Admin system initialized');
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminSystem);
} else {
  initAdminSystem();
}
// ===== BASE64 IMAGE UPLOAD FUNCTION =====

function uploadImageToFirestore() {
  const fileInput = document.getElementById('imageFile');
  const titleInput = document.getElementById('imageTitle');
  const descriptionInput = document.getElementById('imageDescription');
  const statusDiv = document.getElementById('uploadStatus');

  if (!fileInput.files || !fileInput.files[0]) {
    statusDiv.textContent = '❌ Please select an image first';
    statusDiv.style.color = 'red';
    return;
  }

  if (!titleInput.value.trim()) {
    statusDiv.textContent = '❌ Please enter an image title';
    statusDiv.style.color = 'red';
    return;
  }

  if (!descriptionInput.value.trim()) {
    statusDiv.textContent = '❌ Please enter an image description';
    statusDiv.style.color = 'red';
    return;
  }

  if (typeof db === 'undefined') {
    statusDiv.textContent = '❌ Firestore not loaded. Refresh page.';
    statusDiv.style.color = 'red';
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  statusDiv.textContent = '⏳ Uploading...';
  statusDiv.style.color = 'orange';

  reader.onload = function(event) {
    const base64String = event.target.result;

    db.collection('portfolioImages').add({
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      imageData: base64String,
      uploadedAt: new Date(),
      uploadedBy: auth.currentUser.email
    })
    .then(() => {
      statusDiv.textContent = '✅ Image uploaded successfully!';
      statusDiv.style.color = 'green';

      fileInput.value = '';
      titleInput.value = '';
      descriptionInput.value = '';

      loadPortfolioImages();
    })
    .catch((error) => {
      statusDiv.textContent = '❌ Upload failed: ' + error.message;
      statusDiv.style.color = 'red';
      console.error('Upload error:', error);
    });
  };

  reader.onerror = function() {
    statusDiv.textContent = '❌ Failed to read file';
    statusDiv.style.color = 'red';
  };

  reader.readAsDataURL(file);
}

// ===== LOAD AND DISPLAY IMAGES FUNCTION =====

function loadPortfolioImages() {
  const container = document.getElementById('imagesContainer');

  if (typeof db === 'undefined') {
    console.error('Firestore not loaded');
    return;
  }

  container.innerHTML = '';

  db.collection('portfolioImages')
    .orderBy('uploadedAt', 'desc')
    .onSnapshot((snapshot) => {
      if (snapshot.empty) {
        container.innerHTML = '<p>No images uploaded yet</p>';
        return;
      }

      snapshot.forEach((doc) => {
        const imageData = doc.data();
        const docId = doc.id;

        const imageCard = document.createElement('div');
        imageCard.style.cssText = 'border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';

        imageCard.innerHTML = `
          <img src="${imageData.imageData}" style="width: 100%; height: 150px; object-fit: cover;">
          <div style="padding: 10px;">
            <h4 style="margin: 0 0 5px; font-size: 14px;">${imageData.title}</h4>
            <p style="margin: 0 0 5px; font-size: 12px; color: #666;">${imageData.description}</p>
            <p style="margin: 0 0 10px; font-size: 11px; color: #999;">
              ${imageData.uploadedAt.toDate().toLocaleDateString()}
            </p>
            <button onclick="deletePortfolioImage('${docId}')" style="width: 100%; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
              Delete
            </button>
          </div>
        `;

        container.appendChild(imageCard);
      });
    });
}

// ===== DELETE IMAGE FUNCTION =====

function deletePortfolioImage(docId) {
  if (!confirm('Are you sure you want to delete this image?')) {
    return;
  }

  if (typeof db === 'undefined') {
    alert('Firestore not loaded');
    return;
  }

  db.collection('portfolioImages').doc(docId).delete()
    .then(() => {
      console.log('Image deleted successfully');
      loadPortfolioImages();
    })
    .catch((error) => {
      alert('Error deleting image: ' + error.message);
      console.error('Delete error:', error);
    });
}
