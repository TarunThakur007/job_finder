# JobProof — UI/UX Design Specification & Design System

---

## 1. Design Philosophy & Visual Identity

JobProof's visual design is rooted in **"Transparency, Verification, and High-Velocity Career Enablement"**. Rather than resembling generic, clutter-heavy job portals, JobProof adopts a modern, sleek developer-centric dark aesthetic with glassmorphism, precise contrast ratios, and purposeful micro-interactions.

### Key Visual Pillars
1. **Trust-First Signifiers**: Authenticity scores (0–100%) and verification evidence pills ("Active Listing", "Direct Application", "Official Employer Site") are rendered with high-prominence emerald and gold badges.
2. **Strict Workspace Isolation**: Every page has a distinct visual personality matching its role—Candidate Discovery uses electric amber, Resume AI uses deep indigo/blue, and Governance uses royal purple.
3. **Tactile Feedback & Micro-Animations**: Buttons feature subtle scale down states (`active:scale-95`), cards have hover border glow (`hover:border-yellow-500/50`), and loading states use shimmer skeletons rather than generic spinners.

---

## 2. Design System Tokens

### 2.1 Color Palette

```
Surface / Backgrounds:
├─ App Background       : #0f1015 (Deep Charcoal / Slate Black)
├─ Container Surface    : #18181c (Dark Zinc Slate)
├─ Card / Modal Surface : #222228 (Elevated Graphite)
└─ Border Default       : #2a2a32 / border-gray-800

Brand & Accent Palette:
├─ Primary Accent (Gold)  : #facc15 (Tailwind yellow-400) — Primary CTAs, Badges, Highlights
├─ Primary Hover (Amber)  : #eab308 (Tailwind yellow-500)
├─ Success / Verified     : #34d399 (Emerald 400) — Verified Status, Active Endpoints
├─ Warning / Staged       : #fbbf24 (Amber 400) — Staging Queue, Pending Actions
├─ Danger / Suspicious    : #f87171 (Rose 400) — Rejections, Expired Listings
├─ AI / Resume Tools      : #60a5fa (Blue 400) & #818cf8 (Indigo 400)
└─ Admin Authority        : #c084fc (Purple 400) — Governance Badges

Typography Colors:
├─ Heading / Pure White   : #ffffff
├─ Subheadings / Slate 200: #e2e8f0
├─ Body / Gray 400        : #9ca3af
└─ Muted / Gray 500       : #6b7280
```

### 2.2 Typography Scale
- **Font Family**: Primary: `Plus Jakarta Sans`, Secondary / Monospace: `Inter`, `JetBrains Mono`
- **Heading 1**: `text-4xl sm:text-5xl lg:text-6xl`, `font-black`, `tracking-tight`, line-height `1.15`
- **Heading 2**: `text-2xl sm:text-3xl`, `font-black`
- **Heading 3**: `text-lg sm:text-xl`, `font-extrabold`
- **Body Regular**: `text-xs sm:text-sm`, `font-medium`, line-height `1.6`
- **Microcopy & Meta**: `text-[10px] sm:text-[11px]`, `font-semibold`, uppercase tracking wider

### 2.3 Corner Radius & Border Standards
- **Buttons & Small Badges**: `rounded-xl` (12px)
- **Cards & Data Inputs**: `rounded-2xl` (16px)
- **Large Modals & Containers**: `rounded-3xl` (24px)
- **Status Pills**: `rounded-full`

---

## 3. Information Architecture & Navigation

The application uses a persistent top sticky header with responsive role-aware navigation:

```
[ JobProof Logo 🎯 ]   [ Find Jobs ] [ Resume AI ] [ Kanban Tracker ] [ Experiences ]    [ Backend: Connected 🟢 ] [ Profile Pill 👤 ]
```
- **If Candidate / Guest**: Shows *Find Jobs*, *Resume AI*, *Kanban Tracker*, *Experiences*.
- **If Employee (`ROLE_EMPLOYEE`)**: Shows *Employee Portal* (Review AI responses, update job details, publish live to website) and *Preview Live Website*.
- **If Administrator (`ROLE_ADMIN`)**: Shows *Admin Console* (Website Telemetry & Live Working Status, Deploy Personnel & Grant Permissions) and *Preview Live Website*.

---

## 4. Page Layouts & Component Wireframes

