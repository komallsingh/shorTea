# Learning Notes - URL Shortener

## Architecture

```text
Route
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database
```

### Responsibilities

- Route → Maps endpoints
- Controller → Handles req/res
- Service → Business logic
- Repository → SQL queries
- Database → Stores data

---

## Features Completed

- [x] PostgreSQL Setup
- [x] Database Connection Pool
- [x] URL Creation
- [x] URL Validation
- [x] Duplicate URL Check
- [x] URL Redirection
- [x] Click Count
- [x] Stats Endpoint
- [x] Async Handler
- [x] Error Handler

---

## Mistakes & Learnings

### 1. Wrong Package

❌

```ts
import { Pool } from "pq";
```

✅

```ts
import { Pool } from "pg";
```

---

### 2. CommonJS + ES Module Mixup

❌

```ts
const pool = require("./config/db");
```

✅

```ts
import { pool } from "./config/db";
```

Error:

```text
pool.query is not a function
```

---

### 3. Route Params

❌

```ts
const { shortCode } = req.params.shortCode;
```

✅

```ts
const { shortCode } = req.params;
```

or

```ts
const shortCode = req.params.shortCode;
```

---

### 4. URL Validation

Initially checked only:

```ts
if (!url)
```

Problem:

```json
{
  "url": "hello"
}
```

still passed.

Solution:

```ts
new URL(url);
```

Added protocol validation:

```ts
http:
https:
```

allowed only.

---

### 5. Duplicate URL Check

Before:

```text
youtube.com -> abc123
youtube.com -> xyz456
youtube.com -> pqr789
```

After:

```text
youtube.com -> abc123
youtube.com -> abc123
youtube.com -> abc123
```

Flow:

```text
Check Existing URL
        ↓
Exists?
   ↓        ↓
 Yes       No
  ↓         ↓
Return    Create
Existing
```

---

### 6. Redirect Endpoint Returning HTML

Issue:

```http
GET /api/v1/url/A37jz3
```

returned:

```html
<!DOCTYPE html>
```

Reason:

```ts
res.redirect(url.original_url);
```

Postman followed redirect automatically and showed YouTube HTML.

Solution:

- Disable "Follow Redirects" in Postman
- Or test in browser

Learned:

```text
Redirect Endpoint != JSON Endpoint
```

---

### 7. Forgot await

❌

```ts
const url = repo.findByShortCode(shortCode);
```

✅

```ts
const url = await repo.findByShortCode(shortCode);
```

Reason:

```text
Repository returns Promise
Need await to get actual data
```

---

### 8. Stats Endpoint Bug

Wrong Import:

❌

```ts
import { getUrlStats } from "../services/url.service";
```

✅

```ts
import { getUrlStats } from "../controllers/url.controller";
```

Reason:

```text
Routes should call Controllers
Controllers call Services
Services call Repositories
```

Never skip layers.

---

### 9. Express Route Order

Wrong:

```ts
router.get("/:shortCode", ...);

router.get("/stats/:shortCode", ...);
```

Problem:

```text
/stats/A37jz3
```

matched:

```text
/:shortCode
```

first.

Correct:

```ts
router.get("/stats/:shortCode", ...);

router.get("/:shortCode", ...);
```

Learned:

```text
Specific Routes First
Generic Routes Last
```

---

### 10. Controller vs Service vs Repository

SQL belongs in:

✅ Repository

```sql
SELECT *
FROM urls
WHERE short_code = $1
```

Business rules belong in:

✅ Service

```ts
if (!url) {
    throw new AppError(...)
}
```

Response formatting belongs in:

✅ Controller

```ts
res.json(...)
```

---

### 11. API Contract != Database Schema

Database:

```json
{
  "short_code": "A37jz3",
  "original_url": "...",
  "click_count": 5
}
```

API Response:

```json
{
  "shortCode": "A37jz3",
  "originalUrl": "...",
  "clickCount": 5
}
```

Reason:

```text
Database can change
API contract should remain stable
```

---

## Current Endpoints

### Create Short URL

```http
POST /api/v1/url/shorten
```

Body:

```json
{
  "url": "https://youtube.com"
}
```

---

### Redirect

```http
GET /api/v1/url/:shortCode
```

Example:

```http
GET /api/v1/url/A37jz3
```

---

### Stats

```http
GET /api/v1/url/stats/:shortCode
```

Example:

```http
GET /api/v1/url/stats/A37jz3
```

Response:

```json
{
  "success": true,
  "data": {
    "shortCode": "A37jz3",
    "originalUrl": "https://youtube.com",
    "clickCount": 5,
    "createdAt": "..."
  }
}
```

---

## Next Phase

- [ ] Browser Analytics
- [ ] OS Analytics
- [ ] Click History Table
- [ ] QR Code Generation
- [ ] Neon PostgreSQL
- [ ] Deployment
- [ ] Swagger Docs

---

## Golden Rules

```text
Repository -> SQL
Service -> Business Logic
Controller -> HTTP
```

```text
Specific Routes First
Generic Routes Last
```

```text
Always await async DB calls
```

```text
Never expose DB schema directly
```

```text
Route
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database
```
