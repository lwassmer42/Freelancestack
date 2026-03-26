import { hashPassword, verifyPassword, signJwt } from '../utils/crypto.js';
import { json, error, unauthorized } from '../utils/response.js';
import { requireAuth } from '../middleware/auth.js';

const JWT_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

export async function handleRegister(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return error('Invalid JSON');
  }

  const { email, password, business_name } = body;
  if (!email || !password) return error('email and password are required');
  if (password.length < 8) return error('Password must be at least 8 characters');

  const existing = await env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email.toLowerCase()).first();
  if (existing) return error('Email already registered', 409);

  const password_hash = await hashPassword(password);

  const result = await env.DB.prepare(
    'INSERT INTO users (email, password_hash, business_name) VALUES (?, ?, ?) RETURNING id, email, business_name, accent_color, plan, created_at'
  ).bind(email.toLowerCase(), password_hash, business_name || null).first();

  const token = await signJwt(
    { sub: result.id, email: result.email, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY_SECONDS },
    env.JWT_SECRET
  );

  return json({ token, user: result }, 201);
}

export async function handleLogin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return error('Invalid JSON');
  }

  const { email, password } = body;
  if (!email || !password) return error('email and password are required');

  const user = await env.DB.prepare(
    'SELECT id, email, password_hash, business_name, accent_color, logo_url, plan FROM users WHERE email = ?'
  ).bind(email.toLowerCase()).first();

  if (!user) return unauthorized('Invalid credentials');

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return unauthorized('Invalid credentials');

  const token = await signJwt(
    { sub: user.id, email: user.email, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY_SECONDS },
    env.JWT_SECRET
  );

  const { password_hash: _, ...safeUser } = user;
  return json({ token, user: safeUser });
}

export async function handleMe(request, env) {
  const { user, response } = await requireAuth(request, env);
  if (response) return response;

  const profile = await env.DB.prepare(
    'SELECT id, email, business_name, accent_color, logo_url, plan, created_at FROM users WHERE id = ?'
  ).bind(user.sub).first();

  if (!profile) return unauthorized('User not found');
  return json(profile);
}
