# 🎨 Neo Brutalism Design System

> **IMPORTANT**: All UI changes must adhere to this design system. Please read this document thoroughly before making any styling modifications.

[![Design System](https://img.shields.io/badge/Design-Neo%20Brutalism-000000?style=flat&labelColor=FACC15)](https://github.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## 📋 Table of Contents

- [Color Palette](#-color-palette)
- [Typography](#-typography)
- [Spacing System](#-spacing-system)
- [Design Tokens](#-design-tokens)
- [Neo Brutalist Patterns](#-neo-brutalist-patterns)
- [Responsive Design](#-responsive-design)
- [Component Guidelines](#-component-guidelines)
- [Do's and Don'ts](#-dos-and-donts)

---

## 🎨 Color Palette

Our design strictly uses **4 colors only**. No exceptions.

| Color | Hex Code | Tailwind | Usage |
|-------|----------|----------|-------|
| **Electric Yellow** | `#FACC15` | `yellow-400` | Primary accent, hero backgrounds, highlight boxes, hover states, badges |
| **Signal Red** | `#EF4444` | `red-500` | CTAs, sale badges, destructive actions, urgency elements, newsletter |
| **Pure Black** | `#000000` | `black` | Borders, text, shadows, buttons, typography weight |
| **Off-White** | `#FAFAFA` / `#FFFFFF` | `neutral-50` / `white` | Backgrounds, cards, breathing space, contrast areas |

### Color Psychology

```
┌────────────────────────────────────────────────────────────────────┐
│  YELLOW (#FACC15)                                                  │
│  ├── Captures attention, signals energy and optimism               │
│  ├── Hero section backgrounds (immediate visual impact)            │
│  ├── "NEW" badges (draws eye to fresh items)                       │
│  ├── Hover states (rewards interaction)                            │
│  └── Highlight boxes around key words                              │
├────────────────────────────────────────────────────────────────────┤
│  RED (#EF4444)                                                     │
│  ├── Creates urgency, signals action                               │
│  ├── "SALE" badges and discount percentages                        │
│  ├── Primary CTA buttons ("ADD TO CART", "CHECKOUT")               │
│  ├── Newsletter section (drives conversion)                        │
│  └── Remove/delete actions in cart                                 │
├────────────────────────────────────────────────────────────────────┤
│  BLACK (#000000)                                                   │
│  ├── Provides structure, weight, and brutalist edge                │
│  ├── All borders (4px thickness - signature brutalist trait)       │
│  ├── Drop shadows (offset, not blurred)                            │
│  ├── Primary text and headings                                     │
│  └── Secondary buttons and navigation                              │
├────────────────────────────────────────────────────────────────────┤
│  WHITE (#FFFFFF / #FAFAFA)                                         │
│  ├── Creates breathing room and contrast                           │
│  ├── Page backgrounds                                              │
│  ├── Card backgrounds                                              │
│  ├── Text on dark/colored backgrounds                              │
│  └── Balance against heavy black elements                          │
└────────────────────────────────────────────────────────────────────┘
```

### Contrast Hierarchy

| Priority | Combination | Usage |
|----------|------------|-------|
| 1️⃣ | Yellow bg + Black text | Maximum attention (Hero, Highlights) |
| 2️⃣ | Red bg + White text | Call to action (Buttons, CTAs) |
| 3️⃣ | Black bg + White text | Premium/Bold (Footer, Badges) |
| 4️⃣ | White bg + Black text | Readable content (Body, Cards) |

### Semantic Color Exception

> [!NOTE]
> While the core palette is limited to 4 colors, **semantic/status colors** are allowed for meaningful UI feedback:

| Color | Hex Code | Tailwind | Allowed Usage |
|-------|----------|----------|---------------|
| **Success Green** | `#22C55E` | `green-500` | Order status (delivered, confirmed), success messages, progress indicators, free shipping badges, valid form states |

**Rules for Semantic Colors:**
- ✅ Only for **status indicators** and **feedback states**
- ✅ Use sparingly - should not dominate the visual hierarchy
- ✅ Never use for branding elements (logos, hero sections, CTAs)
- ✅ Pair with black borders to maintain brutalist aesthetic
- ❌ Do NOT use blue, purple, or other colors outside this exception

```tsx
// ✅ CORRECT: Green for status indicator
<Badge className="bg-green-500 text-white border-2 border-black">DELIVERED</Badge>

// ✅ CORRECT: Green for success feedback
<p className="text-green-600 font-bold">Order confirmed!</p>

// ❌ WRONG: Green for CTA button (use red instead)
<Button className="bg-green-500">Add to Cart</Button>
```

---

## 🔤 Typography

### Font Families

| Font | Type | Variable | Usage |
|------|------|----------|-------|
| **Space Grotesk** | Sans-serif, geometric | `--font-space-grotesk` | Headings, hero text, badges, prices |
| **DM Sans** | Sans-serif, humanist | `--font-dm-sans` | Body text, descriptions, UI elements |
| **Space Mono** | Monospace | `--font-space-mono` | Accents, tags, code-like elements |

### Type Scale

```css
/* Hero Title */
text-5xl → text-7xl (48px → 72px)     font-black (900)

/* Section Title */
text-3xl → text-4xl (30px → 36px)     font-bold (700)

/* Card Title */
text-xl → text-2xl (20px → 24px)      font-bold (700)

/* Body Large */
text-lg (18px)                         font-medium (500)

/* Body */
text-base (16px)                       font-normal (400)

/* Small/Caption */
text-sm (14px)                         font-medium (500)

/* Badge */
text-xs (12px)                         font-bold uppercase tracking-wide
```

### Typography Rules

```tsx
// ✅ CORRECT: Headings use font-black for maximum impact
<h1 className="text-5xl font-black tracking-tight">BOLD TITLE</h1>

// ✅ CORRECT: All caps for badges with tracking
<span className="text-xs font-bold uppercase tracking-wider">NEW</span>

// ✅ CORRECT: text-balance for optimal line breaks
<h2 className="text-3xl font-bold text-balance">Section Title</h2>

// ✅ CORRECT: Line height for body text
<p className="text-base leading-relaxed">Body text content</p>
```

---

## 📐 Spacing System

### Base Unit: 4px (Tailwind default)

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Tight | 8px | `gap-2` | Tight groupings (icon + text) |
| Related | 16px | `gap-4` | Related elements (form fields) |
| Card | 24px | `gap-6` / `p-6` | Card content padding |
| Section Internal | 32px | `gap-8` | Section internal spacing |
| Section Vertical | 64px / 96px | `py-16` / `py-24` | Section vertical padding |
| Container Horizontal | 16px → 32px | `px-4` → `px-8` | Responsive horizontal padding |

### Container Pattern

```tsx
// Standard container - use everywhere for consistent width
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Spacing Philosophy

> [!IMPORTANT]
> - **Generous white space** between sections (`py-16` minimum)
> - **Tight internal padding** within cards (`p-4` to `p-6`)
> - **Consistent gaps** using `gap-*` instead of margins
> - **Asymmetric layouts** - intentional off-balance for visual interest

---

## 🎯 Design Tokens

### Border System

```css
--border-width: 4px          /* Signature thick border */
--border-color: #000000      /* Always pure black */
--border-style: solid        /* Never dashed/dotted */
--border-radius: 12px        /* Rounded but not pill-shaped */
```

| Hierarchy | Tailwind | Usage |
|-----------|----------|-------|
| Primary | `border-4 border-black` | Cards, buttons, inputs |
| Secondary | `border-2 border-black` | Thumbnails, swatches |
| None | `border-0` | Decorative elements only |

### Shadow System (CRITICAL)

> [!CAUTION]
> **NEVER use blurred shadows.** Neo Brutalism shadows are **hard-edged offsets** only.

```css
--shadow-sm: 2px 2px 0px #000     /* Subtle depth */
--shadow-md: 4px 4px 0px #000     /* Standard cards */
--shadow-lg: 6px 6px 0px #000     /* Emphasized elements */
--shadow-xl: 8px 8px 0px #000     /* Hero elements, modals */
```

```tsx
// ✅ CORRECT: Hard offset shadow
className="shadow-[4px_4px_0px_#000]"

// ❌ WRONG: Blurred shadow (breaks brutalist aesthetic)
className="shadow-lg"  // Uses blur - DO NOT USE
```

### Radius Tokens

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| Small | 8px | `rounded-md` | Small buttons, badges |
| Medium | 12px | `rounded-lg` | Cards, inputs, images |
| Large | 16px | `rounded-xl` | Large containers |
| Full | 9999px | `rounded-full` | Circles only (avatars) |

### Animation Tokens

```css
--transition-fast: 150ms ease
--transition-base: 200ms ease
--hover-translate: -4px, -4px      /* Lift effect */
--hover-shadow: 8px 8px 0px #000   /* Expanded shadow */
```

---

## ✨ Neo Brutalist Patterns

### 1. The "Lift" Hover Effect (SIGNATURE)

```tsx
// Apply to all interactive cards and buttons
className="transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000]"
```

Elements lift up and left while shadow expands - creates tactile, "pressable" feel.

### 2. Rotated Badges

```tsx
// Slight rotation creates hand-stamped aesthetic
<span className="bg-yellow-400 px-2 py-1 border-2 border-black text-xs font-bold -rotate-2">
  NEW
</span>
```

Use `-rotate-2`, `rotate-2`, or `-rotate-3` for playful effect.

### 3. Highlight Boxes

```tsx
// Wrap key words in colored boxes with borders
<span className="bg-yellow-400 px-2 py-1 border-4 border-black rounded-lg">
  KEYWORD
</span>
```

### 4. Stacked/Layered Elements

```tsx
// Creates depth without blur - "stacked paper" effect
<div className="relative">
  <div className="absolute -bottom-2 -right-2 w-full h-full bg-black rounded-xl" />
  <div className="relative bg-white border-4 border-black rounded-xl p-6">
    Content
  </div>
</div>
```

### 5. Asymmetric Layouts

```tsx
// Featured items break the grid
className="md:col-span-2"

// Subtle tilt on containers
className="-rotate-1"
```

---

## 📱 Responsive Design

### Breakpoint Strategy (Mobile-First)

| Breakpoint | Prefix | Target |
|------------|--------|--------|
| Default | (none) | Mobile phones (< 640px) |
| `sm` | `sm:` | Large phones (640px+) |
| `md` | `md:` | Tablets (768px+) |
| `lg` | `lg:` | Laptops (1024px+) |
| `xl` | `xl:` | Desktops (1280px+) |

### Responsive Typography

```tsx
// Hero Title: Scales dramatically
className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black"

// Section Headers
className="text-2xl sm:text-3xl md:text-4xl font-bold"

// Body Text: Minimal scaling
className="text-base md:text-lg"
```

### Responsive Grid

```tsx
// Product Grid
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"

// Collections Grid
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
```

### Responsive Navigation

```tsx
// Desktop nav - hidden on mobile
<nav className="hidden md:flex items-center gap-6">

// Mobile menu button - hidden on desktop
<button className="md:hidden">
```

### Touch-Friendly Targets

| Element | Minimum Size |
|---------|--------------|
| Buttons | 44px height (`h-11`) |
| Icon buttons | 44×44px (`w-11 h-11`) |
| Quantity controls | 40px (`w-10 h-10`) |

---

## 🧱 Component Guidelines

### Buttons

```tsx
// Primary CTA (Red)
<button className="bg-red-500 text-white font-bold px-6 h-11 border-4 border-black rounded-lg shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all duration-200">
  ADD TO CART
</button>

// Secondary (Black)
<button className="bg-black text-white font-bold px-6 h-11 border-4 border-black rounded-lg shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all duration-200">
  VIEW DETAILS
</button>

// Outline
<button className="bg-white text-black font-bold px-6 h-11 border-4 border-black rounded-lg shadow-[4px_4px_0px_#000] hover:bg-yellow-400 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all duration-200">
  LEARN MORE
</button>
```

### Cards

```tsx
<div className="bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] overflow-hidden hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all duration-200">
  <div className="aspect-square overflow-hidden">
    <img className="w-full h-full object-cover" src="..." alt="..." />
  </div>
  <div className="p-4">
    <h3 className="font-bold text-lg">Title</h3>
    <p className="text-gray-600">Description</p>
    <p className="font-bold text-xl mt-2">$99.00</p>
  </div>
</div>
```

### Form Inputs

```tsx
<input 
  className="w-full h-12 px-4 bg-white border-4 border-black rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
  placeholder="Enter text..."
/>
```

### Badges

```tsx
// NEW badge (Yellow)
<span className="bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider px-2 py-1 border-2 border-black rounded -rotate-2">
  NEW
</span>

// SALE badge (Red)
<span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-2 py-1 border-2 border-black rounded rotate-2">
  -50%
</span>
```

---

## ✅ Do's and Don'ts

### ✅ DO

```tsx
// Use thick black borders
className="border-4 border-black"

// Use offset shadows (no blur)
className="shadow-[4px_4px_0px_#000]"

// Use solid colors only
className="bg-yellow-400"  // Primary accent
className="bg-red-500"     // CTA/urgency
className="bg-black"       // Borders, text
className="bg-white"       // Backgrounds

// Use the lift hover effect
className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000]"

// Use bold, uppercase badges
className="text-xs font-bold uppercase tracking-wider"

// Use generous section padding
className="py-16 md:py-24"
```

### ❌ DON'T

```tsx
// ❌ Never use yellow text (poor contrast)
className="text-yellow-400"  // BAD

// ❌ Never use red + yellow adjacent
<div className="bg-red-500">
  <span className="bg-yellow-400">...</span>  // BAD - visual clash
</div>

// ❌ Never use blurred shadows
className="shadow-lg"  // BAD - breaks brutalist aesthetic

// ❌ Never use gradients
className="bg-linear-to-r from-red-500 to-yellow-400"  // BAD

// ❌ Never use more than 4 colors
// Only: Yellow (#FACC15), Red (#EF4444), Black (#000), White (#FFF/FAFAFA)

// ❌ Never use dashed/dotted borders
className="border-dashed"  // BAD

// ❌ Never use thin borders on primary elements
className="border"  // BAD - use border-4
```

---

## 🔍 Quick Reference

### Shadow Levels

```tsx
shadow-[2px_2px_0px_#000]  // Subtle
shadow-[4px_4px_0px_#000]  // Standard (most common)
shadow-[6px_6px_0px_#000]  // Emphasized
shadow-[8px_8px_0px_#000]  // Hero/Modal
```

### Standard Card Pattern

```tsx
className="bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all duration-200"
```

### Standard Button Pattern

```tsx
className="border-4 border-black rounded-lg shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all duration-200"
```

### Container Pattern

```tsx
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

---

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Space Grotesk Font](https://fonts.google.com/specimen/Space+Grotesk)
- [DM Sans Font](https://fonts.google.com/specimen/DM+Sans)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">

**Last Updated:** December 2025

Made with 💛🖤❤️🤍 following Neo Brutalism principles

</div>
