const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

export function error(message, status = 400) {
  return json({ error: message }, status);
}

export function notFound(message = 'Not found') {
  return error(message, 404);
}

export function unauthorized(message = 'Unauthorized') {
  return error(message, 401);
}

export function forbidden(message = 'Forbidden') {
  return error(message, 403);
}

export function corsOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