### 4.1 Page 1: Find Jobs (Candidate Job Discovery)
```
┌─────────────────────────────────────────────────────────────────┐
│ Hero Section: "Find your dream job with us"                     │
│ Dual Input Search: [ Job Title / Skills ] [ Job Type ▼ ] [ 🔍 ] │
│ Popular Search Tags: [ Software Engineer ] [ Frontend ] [ DevOps]│
├─────────────────────────────────────────────────────────────────┤
│ Company Ticker: Figma • Stripe • Spotify • Linear • Ramp        │
├─────────────────────────────────────────────────────────────────┤
│ Category Grid: [ ⚙️ Backend (34) ] [ 🎨 Frontend (28) ] ...     │
├─────────────────────────────────────────────────────────────────┤
│ Filter Toolbar:                                                 │
│ [Exp: All ▼] [Type: All ▼] [ 🌐 Remote Only ]   [Sort: Trust ▼] │
│ Active Filter Chips: [ Category: Backend ✕ ] [ Reset All ↺ ]   │
├─────────────────────────────────────────────────────────────────┤
│ Verified Job Table Cards:                                       │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🛡️ 98% Verified  Senior Backend Engineer      $140k-$190k  │ │
│ │ Google • New York, USA • Fulltime                           │ │
│ │ Highlights: [ ✓ Official Site ] [ ✓ Direct ATS ]            │ │
│ │                                   [ Apply on Company Site →]│ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Page 2: Resume AI (ATS Resume Optimizer)
```
┌─────────────────────────────────────────────────────────────────┐
│ Banner: AI ATS Scorecard & STAR Method Optimizer               │
│ Target Role Benchmark: [ Senior Java Backend Engineer ▼ ]       │
├───────────────────────────────┬─────────────────────────────────┤
│ Dual Upload / Paste Input:    │ ATS Scorecard Metrics:          │
│ ┌───────────────────────────┐ │  ┌───────────────┐              │
│ │ Drag & Drop Resume File   │ │  │    94% ATS    │ Readability  │
│ │ (.pdf, .docx, .txt)       │ │  │  Score Gauge  │ Overall      │
│ └───────────────────────────┘ │  └───────────────┘              │
│ One-Click Sample Presets:     │  Formatting: 96% | Keywords: 92%│
│ [ Alex M. ] [ Priya S. ]      │  Impact: 90%                    │
├───────────────────────────────┴─────────────────────────────────┤
│ Tabs: [ ⭐ STAR Bullet Enhancer ] [ 📊 Skills & Gaps ] [ 📋 Checklist ]│
│                                                                 │
│ Side-by-Side STAR Enhancer:                                     │
│ ┌─────────────────────────────┬───────────────────────────────┐ │
│ │ Original (Passive)          │ STAR AI Improved (Impact)     │ │
│ │ "Worked on backend APIs..." │ "Architected resilient Spring │ │
│ │                             │  Boot microservices handling  │ │
│ │                             │  25M+ requests, reducing      │ │
│ │                             │  p99 latency by 42%..."       │ │
│ │                             │  [ 📋 Copy Improved Bullet ]  │ │
│ └─────────────────────────────┴───────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Page 3: Kanban Application Tracker
```
┌─────────────────────────────────────────────────────────────────────────┐
│ Header: Personal Career Application Tracker      [ + Track New Job App ]│
├──────────────┬──────────────┬──────────────┬──────────────┬─────────────┤
│ 📌 SAVED (2) │ 📨 APPLIED (4)│ 🔍 REVIEW (1)│ 🗣️ INTERVIEW(2)│ 🎉 OFFER (1)│
├──────────────┼──────────────┼──────────────┼──────────────┼─────────────┤
│ Netflix      │ Google       │ Airbnb       │ Stripe       │ Google      │
│ Streaming Eng│ Cloud Eng    │ Full Stack   │ Infra Eng    │ Staff Eng   │
│ $180k-$260k  │ $190k-$245k  │ $160k-$195k  │ $175k-$220k  │ $215k Offer │
│ Match: 89%   │ Match: 98%   │ Match: 94%   │ Match: 96%   │ Match: 98%  │
│ [ ➔ Next ]   │ [ ➔ Next ]   │ [ ➔ Next ]   │ [ ➔ Next ]   │ [ Done ]    │
└──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘
```

---

## 5. Interaction States & Transitions

| Interaction | Visual Treatment | CSS Classes / Transition |
| :--- | :--- | :--- |
| **Button Hover** | Background shifts to lighter tint, shadow deepens | `hover:bg-yellow-300 shadow-yellow-500/20` |
| **Button Active (Press)** | Scaled down 5% to give physical tactile feeling | `active:scale-95 transition-transform` |
| **Card Hover** | Border illuminates with gold/emerald ring | `border-gray-800 hover:border-yellow-500/50` |
| **Modal Overlay** | Smooth black glass backdrop with blur | `bg-black/80 backdrop-blur-sm animate-fadeIn` |
| **Copy Action** | Toast icon changes from Copy to Green Checkmark for 2s | `setCopiedBulletKey(key)` |

---

## 6. Accessibility (WCAG 2.1 AA Compliance)

- **Color Contrast**: All primary text (`#ffffff` and `#e2e8f0`) exceeds the minimum 4.5:1 contrast ratio against `#18181c` and `#222228` card backgrounds. Yellow-400 (`#facc15`) against dark backgrounds achieves a contrast ratio of > 11:1.
- **Screen Reader Support**: All icon-only buttons include descriptive `aria-label` and `title` attributes.
- **Focus Indicators**: Interactive elements feature distinct focus outlines (`focus:outline-none focus:border-yellow-400`).
