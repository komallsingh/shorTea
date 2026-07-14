#  Development Log — JWT Authorization, Zod Validation & Resource Ownership



---

#  Goal

Today the objective was to move the URL Shortener backend from simple authentication to a production-style authorization system while replacing manual request validation with Zod.

---

#  Features Implemented

## 1. Zod Request Validation

### Created validation schemas for:

- User Registration
- User Login
- URL Shortening

```ts
registerSchema
loginSchema
createUrlSchema
```

Instead of writing validation logic for every route, I now validate requests using schemas.

---

## 2. Generic Validation Middleware

Created a reusable middleware:

```ts
validate(schema)
```

Instead of writing:

```ts
if (!email) ...
if (!password) ...
if (!url) ...
```

every time, I simply write:

```ts
router.post(
    "/register",
    validate(registerSchema),
    ...
);
```

This keeps controllers and routes clean.

---

## 3. Replaced Manual URL Validation

Removed my old

```ts
validateUrl.ts
```

middleware and replaced it completely with Zod.

Old approach:

- Manual parsing
- Manual protocol checking
- Manual error handling

New approach:

- Declarative schemas
- Cleaner code
- Better error messages
- Easier maintenance

---

## 4. URL Ownership

Modified database schema.

```sql
ALTER TABLE urls
ADD COLUMN user_id INTEGER
REFERENCES users(id);
```

Now every shortened URL belongs to one authenticated user.

Relationship:

```text
User (1)
   │
   │
   ▼
Many URLs
```

---

## 5. Authentication vs Authorization

Today I clearly understood the difference.

### Authentication

> Who are you?

Solved using JWT.

---

### Authorization

> Are you allowed to access this resource?

Solved using URL ownership.

---

## 6. Never Trust Client Input

One of today's biggest lessons.

❌ Wrong

```ts
req.body.userId
```

A malicious user can send:

```json
{
    "userId": 1
}
```

and pretend to be another user.

---

✅ Correct

```ts
req.user.id
```

The JWT middleware verifies the token and safely provides the authenticated user's id.

---

## 7. Data Flow Across Layers

Every layer now receives the authenticated user's id.

```text
JWT Middleware
        │
        ▼
req.user.id
        │
        ▼
Controller
        │
(url, userId)
        ▼
Service
        │
(url, userId)
        ▼
Repository
        │
INSERT user_id
        ▼
Database
```

---

## 8. Authorization Service

Created a dedicated

```text
authorization.service.ts
```

instead of importing services into each other.

Reason:

Avoid circular dependencies.

Old:

```text
url.service
      ▲
      │
analytics.service
```

Circular dependency ❌

New:

```text
authorization.service
      ▲          ▲
      │          │
url.service   analytics.service
```

Much cleaner.

---

## 9. Resource Ownership Helper

Created

```ts
getOwnedUrl(shortCode, userId)
```

Instead of repeating:

```ts
const url = ...
if (!url)
    throw ...
```

across every endpoint.

Benefits:

- Less duplicate code
- Easier maintenance
- Single authorization logic

---

## 10. Protected Endpoints

Now these endpoints require ownership.

```
POST /shorten
```

```
GET /stats/:shortCode
```

```
GET /stats/:shortCode/browser
```

If the authenticated user does not own the URL:

```
403 Forbidden
```

is returned.

---

## 11. Duplicate URL Logic

Earlier:

```
All users
        │
        ▼
Same original URL
        │
        ▼
Same short code
```

Now:

```
User A
google.com
↓

abc123

----------------

User B
google.com
↓

xyz789
```

Duplicate detection is now scoped per user.

---

## 12. Browser Analytics Authorization

Before returning analytics:

```
shortCode
      │
      ▼
Verify Ownership
      │
      ▼
Get URL ID
      │
      ▼
Fetch Analytics
```

Unauthorized users cannot access browser statistics.

---

# 🧠 Mistakes I Made Today

## Mistake 1

Forgot to return query result.

Wrong:

```ts
await pool.query(...)
```

Correct:

```ts
const result = await pool.query(...);

return result.rows[0];
```

---

## Mistake 2

Called the service before reading

```ts
req.user.id
```

Wrong order.

Correct order:

```ts
const userId = req.user.id;

service.createShortUrl(url, userId);
```

---

## Mistake 3

Used

```ts
req.user?.id
```

inside protected routes.

Since

```
authMiddleware
```

always executes first,

I can safely use

```ts
req.user.id
```

---

## Mistake 4

Forgot to pass

```ts
userId
```

through every layer.

Controller

↓

Service

↓

Repository

↓

Database

Every layer must receive it.

---

## Mistake 5

Created

```ts
findByUrlAndUser()
```

but forgot

```ts
return result.rows[0];
```

Always return query results.

---

## Mistake 6

Created circular dependency.

```
url.service
      ▲
      │
analytics.service
```

Solved by introducing

```
authorization.service
```

---

## Mistake 7

Tried to fetch analytics using

```ts
shortCode
```

The analytics table stores

```text
url_id
```

Correct flow:

```
shortCode

↓

URL

↓

url.id

↓

Analytics
```

---

## Mistake 8

Initially forgot to authorize Browser Analytics.

Authentication alone is not enough.

Ownership must be verified.

---

# ⭐ Important Backend Concepts Learned

## Authentication

Identity verification.

JWT proves who the user is.

---

## Authorization

Permission verification.

Checks whether the authenticated user owns the requested resource.

---

## Validation

Never trust request body.

Validate every incoming request.

---

## Repository Pattern

Database logic stays inside repositories.

No SQL inside controllers or services.

---

## Layered Architecture

```
Routes

↓

Middleware

↓

Controllers

↓

Services

↓

Repositories

↓

Database
```

Every layer has one responsibility.

---

## Resource Ownership

Always associate data with its owner.

```
user_id
```

becomes one of the most important columns.

---

## Generic Middleware

Reusable middleware reduces duplication.

One validation middleware can validate every endpoint.

---

## Never Trust the Client

Everything from

```
req.body
```

is untrusted.

Authentication data should come only from verified JWTs.

---

# 📈 Current Backend Status

- ✅ PostgreSQL
- ✅ Express
- ✅ TypeScript
- ✅ Repository Pattern
- ✅ Layered Architecture
- ✅ URL Shortening
- ✅ Redirects
- ✅ Click Counter
- ✅ Browser Analytics
- ✅ Google Safe Browsing
- ✅ Password Hashing
- ✅ JWT Authentication
- ✅ Authorization
- ✅ Zod Validation
- ✅ Generic Validation Middleware
- ✅ URL Ownership

---

# 🚀 Next Steps

- Add "My URLs" endpoint
- Delete URL endpoint with ownership checks
- Update URL endpoint
- Refresh Tokens
- Rate Limiting
- Logging
- Dockerize the application
- Unit & Integration Tests
- Deploy backend

---

# 💡 Biggest Takeaway

Today I realized that **authentication alone is not enough**.

A user proving their identity with JWT does **not** automatically mean they can access every resource.

Every protected resource must verify **ownership**, not just **authentication**.

This distinction between **authentication** and **authorization** is one of the most important backend security concepts I learned today.
