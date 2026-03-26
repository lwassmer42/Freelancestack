import { requireAuth } from '../middleware/auth.js';
import { json, error, notFound } from '../utils/response.js';

// Freelancer-side: post an update to their own project (is_client = 0)
export async function handleCreateUpdate(request, env, projectId) {
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  const project = await env.DB.prepare(
    'SELECT id FROM projects WHERE id = ? AND user_id = ?'
  ).bind(projectId, user.sub).first();
  if (!project) return notFound('Project not found');

  let body;
  try {
    body = await request.json();
  } catch {
    return error('Invalid JSON');
  }

  const { body: updateBody, author_name } = body;
  if (!updateBody || !updateBody.trim()) return error('body is required');

  const update = await env.DB.prepare(
    'INSERT INTO updates (project_id, body, is_client, author_name) VALUES (?, ?, 0, ?) RETURNING id, body, is_client, author_name, created_at'
  ).bind(projectId, updateBody.trim(), author_name || null).first();

  // Bump project updated_at
  await env.DB.prepare(
    "UPDATE projects SET updated_at = datetime('now') WHERE id = ?"
  ).bind(projectId).run();

  return json(update, 201);
}

export async function handleDeleteUpdate(request, env, projectId, updateId) {
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  const project = await env.DB.prepare(
    'SELECT id FROM projects WHERE id = ? AND user_id = ?'
  ).bind(projectId, user.sub).first();
  if (!project) return notFound('Project not found');

  const update = await env.DB.prepare(
    'SELECT id FROM updates WHERE id = ? AND project_id = ?'
  ).bind(updateId, projectId).first();
  if (!update) return notFound('Update not found');

  await env.DB.prepare('DELETE FROM updates WHERE id = ?').bind(updateId).run();
  return json({ deleted: true });
}
