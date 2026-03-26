import { requireAuth } from '../middleware/auth.js';
import { generateShareToken, hashPassword } from '../utils/crypto.js';
import { json, error, notFound, forbidden } from '../utils/response.js';

export async function handleListProjects(request, env) {
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  const { results } = await env.DB.prepare(`
    SELECT
      p.id, p.title, p.client_name, p.client_email, p.status,
      p.share_token, p.created_at, p.updated_at,
      COUNT(f.id) AS file_count,
      MAX(u.created_at) AS latest_update
    FROM projects p
    LEFT JOIN files f ON f.project_id = p.id
    LEFT JOIN updates u ON u.project_id = p.id
    WHERE p.user_id = ?
    GROUP BY p.id
    ORDER BY p.updated_at DESC
  `).bind(user.sub).all();

  return json(results);
}

export async function handleCreateProject(request, env) {
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  let body;
  try {
    body = await request.json();
  } catch {
    return error('Invalid JSON');
  }

  const { title, client_name, client_email, description } = body;
  if (!title || !client_name) return error('title and client_name are required');

  const share_token = generateShareToken();

  const project = await env.DB.prepare(`
    INSERT INTO projects (user_id, title, client_name, client_email, description, share_token)
    VALUES (?, ?, ?, ?, ?, ?)
    RETURNING id, user_id, title, client_name, client_email, description, status, share_token, created_at, updated_at
  `).bind(user.sub, title, client_name, client_email || null, description || null, share_token).first();

  return json(project, 201);
}

export async function handleGetProject(request, env, projectId) {
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  const project = await env.DB.prepare(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?'
  ).bind(projectId, user.sub).first();
  if (!project) return notFound('Project not found');

  const { results: files } = await env.DB.prepare(
    'SELECT id, filename, size_bytes, mime_type, version, uploaded_at FROM files WHERE project_id = ? ORDER BY uploaded_at DESC'
  ).bind(projectId).all();

  const { results: updates } = await env.DB.prepare(
    'SELECT id, body, is_client, author_name, created_at FROM updates WHERE project_id = ? ORDER BY created_at ASC'
  ).bind(projectId).all();

  const { password_hash: _, ...safeProject } = project;
  return json({ ...safeProject, files, updates });
}

export async function handleUpdateProject(request, env, projectId) {
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  const existing = await env.DB.prepare(
    'SELECT id FROM projects WHERE id = ? AND user_id = ?'
  ).bind(projectId, user.sub).first();
  if (!existing) return notFound('Project not found');

  let body;
  try {
    body = await request.json();
  } catch {
    return error('Invalid JSON');
  }

  const { status, title, description, client_name, password } = body;

  const allowed_statuses = ['active', 'review', 'completed', 'archived'];
  if (status && !allowed_statuses.includes(status)) {
    return error(`status must be one of: ${allowed_statuses.join(', ')}`);
  }

  // Build dynamic SET clause using only provided fields
  const fields = [];
  const values = [];

  if (title !== undefined) { fields.push('title = ?'); values.push(title); }
  if (client_name !== undefined) { fields.push('client_name = ?'); values.push(client_name); }
  if (description !== undefined) { fields.push('description = ?'); values.push(description); }
  if (status !== undefined) { fields.push('status = ?'); values.push(status); }
  if (password !== undefined) {
    const hashed = password ? await hashPassword(password) : null;
    fields.push('password_hash = ?');
    values.push(hashed);
  }

  fields.push('updated_at = ?');
  values.push(new Date().toISOString().replace('T', ' ').slice(0, 19));
  values.push(projectId);
  values.push(user.sub);

  const project = await env.DB.prepare(
    `UPDATE projects SET ${fields.join(', ')} WHERE id = ? AND user_id = ? RETURNING id, title, client_name, client_email, description, status, share_token, created_at, updated_at`
  ).bind(...values).first();

  return json(project);
}

export async function handleDeleteProject(request, env, projectId) {
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  const project = await env.DB.prepare(
    'SELECT id FROM projects WHERE id = ? AND user_id = ?'
  ).bind(projectId, user.sub).first();
  if (!project) return notFound('Project not found');

  // Fetch all R2 keys for this project's files before cascade delete
  const { results: files } = await env.DB.prepare(
    'SELECT r2_key FROM files WHERE project_id = ?'
  ).bind(projectId).all();

  // Delete files from R2
  await Promise.all(files.map((f) => env.BUCKET.delete(f.r2_key)));

  // D1 cascade handles files + updates rows
  await env.DB.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').bind(projectId, user.sub).run();

  return json({ deleted: true });
}
