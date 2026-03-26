// PBKDF2 password hashing using Web Crypto API (available in Workers)
const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_HASH = 'SHA-256';
const KEY_LENGTH = 32; // bytes

export async function hashPassword(password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  const saltHex = bufToHex(salt);
  const hashHex = bufToHex(new Uint8Array(derived));
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;

  const salt = hexToBuf(saltHex);
  const enc = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    keyMaterial,
    KEY_LENGTH * 8
  );

  const derivedHex = bufToHex(new Uint8Array(derived));
  return timingSafeEqual(derivedHex, hashHex);
}

// ─── JWT (HS256) ─────────────────────────────────────────────────────────────

export async function signJwt(payload, secret) {
  const enc = new TextEncoder();
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify(payload));
  const signingInput = `${header}.${body}`;

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(signingInput));
  const sigB64 = bufToB64url(new Uint8Array(sig));
  return `${signingInput}.${sigB64}`;
}

export async function verifyJwt(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, bodyB64, sigB64] = parts;
  const enc = new TextEncoder();
  const signingInput = `${headerB64}.${bodyB64}`;

  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  let valid;
  try {
    valid = await crypto.subtle.verify(
      'HMAC',
      key,
      b64urlToBuf(sigB64),
      enc.encode(signingInput)
    );
  } catch {
    return null;
  }

  if (!valid) return null;

  let payload;
  try {
    payload = JSON.parse(atob(bodyB64.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }

  if (payload.exp && Date.now() / 1000 > payload.exp) return null;
  return payload;
}

// ─── Share token ─────────────────────────────────────────────────────────────

export function generateShareToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function bufToHex(buf) {
  return Array.from(buf).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBuf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function b64url(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function bufToB64url(buf) {
  let binary = '';
  for (const byte of buf) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function b64urlToBuf(b64) {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
