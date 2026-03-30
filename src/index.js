import { corsOptions, error } from './utils/response.js';
import { handleRegister, handleLogin, handleMe } from './routes/auth.js';
import {
  handleListProjects,
  handleCreateProject,
  handleGetProject,
  handleUpdateProject,
  handleDeleteProject,
} from './routes/projects.js';
import { handleUploadFiles, handleDeleteFile } from './routes/files.js';
import { handleShareGet, handleShareDownload, handleShareComment } from './routes/share.js';
import { handleCreateUpdate, handleDeleteUpdate } from './routes/updates.js';
import {
  renderDashboardPage,
  renderPortalPage,
  serveDashboardScript,
  servePortalScript,
  serveStyles,
} from './frontend/pages.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    // CORS preflight
    if (method === 'OPTIONS') return corsOptions();

    try {
      // ── Frontend ──────────────────────────────────────────────────────────
      if (pathname === '/' && method === 'GET') return renderDashboardPage();
      if (pathname === '/app.css' && method === 'GET') return serveStyles();
      if (pathname === '/app.js' && method === 'GET') return serveDashboardScript();
      if (pathname === '/portal.js' && method === 'GET') return servePortalScript();

      const portalMatch = pathname.match(/^\/p\/([^/]+)$/);
      if (portalMatch && method === 'GET') return renderPortalPage(portalMatch[1]);

      // ── Auth ──────────────────────────────────────────────────────────────
      if (pathname === '/api/auth/register' && method === 'POST')
        return handleRegister(request, env);

      if (pathname === '/api/auth/login' && method === 'POST')
        return handleLogin(request, env);

      if (pathname === '/api/auth/me' && method === 'GET')
        return handleMe(request, env);

      // ── Projects ──────────────────────────────────────────────────────────
      if (pathname === '/api/projects' && method === 'GET')
        return handleListProjects(request, env);

      if (pathname === '/api/projects' && method === 'POST')
        return handleCreateProject(request, env);

      const projectMatch = pathname.match(/^\/api\/projects\/([^/]+)$/);
      if (projectMatch) {
        const projectId = projectMatch[1];
        if (method === 'GET') return handleGetProject(request, env, projectId);
        if (method === 'PATCH') return handleUpdateProject(request, env, projectId);
        if (method === 'DELETE') return handleDeleteProject(request, env, projectId);
      }

      // ── Files ─────────────────────────────────────────────────────────────
      const filesMatch = pathname.match(/^\/api\/projects\/([^/]+)\/files$/);
      if (filesMatch && method === 'POST')
        return handleUploadFiles(request, env, filesMatch[1]);

      const fileDeleteMatch = pathname.match(/^\/api\/projects\/([^/]+)\/files\/([^/]+)$/);
      if (fileDeleteMatch && method === 'DELETE')
        return handleDeleteFile(request, env, fileDeleteMatch[1], fileDeleteMatch[2]);

      // ── Updates (freelancer-side) ─────────────────────────────────────────
      const updatesMatch = pathname.match(/^\/api\/projects\/([^/]+)\/updates$/);
      if (updatesMatch && method === 'POST')
        return handleCreateUpdate(request, env, updatesMatch[1]);

      const updateDeleteMatch = pathname.match(/^\/api\/projects\/([^/]+)\/updates\/([^/]+)$/);
      if (updateDeleteMatch && method === 'DELETE')
        return handleDeleteUpdate(request, env, updateDeleteMatch[1], updateDeleteMatch[2]);

      // ── Share (public / client-facing) ────────────────────────────────────
      const shareMatch = pathname.match(/^\/api\/share\/([^/]+)$/);
      if (shareMatch) {
        const token = shareMatch[1];
        if (method === 'GET') return handleShareGet(request, env, token);
        if (method === 'POST') return handleShareComment(request, env, token);
      }

      const shareDownloadMatch = pathname.match(/^\/api\/share\/([^/]+)\/files\/([^/]+)\/download$/);
      if (shareDownloadMatch && method === 'GET')
        return handleShareDownload(request, env, shareDownloadMatch[1], shareDownloadMatch[2]);

      return error('Not found', 404);
    } catch (err) {
      console.error('Unhandled error:', err);
      return error('Internal server error', 500);
    }
  },
};

