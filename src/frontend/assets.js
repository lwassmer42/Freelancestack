export const stylesCss = `
:root {
  --bg: #f6f0e8;
  --surface: rgba(255, 252, 247, 0.8);
  --surface-strong: rgba(255, 252, 247, 0.95);
  --text: #1c1712;
  --muted: #6a6258;
  --line: rgba(28, 23, 18, 0.12);
  --accent: #d66c2f;
  --accent-deep: #a34b1d;
  --success: #175f4a;
  --shadow: 0 24px 60px rgba(86, 48, 24, 0.12);
  --radius-lg: 28px;
  --radius-md: 18px;
}

* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
}

body {
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top right, rgba(214, 108, 47, 0.16), transparent 30%),
    radial-gradient(circle at top left, rgba(28, 23, 18, 0.08), transparent 35%),
    var(--bg);
  color: var(--text);
}

a {
  color: inherit;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.page-shell {
  width: min(1180px, calc(100vw - 40px));
  margin: 0 auto;
  padding: 24px 0 56px;
}

.masthead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 0 28px;
}

.brand-lockup {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.brand-mark::before {
  content: "";
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), #ffba82);
  box-shadow: 0 0 0 5px rgba(214, 108, 47, 0.14);
}

.hero-grid,
.portal-hero {
  display: grid;
  gap: 24px;
  align-items: stretch;
}

.hero-grid {
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  min-height: min(78vh, 820px);
}

.hero-copy,
.panel,
.portal-panel {
  border: 1px solid var(--line);
  background: var(--surface);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow);
}

.hero-copy {
  position: relative;
  overflow: hidden;
  border-radius: 40px;
  padding: 42px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  isolation: isolate;
}

.hero-copy::after {
  content: "";
  position: absolute;
  inset: auto -8% -16% auto;
  width: 280px;
  aspect-ratio: 1;
  border-radius: 36px;
  background: linear-gradient(135deg, rgba(214, 108, 47, 0.9), rgba(255, 197, 146, 0.3));
  transform: rotate(16deg);
  z-index: -1;
}

.hero-copy h1,
.portal-title {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 600;
  line-height: 0.92;
  letter-spacing: -0.03em;
}

.hero-copy h1 {
  font-size: clamp(3.8rem, 8vw, 7.5rem);
  max-width: 7ch;
}

.eyebrow,
.kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.eyebrow::before,
.kicker::before {
  content: "";
  width: 28px;
  height: 1px;
  background: currentColor;
}

.lede,
.subtle {
  max-width: 42ch;
  color: var(--muted);
  line-height: 1.6;
}

.hero-points {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding-top: 24px;
}

.hero-points span {
  padding-top: 14px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.92rem;
}

.panel {
  border-radius: 32px;
  padding: 28px;
}

.stack {
  display: grid;
  gap: 18px;
}

.section-title {
  margin: 0;
  font-size: 0.92rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.auth-toggle,
.workspace-actions,
.project-meta,
.project-actions,
.portal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.pill,
.ghost-button,
.mini-button {
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  color: inherit;
}

.pill {
  padding: 10px 14px;
  font-size: 0.92rem;
}

.pill.active {
  background: var(--text);
  color: #fff9f3;
  border-color: var(--text);
}

.primary-button,
.secondary-button,
.ghost-button,
.mini-button {
  padding: 12px 18px;
  transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
}

.primary-button {
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), #f0a25f);
  color: #fff9f4;
  font-weight: 600;
}

.secondary-button {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--surface-strong);
  color: var(--text);
}

.ghost-button,
.mini-button {
  background: rgba(255, 255, 255, 0.45);
}

.primary-button:hover,
.secondary-button:hover,
.ghost-button:hover,
.mini-button:hover {
  transform: translateY(-1px);
}

.auth-form,
.project-form,
.comment-form,
.password-form {
  display: grid;
  gap: 12px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.field {
  display: grid;
  gap: 8px;
}

.field label {
  font-size: 0.88rem;
  color: var(--muted);
}

.field input,
.field textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.8);
  color: var(--text);
}

.field textarea {
  min-height: 108px;
  resize: vertical;
}

.hidden {
  display: none !important;
}

.message {
  min-height: 24px;
  font-size: 0.92rem;
  color: var(--muted);
}

.message.error {
  color: #9e2f25;
}

.message.success {
  color: var(--success);
}

.workspace-shell {
  display: grid;
  gap: 18px;
}

.workspace-bar {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: end;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
}

.workspace-bar h2 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
}

.projects-list,
.file-list,
.update-list {
  display: grid;
  gap: 14px;
}

.project-row,
.file-row,
.update-row {
  display: grid;
  gap: 10px;
  padding: 18px 0;
  border-top: 1px solid var(--line);
}

.project-row:first-child,
.file-row:first-child,
.update-row:first-child {
  border-top: none;
  padding-top: 0;
}

.project-row h3,
.portal-panel h2,
.portal-panel h3,
.update-row h3 {
  margin: 0;
}

.project-header,
.file-header,
.update-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: start;
}

.muted {
  color: var(--muted);
}

.link-line {
  overflow-wrap: anywhere;
  color: var(--accent-deep);
}

.empty-state {
  padding: 28px 0 12px;
  color: var(--muted);
}

.portal-page {
  width: min(1020px, calc(100vw - 36px));
  margin: 0 auto;
  padding: 28px 0 56px;
}

.portal-hero {
  grid-template-columns: minmax(0, 1fr) 300px;
  padding-bottom: 20px;
}

.portal-panel {
  border-radius: 30px;
  padding: 28px;
}

.portal-title {
  font-size: clamp(3rem, 7vw, 5.8rem);
  max-width: 8ch;
}

.accent-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), transparent);
  margin: 18px 0 22px;
}

.portal-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
}

.footer-note {
  padding-top: 24px;
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 960px) {
  .hero-grid,
  .portal-hero,
  .portal-grid,
  .field-grid {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    min-height: auto;
  }

  .hero-points {
    grid-template-columns: 1fr;
  }

  .workspace-bar,
  .project-header,
  .file-header,
  .update-header {
    flex-direction: column;
    align-items: start;
  }
}
`;

