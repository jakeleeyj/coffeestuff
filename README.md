# Bloom

A coffee community PWA for sharing brews, rating beans, and connecting with fellow coffee snobs.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Styling:** Tailwind CSS v4 (cool dark + gold accent theme, glassmorphism)
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Deployment:** Vercel
- **PWA:** Installable with offline fallback, push notifications

## Features

- **Auth** — Email/password sign up & login, session management via middleware, protected routes
- **Feed** — Infinite scroll, brew method filters, pull-to-refresh, double-tap to like, time-of-day greeting
- **Posts** — Square image cropper with pinch-to-zoom, structured recipe (dose/yield/time), brew method, bean tagging with drag reorder
- **Bean Library** — Browse, add, and rate beans. Bean detail pages with tagged posts grid, search/filter
- **Likes & Comments** — Optimistic like toggle, inline commenting on feed, comment threads on post detail
- **Notifications** — In-app alerts for likes/comments with unread badge, web push notifications for new posts
- **Profiles** — Public pages with avatar, display name, bio, post grid. Edit profile with avatar upload
- **UI/UX** — Glassmorphism cards, staggered animations, shimmer skeletons, toast notifications, film grain texture
- **PWA** — Installable on iOS/Android, offline fallback page, iOS safe area support (Dynamic Island + home indicator)

## Getting Started

```bash
npm install
npm run dev
```

Requires environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

## Project Structure

```
src/
  app/              # Next.js App Router pages
    (auth)/         # Login & signup
    beans/          # Bean library + detail
    feed/           # Main feed
    posts/          # Post detail & new post
    profile/        # User profiles & edit
    notifications/  # Notification center
    offline/        # Offline fallback
  components/       # React components
    auth/           # Login/signup forms
    beans/          # Bean cards, forms, ratings
    feed/           # Post cards, feed grid, filters, pull-to-refresh
    posts/          # Post form, image cropper, bean tag selector
    profile/        # Profile header, post grid, sign out
    ui/             # Shared UI (Avatar, Badge, Toast, Spinner)
  lib/
    actions/        # Server Actions (posts, beans, feed, profile, interactions, push)
    supabase/       # Supabase client/server helpers
    push.ts         # Web push notification sender
    types.ts        # Shared TypeScript types
  middleware.ts     # Auth session refresh + route protection
public/
  sw.js             # Service worker (push + offline caching)
  manifest.json     # PWA manifest
  icons/            # App icons
```
