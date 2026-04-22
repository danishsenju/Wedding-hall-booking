# Lumières Grand Hall — Booking System

## Project Identity
Premium wedding hall booking SPA. Kuala Lumpur.
Stack: Next.js 14 App Router + Supabase + TypeScript + Tailwind + Framer Motion

## Design System
Base: #0A0B10 | Surface: #141226 / #2B1B52
Accent: #6D28D9 → #7C3AED hover | Lavender hint: #C4B5FD
Text: #EDE9FE | Muted: #A78BFA
Font display: Cormorant Garamond | Font body: DM Sans
Rule: NO white bg, NO Inter. Purple = only accent.

## CSS Variables (globals.css)
--gold: #6D28D9
--gold-hover: #7C3AED
--gold-dim: #4C1D95
--base: #0A0B10
--surface-1: #141226
--surface-2: #2B1B52
--surface-3: #0D0C1A
--text: #EDE9FE
--text-muted: #A78BFA
--rose: #C4B5FD
--border: rgba(109,40,217,0.15)
--border-hover: rgba(109,40,217,0.35)

## Coding Rules
- TypeScript strict mode always
- Tailwind for layout/spacing, CSS variables for colors
- Framer Motion for ALL animations
- Lucide React for ALL icons
- No inline styles except dynamic values
- Mobile-first, breakpoints: sm(480) md(768) lg(1024)
- All prices in RM (Malaysian Ringgit)
- use-client only when needed

## File Conventions
- Components: PascalCase in /components
- Pages: /app/(routes)/page.tsx
- Types: /types/index.ts
- Utils: /lib/utils.ts
- Supabase client: /lib/supabase.ts
- Server actions: /app/actions/

## Supabase Rules
- Always use server actions for mutations
- RLS enabled on all tables
- Use supabase.auth for admin only
- Booking ref format: LMR-YYYY-XXXX

## Agent Behavior
- Read CHECKLIST.md before starting any task
- Mark items done in CHECKLIST.md after completing
- Read relevant skill file before building each feature
- Never skip TypeScript types
- Always handle loading + error + empty states
- Test on mobile viewport mentally before finishing