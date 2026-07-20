# Building Complete CRUD with Authorization


---

# Goal

Today I completed the URL management features of the URL Shortener backend by implementing:

- My URLs endpoint
- Delete URL
- Update URL
- Ownership-based authorization for all protected operations

The backend now supports complete CRUD operations while ensuring users can only manage their own resources.

---

# Features Implemented

## 1. My URLs Endpoint

Implemented:

```
GET /api/url/my-urls
```

Returns all URLs created by the authenticated user.

### Repository

```sql
SELECT *
FROM urls
WHERE user_id = $1
ORDER BY created_at DESC;
```

### Learning

Collections of resources should be filtered directly using `user_id`.

No separate authorization helper is required because the query itself guarantees ownership.

---

## 2. Delete URL

Implemented:

```
DELETE /api/url/:shortCode
```

Only the owner of the URL can delete it.

Flow:

```
JWT Authentication
        ↓
Ownership Verification
        ↓
Delete URL
```

---

## 3. Update URL

Implemented:

```
PATCH /api/url/:shortCode
```

Features:

- Ownership verification
- URL validation
- Google Safe Browsing verification
- Duplicate URL prevention
- Prevent updating to the same URL

---

# Authorization Pattern

Instead of repeating ownership checks everywhere, I reused one helper:

```ts
getOwnedUrl(shortCode, userId)
```

Every protected operation follows:

```
Authentication
        ↓
Authorization
        ↓
Business Logic
        ↓
Repository
```

Keeping authorization centralized makes the code easier to maintain.

---

# API Design Decision

When updating a URL:

Current URLs:

```
abc123 → google.com
xyz789 → github.com
```

If the user updates:

```
xyz789 → google.com
```

Instead of creating duplicates, the API returns the existing shortened URL.

This keeps the application idempotent and avoids duplicate records.

---

# Important Backend Concepts Learned

## Authentication vs Authorization

Authentication answers:

```
Who is the user?
```

Authorization answers:

```
Can this user perform this action?
```

---

## Which Endpoints Require What?

| Endpoint | Authentication | Authorization |
|----------|---------------|---------------|
| Register | ❌ | ❌ |
| Login | ❌ | ❌ |
| Redirect | ❌ | ❌ |
| Shorten URL | ✅ | ❌ |
| My URLs | ✅ | Query filters by user |
| URL Stats | ✅ | ✅ |
| Browser Stats | ✅ | ✅ |
| Update URL | ✅ | ✅ |
| Delete URL | ✅ | ✅ |

---

## Layer Responsibilities

### Repository

Responsible only for database operations.

Never performs authorization.

---

### Service

Contains business logic.

Examples:

- ownership verification
- duplicate detection
- spam checking
- update logic

---

### Controller

Responsible for:

- reading request
- calling service
- formatting response

Should never contain SQL.

---

# Mistakes Made Today

## Mistake 1

Route parameter mismatch.

Incorrect:

```ts
router.delete("/:shortcode")
```

Controller:

```ts
req.params.shortCode
```

Result:

```
shortCode = undefined
```

Always keep route parameter names identical.

Correct:

```ts
router.delete("/:shortCode")
```

---

## Mistake 2

Forgot SQL parameters.

Incorrect:

```ts
DELETE FROM urls
WHERE short_code = $1
```

without

```ts
[shortCode]
```

Always pass query parameters.

---

## Mistake 3

Authorization before business logic.

Initially it was tempting to update the database first.

Correct flow:

```
Ownership Check
      ↓
Spam Check
      ↓
Duplicate Check
      ↓
Database Update
```

Authorization should happen before any modification.

---

# REST API Design Learned

Updating an existing resource:

```
PATCH /:shortCode
```

Deleting a resource:

```
DELETE /:shortCode
```

Listing current user's resources:

```
GET /my-urls
```

Keeping endpoints RESTful makes APIs easier to understand.

---

# Architecture Progress

Current architecture:

```
Routes
    ↓
Controllers
    ↓
Services
    ↓
Authorization Helpers
    ↓
Repositories
    ↓
Database
```

This separation keeps the project scalable.

---

# Current Backend Features

- User Registration
- User Login
- JWT Authentication
- Authorization
- URL Shortening
- Redirect
- Duplicate Detection
- Safe Browsing
- Browser Analytics
- Click Tracking
- My URLs
- Update URL
- Delete URL
- URL Statistics
- Browser Statistics
- GitHub Actions CI

---

# Biggest Takeaways

1. Authentication identifies the user.

2. Authorization verifies ownership.

3. Reuse authorization helpers instead of repeating checks.

4. Repositories should only access the database.

5. Services orchestrate business logic.

6. Controllers remain thin.

7. Route parameter names must exactly match controller parameter names.

8. Validate requests before reaching business logic.

9. Prevent duplicate resources whenever possible.

10. Building reusable layers makes adding new features significantly easier.

---

# Next Steps

- Swagger / OpenAPI Documentation
- Pagination
- Search
- Sorting
- Rate Limiting
- Helmet
- Docker
- Deployment
