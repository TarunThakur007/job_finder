UI/UX DESIGN DOCUMENT

JobRadar AI — AI-Powered Job Discovery, Verification & Direct Application Platform

Project Documentation • Version 1.0 • September 2026

1. UX Vision

The UI should feel like a modern, trustworthy job-discovery product: clean search-first navigation, information-dense job cards, strong visual hierarchy, transparent trust evidence, and a clear Direct Apply action.

The interface should avoid presenting the trust score as an absolute guarantee. Use labels such as 'Trust score based on available evidence' and expose the underlying signals.

2. Design Principles

Search first: make the main job search immediately visible.

Scanability: cards should expose title, company, location, experience, salary, freshness and trust score.

Evidence over claims: verification details should show why a score exists.

Progressive disclosure: show a short summary first, then detailed description/verification.

Consistent actions: Direct Apply should remain prominent on job detail pages.

Responsive by default: desktop, tablet and mobile layouts.

Accessibility: readable contrast, keyboard navigation, semantic controls and visible focus states.

3. Information Architecture

Home → Search Results → Job Details → Original Application

Supporting areas: Login/Register → Profile → Saved Jobs; Admin → Dashboard → Jobs → Companies → Suspicious Jobs → Sources

4. Screen Specifications

Screen

Main Components

Primary Action

Home

Navbar, hero search, popular roles, quick filters, latest/verified jobs, trust explanation, footer.

Search / View Job

Search Results

Search bar, filter sidebar/drawer, sort control, job cards, pagination/infinite loading.

Open Job

Job Details

Title, company, location, salary provenance, skills, summary, description, selection process, trust score, evidence, Direct Apply.

Apply / Save

Company

Company overview, website/career page, jobs, verification signals.

View Jobs

Saved Jobs

Saved list, filters, status and quick apply.

Open Job

Login/Register

Minimal authentication forms with validation.

Authenticate

Admin Dashboard

KPIs, recent jobs, suspicious jobs, source health, verification activity.

Review

5. Job Card Template

Recommended card hierarchy:

Company logo/name + source badge.

Job title.

Location • experience • employment type.

Salary with source label: Company provided / Estimated / Not disclosed.

Top skills as chips.

Posted/verified time.

Trust score badge with evidence-based wording.

Save icon and View Job button.

6. Job Details Layout

Desktop: two-column layout. Main column contains role overview, responsibilities, requirements and selection process. Right column contains sticky Apply Now, salary, key facts, save action and trust score.

Mobile: stack sections vertically; keep Apply Now sticky near the bottom without obscuring content.

7. Trust Score Component

Component

Example UI

Overall

91/100 • Evidence-based trust score

Company

25/25

Official source

20/20

Application URL

20/20

Freshness

15/15

Description quality

7/10

AI confidence

4/5

Reasons

Company website found; URL consistency; recent verification; multi-source match

8. Visual System

Use a restrained neutral background with one strong brand accent.

Use green/amber/red only for status communication, not decoration.

Use 8px-based spacing increments where practical.

Use rounded cards with subtle borders/shadows rather than heavy gradients.

Typography: modern sans-serif; strong 24–32px page headings and 16–18px job titles.

Icons should be consistent and paired with text when the meaning is not obvious.

9. UX States

State

Required Treatment

Loading

Skeleton cards and disabled duplicate actions.

No results

Explain filters/search and offer clear reset action.

API failure

Human-readable message + retry.

Expired job

Clearly label expired/archived and disable or replace Apply action.

Low confidence

Show 'Needs review' with evidence instead of a definitive accusation.

AI unavailable

Show source data without fabricated AI fields.

Missing salary

Show 'Salary not disclosed' rather than inventing a number.

10. Responsive Breakpoints

Viewport

Layout

Mobile

Single column; filter drawer; sticky Apply; compact cards

Tablet

Single/two-column hybrid; collapsible filters

Desktop

Two-column details; persistent filters; wider job cards

11. Suggested UI Component Structure

Navbar, SearchBar, FilterPanel, SortDropdown, JobCard, SkillChip, SalaryBlock, TrustScoreCard, VerificationBreakdown, SelectionTimeline, CompanyCard, SaveButton, ApplyButton, Pagination, EmptyState, LoadingSkeleton, Toast, Modal, AdminMetricCard.