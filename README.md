# Blogr — A Modern Publishing Platform

A complete, production-quality recreation of the [Frontend Mentor Blogr Landing Page](https://www.frontendmentor.io/challenges/blogr-landing-page-EX2RLAApP) challenge. Built with semantic HTML, modern CSS, and vanilla JavaScript — no frameworks, no dependencies.

---

## Overview

Blogr is a fictional modern publishing platform. This project recreates the full marketing landing page including a responsive navigation with dropdowns, gradient hero section, multi-column feature sections, and a dark-themed footer.

---

## Features

- **Fully responsive** — mobile (320px), tablet (768px), desktop (1024px+)
- **Mobile-first CSS** with a professional hamburger navigation
- **Dropdown menus** — click-to-toggle on desktop, accordion on mobile
- **Dark mode** — toggle button with `localStorage` persistence and OS-preference detection
- **Scroll reveal animations** — smooth fade-in with `IntersectionObserver`
- **Loading screen** — branded spinner before content appears
- **Button ripple effect** — subtle progressive enhancement on click
- **Keyboard navigable** — full arrow-key support in dropdowns, Escape to close
- **Accessible** — ARIA labels, roles, semantic HTML, visible focus states
- **SVG illustrations** — hand-crafted inline SVG graphics matching the design
- **No console errors** — clean, defensive JavaScript

---

## Technologies

| Layer      | Tech                                          |
|------------|-----------------------------------------------|
| Markup     | HTML5, semantic elements, ARIA                |
| Styling    | CSS3, Custom Properties, Flexbox, CSS Grid    |
| Scripting  | Vanilla JavaScript (ES2020+)                  |
| Fonts      | Google Fonts — Overpass 300/600, Ubuntu 400/500/700 |
| Animation  | CSS transitions, `IntersectionObserver`, `@keyframes` |

---

## Responsive Breakpoints

| Range          | Layout                                    |
|----------------|-------------------------------------------|
| 320px – 767px  | Single-column, stacked nav, hamburger     |
| 768px – 1023px | Two-column footer, larger type            |
| 1024px+        | Full desktop nav, side-by-side split grids |

---

## File Structure

```
blogr/
├── index.html      — Semantic HTML, all sections and SVG illustrations
├── style.css       — Mobile-first CSS with custom properties and BEM naming
├── script.js       — Vanilla JS: loader, nav, dropdowns, dark mode, reveals
└── README.md       — This file
```

---

## Color Palette

| Token                | Value                        |
|----------------------|------------------------------|
| Red Light            | `hsl(13, 100%, 72%)`         |
| Red                  | `hsl(353, 100%, 62%)`        |
| Heading Blue         | `hsl(208, 49%, 24%)`         |
| Body Text            | `hsl(207, 13%, 34%)`         |
| Infrastructure BG    | `hsl(237, 17%–23%, 21%–32%)` |
| Footer BG            | `hsl(240, 10%, 16%)`         |

---

## Typography

- **Overpass** — headings, hero text, nav links (weights: 300, 600)
- **Ubuntu** — body copy, buttons, auth links (weights: 400, 500, 700)

---

## Deployment

https://blogr-landing-page-sm.netlify.app/

### GitHub Pages

```bash
#
```

### Netlify 

https://app.netlify.com/projects/blogr-landing-page-sm

### Vercel CLI

```bash
npx vercel blogr/
```

---

## Accessibility Notes

- All interactive elements are keyboard-reachable
- Dropdown menus support `ArrowDown`, `ArrowUp`, `Escape`, `Tab`
- `aria-expanded` is correctly toggled on all triggers
- `prefers-reduced-motion` is respected — animations are disabled
- `prefers-color-scheme` is respected as a dark-mode default
- All SVG illustrations carry `role="img"` and `aria-label`
- Heading hierarchy: `h1` → `h2` → `h3`, no skipped levels

---

## GitHub Repository

```
https://github.com/mikuncyber/blogr-landing-page
```

---

## Author

Built by **Abioye Stephen Ayomikun** as a Frontend Mentor capstone project.

- Frontend Mentor: [@stephen](https://www.frontendmentor.io/profile/stephen)
