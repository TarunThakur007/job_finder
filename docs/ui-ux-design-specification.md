# JobProof — UI/UX Design Specification & Anti-"AI Slop" Architectural System

> **Document Version**: 2.0.0  
> **Status**: Approved & Integrated  
> **Target Platforms**: Web (Desktop & Mobile-First Responsive)  
> **Compliance**: WCAG 2.1 AAA Accessibility  

---

## 🌟 Executive Summary & Key Highlights

This specification defines the complete visual, structural, and behavioral standards for the **JobProof** platform. Built on strict anti-"AI slop" design principles, the design rejects frivolous glassmorphism, muddy neon gradients, and ungrounded novelty components in favor of high-density, tactile, and institutional craft.

### 1. Anti-"AI Slop" Manifesto & Rules

1. **Zero Neon/Violet Gradients**:
   - Replaced with a grounded, modernist palette of deep charcoal ink (`#0f0f12`, `#121316`), warm slate (`#18181c`, `#222228`), clean hairlines (`#272730`, `border-gray-800`), and purposeful semantic accents (warm amber/yellow `#FBBF24` and verified emerald `#10B981`).
   - Radial and conic neon gradient soups are strictly prohibited.
2. **No Floaty Pill Buttons**:
   - Enforces structured geometric radii (6px–12px) with tactile micro-interactions:
     - Physical press states: `active:translate-y-[0.5px]` and `active:scale-[0.98]`.
     - Inset hairline highlight: `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15)`.
     - High-contrast text label (`#0B0D0E` bold on amber `#FBBF24`).
3. **No Abusive Glassmorphism**:
   - Replaces blurry, unreadable glass panels with crisp surface layering, calibrated ambient occlusion shadows (`rgba(0, 0, 0, 0.4)` to `rgba(0, 0, 0, 0.7)`), and high-contrast boundary definitions.

---

### 2. Cross-Platform Responsive Ergonomics

1. **Mobile-First (Thumb Zone)**:
   - Viewport height calibrated using dynamic viewport units (`100dvh` / `min-h-dvh`) to prevent address-bar reflow glitches on iOS/Android Safari & Chrome.
   - Strict 48px minimum touch targets on all interactive triggers (`min-h-[48px]`, `min-w-[48px]`).
   - Sticky thumb-reachable quick actions and bottom navigation drawer for candidate workflows.
2. **Desktop Power-User Density**:
   - Sticky navigational header with integrated system health status indicator (`Live API 🟢`).
   - `Ctrl+K` / `⌘K` global search command bar focus trigger.
   - Tabular numerals with monospace alignment (`font-mono tabular-nums`) for structured data (salaries, requisitions count, timestamps, trust percentages).
   - High-throughput multi-parameter command bar: Role input with browser datalist autocomplete, location filter, employment type dropdown, and one-click direct application dispatch.

---

### 3. Accessibility & Usability (WCAG 2.1 AAA)

1. **Deep Contrast Ratios**:
   - Pure white core headings (`#FFFFFF`) on `#0f0f12` canvas achieve an **18.5:1** contrast ratio (exceeds WCAG AAA requirement of 7:1).
   - Slate secondary metadata (`#9CA3AF`) achieves a **7.2:1** ratio.
   - Amber accent (`#FBBF24`) achieves an **11.2:1** contrast ratio.
2. **Comprehensive Keyboard Navigation**:
   - High-contrast `:focus-visible` ring offsets (`focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none`).
   - Full ARIA compliance with `aria-label`, `role="button"`, and keyboard handlers (`Enter` and `Space`).
3. **Reduced Motion Safety**:
   - Built-in `@media (prefers-reduced-motion: reduce)` overrides disable non-essential animations.

---

## 4. Design Tokens & CSS Variables Reference

```css
:root,
[data-theme='dark'],
.dark,
body {
  /* Surfaces */
  --surface-canvas: #0f0f12;          /* Canvas background */
  --surface-raised: #18181c;          /* Cards & panels */
  --surface-overlay: #222228;         /* Popovers & modals */
  --surface-sunken: #0b0b0e;          /* Recessed inputs */

  /* Typography */
  --text-primary: #FFFFFF;            /* Headers (Contrast > 18:1) */
  --text-secondary: #9CA3AF;          /* Subtitles & metadata (> 7:1) */
  --text-tertiary: #6B7280;           /* Subtle metadata */
  --text-inverse: #0B0D0E;            /* Button text on amber */

  /* Structural Hairlines */
  --border-subtle: #272730;           /* Card dividers */
  --border-strong: #383E47;           /* Outlines */
  --border-focus: #FBBF24;            /* Keyboard focus ring */

  /* Semantic & Brand Accents */
  --brand-primary: #FBBF24;           /* Warm Golden Amber */
  --brand-primary-hover: #F59E0B;     /* Deep Amber */
  --brand-primary-foreground: #0B0D0E;/* Dark Ink */
  --accent-functional: #FBBF24;       /* Tactical Action Amber */
  --status-success: #10B981;          /* Authentic Verified Emerald */
  --status-warning: #F59E0B;          /* Review / Staging Amber */
  --status-danger: #EF4444;           /* Flagged / Closed Crimson */

  /* Tactile Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
}
```

