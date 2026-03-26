import { verifyPassword } from '../utils/crypto.js';
import { json, error, notFound, unauthorized } from '../utils/response.js';
import { rateLimit } from '../middleware/rateLimit.js';

async function resolveProject(env, token) {
  return env.DB.prepare(
    'SELECT id, title, client_name, description, status, password_hash, user_id FROM projects WHERE share_token = ?'
  ).bind(token).first();
}

async function checkProjectPassword(request, project) {
  if (!project.password_hash) return true;

  // Check cookie first
  const cookie = request.headers.get('Cookie') || '';
  const cookieToken = parseCookie(cookie, `project_pw_${project.id}`);
  if (cookieToken === 'ok') return true;

  // Check query param
  const url = new URL(request.url);
  const pw = url.searchParams.get('password');
  if (!pw) return false;

  return verifyPassword(pw, project.password_hash);
}

export async function handleShareGet(request, env, token) {
  const project = await resolveProject(env, token);
  if (!project) return notFound('Project not found');

  const passwordOk = await checkProjectPassword(request, project);
  if (!passwordOk) {
    return unauthorized('This project is password protected. Provide ?password= query param.');
  }

  const { results: files } = await env.DB.prepare(
    'SELECT id, filename, size_bytes, mime_type, version, uploaded_at FROM files WHERE project_id = ? ORDER BY uploaded_at DESC'
  ).bind(project.id).all();

  const { results: updates } = await env.DB.prepare(
    'SELECT id, body, is_client, author_name, created_at FROM updates WHERE project_id = ? ORDER BY created_at ASC'
  ).bind(project.id).all();

  // Fetch branding from project owner
  const owner = await env.DB.prepare(
    'SELECT business_name, accent_color, logo_url FROM users WHERE id = ?'
  ).bind(project.user_id).first();

  const { password_hash: _, user_id: __, ...safeProject } = project;

  const headers = {};
  // Set a long-lived cookie if password was just verified
  if (project.password_hash) {
    headers['Set-Cookie'] = `project_pw_${project.id}=ok; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`;
  }

  return json({ project: safeProject, files, updates, branding: owner }, 200, headers);
}

export async function handleShareDownload(request, env, token, fileId) {
  const project = await resolveProject(env, token);
  if (!project) return notFound('Project not found');

  const passwordOk = await checkProjectPassword(request, project);
  if (!passwordOk) return unauthorized('Password required');

  const file = await env.DB.prepare(
    'SELECT id, filename, r2_key, size_bytes, mime_type FROM files WHERE id = ? AND project_id = ?'
  ).bind(fileId, project.id).first();
  if (!file) return notFound('File not found');

  const object = await env.BUCKET.get(file.r2_key);
  if (!object) return notFound('File not found in storage');

  return new Response(object.body, {
    headers: {
      'Content-Type': file.mime_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
      'Content-Length': String(file.size_bytes ?? ''),
    },
  });
}

export async function handleShareComment(request, env, token) {
  const project = await resolveProject(env, token);
  if (!project) return notFound('Project not found');

  const passwordOk = await checkProjectPassword(request, project);
  if (!passwordOk) return unauthorized('Password required');

  // Rate limit: 10 comments per hour per IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const { allowed } = rateLimit(`comment:${ip}`, 10, 60 * 60 * 1000);
  if (!allowed) return error('Rate limit exceeded. Try again later.', 429);

  let body;
  try {
    body = await request.json();
  } catch {
    return error('Invalid JSON');
  }

  const { body: commentBody, author_name } = body;
  if (!commentBody || !commentBody.trim()) return error('body is required');

  const update = await env.DB.prepare(
    'INSERT INTO updates (project_id, body, is_client, author_name) VALUES (?, ?, 1, ?) RETURNING id, body, is_client, author_name, created_at'
  ).bind(project.id, commentBody.trim(), author_name || 'Client').first();

  return json(update, 201);
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function parseCookie(cookieHeader, name) {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
