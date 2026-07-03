# SkillSwap AI — Frontend

A student skill-exchange platform UI: students trade what they know for what they want to learn. Frontend-only — no backend, auth, or database wired up. Realistic dummy data throughout; `src/services/api.js` is structured so each function can be swapped for a real call to an Express + MongoDB backend later.

## Stack

React 18 (Vite) · Tailwind CSS · React Router DOM · Axios · React Icons

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build
```

## Project structure

```
src/
  components/   Reusable UI: Navbar, Footer, Sidebar, SkillCard, UserCard,
                ProfileCard, RequestCard, SearchBar, SkillTag, Loader,
                EmptyState, Modal
  pages/        Landing, Login, Register, ProfileSetup, Dashboard,
                ExploreSkills, Profile, MyRequests, NotFound
  services/     api.js — placeholder API functions (mocked promises)
  context/      AuthContext.jsx — mock auth state
  data/         students.js, skills.js, requests.js, notifications.js
```

## Connecting a real backend

Every function in `src/services/api.js` already has the real endpoint
commented above its mock implementation, e.g.:

```js
export function login(payload) {
  // return api.post('/auth/login', payload)
  return mock({ token: 'mock-token', user: students[0] })
}
```

Swap the mock return for the commented `api.*` call (an axios instance
pointed at `VITE_API_BASE_URL`, defaulting to `/api`) and the rest of the
app — which only calls these functions, never axios directly — keeps
working unchanged.

## Notes

- The app currently boots "logged in" as a demo user (see `AuthContext.jsx`)
  so every screen, including Dashboard/Profile/Requests, is explorable
  without wiring up real auth.
- Messages and Settings sidebar items are UI-only placeholders, as scoped.
- Google login button is UI only.
