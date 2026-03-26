import { requireAuth } from '../middleware/auth.js';
import { json, error, notFound } from '../utils/response.js';

export async function handleUploadFiles(request, env, projectId) {
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  // Verify the project belongs to this user
  const project = await env.DB.prepare(
    'SELECT id FROM projects WHERE id = ? AND user_id = ?'
  ).bind(projectId, user.sub).first();
  if (!project) return notFound('Project not found');

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return error('Expected multipart/form-data');
  }

  const uploaded = [];

  // Support single 'file' field or multiple 'files[]' fields
  const fileEntries = [...formData.entries()].filter(([k]) => k === 'file' || k === 'files[]');
  if (fileEntries.length === 0) return error('No file(s) provided');

  for (const [, file] of fileEntries) {
    if (typeof file === 'string') continue; // skip non-file fields

    const fileId = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
    const r2Key = `${user.sub}/${projectId}/${fileId}/${file.name}`;

    await env.BUCKET.put(r2Key, file.stream(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
      customMetadata: { originalName: file.name },
    });

    const meta = await env.DB.prepare(
      'INSERT INTO files (id, project_id, filename, r2_key, size_bytes, mime_type) VALUES (?, ?, ?, ?, ?, ?) RETURNING id, filename, size_bytes, mime_type, version, uploaded_at'
    ).bind(fileId, projectId, file.name, r2Key, file.size, file.type || null).first();

    uploaded.push(meta);
  }

  // Bump project updated_at
  await env.DB.prepare(
    "UPDATE projects SET updated_at = datetime('now') WHERE id = ?"
  ).bind(projectId).run();

  return json(uploaded, 201);
}

export async function handleDeleteFile(request, env, projectId, fileId) {
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  // Verify project ownership
  const project = await env.DB.prepare(
    'SELECT id FROM projects WHERE id = ? AND user_id = ?'
  ).bind(projectId, user.sub).first();
  if (!project) return notFound('Project not found');

  const file = await env.DB.prepare(
    'SELECT id, r2_key FROM files WHERE id = ? AND project_id = ?'
  ).bind(fileId, projectId).first();
  if (!file) return notFound('File not found');

  await env.BUCKET.delete(file.r2_key);
  await env.DB.prepare('DELETE FROM files WHERE id = ?').bind(fileId).run();

  return json({ deleted: true });
}