export const dashboardJs = `
const state = {
  token: localStorage.getItem('freelancestack_token') || '',
  me: null,
  projects: [],
  mode: 'login',
};

const els = {
  authPanel: document.getElementById('auth-panel'),
  workspacePanel: document.getElementById('workspace-panel'),
  authTitle: document.getElementById('auth-title'),
  authHint: document.getElementById('auth-hint'),
  authSubmit: document.getElementById('auth-submit'),
  toggleButtons: [...document.querySelectorAll('[data-auth-mode]')],
  form: document.getElementById('auth-form'),
  authMessage: document.getElementById('auth-message'),
  registerNameField: document.getElementById('register-name-field'),
  welcomeName: document.getElementById('welcome-name'),
  welcomeMeta: document.getElementById('welcome-meta'),
  projectsList: document.getElementById('projects-list'),
  workspaceMessage: document.getElementById('workspace-message'),
  createForm: document.getElementById('create-project-form'),
  logoutButton: document.getElementById('logout-button'),
};

function setMessage(target, text, tone = '') {
  target.textContent = text || '';
  target.className = 'message' + (tone ? ' ' + tone : '');
}

function setMode(mode) {
  state.mode = mode;
  const registering = mode === 'register';
  els.authTitle.textContent = registering ? 'Create your workspace' : 'Sign in to your workspace';
  els.authHint.textContent = registering
    ? 'Spin up a shareable client portal in one place.'
    : 'Pick up where you left off and send your next delivery.';
  els.authSubmit.textContent = registering ? 'Create account' : 'Sign in';
  els.registerNameField.classList.toggle('hidden', !registering);
  for (const button of els.toggleButtons) {
    button.classList.toggle('active', button.dataset.authMode === mode);
  }
  setMessage(els.authMessage, '');
}

async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  if (state.token) {
    headers.set('Authorization', 'Bearer ' + state.token);
  }
  const response = await fetch(path, { ...options, headers });
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) {
    const message = data?.error || 'Request failed';
    throw new Error(message);
  }
  return data;
}

function renderProjects() {
  if (!state.projects.length) {
    els.projectsList.innerHTML = '<div class="empty-state">No projects yet. Create one and the client portal link will appear here.</div>';
    return;
  }

  els.projectsList.innerHTML = state.projects.map((project) => {
    const shareUrl = location.origin + '/p/' + project.share_token;
    const updated = project.latest_update || project.updated_at || project.created_at;
    return \`
      <article class="project-row">
        <div class="project-header">
          <div class="stack">
            <h3>\${escapeHtml(project.title)}</h3>
            <div class="project-meta muted">
              <span>\${escapeHtml(project.client_name)}</span>
              <span>\${escapeHtml(project.status)}</span>
              <span>\${project.file_count || 0} files</span>
            </div>
          </div>
          <div class="project-actions">
            <button class="mini-button" type="button" data-copy-link="\${shareUrl}">Copy link</button>
            <a class="mini-button" href="\${shareUrl}" target="_blank" rel="noreferrer">Open portal</a>
            <a class="mini-button" href="/api/projects/\${project.id}" target="_blank" rel="noreferrer">Open JSON</a>
          </div>
        </div>
        <div class="muted">\${escapeHtml(project.client_email || 'No client email yet')}</div>
        <div class="link-line">\${escapeHtml(shareUrl)}</div>
        <div class="muted">Last activity: \${formatDate(updated)}</div>
      </article>
    \`;
  }).join('');

  for (const button of document.querySelectorAll('[data-copy-link]')) {
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(button.dataset.copyLink);
      setMessage(els.workspaceMessage, 'Share link copied.', 'success');
    });
  }
}

function renderWorkspace() {
  const businessName = state.me?.business_name || 'FreelanceStack';
  els.welcomeName.textContent = businessName;
  els.welcomeMeta.textContent = state.me?.email || '';
  els.authPanel.classList.add('hidden');
  els.workspacePanel.classList.remove('hidden');
  renderProjects();
}

function renderAuth() {
  els.workspacePanel.classList.add('hidden');
  els.authPanel.classList.remove('hidden');
}

async function loadSession() {
  if (!state.token) {
    renderAuth();
    return;
  }

  try {
    state.me = await api('/api/auth/me');
    state.projects = await api('/api/projects');
    renderWorkspace();
  } catch (error) {
    localStorage.removeItem('freelancestack_token');
    state.token = '';
    state.me = null;
    state.projects = [];
    renderAuth();
    setMessage(els.authMessage, 'Session expired. Sign in again.', 'error');
  }
}

els.toggleButtons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.authMode));
});

els.form.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(els.authMessage, state.mode === 'register' ? 'Creating account...' : 'Signing in...');

  const formData = new FormData(els.form);
  const body = {
    email: formData.get('email'),
    password: formData.get('password'),
  };
  if (state.mode === 'register') {
    body.business_name = formData.get('business_name');
  }

  try {
    const path = state.mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const data = await api(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    state.token = data.token;
    localStorage.setItem('freelancestack_token', state.token);
    state.me = data.user;
    state.projects = await api('/api/projects');
    els.form.reset();
    renderWorkspace();
    setMessage(els.workspaceMessage, state.mode === 'register' ? 'Workspace created.' : 'Signed in.', 'success');
  } catch (error) {
    setMessage(els.authMessage, error.message, 'error');
  }
});

els.createForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(els.workspaceMessage, 'Creating project...');
  const formData = new FormData(els.createForm);
  const body = {
    title: formData.get('title'),
    client_name: formData.get('client_name'),
    client_email: formData.get('client_email'),
    description: formData.get('description'),
  };

  try {
    const project = await api('/api/projects', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    state.projects = [project, ...state.projects];
    els.createForm.reset();
    renderProjects();
    setMessage(els.workspaceMessage, 'Project created. Open the portal link or copy it from the list below.', 'success');
  } catch (error) {
    setMessage(els.workspaceMessage, error.message, 'error');
  }
});

els.logoutButton.addEventListener('click', () => {
  localStorage.removeItem('freelancestack_token');
  state.token = '';
  state.me = null;
  state.projects = [];
  renderAuth();
  setMessage(els.authMessage, 'Signed out.');
});

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(value) {
  if (!value) return 'just now';
  const date = new Date(value.replace(' ', 'T') + 'Z');
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

setMode('login');
loadSession();
`;

