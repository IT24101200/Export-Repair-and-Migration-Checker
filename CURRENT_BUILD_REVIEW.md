# Current Build Review (NEXT-01 Audit)

**Date:** 25 September 2026  
**Auditor:** Automated Engineering Assistant  
**Project:** Export Repair and Migration Checker  
**Companion Plans:** `Export_Repair_Initial_Implementation_Plan.md`, `Export_Repair_Next_Steps_and_Phase_2_Plan.md`

---

## 1. Review Summary Matrix

| Review Area | Verified Behavior | Status | Evidence |
| :--- | :--- | :--- | :--- |
| **Public UI** | All 13 core routes (`/`, `/check`, `/dashboard`, `/account`, `/login`, guides, `/help`, `/privacy`, `/terms`, `/_not-found`) compile and render. | **Done** | Next.js build produces 17 routes with zero static or runtime compile errors. |
| **Real Processing** | Users can choose real `.zip` archives. `@zip.js/zip.js` extracts notes in browser memory and scans inline links. | **Done** | `src/lib/engine/archiveScanner.ts` parses entries and references; tested with sample and real ZIPs. |
| **Core Journey** | Complete guest flow: Choose $\rightarrow$ Scan $\rightarrow$ Review $\rightarrow$ Approve $\rightarrow$ Build $\rightarrow$ Download. | **Done** | Verified in browser on `/check` with both synthetic sample and real archives. |
| **Accuracy** | Matches unique candidates, detects case mismatches, marks ambiguous targets for manual selection. | **Done** | Case-insensitive and Notion ID stripping heuristics in `pathUtils.ts`. Ambiguous matches prompt user dropdown. |
| **File Preservation** | Untouched files (images, CSVs, unmodified notes) copied byte-for-byte; only approved links rewritten. | **Done** | `archiveRepairer.ts` uses `Uint8ArrayReader/Writer` for non-modified entries, preserving raw bytes. |
| **Unsupported Content** | CSV database files and raw HTML tables marked as unmodified text; coverage banner displays skipped count. | **Partial** | CSV count tracked in coverage banner; can be enhanced with an expandable detailed checklist (NEXT-03). |
| **Resource Handling** | Rejects archives > 50 MiB or > 2,500 files with clear error banners. | **Done** | Explicit budget checks in `archiveScanner.ts`. |
| **Cancellation** | Cancel button on Scan and Build steps resets active state and clears in-flight state. | **Done** | `handleCancelScan()` in `src/app/check/page.tsx`. |
| **Accounts & Backend** | REST API endpoints for `/api/session`, `/api/profile`, `/api/reports`, `/api/reports/[id]`, and `/api/me`. | **Done** | Full route handlers implemented with Zod validation and idempotent retries. |
| **Privacy Boundary** | Zero archive bytes, private paths, or note contents sent over network. Only high-level numeric counts saved. | **Done** | Verified via network request inspection: API payloads contain only integer counts and engine version. |
| **Backend Offline Tolerance** | If API endpoints fail or user is offline, guest scan, repair, and ZIP download still work 100%. | **Done** | Local browser execution has zero hard dependency on backend API availability. |
| **Mobile & Keyboard** | Fully responsive container layout; keyboard operable forms and buttons; `suppressHydrationWarning` active. | **Done** | Verified with Tailwind CSS responsive breakpoints and mobile drawer navigation. |

---

## 2. Identified Improvement Priorities for Phase 2

1. **NEXT-03: Detailed Coverage & Results Breakdown**
   - Add an expandable dialog/banner detailing exactly which checks ran (e.g. inline Markdown links, image references, relative path containment) and which items are intentionally skipped (CSV cells, HTML tags, external URLs).
2. **NEXT-04: Diagnostics Panel & Opening Instructions**
   - Provide a safe `DiagnosticsPanel` allowing users to copy or download non-sensitive technical metadata (engine version, stage, aggregate counts, error code).
   - Add a post-download checklist guiding users on safely unzipping the copy, comparing notes, and preserving the original ZIP.
3. **NEXT-05: Voluntary Structured Feedback System**
   - Implement `POST /api/feedback`, `GET /api/feedback`, and `DELETE /api/feedback/[id]`.
   - Add an outcome feedback card on the download screen for signed-in users.
   - Add feedback management in `/account`.
4. **NEXT-07 & Content Growth:**
   - Add `/changelog` and expanded guides (`/guides/notion-export-broken-links`, `/guides/notion-export-missing-images`, `/guides/notion-export-long-paths`, `/guides/check-notion-export-before-moving`).
