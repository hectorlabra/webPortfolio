# PR: Responsive Hardening Phases 0–3b

Summary
- Goal: Make the site fully responsive with zero aesthetic regressions.
- Scope: Minimal code changes to fix mobile behavior, image containment, and responsive image sizes.
- Pages: Home (/), Blog list (/blog), Blog post (/blog/[slug]), Quien Soy (/quien-soy).

Changes
1) Phase 0–1
- app/layout.tsx: Export explicit viewport (width=device-width, initialScale=1) for consistent mobile scaling.
- app/globals.css: Constrain markdown images inside .blog-richtext with `max-width: 100%` and `height: auto` to eliminate horizontal overflow on small screens.

2) Phase 2
- app/quien-soy/page.tsx: Allow H1 to wrap in small screens by removing `whitespace-nowrap overflow-hidden`. Prevents truncation on narrow devices; no visual change in desktop.

3) Phase 3 / 3b (responsive sizes for images)
- components/blog/BlogCard.tsx: Add `sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"` to card images (matches lg 3-col, md 2-col, mobile 1-col grids).
- app/page.tsx: Same `sizes` for home article card images.
- app/quien-soy/page.tsx: Add `sizes` for story images (100vw), project thumbnails (≥md 50vw), and hobby grid images with `fill` (≥md 33vw, mobile 50vw).

Out of Scope (for this PR)
- Any color/typography/spacing redesign.
- Changing Next.js image optimization configuration (images.unoptimized remains true).

Testing & Verification
- Local build (Next 15) successful with SSG for all routes.
- Manual QA breakpoints: 320, 360, 390, 414, 768, 1024, 1280, 1440.
- Checks:
  - No horizontal scroll in any page.
  - Markdown images contained within article width on mobile.
  - H1 on `/quien-soy` wraps correctly in small screens.
  - Card images behave responsively according to grid columns.
  - Post sidebars (TOC/Newsletter) hidden on mobile/tablet and stable on desktop.
  - Navbar + mobile Sheet tappable targets ≥44px and no overlay issues with reading progress bar.

Risk Assessment
- Low risk. All changes are additive and scoped to responsive behavior. Desktop aesthetics untouched.

How to Review
- Visual diff in the four pages listed above across the breakpoints.
- Focus on:
  - `/blog/[slug]`: try a very wide image in markdown (if available) and verify no overflow.
  - `/quien-soy`: ensure title is not truncated on small devices.
  - Home & Blog list: confirm image layout stability with `sizes`.

Checklist
- [x] Viewport configured
- [x] Markdown images constrained
- [x] H1 wraps in `/quien-soy`
- [x] Responsive `sizes` for images in cards and key pages
- [x] Build passes

Notes
- Further phases (4–7) require no changes at the moment based on validation. Will open a follow-up PR only if device testing reveals edge cases.
