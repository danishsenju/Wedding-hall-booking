# Next.js Skill

App Router only. No Pages Router.
Server components default. Add 'use client' only for interactivity.
Server actions in /app/actions/*.ts for all mutations.
Route groups: (public) for guest pages, (admin) for protected.
Middleware.ts for admin auth protection.
Image: next/image with proper width/height always.
Loading: loading.tsx per route segment.
Error: error.tsx per route segment.
Layout nesting: root layout → group layout → page.