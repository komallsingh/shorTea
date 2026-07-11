# Day 4 Learning - URL Analytics & Clean Backend Architecture

> **Project:** URL Shortener Backend
> **Focus:** Analytics Tracking, User-Agent Parsing, Repository Design

---

# ✅ What I Built Today

- Created a dedicated `url_clicks` table.
- Learned why analytics should be stored separately from the `urls` table.
- Added Browser, OS and Device tracking.
- Parsed User-Agent using `ua-parser-js`.
- Created a dedicated Analytics Repository.
- Connected Controller → Service → Utility → Repository.
- Successfully stored analytics in PostgreSQL.
- Redirect functionality still works while analytics are recorded.

---

# 1. Database Design

## ❌ Initial Thought

Store everything inside the `urls` table.

## ✅ Better Design

Use a separate table.

```text
urls
-----
id
short_code
original_url
click_count
created_at

            1
            │
            │
            ▼

url_clicks
----------
id
url_id
browser
os
device
clicked_at
```

### Why?

One URL can have thousands of clicks.

Storing browser/device information inside the `urls` table is impossible.

---

# 2. Foreign Key

```sql
FOREIGN KEY (url_id)
REFERENCES urls(id)
ON DELETE CASCADE
```

### Learned

- `url_id` stores the parent URL.
- Foreign key maintains referential integrity.
- `ON DELETE CASCADE` automatically removes analytics when the URL is deleted.

---

# 3. Why Not Store Total Analytics in URLs?

Instead of

```
Chrome : 100
Firefox : 20
Windows : 90
Android : 30
```

inside one row,

store every click separately.

Example:

| url_id | browser | os | device |
|--------|----------|---------|----------|
| 2 | Chrome | Windows | Desktop |
| 2 | Firefox | Windows | Desktop |
| 2 | Chrome | Android | Mobile |

Later SQL can calculate statistics using `GROUP BY`.

---

# 4. Repository Design

## ❌ Wrong Idea

```
url.repo.ts
```

containing

```
createUrl()
findUrl()
counter()
saveClick()
browserStats()
deviceStats()
...
```

Huge file.

---

## ✅ Better

```
repo
│
├── url.repo.ts
└── analytics.repo.ts
```

### Learned

Each repository should have a single responsibility.

---

# 5. Parameter Object Pattern

Instead of

```ts
saveClick(
    urlId,
    browser,
    os,
    device
)
```

Use

```ts
interface ClickAnalytics {
    urlId: number;
    browser: string;
    os: string;
    device: string;
}

saveClick(click: ClickAnalytics)
```

### Why?

Easy to extend later.

Tomorrow we can add

- country
- language
- ip
- referrer

without changing function signatures.

---

# 6. User-Agent Parsing

Created

```
utils/
    userAgent.ts
```

Used

```ts
UAParser
```

to extract

- Browser
- OS
- Device

instead of manually parsing headers.

---

# 7. Service Responsibility

Analytics belongs inside

```
Service
```

because it contains business logic.

Flow

```
Controller
      ↓
Service
      ↓
Repository
```

Controller should never directly insert analytics.

---

# 8. Analytics Flow

```
Find URL
      ↓
404?
      ↓
Increment Counter
      ↓
Parse User-Agent
      ↓
Save Analytics
      ↓
Return URL
```

---

# 9. Non-Critical Operations

Analytics is NOT critical.

If analytics fails,

Redirect should still happen.

Implemented

```ts
try {
    await analyticsRepo.saveClick(...)
} catch (error) {
    console.error(...)
}
```

### Learned

Some operations are optional.

Examples

- Analytics
- Logging
- Notifications
- Emails

Main functionality should continue.

---

# 10. Controller Responsibility

Wrong

```ts
req.headers
```

Correct

```ts
const userAgent =
    req.get("User-Agent") ?? "";
```

### Why?

Service only needs one string.

Controller extracts it.

---

# 11. Separation of Concerns

Final architecture

```
Browser
      │
      ▼
Controller
      │
      ▼
Service
      │
      ├── URL Repository
      ├── Analytics Repository
      ├── Spam Service
      └── UserAgent Utility
      │
      ▼
PostgreSQL
```

Every layer has one responsibility.

---

# 12. SQL Insert Best Practice

Instead of

```sql
INSERT INTO url_clicks
VALUES(...)
```

Always write

```sql
INSERT INTO url_clicks
(
url_id,
browser,
os,
device
)
VALUES(...)
```

### Why?

Future schema changes won't break queries.

---

# 13. Why Analytics Repository?

Tomorrow it may contain

```
saveClick()

getBrowserStats()

getOSStats()

getDeviceStats()

getRecentClicks()

getTopCountries()

getReferrers()
```

Keeping these separate improves maintainability.

---

# 14. Small Code Improvement

Instead of

```ts
click.urlId
click.browser
click.os
click.device
```

Destructure

```ts
const {
    urlId,
    browser,
    os,
    device
} = click;
```

Cleaner and easier to read.

---

# Mistakes I Made Today

## Mistake 1

Used

```ts
const userAgent = req.headers;
```

instead of

```ts
req.get("User-Agent")
```

### Learned

Headers object is not a string.

---

## Mistake 2

Added

```ts
userAgent
```

inside

```ts
ShortCodeParams
```

### Learned

`userAgent` comes from request headers.

It is **not** a route parameter.

---

## Mistake 3

Destructured

```ts
const {
urlId,
browser,
os,
device
} = click;
```

but still used

```ts
click.urlId
```

instead of

```ts
urlId
```

---

## Mistake 4

Initially thought analytics failure should stop redirect.

### Learned

Redirect is the primary functionality.

Analytics is secondary.

---

## Mistake 5

Initially considered storing analytics inside the `urls` table.

### Learned

One URL has many clicks.

Separate tables provide scalability and normalization.

---

# New Concepts Learned

- Foreign Keys
- ON DELETE CASCADE
- Parameter Object Pattern
- Repository Pattern
- User-Agent Parsing
- Analytics Tracking
- Separation of Concerns
- Non-Critical Error Handling
- Controller vs Service Responsibility
- SQL INSERT Best Practices

---

# Architecture Achieved

```
Browser
    │
    ▼
Controller
    │
    ▼
Service
    │
    ├── Spam Service
    ├── User-Agent Utility
    ├── URL Repository
    └── Analytics Repository
    │
    ▼
PostgreSQL
```

---

# Day 4 Milestone ✅

Today the project evolved from a simple URL shortener into a **production-style backend**.

Implemented features:

- ✅ URL Shortening
- ✅ Duplicate Detection
- ✅ Google Safe Browsing Integration
- ✅ Redirects
- ✅ Click Counter
- ✅ Browser Analytics
- ✅ OS Analytics
- ✅ Device Analytics
- ✅ Layered Architecture
- ✅ Repository Pattern
- ✅ Utility Layer
- ✅ Production-style Error Handling

---

#  (Day 5)

- SQL `GROUP BY`
- SQL Aggregation (`COUNT`)
- Browser Statistics API
- OS Statistics API
- Device Statistics API
- Recent Clicks API
- Dashboard Response DTO
- Building a complete Analytics Dashboard endpoint
