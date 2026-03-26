# ClientDrop — Backend (Phase 1)

Client portal SaaS for freelancers. Built on Cloudflare Workers + D1 + R2.

## Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Runtime  | Cloudflare Workers                 |
| Database | Cloudflare D1 (SQLite)             |
| Storage  | Cloudflare R2                      |
| Auth     | JWT (HS256) + share tokens         |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the D1 database

```bash
npx wrangler d1 create clientdrop-db
```

Copy the `database_id` output and paste it into `wrangler.toml`.

### 3. Run the schema migration

```bash
# Local dev database
npx wrangler d1 execute clientdrop-db --local --file=schema.sql

# Remote (production)
npx wrangler d1 execute clientdrop-db --file=schema.sql
```

### 4. Create the R2 bucket

```bash
npx wrangler r2 bucket create clientdrop-files
```

### 5. Set the JWT secret

```bash
npx wrangler secret put JWT_SECRET
# Enter a long random string when prompted
```

### 6. Start local dev server

```bash
npm run dev
# API available at http://localhost:8787
```

### 7. Deploy to production

```bash
npm run deploy
```

---

## API Reference

### Auth

```
POST /api/auth/register
  Body: { email, password, business_name? }
  → { token, user }

POST /api/auth/login
  Body: { email, password }
  → { token, user }

GET /api/auth/me
  Authorization: Bearer <token>
  → user profile
```

### Projects (requires JWT)

```
GET  /api/projects                   → list projects (with file count)
POST /api/projects                   → create project
GET  /api/projects/:id               → project detail + files + updates
PATCH /api/projects/:id              → update project fields
DELETE /api/projects/:id             → delete project + all files
```

**PATCH body fields** (all optional): `status`, `title`, `description`, `client_name`, `password`

### Files (requires JWT)

```
POST   /api/projects/:id/files              → upload file(s) (multipart)
DELETE /api/projects/:id/files/:fileId      → delete file
```

For upload, send `multipart/form-data` with field name `file` (or `files[]` for multiple).

### Updates — freelancer side (requires JWT)

```
POST   /api/projects/:id/updates            → post update/comment
DELETE /api/projects/:id/updates/:updateId  → delete update
```

### Share — client-facing (public)

```
GET  /api/share/:token                          → project view (files + updates + branding)
GET  /api/share/:token/files/:fileId/download   → download a file
POST /api/share/:token                          → post a client comment
```

If the project has a password, append `?password=<pw>` on first access. A session cookie is set so the client doesn't need to re-enter it.

**Rate limiting**: client comments are limited to 10 per IP per hour.

---

## Project Structure

```
src/
├── index.js              # Router / entry point
├── routes/
│   ├── auth.js           # Register, login, me
│   ├── projects.js       # CRUD
│   ├── files.js          # Upload & delete
│   ├── share.js          # Public client portal
│   └── updates.js        # Freelancer-side comments
├── middleware/
│   ├── auth.js           # JWT validation
│   └── rateLimit.js      # IP-based rate limiter
└── utils/
    ├── crypto.js          # PBKDF2 hashing, JWT sign/verify, share tokens
    └── response.js        # JSON response helpers + CORS headers
```

---

## Security Notes

- Passwords hashed with PBKDF2-SHA256 (100k iterations) via Web Crypto API
- JWT signed with HS256; expires in 7 days
- All D1 queries use parameterized prepared statements
- R2 keys namespaced per user: `{user_id}/{project_id}/{file_id}/{filename}`
- Share tokens are 12-char cryptographically random alphanumeric strings
- Password-protected projects set an HttpOnly session cookie after first successful auth
