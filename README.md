# Health Survey Platform

Field workers collect household health data on mobile (often with bad connectivity). Super admins manage areas, workers, and review urgent cases on the web. This repo has three apps that talk to one API.

```
assesment/
  health-survey-backend/   Express + Prisma + Redis/BullMQ
  health-survey-web/       Super Admin (React + MUI + RTK Query)
  health-survey-mobile-app/ Field Worker (React Native CLI)
```

---

## Architecture

```
┌─────────────────┐         ┌─────────────────┐
│  Web (Admin)    │         │ Mobile (Worker) │
│  React / MUI    │         │ RN + Keychain   │
└────────┬────────┘         └────────┬────────┘
         │  HTTPS / JWT               │
         └────────────┬───────────────┘
                      ▼
              ┌───────────────┐
              │ API (Express) │
              └───────┬───────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌─────────┐  ┌─────────┐  ┌──────────────┐
   │ Postgres │  │  Redis  │  │ BullMQ Worker│
   │ (Prisma) │  │ cache + │  │ urgent →     │
   │          │  │  queue   │  │ ActivityLog  │
   └─────────┘  └─────────┘  └──────────────┘
```

**How the pieces relate**

- **Web** → admin only. Areas, field workers, household overview, activity feed for urgent assessments. No field-worker login on web.
- **Mobile** → field workers only. Assigned area, households, members, assessments. Tokens live in Keychain; session flags in Redux Persist.
- **Backend** → single source of truth. Auth, CRUD, sync push/pull, dashboard stats.
- **Postgres** → users, areas, households, members, assessments, sync op log, activity log. Soft deletes + `version` on mutable entities.
- **Redis** → short-lived cache for dashboard / household lists, and BullMQ broker for urgent notifications.
- **Worker** (`npm run worker`) → consumes urgent-assessment jobs and upserts `ActivityLog` rows the admin UI reads.

Online path today: mobile/web hit REST directly. Offline-first queue on mobile is designed on the API side but not fully wired in the app yet (see _What I’d do next_).

---

## Authentication & logout

**Login**

1. `POST /api/auth/login` with email/password.
2. Server checks bcrypt hash + `isActive`.
3. Returns `accessToken`, `refreshToken`, and public `user` (includes `areaId` + nested `area` for workers).
4. Mobile: only `FIELD_WORKER` may continue. Web: only `SUPER_ADMIN`.

**Tokens**

- Access JWT on `Authorization: Bearer …` for API calls.
- Refresh JWT stored on the user row; `POST /api/auth/refresh` rotates both tokens.
- Mobile keeps tokens in **Keychain** (not AsyncStorage). Redux Persist stores user/session flags and strips tokens before writing to disk. On app start, PersistGate rehydrates flags then restores tokens from Keychain.

**Logout**

1. Client calls `POST /api/auth/logout` (authenticated).
2. Server clears `refreshToken` on the user.
3. Mobile clears Keychain + resets auth slice + RTK Query cache.
4. Web clears persisted store / tokens the same idea.

If refresh fails with 401, mobile clears secure tokens and forces login again.

---

## Authorization (roles)

Roles live on the JWT and on `User.role`:

| Role           | Web | Mobile | Typical access                                           |
| -------------- | --- | ------ | -------------------------------------------------------- |
| `SUPER_ADMIN`  | yes | no     | Areas, workers, all households, activities, stats        |
| `FIELD_WORKER` | no  | yes    | Own area only: households / members / assessments / sync |

Enforcement is layered:

1. **`authenticate`** – valid access JWT required.
2. **`authorize(...roles)`** – route-level allow-list (e.g. areas admin-only; sync worker-only).
3. **Service checks** – field workers must match `areaId` on the household/member/assessment they’re touching. Admins skip area checks where appropriate.
4. **Client guards** – web redirects workers away; mobile rejects non-workers at login.

Inactive users (`isActive: false`) cannot log in.

---

## Offline storage choice (mobile)

| Data                        | Where                          | Why                                       |
| --------------------------- | ------------------------------ | ----------------------------------------- |
| Access / refresh tokens     | **Keychain**                   | OS-backed; shouldn’t sit in plain storage |
| User profile / `isLoggedIn` | AsyncStorage via redux-persist | Non-secret, needed for cold start UI      |
| Last pull cursor            | AsyncStorage                   | Simple timestamp for `sync/pull?since=`   |
| Survey entities (planned)   | Local DB / queue               | Not fully built yet — see next section    |

I avoided putting JWTs in AsyncStorage on purpose. Keychain is the right default on RN for credentials. Persist transform nulls `token` / `refreshToken` so a compromised device dump of AsyncStorage doesn’t leak sessions.

---

## Sync design & API shape

Backend sync is built for **offline field work**. Mobile can create UUIDs locally, queue ops, then push when online.

### Push — `POST /api/sync/push`

