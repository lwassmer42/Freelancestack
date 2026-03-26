import { verifyJwt } from '../utils/crypto.js';
import { unauthorized } from '../utils/response.js';

export async function requireAuth(request, env) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return { user: null, response: unauthorized('Missing token') };

  const payload = await verifyJwt(token, env.JWT_SECRET);
  if (!payload) return { user: null, response: unauthorized('Invalid or expired token') };

  return { user: payload, response: null };
}
