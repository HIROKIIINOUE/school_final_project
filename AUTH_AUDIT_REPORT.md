# Authentication and Application Logic Audit

**Project:** Gowbie trip application  
**Review type:** Read-only source-code audit  
**Primary focus:** Authentication, session handling, authorization, protected routing, and profile onboarding  
**Code changes made during audit:** None

## Executive summary

The application currently has several independent authentication blockers. Fixing only one of them will not restore the complete flow.

The most significant issues are:

1. The backend uses the PostgreSQL `DIRECT_URL` as the Supabase Auth URL when verifying JWTs.
2. The protected layout can redirect the profile page to itself, preventing profile setup from rendering.
3. Existing profiles are not restored when the application restarts.
4. Most authenticated frontend API requests do not send a bearer token.
5. The itinerary endpoints authenticate users but do not verify trip membership.

Together, these issues can cause valid users to receive `401` responses, remain stuck on the login or profile page, lose profile state after restarting, and access or modify another trip's itinerary if they know its ID.

## Current authentication flow

The intended authentication flow appears to be:

1. Start Google or Apple OAuth through Supabase.
2. Open the provider's login page in an authentication browser.
3. Receive an OAuth callback URL.
4. Create and persist a Supabase session from the callback.
5. Send the access token to the Express backend.
6. Verify the JWT using Supabase's JWKS endpoint.
7. Check whether the authenticated user has a profile.
8. Send new users to profile setup and existing users to their trips.
9. Use the access token for subsequent protected API requests.

The implementation currently breaks at multiple points in this sequence.

## Critical findings

### 1. Backend JWT verification uses the database URL

**Severity:** Critical  
**Files:** `backend/src/config/env.ts`, `backend/prisma.config.ts`, `backend/src/lib/supabase-jws.service.ts`

`backend/src/config/env.ts` assigns:

```ts
const SUPABASE_URL = process.env.DIRECT_URL;
```

However, `DIRECT_URL` is also configured as the Prisma PostgreSQL datasource in `backend/prisma.config.ts`.

The JWT verifier then builds this endpoint from that value:

```ts
new URL(`${SUPABASE_URL}/auth/v1/.well-known/jwks.json`);
```

This produces a JWKS URL based on a PostgreSQL connection URL rather than the Supabase project's HTTPS URL.

**Impact:** Valid Supabase access tokens will fail backend verification. All routes protected by `authCheck` can return `401 User is not authorized`.

**Recommendation:** Configure a separate backend environment variable containing the Supabase project HTTPS URL. Do not reuse either database connection URL for JWT verification.

### 2. The protected layout can prevent profile setup from rendering

**Severity:** Critical  
**File:** `frontend/app/(protected)/_layout.tsx`

When the user is authenticated but the Zustand `profile` value is null, the layout returns:

```tsx
<Redirect href="/(protected)/profile" />
```

The profile route is itself inside this protected layout. When navigation reaches `/profile`, the layout still sees a null profile and returns the same redirect instead of rendering its `<Stack />`.

**Impact:** The profile screen may never mount. Users can see a blank screen or repeated self-navigation after their first login.

**Recommendation:** Treat authenticated users without profiles as allowed to render the profile setup route. Only redirect them when they try to access another protected route.

### 3. Existing profiles are not restored after restarting the app

**Severity:** Critical  
**Files:** `frontend/app/(protected)/_layout.tsx`, `frontend/store/auth.store.ts`

The Zustand store is memory-only. On a cold start, both `user` and `profile` begin as null. The protected layout calls `supabase.auth.getUser()` and restores only the Supabase user. It does not obtain the session token and call the backend profile endpoint.

**Impact:** Every returning user is treated as if they have no profile after restarting the app. If they submit profile setup again, the backend returns `409 Profile already exist`, leaving them stuck.

**Recommendation:** Use a single initialization process that restores the Supabase session, verifies the user, fetches the backend profile, updates the store, and only then marks authentication initialization as complete.

### 4. Protected frontend requests do not send bearer tokens

**Severity:** Critical  
**Files:**

- `frontend/features/trips/api/myRoom.api.ts`
- `frontend/features/overview/api/overview.api.ts`
- `frontend/features/itinerary/api/itinerary.api.ts`

