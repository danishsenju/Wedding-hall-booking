# Lumières Grand Hall — Booking System

## Project Identity
Premium wedding hall booking SPA. Kuala Lumpur.
Stack: Next.js 14 App Router + Supabase + TypeScript + Tailwind + Framer Motion

## Design System
Base: #06141B | Surface: #11212D / #253745
Gold: #C9A84C → #E8C97A hover | Rose hint: #C5BAC4
Text: #CCD0CF | Muted: #9BA8AB
Font display: Cormorant Garamond | Font body: DM Sans
Rule: NO white bg, NO purple, NO Inter. Gold = only accent.

## CSS Variables (globals.css)
--gold: #C9A84C
--gold-hover: #E8C97A  
--gold-dim: #8A6F32
--base: #06141B
--surface-1: #11212D
--surface-2: #253745
--surface-3: #191D23
--text: #CCD0CF
--text-muted: #9BA8AB
--rose: #C5BAC4
--border: rgba(201,168,76,0.15)
--border-hover: rgba(201,168,76,0.35)

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