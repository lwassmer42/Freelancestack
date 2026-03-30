import { dashboardJs, portalJs, stylesCss } from './assets.js';

function htmlResponse(markup) {
  return new Response(markup, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-store',
    },
  });
}

function assetResponse(body, contentType) {
  return new Response(body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
    },
  });
}

export function serveStyles() {
  return assetResponse(stylesCss, 'text/css; charset=UTF-8');
}

export function serveDashboardScript() {
  return assetResponse(dashboardJs, 'application/javascript; charset=UTF-8');
}

export function servePortalScript() {
  return assetResponse(portalJs, 'application/javascript; charset=UTF-8');
}

export function renderDashboardPage() {
  return htmlResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FreelanceStack</title>
    <meta name="description" content="A lightweight client portal for freelancers running on Cloudflare Workers." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/app.css" />
  </head>
  <body>
    <main class="page-shell">
      <header class="masthead">
        <div class="brand-lockup">
          <span class="brand-mark">FreelanceStack</span>
          <strong>Single-deploy client portal</strong>
        </div>
        <div class="muted">Worker, D1, R2, same origin.</div>
      </header>

      <section class="hero-grid">
        <section class="hero-copy">
          <div class="stack">
            <span class="eyebrow">Client delivery</span>
            <h1>Send polished work without extra admin drag.</h1>
            <p class="lede">
              Sign in, create a project, and hand clients one clean link for files, updates, and comments.
            </p>
          </div>
          <div class="hero-points">
            <span>One Worker deploy for app and API.</span>
            <span>Projects live in D1. Files live in R2.</span>
            <span>Client portal opens from a share token.</span>
          </div>
        </section>

        <section class="panel stack" id="auth-panel">
          <div class="stack">
            <div class="auth-toggle">
              <button class="pill active" type="button" data-auth-mode="login">Sign in</button>
              <button class="pill" type="button" data-auth-mode="register">Create account</button>
            </div>
            <div class="stack">
              <h2 id="auth-title">Sign in to your workspace</h2>
              <p class="subtle" id="auth-hint">Pick up where you left off and send your next delivery.</p>
            </div>
          </div>

          <form class="auth-form" id="auth-form">
            <div class="field hidden" id="register-name-field">
              <label for="business_name">Business name</label>
              <input id="business_name" name="business_name" placeholder="Lucas Wassmer Studio" />
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" required />
            </div>
            <div class="field">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required />
            </div>
            <button class="primary-button" id="auth-submit" type="submit">Sign in</button>
            <div class="message" id="auth-message"></div>
          </form>
        </section>
      </section>

      <section class="panel workspace-shell hidden" id="workspace-panel">
        <div class="workspace-bar">
          <div class="stack">
            <span class="section-title">Workspace</span>
            <h2 id="welcome-name">FreelanceStack</h2>
            <div class="muted" id="welcome-meta"></div>
          </div>
          <div class="workspace-actions">
            <button class="secondary-button" id="logout-button" type="button">Sign out</button>
          </div>
        </div>

        <div class="stack">
          <span class="section-title">New project</span>
          <form class="project-form" id="create-project-form">
            <div class="field-grid">
              <div class="field">
                <label for="title">Project title</label>
                <input id="title" name="title" placeholder="Homepage redesign" required />
              </div>
              <div class="field">
                <label for="client_name">Client name</label>
                <input id="client_name" name="client_name" placeholder="Acme Co" required />
              </div>
            </div>
            <div class="field-grid">
              <div class="field">
                <label for="client_email">Client email</label>
                <input id="client_email" name="client_email" type="email" placeholder="client@acme.com" />
              </div>
              <div class="field">
                <label for="description">Delivery note</label>
                <input id="description" name="description" placeholder="Round one assets and notes" />
              </div>
            </div>
            <button class="primary-button" type="submit">Create project</button>
          </form>
          <div class="message" id="workspace-message"></div>
        </div>

        <div class="stack">
          <span class="section-title">Active projects</span>
          <div class="projects-list" id="projects-list"></div>
        </div>
      </section>
    </main>
    <script type="module" src="/app.js"></script>
  </body>
</html>`);
}

export function renderPortalPage(token) {
  return htmlResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Client Portal</title>
    <meta name="description" content="Shared project files and updates." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/app.css" />
  </head>
  <body data-share-token="${escapeHtml(token)}">
    <main class="portal-page">
      <header class="masthead">
        <div class="brand-lockup">
          <span class="brand-mark">Client portal</span>
          <strong id="brand-name">FreelanceStack</strong>
        </div>
        <a class="muted" href="/">Open workspace</a>
      </header>

      <section class="portal-hero">
        <section class="portal-panel">
          <span class="kicker">Shared project</span>
          <div class="accent-line"></div>
          <h1 class="portal-title" id="portal-title">Loading...</h1>
          <div class="portal-meta muted">
            <span id="portal-client">Client</span>
          </div>
          <p class="lede" id="portal-description">Loading shared files and update history.</p>
          <div class="message" id="share-status"></div>
        </section>

        <aside class="portal-panel stack">
          <span class="section-title">Access</span>
          <form class="password-form hidden" id="password-form">
            <div class="field">
              <label for="portal-password">Project password</label>
              <input id="portal-password" name="password" type="password" placeholder="Enter password if required" />
            </div>
            <button class="primary-button" type="submit">Unlock portal</button>
          </form>
          <div class="subtle" id="password-panel">
            This view will show files, comments, and project context for the shared link.
          </div>
        </aside>
      </section>

      <section class="portal-grid">
        <section class="portal-panel stack">
          <span class="section-title">Files</span>
          <div class="file-list" id="files-list"></div>
        </section>

        <section class="portal-panel stack">
          <span class="section-title">Conversation</span>
          <div class="update-list" id="updates-list"></div>
          <form class="comment-form" id="comment-form">
            <div class="field">
              <label for="author_name">Your name</label>
              <input id="author_name" name="author_name" placeholder="Client name" />
            </div>
            <div class="field">
              <label for="body">Comment</label>
              <textarea id="body" name="body" placeholder="Leave feedback or delivery notes"></textarea>
            </div>
            <button class="primary-button" type="submit">Post comment</button>
            <div class="message" id="comment-message"></div>
          </form>
        </section>
      </section>

      <div class="footer-note">This portal is powered by the same Worker as the API, so there is only one deployment target.</div>
    </main>
    <script type="module" src="/portal.js"></script>
  </body>
</html>`);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