These clients use `credentials: "include"`, but the backend does not implement cookie-based authentication. Its middleware requires:

```http
Authorization: Bearer <access-token>
```

Only the profile check and profile creation requests currently send that header.

**Impact:** Fetching trips, creating trips, loading overview data, and reading or creating itineraries all return `401`, even after a successful login.

**Recommendation:** Centralize authenticated API calls so that every protected request obtains the current Supabase access token and sends it as a bearer token. Handle token expiration consistently in the same layer.

### 5. Itinerary endpoints do not enforce trip membership

**Severity:** Critical security issue  
**Files:** `backend/src/models/itinerary.service.ts`, `backend/src/controllers/my-trips/itinerary.controller.ts`

The itinerary routes verify that the caller has a valid access token, but the service queries and writes using only the supplied `tripId`.

There is no check that the authenticated `userId` belongs to the specified trip.

**Impact:** Any authenticated user who learns another trip's UUID can:

- Read that trip's itinerary.
- Add itinerary items to that trip.

**Recommendation:** Verify `TripMember` membership before every trip-scoped read or write. Return a non-revealing `404` or an appropriate `403` when access is denied.

## High-priority authentication findings

### 6. Existing users remain on the login screen after successful authentication

**Severity:** High  
**File:** `frontend/features/auth/hooks/useAuth.ts`

When the backend reports that a profile exists, the hook updates the store but performs no navigation. The intended destination is commented out.

Because `/auth` is outside the protected layout and does not observe authentication state, the user can remain on the login screen despite being authenticated.

**Recommendation:** Define one explicit post-login destination and replace the auth route after both authentication and profile hydration succeed.

### 7. Profile creation does not navigate to the application

**Severity:** High  
**File:** `frontend/features/profile/screen/ProfileSetupScreen.tsx`

After profile creation succeeds, the screen shows a toast but does not navigate away. It also disables the Continue button permanently because `createdProfile !== null`.

**Impact:** The user remains on the completed setup screen and cannot continue through the UI.

**Recommendation:** Replace the profile route with the main protected route after the store has been updated successfully.

### 8. OAuth submission locking is not activated

**Severity:** High  
**File:** `frontend/features/auth/hooks/useAuth.ts`

The hook initializes `isSubmitting` and resets it to false in `finally`, but it never calls `setIsSubmitting(true)`.

**Impact:**

- OAuth buttons are never disabled.
- Users can launch multiple authentication sessions.
- Concurrent callbacks can race and overwrite session or store state.
- No loading state is displayed during authentication.

### 9. Non-cancellation OAuth errors are silently ignored

**Severity:** High  
**File:** `frontend/features/auth/hooks/useAuth.ts`

The failure branch immediately returns whenever the reason is not `cancelled`:

```ts
if (!result.ok) {
  if (result.reason !== "cancelled") {
    return;
  }
}
```

Provider errors, missing sessions, invalid callbacks, and other unexpected failures therefore produce no feedback and leave the loading status as `Idle`.

Cancellation is treated as an authorization failure even though user cancellation is normally a neutral outcome.

### 10. Backend profile failures leave Supabase and UI state inconsistent

**Severity:** High  
**File:** `frontend/features/auth/hooks/useAuth.ts`

The Supabase session is persisted before the backend profile request runs. If the backend request fails, the catch block marks the UI as unauthorized but does not sign out or clear the persisted Supabase session.

**Impact:** Supabase considers the user authenticated while the Zustand store and UI consider the user unauthorized.

**Recommendation:** Distinguish authentication failures from profile/API failures. A temporary backend failure should not automatically invalidate a valid Supabase login. If the session is intentionally rejected, clear both Supabase and local state together.

### 11. Authentication state is not synchronized after initialization

**Severity:** High  
**Files:** `frontend/app/(protected)/_layout.tsx`, `frontend/store/auth.store.ts`

There is no `supabase.auth.onAuthStateChange()` subscription and no implemented logout flow. The protected layout checks the user only when it mounts.

The application therefore does not reliably react to:

- Session expiration.
- Token refresh failure.
- Sign-out.
- Account or user changes.
- Supabase emitting a signed-out event.

Additionally, `clearAuth()` clears the user and profile but does not reset `loadingStatus`.

