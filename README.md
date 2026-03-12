# Bloom

An Instagram-like app for coffee enthusiasts. Share photos of your brews and latte art, tag beans from a community library, and connect with fellow coffee lovers.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Styling:** Tailwind CSS v4 (dark coffee theme)
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Deployment:** Vercel

## Features

### Done

- **Auth** — Email/password sign up & login, session management via proxy middleware, protected routes
- **Bean Library** — Browse, add, edit, and delete coffee beans (name, roaster, origin, roast level)
- **Posts & Feed** — Photo upload with client-side compression, caption, brew method, recipe, bean tagging. Feed with author avatars, time ago, bean/brew badges
- **Post Delete** — Inline confirm-to-delete on feed cards with feed refresh
- **Profiles** — Public profile pages (`/profile/[username]`) with avatar, bio, post count, 3-column post grid. Edit profile (bio + avatar upload)
- **Responsive Design** — Mobile bottom tab bar + desktop top nav bar. Mobile-first dark theme with golden accent palette

### Next Up

- **Likes & Comments** — Heart toggle with optimistic UI, comment threads on post detail
- **Polish** — Loading skeletons, error boundaries, spinner component

## Getting Started

```bash
npm install
npm run dev
```

Requires environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
  app/              # Next.js App Router pages
    (auth)/         # Login & signup
    beans/          # Bean library
    feed/           # Main feed
    posts/          # Post detail & new post
    profile/        # User profiles & edit
  components/       # React components
    auth/           # Login/signup forms
    beans/          # Bean cards & forms
    feed/           # Post cards, feed grid, delete button
    posts/          # Post form, bean tag selector
    profile/        # Profile header, post grid
    ui/             # Shared UI (Avatar, Badge)
  lib/
    actions/        # Server Actions (posts, beans, profile)
    supabase/       # Supabase client/server helpers
    types.ts        # Shared TypeScript types
  proxy.ts          # Auth middleware (session refresh + route protection)
```