export const portalJs = `
const portalState = {
  token: document.body.dataset.shareToken,
  share: null,
  password: new URLSearchParams(location.search).get('password') || '',
};

const shareEls = {
  status: document.getElementById('share-status'),
  heroTitle: document.getElementById('portal-title'),
  heroClient: document.getElementById('portal-client'),
  heroDescription: document.getElementById('portal-description'),
  brandName: document.getElementById('brand-name'),
  filesList: document.getElementById('files-list'),
  updatesList: document.getElementById('updates-list'),
  passwordPanel: document.getElementById('password-panel'),
  passwordForm: document.getElementById('password-form'),
  commentForm: document.getElementById('comment-form'),
  commentMessage: document.getElementById('comment-message'),
};

function setStatus(text, tone = '') {
  shareEls.status.textContent = text || '';
  shareEls.status.className = 'message' + (tone ? ' ' + tone : '');
}

async function fetchShare() {
  const suffix = portalState.password ? '?password=' + encodeURIComponent(portalState.password) : '';
  const response = await fetch('/api/share/' + portalState.token + suffix);
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    shareEls.passwordPanel.classList.add('hidden');
    shareEls.passwordForm.classList.remove('hidden');
    setStatus(data?.error || 'Password required.', 'error');
    return;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Unable to load portal');
  }

  portalState.share = data;
  shareEls.passwordPanel.classList.add('hidden');
  shareEls.passwordForm.classList.add('hidden');
  renderShare();
  setStatus('');
}

function renderShare() {
  const { project, files, updates, branding } = portalState.share;
  document.documentElement.style.setProperty('--accent', branding?.accent_color || '#d66c2f');
  shareEls.heroTitle.textContent = project.title;
  shareEls.heroClient.textContent = project.client_name;
  shareEls.heroDescription.textContent = project.description || 'Shared deliverables and conversation history in one place.';
  shareEls.brandName.textContent = branding?.business_name || 'FreelanceStack';

  if (!files.length) {
    shareEls.filesList.innerHTML = '<div class="empty-state">No files have been uploaded yet.</div>';
  } else {
    shareEls.filesList.innerHTML = files.map((file) => \`
      <article class="file-row">
        <div class="file-header">
          <div class="stack">
            <h3>\${escapeHtml(file.filename)}</h3>
            <div class="portal-meta muted">
              <span>\${formatBytes(file.size_bytes)}</span>
              <span>\${escapeHtml(file.mime_type || 'Unknown type')}</span>
            </div>
          </div>
          <a class="mini-button" href="/api/share/\${portalState.token}/files/\${file.id}/download">Download</a>
        </div>
      </article>
    \`).join('');
  }

  if (!updates.length) {
    shareEls.updatesList.innerHTML = '<div class="empty-state">No comments yet. Add the first note below.</div>';
  } else {
    shareEls.updatesList.innerHTML = updates.map((update) => \`
      <article class="update-row">
        <div class="update-header">
          <div class="stack">
            <h3>\${escapeHtml(update.author_name || (update.is_client ? 'Client' : 'Freelancer'))}</h3>
            <div class="muted">\${update.is_client ? 'Client note' : 'Freelancer update'} · \${formatDate(update.created_at)}</div>
          </div>
        </div>
        <div>\${escapeHtml(update.body)}</div>
      </article>
    \`).join('');
  }
}

shareEls.passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(shareEls.passwordForm);
  portalState.password = String(formData.get('password') || '');
  const nextUrl = new URL(location.href);
  nextUrl.searchParams.set('password', portalState.password);
  history.replaceState({}, '', nextUrl);
  await fetchShare();
});

shareEls.commentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setStatus('Posting comment...');
  const formData = new FormData(shareEls.commentForm);
  try {
    await fetch('/api/share/' + portalState.token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author_name: formData.get('author_name'),
        body: formData.get('body'),
      }),
    }).then(async (response) => {
      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }
      if (!response.ok) {
        throw new Error(data?.error || 'Unable to post comment');
      }
      return data;
    });

    shareEls.commentForm.reset();
    setStatus('Comment posted.', 'success');
    await fetchShare();
  } catch (error) {
    setStatus(error.message, 'error');
  }
});

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / Math.pow(1024, index);
  return size.toFixed(size >= 10 || index === 0 ? 0 : 1) + ' ' + units[index];
}

function formatDate(value) {
  if (!value) return 'just now';
  const date = new Date(value.replace(' ', 'T') + 'Z');
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

fetchShare().catch((error) => setStatus(error.message, 'error'));
`;