## OAuth and routing concerns

### 12. OAuth callback parsing has an off-by-one error

**Severity:** Medium  
**File:** `frontend/features/auth/utils/authSession.ts`

When both a query string and fragment are present, the parser uses:

```ts
const queryEnd = hashIndex === -1 ? undefined : hashIndex - 1;
```

This removes the final character before the `#`. For example, a callback containing `?code=abc#...` can parse the code as `ab`.

### 13. The configured OAuth callback route does not exist

**Severity:** Medium to high  
**Files:** `frontend/features/auth/hooks/useAuth.ts`, `frontend/app/`

OAuth builds a redirect to `/auth/callback`, but the Expo Router route map contains no callback route.

`openAuthSessionAsync` may intercept the redirect while the original process remains alive, but deep-link delivery, cold-start callbacks, and some web scenarios can land on an unmatched route.

### 14. Web authentication is not fully configured

**Severity:** Medium  
**Files:** `frontend/lib/supabaseClient.ts`, `backend/src/server.ts`

Potential web-specific blockers include:

- `detectSessionInUrl` is always false.
- The flow assumes `openAuthSessionAsync` callback interception.
- The backend does not install CORS middleware despite listing `cors` as a dependency.
- Requests use `credentials: "include"` without corresponding cookie or credential configuration.
- The callback route does not exist.

These are less urgent if the current target is native-only, but Expo configuration declares web support.

### 15. Missing frontend environment variables fail unclearly

**Severity:** Medium  
**File:** `frontend/lib/supabaseClient.ts`

Supabase environment values are wrapped in `String(...)`. A missing variable becomes the literal string `"undefined"` instead of producing a clear configuration error.

## Other application logic findings

### 16. Itinerary GET route spelling does not match

**Severity:** High  
**Files:** `frontend/features/itinerary/api/itinerary.api.ts`, `backend/src/server.ts`

The frontend calls:

```text
/api/itinerary/:tripId
```

The backend mounts:

```text
/api/itineray/:tripId
```

The GET request will return `404` even after authentication is corrected.

### 17. Itinerary POST request body does not match the backend schema

**Severity:** High  
**Files:** `frontend/features/itinerary/api/itinerary.api.ts`, `backend/src/schemas/trips.schema.ts`

The frontend sends:

```json
{ "itineraryInputs": [] }
```

The backend requires:

```json
{ "itineraries": [] }
```

The backend will respond with a validation error.

### 18. Itinerary creation response shape does not match the frontend

**Severity:** Medium  
**Files:** `frontend/features/itinerary/api/itinerary.api.ts`, `backend/src/controllers/my-trips/itinerary.controller.ts`

The backend returns the created array directly, but the frontend returns `data.data`. A successful request therefore resolves to `undefined` in the frontend.

### 19. Toast notifications are not correctly integrated for native use

**Severity:** Medium  
**Files:** `frontend/features/auth/hooks/useAuth.ts`, `frontend/features/profile/screen/ProfileSetupScreen.tsx`

The code imports `toast` from the browser-oriented `sonner` package, but no `<Toaster />` is mounted. The package's renderer relies on browser DOM APIs.

**Impact:** Notifications will not appear and may cause platform-specific issues on native devices. The project has `react-native-toast-message` installed but does not use it.

### 20. The signup screen uses an HTML element in a React Native route

**Severity:** Medium  
**File:** `frontend/app/auth/signup.tsx`

The route returns `<div>signup</div>`. A DOM `div` is not a valid native React Native component.

### 21. Expo configuration references missing assets

**Severity:** Medium  
**File:** `frontend/app.config.ts`

The following configured files were not found:

- `assets/images/android-icon-foreground.png`
- `assets/images/android-icon-background.png`
- `assets/images/android-icon-monochrome.png`
- `assets/images/favicon.png`
- `assets/images/splash-icon.png`

This can break native generation or production builds.

### 22. Backend environment initialization depends on import order

**Severity:** Medium  
**Files:** `backend/src/server.ts`, `backend/src/lib/prisma.ts`

`server.ts` calls `dotenv.config()` after importing modules that read environment variables during module initialization.

It currently appears to work because the Prisma module imports `dotenv/config` through another import path. A change in route or import order could cause environment validation to run before `.env` is loaded.