---

## 5. Information Architecture & Navigation

The platform provides role-aware isolation across three primary operator states:

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [JP] JobProof v1.0   [Explore Jobs] [Resume AI] [Kanban Tracker] [Experiences]   [Live API 🟢] [👤 User]│
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Candidate Workspace**:
   - **Hero Pipeline**: Dual command search with browser datalist autocomplete strictly matched to database jobs.
   - **Live Requisition Overview**: Real-time opening counters, 100% direct application guarantee, zero ghost posts.
   - **Company Marquee**: Direct pipelines to verified employers (`Google`, `Spotify`, `Figma`, `Stripe`, `Discord`, `Cloudflare`, `Linear`, `Ramp`, `NASA`).
   - **Category Grid**: Strictly filters for domains with verified openings. Non-existent roles are omitted.
   - **Verified Requisition Hub**: Multi-filter toolbar (Experience, Employment Type, Remote Only, Sort By Trust/Newest).
2. **Employee Portal (`ROLE_EMPLOYEE`)**:
   - Review pending job postings discovered via ATS connectors.
   - Edit, grant permission, or reject requisitions.
   - Live notification drawer for stale or closed vacancies.
3. **Admin Governance (`ROLE_ADMIN`)**:
   - Platform telemetry & database health.
   - Employee clearance management & role elevation.
   - Candidate resumes & ATS scan logs audit.

---

## 6. Interaction Matrix & States

| Element | Idle State | Hover State | Active (Press) State | Focus Visible State |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Button** | `bg-yellow-400 text-gray-950 font-bold` | `bg-yellow-300 shadow-lg shadow-yellow-500/20` | `active:scale-95 active:translate-y-[0.5px]` | `ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#0f0f12]` |
| **Tactile Card** | `bg-[#18181c] border border-gray-800` | `hover:border-yellow-500/40 hover:bg-[#222228]` | `scale-[0.995]` | `border-yellow-400 ring-1 ring-yellow-400` |
| **Filter Select** | `bg-[#222228] border border-gray-700/60 text-gray-300` | `border-gray-500 text-white` | `border-yellow-400` | `ring-1 ring-yellow-400 focus:outline-none` |
| **Trust Badge** | `bg-emerald-500/10 border border-emerald-500/30 text-emerald-400` | Static / No bounce | N/A | N/A |

---

## 7. Master Frontend Engineering Prompt

Frontend developers and AI coding agents implementing components for this platform MUST follow this master prompt:

```markdown
### MASTER PROMPT: ARCHITECTURAL CRAFT IMPLEMENTATION

You are building components for JobProof following the Anti-"AI Slop" Design System:

1. PALETTE & THEME:
   - Base canvas: #0f0f12 (obsidian). Card surfaces: #18181c and #222228.
   - Borders: #272730 / border-gray-800.
   - Brand & Highlights: Warm Amber/Yellow (#FBBF24 / yellow-400) with dark text (#0B0D0E).
   - Trust & Verification: Emerald (#10B981 / emerald-400).
   - Prohibit neon/violet gradients, abusive glassmorphism, or generic blue buttons.

2. STRUCTURE & TYPOGRAPHY:
   - Primary headings: text-white, font-black, tracking-tight.
   - Numbers, salaries, trust scores: font-mono tabular-nums text-yellow-400 or text-emerald-400.
   - Radii: rounded-xl for buttons, rounded-2xl for cards, rounded-full for status pills.

3. ERGONOMICS & ACCESSIBILITY:
   - Interactive elements must have active press micro-interactions: active:scale-95 or active:translate-y-[0.5px].
   - Provide explicit :focus-visible outlines with offset.
   - Mobile touch targets must exceed 48px height.
   - Screen-reader accessible with aria-label on all icon-only triggers.

4. REAL DATA INTEGRITY:
   - Never invent or fabricate job roles, salaries, or companies.
   - Search autocomplete and category cards must be dynamically linked to active database entities.
   - Roles absent from the database must NOT be shown.
```
