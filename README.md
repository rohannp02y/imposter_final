# Imposter — Nepal Edition

A pass-and-play social deduction party game. Everyone gets the same secret word — except the imposter. Give clues, spot the fake, vote them out.

**Live:** https://imposter-app-three.vercel.app

## How it works

- 3–10 players on one device, names pre-filled as Player 1…N (editable)
- 19 word categories across Nepal 🇳🇵 and Global 🌍 packs (600+ words), plus device-local custom categories
- Optional imposter hints, toggleable per game:
  - **Word Hint** — a subtle related clue (e.g. Momo → "Coke ko saathi")
  - **Theme Hint** — the category of the secret word
- Discussion timer, per-player voting, role reveal
- *Gaun Khane Katha* category: the answer is the word, the riddle is the imposter's hint

## Stack

- Next.js 14 (App Router) + Tailwind CSS + Framer Motion
- Firebase: Firestore (word packs, anonymous game logs) + Auth (admin panel)
- Word packs load from Firestore with the bundled JSON in `src/data/` as offline fallback/seed

## Admin panel

Lives on a separate domain (`NEXT_PUBLIC_ADMIN_HOST`), routed by `middleware.ts`; the public site has no reference or route to it. Sign-in is Firebase email/password (usernames map to `<user>@nepaliimposter.app`), and Firestore rules only allow pack writes for users whose `users/{uid}.isAdmin` is true. Admins can monitor played rounds and add/edit/delete categories, words, and hints.

## Development

```bash
npm install
npm run dev          # http://localhost:3000 (admin at /admin on localhost only)
npm run build

# reseed Firestore packs from src/data:
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed

# deploy Firestore rules:
firebase deploy --only firestore:rules
```

Environment variables (see Vercel project settings): `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_FIREBASE_DATABASE_ID` (named Firestore DB), `NEXT_PUBLIC_ADMIN_HOST`.