### 23. Error-response formats are inconsistent

**Severity:** Low to medium  
**Files:** Backend auth middleware, global error handler, and frontend API clients

Some backend failures return:

```json
{ "message": "..." }
```

Others return:

```json
{ "error": { "code": "...", "message": "..." } }
```

Several frontend clients read only `data.error?.message`, so authentication failures can be replaced by generic messages that hide the real cause.

## Positive observations

Several parts of the implementation provide a good foundation:

- Supabase sessions are configured to persist in `AsyncStorage`.
- The backend verifies JWT issuer and audience rather than merely decoding tokens.
- Profile lookup and creation derive the user ID from the verified token rather than accepting it from the request body.
- Duplicate profiles are protected by a database unique constraint.
- Profile input is validated with Zod.
- Trip creation derives ownership from `req.userId` and creates the trip and owner membership in a transaction.
- Overview access checks trip membership before returning trip data.
- Backend TypeScript strict checking currently passes.

## Verification performed

The audit used non-mutating static checks and source inspection.

| Check                             | Result                                                                                         |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| Backend `npx tsc --noEmit`        | Passed                                                                                         |
| Frontend ESLint                   | Passed with 0 errors and 1 hook-dependency warning                                             |
| Frontend `npx tsc --noEmit`       | Failed because `tsconfig.json` includes a leftover `app-example/` tree with unresolved imports |
| Automated auth tests              | None found                                                                                     |
| Automated application tests       | No test suite configured; only a Prisma diagnostic script was found                            |
| Source files changed during audit | None                                                                                           |

The frontend lint warning concerns missing dependencies in the protected layout's `useEffect`.

## Recommended repair order

1. Add a dedicated backend Supabase project URL and correct JWKS verification.
2. Create a single auth initialization flow that restores session, user, and profile before routing.
3. Allow authenticated users without profiles to render the profile setup route.
4. Add bearer tokens to every protected frontend API request.
5. Add trip-membership authorization to itinerary reads and writes.
6. Add explicit navigation after existing-profile login and profile creation.
7. Subscribe to Supabase auth-state changes and implement complete logout behavior.
8. Correct submission locking, cancellation handling, and OAuth error reporting.
9. Fix callback parsing and define a callback/deep-link strategy.
10. Align itinerary route names, request bodies, and response shapes.
11. Standardize backend error responses and frontend error extraction.
12. Repair project-wide TypeScript configuration and add automated tests.

## Suggested authentication test matrix

Before considering the auth feature complete, verify at least these cases:

| Scenario                        | Expected result                                                       |
| ------------------------------- | --------------------------------------------------------------------- |
| First Google login              | Session created, profile setup displayed                              |
| First Apple login on iOS        | Session created, profile setup displayed                              |
| OAuth cancellation              | User remains signed out, buttons re-enable, no error state corruption |
| OAuth provider error            | Clear error shown, session/store remain consistent                    |
| New profile creation            | Profile stored once, user navigated to trips                          |
| Returning user login            | Existing profile restored, user navigated to trips                    |
| Cold app restart                | Persisted session and profile restored without showing setup          |
| Expired access token            | Token refreshed or user cleanly returned to login                     |
| Backend unavailable             | Valid Supabase session is not incorrectly destroyed                   |
| Logout                          | Supabase session, user, profile, and loading state all cleared        |
| Trips API after login           | Bearer token accepted and only the user's trips returned              |
| Unknown trip ID                 | Non-revealing not-found/access response                               |
| Another user's trip ID          | Overview and itinerary access denied                                  |
| Concurrent login button presses | Only one OAuth operation can start                                    |
| Invalid or truncated callback   | Clear failure without partial session state                           |

## Conclusion

The project has the essential pieces for authentication—Supabase OAuth, persisted sessions, backend JWT verification, profile storage, and route protection—but they are not yet coordinated as one state machine.

The most important architectural improvement is to establish one authoritative initialization process with explicit states such as:

```text
initializing
signed_out
authenticated_profile_missing
authenticated_ready
error
```

Routing should depend on those states only after both the Supabase session and backend profile have been resolved. Protected API calls should then use one shared bearer-token mechanism, while backend services independently enforce resource-level membership.