```json
{
  "ops": [
    {
      "opId": "uuid-from-device",
      "entityType": "HOUSEHOLD" | "MEMBER" | "ASSESSMENT",
      "entityId": "uuid",
      "action": "CREATE" | "UPDATE" | "DELETE",
      "clientVersion": 1,
      "payload": { }
    }
  ]
}
```

- Max 100 ops per request.
- Server sorts ops (CREATE → UPDATE → DELETE; parents before children).
- Each `opId` is stored in `SyncOperation` (`@@unique([userId, opId])`). Replay the same op → return stored result, don’t apply twice.
- Response: per-op `{ opId, result: APPLIED | CONFLICT | REJECTED, entity?, message? }`.

### Pull — `GET /api/sync/pull?since=<ISO>`

Returns households / members / assessments in the worker’s area changed since `since` (or full area snapshot if omitted), plus `serverTime` and counts. Mobile should store `serverTime` as the next cursor.

### What’s implemented on mobile today

Sync tab only does **pull** (refresh counts + cursor). Creates/updates still go through normal REST while online. There is **no offline outbox / push client** yet.

---

## Conflict handling

Mutable entities (`Household`, `HouseholdMember`, `HealthAssessment`) carry an integer **`version`** that increments on every successful update.

On sync **UPDATE**:

1. Client sends `clientVersion` = version it last knew.
2. If `clientVersion !== server.version` → `CONFLICT`, server entity returned, **server wins**.
3. Client should replace local row with server payload (or show a “server changed” state) and drop/retry the stale op.

Other outcomes:

- **APPLIED** – change accepted; client should adopt returned entity (and new version).
- **REJECTED** – validation, wrong area, deleted parent, etc. Client should mark the op failed and surface the message.

Deletes are soft (`deletedAt`). Idempotent CREATE: if the entity id already exists in the worker’s area, treat as APPLIED with existing row.

---

## Redis & BullMQ

**Redis cache**

- Dashboard stats and household list responses are cached with short TTLs.
- Writes (create/update/delete household, assessments, etc.) invalidate the relevant keys so admin numbers don’t stay stale.

**BullMQ (`urgent-notifications` queue)**

When an assessment is marked urgent (`temp >= 39` **or** breathing difficulty **or** flagged for review):

1. API writes / upserts an `ActivityLog` synchronously (so admin sees it even if Redis hiccups).
2. API also enqueues a job (`jobId` without `:` — BullMQ rejects colons in custom ids).
3. Worker consumes the job and upserts the same activity (`@@unique([type, assessmentId])` keeps duplicates safe).

Run API and worker separately:

```bash
# terminal 1
cd health-survey-backend && npm run dev

# terminal 2
cd health-survey-backend && npm run worker
```

Redis must be reachable via `REDIS_URL`.

---

## Quick start (short)

```bash
# Backend
cd health-survey-backend
cp .env.example .env   # if present — set DATABASE_URL, JWT secrets, REDIS_URL
npx prisma migrate dev
npm run seed
npm run dev
npm run worker          # second terminal

# Web
cd health-survey-web && npm install && npm run dev

# Mobile
cd health-survey-mobile-app && npm install
# Android emulator → API host is 10.0.2.2:4000
npm run android
```

Seeded admin / worker credentials come from `prisma/seed.ts`.

---

## What I’d do next

### 1. Finish mobile offline sync (main gap)

Backend push/pull + conflict rules are ready; the app still talks REST when online and only pulls on the Sync screen. Planned client strategy:

1. **Local store** – SQLite (or WatermelonDB) for households / members / assessments scoped to the worker’s area, each row keeping server `version` + soft-delete flag.
2. **Outbox table** – every local CREATE/UPDATE/DELETE writes an op `{ opId, entityType, entityId, action, clientVersion, payload, status }` before UI updates optimistically.
3. **Client-generated UUIDs** – so CREATE works offline and matches `entityId` on push.
4. **Sync runner** (manual button + app foreground / connectivity restore):
   - **Push** pending outbox ops (batch ≤ 100) → `POST /api/sync/push`.
   - For `APPLIED`: mark op done, upsert returned entity locally.
   - For `CONFLICT`: replace local entity with server copy, mark op resolved (server wins), optionally notify the worker.
   - For `REJECTED`: mark failed with message; don’t loop forever.
   - **Pull** with last `serverTime` → merge into local DB → save new cursor.
5. **Online shortcut** – if network is up and outbox is empty, keep using REST for snappy UX; if offline or outbox has items, route writes through the queue.
6. **UI** – pending / failed badges on Sync tab, last sync time, “retry failed”.

That’s the missing piece for a real field-ready offline loop.

### 2. Other follow-ups

- Wire sync **push** path into assessments created while offline (urgent activity still depends on server seeing the assessment).
- Stronger empty / error states and field-level validation messages on mobile forms.
- Web: realtime-ish activity refresh (poll or light websocket) when workers submit urgent cases.
- E2E tests around sync CONFLICT + idempotent `opId` replay.
- CI for backend + web; detox/maestro smoke for mobile login → household → assessment.
- Harden Keychain rebuild docs (native module needs a full `run-android` / pods install after add).
