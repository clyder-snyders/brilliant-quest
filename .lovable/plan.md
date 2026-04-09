

# Brilliant OS — Gamified Coding Game for Teens

## Overview
Build a complete grid-based coding game where players program a robot through 50 levels across 4 zones, learning sequencing, loops, conditionals, variables, and functions. Delivered as both a React app (live preview) and a downloadable standalone HTML file.

## Phase 1 — Core Design System & Screens
- Set up color palette, typography (Nunito, Inter, JetBrains Mono), button styles, card styles, and animations in the project's CSS
- Build all 5 screens as React pages: Welcome, Setup, Level Map, Game, Result
- Implement screen transitions with fade animations

## Phase 2 — Welcome & Setup Screens
- Welcome screen with inline SVG robot illustration, feature badges, and staggered fade-in animations
- Setup screen with name input, 6 inline SVG avatar characters (Spark, Nova, Bolt, Pixel, Orbit, Ghost), and game explainer
- Save player profile to localStorage

## Phase 3 — Level Map
- 4 color-coded zones with banner headers and zone icons (all inline SVG)
- 50 level cards showing stars, lock states, and best times
- Unlock logic: each level unlocks only after completing the previous one
- Player stats header with avatar, stars, streak, and rank title
- Daily Challenge and Leaderboard buttons

## Phase 4 — Game Screen (Core Gameplay)
- 3-column responsive layout: Level Info | Game Grid | Command Palette + Sequence Builder
- Dynamic grid rendering (6×6 through 12×12) with tile types: empty, wall, goal, start, special, bonus
- Robot character (selected avatar SVG) with smooth CSS transition movement and direction rotation
- Command palette with categorized, progressively unlocked commands (Movement → Loops → Conditionals → Variables → Functions → Logic)
- Drag-to-reorder sequence builder with run/undo/clear/reset controls
- Timer, move counter, hint system, and variable display panel
- Execution lock during robot animation
- Responsive collapse to single-column at 768px

## Phase 5 — All 50 Level Definitions
- Complete grid data for all 50 levels with solvable puzzles
- Progressive concept teaching: sequencing → loops → conditionals → variables → functions → logic operators
- Par times, par commands, hints, and available command sets per level

## Phase 6 — Scoring, Results & Persistence
- Score calculation: base 1000 + time bonus + efficiency bonus + loop/function bonuses − hint/collision penalties
- 3-star system with animated star reveal
- Confetti celebration animation on success
- Failure state with contextual tips
- localStorage persistence for progress, stars, streaks, and leaderboard
- Practice mode (no penalties, no saves)

## Phase 7 — Standalone HTML Export
- Generate a single self-contained HTML file with all CSS, JS, SVGs, and level data inline
- No external dependencies except Google Fonts @import
- Write to `/mnt/documents/brilliant-os.html` for download

## Scope Notes
- All SVGs drawn inline (no external images or emoji for avatars)
- All fonts via Google Fonts @import
- Desktop-first with tablet support (768px+)
- ~50 levels with handcrafted grid layouts

