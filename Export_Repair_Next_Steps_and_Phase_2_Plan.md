**Export Repair and Migration Checker — Next Steps and Phase 2 Plan**

Prepared: 24 September 2026  
Companion to: `Export_Repair_Initial_Implementation_Plan.md`  
Status: proposed follow-up plan. Your application code and deployed website have not been reviewed for this document.

**What should you do next?**

First, prove that the initial version works with real exports. Then let a small group use it, fix the problems they encounter, and publish useful guides that bring the right visitors. Add more powerful repairs after you have evidence that people need them.

The recommended order is:

1. Check what you actually built against the initial plan.
2. Fix anything that prevents a reliable scan, repair, or download.
3. Improve the results explanation and add simple feedback tools.
4. Run a small user pilot and launch the verified first version.
5. Add better reference coverage, then carefully controlled filename shortening if users need it.
6. Grow traffic through original guides and demonstrations.
7. Consider paid services after you understand the repeated user problem.

**You can launch the first version before building filename shortening, additional import formats, AI, or payments.** The first release already has a useful job: check a supported export and repair approved Markdown references.

---

**1. Keep the original product scope clear**

This plan continues the original architecture and UI. It does not require rebuilding the project.

| Area | Continue using |
| --- | --- |
| Main user | Someone checking a Notion Markdown/CSV ZIP before using its files elsewhere. |
| First output | A portable Markdown ZIP with a local report and change log. |
| File processing | Browser Web Worker; selected archives remain on the user's device. |
| Frontend | Existing Next.js, TypeScript, Tailwind, and shared components. |
| Backend | Existing account and summary APIs. |
| Database | Existing Supabase profiles and scan summaries. |
| Guest access | Scan, review, repair, and download without signing in. |
| Saved information | Optional account information and explicitly saved summary counts. |
| Current repair scope | Supported Markdown destinations, with user approval. |
| Current filename behavior | Diagnose long or problematic paths; no automatic renaming until the later milestone passes. |

Notion exports have limitations: an export cannot include pages that the exporting user cannot access, for example. Explain missing content honestly and never promise to recreate it [S1].

Do not advertise a complete Notion-to-Obsidian migration on the basis of portable Markdown output alone. Obsidian has its own documented import workflows. Any destination-specific claim needs a separately tested workflow [S2].

**Priority meanings:** P0 = needed before a public launch; P1 = useful next improvement; P2 = build after evidence of demand.

---

**2. Start with a build review — P0**

Create `CURRENT_BUILD_REVIEW.md` inside the project repository. Record the actual state of each item as **Done / Partial / Missing / Blocked**, with evidence. A page existing is not proof that its functionality works.

| Review area | What to verify | Evidence to record |
| --- | --- | --- |
| Public UI | Home, guides, help, privacy, terms, navigation, and error screens work. | Working routes and a short review note. |
| Real processing | Choosing a real ZIP invokes the real worker and produces findings from that ZIP. | Controlled input with known expected findings. |
| Core journey | Choose → scan → review → approve → build → download works as a guest. | One complete end-to-end run. |
| Accuracy | Healthy links stay healthy; ambiguous matches are not silently selected. | Expected and actual fixture results. |
| File preservation | Every original member is retained; only approved destination bytes change. | Extracted-file comparisons and local hashes. |
| Unsupported content | CSV, HTML, unsupported syntax, and skipped files are clearly identified. | A mixed-format fixture and its coverage report. |
| Resource handling | Invalid, corrupt, unsafe, encrypted, and oversized ZIPs fail clearly. | Relevant initial-plan fixtures and observed outcomes. |
| Cancellation | Cancelling and starting again cannot display results from an old job. | A cancel/restart run. |
| Accounts and database | Sign-in, save, history, record deletion, and account deletion work. | Two-account ownership tests, including direct database API access. |
| Privacy | Archive bytes, filenames, paths, excerpts, hashes, and detailed findings stay local. | Network inspection using identifiable synthetic test content. |
| Backend failure | Local processing and download still work when account services fail. | A deliberate metadata-service failure. |
| Mobile and keyboard | Selection, issue review, approval, and download are usable. | Desktop/mobile review and a keyboard-only run. |

Use the meaningful tests already required by the initial plan. Add tests for uncovered failure cases rather than duplicating existing tests for every button.

If a feature is still using demo data, label it and complete its real implementation before treating it as finished. Keep real-file mode separate from the synthetic sample.

**Finish this step when:** the working features are documented, remaining defects have clear priorities, and there are no unresolved P0 failures. No file-loss, unauthorized-edit, cross-account-access, or archive-content-leak defect can remain open for launch.

---

**3. UI improvements to build first**

Reuse the existing visual style, navigation, review drawer, tables, and dialogs. Add these parts to the current screens.

| UI addition | Location | What the user sees and does | Priority |
| --- | --- | --- | --- |
| Clear result summary | `/check`, Review and Download | Separate counts for checked references, unresolved findings, and unchecked content. | P0 if missing |
| Coverage details | Existing coverage banner | Expand a list of supported checks and skipped categories, with a short reason. | P0 if missing |
| Helpful next action | Existing issue drawer | “Choose another target,” “Export again with files included,” or a relevant guide, depending on the finding. | P1 |
| Technical details panel | Review, Download, and failure states | View an engine version, error code, and limited diagnostic counts; copy or download them locally. | P1 |
| Outcome feedback card | After a completed result, for signed-in users | Select whether the result helped and the main difficulty, then explicitly submit. | P1 |
| Open-the-result instructions | Download screen | Explain how to extract a new copy, inspect notes/images, and keep the original ZIP. | P1 |
| Release history | New `/changelog` page | Brief dated entries describing real fixes, supported changes, and known limitations. | P1 |
| Feedback history | Existing `/account` page | List and delete the feedback the user submitted. | P1 with feedback backend |
| Rename preview | Existing Repair plan tab | Review old/new filenames, affected references, and reasons a rename is blocked. | P2, behind the engine milestone |

**3.1 Coverage and results**

Use plain statements such as:

- “82 local Markdown references checked.”
- “3 references still need attention.”
- “Links inside 2 CSV files were not checked.”
- “This check does not verify heading anchors or external websites.”

The numbers above are illustrative; live screens must use actual results. Do not combine these categories into an unexplained “migration score.” A result with zero detected issues can still contain unchecked material.

When a feature adds a new check, update the live UI, downloaded report, sample, help text, and fixture expectations together.

**3.2 Diagnostics panel**

Build `DiagnosticsPanel` with these states: closed, preview, copied, download started, and local-generation failure.

The diagnostic object may contain:

- Diagnostic schema version and engine version.
- A controlled error code and processing stage.
- Broad file-size bucket and aggregate file/reference counts.
- Source format and enabled check identifiers.

Show the exact fields before copying or downloading. Exclude filenames, paths, file hashes, text excerpts, exception messages containing source data, account email, access tokens, and archive contents. Do not copy raw console output or automatically send this file to a server.

Reuse the existing local report for detailed findings. The new diagnostic file is a separate local download; it is not an extra member in the repaired ZIP.

**3.3 Feedback card**

Keep the first feedback form structured and short:

| Field | Options |
| --- | --- |
| Outcome | Helped / Partly helped / Did not help / Not sure yet |
| Main difficulty | None / Selecting export / Understanding findings / Repair options / Download / Unsupported format / Performance / Other |
| Action | Send feedback |

Do not include a file attachment or free-text box in the first version. “Other” is a category, not an invitation to paste private notes. Qualitative detail can come from the pilot conversations in section 7.

Submission requires a signed-in account, uses an explicit Send button, and displays exactly what will be stored. Show sending, success, validation error, expired-session, and retry states. Guests can still copy local diagnostics and finish their export workflow.

This is a small, voluntary feedback channel. Its results will favor people who signed in; do not treat it as a representative survey of all visitors.

**3.4 Opening a downloaded result**

Add a short checklist beneath Download ZIP:

1. Keep the original export.
2. Extract the new ZIP into a new folder.
3. Open several notes and images and check the links that mattered to you.
4. Read the report for remaining issues and unchecked content.
5. Follow the destination application's documented workflow if moving the files there.

The application can confirm it generated and verified a ZIP. A browser download click should still say **“Download started”**. Confirmation that extraction or another application's import worked comes from the user.

---

**4. Backend and database additions**

The repair engine remains local. Add only the metadata features required by the UI above.

**4.1 New feedback API — P1**

| Endpoint | Access | Behavior |
| --- | --- | --- |
| `POST /api/feedback` | Signed in | Validate and store one explicitly submitted structured response. |
| `GET /api/feedback` | Signed in | Return only the caller's submissions, newest first, with bounded pagination. |
| `DELETE /api/feedback/[id]` | Owner | Delete the caller's feedback; use a generic 404 for inaccessible records. |

Example request, using illustrative version values:

```json
{
  "clientFeedbackId": "c04a0f12-7d2a-49b0-9f4e-94b6f01129ac",
  "schemaVersion": 1,
  "engineVersion": "1.0.0",
  "sourceFormat": "notion_markdown_csv",
  "outcome": "partly_helped",
  "reasonCode": "unsupported_format"
}
```

Use strict enum validation, reject unknown fields, and enforce a small body limit such as 2 KiB. The server derives the owner from the verified session. Do not accept a user ID in the request.

Use the existing origin/CSRF controls and shared rate-limit mechanism. A proposed starting limit is 10 feedback writes per account per hour; tune it from actual use. To keep this limit enforceable, allow inserts through this route only: revoke direct insert privileges from `anon` and `authenticated` and define no client insert policy for this table.

For this narrowly scoped write, use an isolated server-only Supabase administrative client after authentication, origin checks, rate limiting, and strict validation. Set `user_id` from the verified caller inside the server code. Never spread an unvalidated request into the insert. This is one additional privileged operation beyond the initial account-deletion flow; test it explicitly. All ordinary feedback reads and deletions use the caller's authenticated client and RLS. The administrative credential must never enter a browser bundle.

Make `(user_id, client_feedback_id)` unique. After authentication and request validation, return an identical existing response before consuming a new-write quota slot; conflicting reuse returns 409. Handle concurrent inserts by re-reading the owned record after a uniqueness conflict and applying the same comparison. Keep feedback failures independent of the archive worker and download state.

**4.2 New table: `product_feedback`**

| Column | Rule |
| --- | --- |
| `id` | Server-generated UUID primary key. |
| `user_id` | Required owner; references `auth.users.id`, with account-delete cascade. |
| `client_feedback_id` | UUID used for safe retries; unique with owner. |
| `schema_version` | Integer constrained to supported feedback schema versions. |
| `engine_version` | Bounded string using the existing version validation. |
| `source_format` | Allowlisted source identifier. |
| `outcome` | `helped`, `partly_helped`, `not_helped`, or `not_sure`. |
| `reason_code` | Controlled values matching the UI options. |
| `created_at` | Server timestamp. |

Use an index on `(user_id, created_at desc, id)` for the account list. There is no archive relationship, note content, detailed issue payload, or saved file path in this table.

Enable RLS and matching grants in the same migration. Permit authenticated users to read and delete their own rows. Direct client inserts and updates are denied; the authenticated POST route performs the narrowly scoped insert described above. Do not expose other users' feedback. Verify that account deletion removes owned feedback. Supabase's official guidance distinguishes table privileges from row policies; configure both [S3].

Keep feedback until the user deletes it or deletes their account for this first iteration, and say so in the privacy page. Document provider backup retention separately. Review collected feedback through authorized internal tooling; a custom admin dashboard is unnecessary at this stage.

**4.3 Summary schema extension — only when renaming ships**

Keep existing summary fields and their meanings. `appliedChangeCount` continues to mean destination edits; it must not silently start counting filename changes too.

Add these fields only with the rename milestone:

| Field | Purpose |
| --- | --- |
| `summary_schema_version` / `summarySchemaVersion` | Distinguish the original request shape from the expanded shape. |
| `renamed_file_count` / `renamedFileCount` | Number of original files whose archive paths changed. |

Treat original records as schema 1 with zero renamed files. Accept the original strict request shape during the transition; map it to schema 1 on the server. New clients explicitly send schema 2. Validate each shape separately, rejecting unknown fields for that shape.

For schema 2, require `0 <= renamedFileCount <= fileCount`, retain existing count caps, and display “Reference edits” and “Files renamed” separately. A result with a validated rename can be `repaired` even if it has zero destination edits. A `scan_only` or `checked_copy` record must have zero applied edits and zero renames.

Keep original summaries immutable. Before/after issue counts refer to one run under the same engine rules; do not imply that different engine versions produce directly comparable scores. Store the detailed path map only in the local result.

Deployment order: additive database migration → server accepting both shapes → new client → verify old and new summaries still display. Keep older-client support through the transition; do not drop columns during rollback.

---

**5. Next engine work: better reference coverage — P1/P2**

A reference is a link from one file to another. Before changing filenames, the engine needs to know which links would be affected.

Build a local **reference map**: for each file, record which supported references point to it and where those references occur. Reuse the current parser and resolver rather than introducing a second interpretation of Markdown paths.

**5.1 Reference map requirements**

Each local reference record should include a stable source-file ID, target-file ID if resolved, reference type, original destination, editable source range when supported, and a coverage status. File IDs and hashes are local implementation details, never server telemetry.

Use three states:

- **Checked and editable:** destination and exact edit range are understood.
- **Checked but read-only:** the target can be inspected, but a safe source edit is unavailable.
- **Unchecked:** the format or syntax is not supported.

An unresolved target is a finding, not proof that a missing file can be recovered. An empty list of known incoming references is not proof that no unchecked references exist.

**5.2 Format coverage work**

| Content | Next implementation | Repair boundary |
| --- | --- | --- |
| Existing Markdown links, images, and reference definitions | Reuse current checks; expose incoming-reference relationships. | Continue approved destination edits. |
| Raw HTML inside Markdown | First diagnose supported local `href` and `src` attributes through a nonexecuting parser. | Enable edits only after exact attribute-value ranges and encoding are tested. |
| Standalone HTML | Prototype diagnosis using controlled fixtures. | Remain read-only until an explicit source profile supports it. |
| CSV | Parse rows/cells as text and identify only link-bearing structures that are documented by fixtures. | Unknown columns and ambiguous cells remain read-only. |
| Heading fragments and external URLs | Preserve their current handling. | Continue clearly labelling them as not verified. |
| CSS URLs, scripts, `srcset`, unknown text formats, and embedded-document links | Record the limitation. | No guessed repair; block dependent renames. |

For HTML, parse5 supports source-location information [S4]. This is a possible implementation aid, not a guarantee that every attribute can be patched safely. Map an exact destination range and escape its replacement correctly. Never render or execute imported HTML to find links.

For CSV, a parser such as Papa Parse can read rows, but generating a new CSV can alter quoting or line endings. Its configuration distinguishes parsing from serialization [S5]. Keep values as strings, preserve duplicate headers and leading zeros, and do not treat every cell that resembles a path as a link. A repair adapter needs verified cell semantics and source ranges; otherwise retain the original bytes.

These are proposed engineering choices. Prototype them against the project's installed package versions before adopting an adapter.

**5.3 Conditions for shipping an adapter**

An adapter is ready when its supported syntax is documented, fixtures establish expected results, non-target bytes remain unchanged, and malformed or unknown structures produce a read-only limitation instead of an optimistic edit.

Use the existing resource budgets as the ceiling. If HTML or CSV analysis adds parsed text, count it within a shared 25 MiB parsing budget initially, with the existing per-file cap of 2 MiB. Retain larger files unchanged and flag them unchecked. Do not independently allocate a full new budget to every parser. Keep the other initial ZIP, entry, reference, report, and output limits until benchmarks justify a change.

Ship improved diagnosis independently if it helps users. Do not wait for every format to support editing.

---

**6. Main optional feature: safe filename shortening — P2**

Build this when pilot users repeatedly struggle with long filenames, and the reference map is reliable. This is the main expansion of the original repair engine.

**6.1 Narrow first release**

Start with renaming individual Markdown files within their existing folders. Preserve file extensions and Notion identifier suffixes. Leave folder renaming, attachment renaming, and removal of identifiers for later work.

Use an explicit eligibility profile: recognized Markdown plus supported raster attachments, with every potentially affected local reference understood and editable. If the archive contains unchecked CSV/HTML, skipped text, unknown attachment formats that may contain links, or unsupported reference syntax, block renaming for the first implementation. Existing supported link repair may still be available.

Even a reference that is merely read-only can block a rename if its destination would need updating. Handle raw HTML only after its adapter meets the edit requirements in section 5. Conservative archive-wide blocking is acceptable at first; relaxing it needs evidence that the engine can identify every affected dependency.

The guarantee covers supported references **inside this export**. The tool cannot find links from unrelated documents or other systems pointing into a renamed file. State this in the rename confirmation.

**6.2 Rename UI**

Add a “Filename changes” section inside the existing Repair plan tab.

| Element | Behavior |
| --- | --- |
| Eligibility message | Show whether renaming is available and explain blocked categories. |
| Filename table | Current path, proposed path, affected-reference count, and validation status. |
| Name editor | Let the user review or edit the proposed leaf filename. |
| Change preview | Show all reference edits required by each selected rename. |
| Selection | Start unselected; only valid plans can be approved. |
| Confirmation | State rename and reference-edit counts, scope, and any unresolved findings. |
| Completed result | Show files renamed and reference edits separately. |

Example only: shorten the readable title portion of `Very long project meeting notes <notion-id>.md` to `Project notes <notion-id>.md`. Preserve the full real identifier; the placeholders are not filenames to emit.

Reuse validation helpers for root containment, duplicate paths, case/Unicode collisions, and unsafe names. Reject path separators in a leaf-name field. Reject reserved or invalid names under the chosen portability profile and show the reason. Do not silently transliterate Sinhala, Tamil, or other Unicode titles to ASCII.

The initial path-length warnings are heuristics. A shorter name does not establish compatibility with every extraction location, operating system, or destination app.

**6.3 Engine implementation order**

1. Build the complete supported reference map from immutable original bytes.
2. Check archive eligibility and compute proposed leaf names deterministically.
3. Create a one-to-one mapping from original file IDs/paths to planned paths.
4. Reject collisions against renamed and unchanged members, including case and Unicode-normalization collisions.
5. Calculate each affected destination using both the source's planned location and the target's planned location. Preserve the existing query/fragment behavior and URI-encoding rules.
6. Merge rename-required edits with user-approved broken-link repairs into one plan. Reject conflicting edits to the same source range.
7. Show the complete plan. Required reference edits cannot be deselected independently while keeping the rename selected.
8. Validate source fingerprints and apply all approved edits to a new copy. Never mutate the selected original File.
9. Reparse the output and verify that previously working supported references still resolve to the same file identities after mapping.
10. Verify all original files are present at their mapped paths. Unedited extracted bytes must match the originals, including files whose names alone changed.
11. Generate the local reports, validate the final archive, and allow its download.

If any step fails, produce no successful repaired result. Return to Review with an actionable reason. Changing a rename selection invalidates any previously built output.

Build the plan atomically: the entire approved set succeeds or none of it is presented as complete. Do not implement a sequence of destructive filesystem moves.

**6.4 Local report changes**

Extend the existing `changes.json` with a report schema version, old/new path pairs, and the destination changes linked to each rename. Update `report.json`, HTML explanations, and inventory accordingly.

Keep the existing five report members and their collision-safe output directory. Do not increase the ZIP entry allowance just to add a second manifest. Preserve all original-member identities through the path map rather than requiring their original paths to remain unchanged in this feature.

The map explains how filenames changed. It is not an automatic recovery service or a backup of all previous note contents. To discard a generated result, the user can return to the untouched original export. A future restore feature would need separate design and verification.

**6.5 Required rename tests**

| Case | Expected outcome |
| --- | --- |
| One approved note rename with incoming references | References resolve to the same note after the change. |
| Shared Markdown reference definition | Definition edited once; all uses remain correct. |
| Two proposed files share the same destination name | Block and explain the collision. |
| Destination collides with an unchanged member | Block; do not overwrite the member. |
| Case-only or Unicode-normalization collision | Block under the portability profile. |
| Unicode title, spaces, parentheses, and encoded characters | Preserve correct names and link encoding. |
| Unknown CSV/HTML or skipped text present | Renaming unavailable under the first eligibility profile. |
| Required reference edit cannot be mapped safely | Block the dependent rename. |
| Manual link repair and rename affect the same destination | Produce one consistent edit or report a conflict. |
| A replacement path resolves to a different existing note | Validation fails even though that path exists. |
| Cancel, stale input, or output validation failure | No successful output; original bytes unchanged. |
| Local report opens after the rename | It lists actual changes and remaining limitations correctly. |

**Finish this feature when:** every approved eligible plan preserves file identities and supported reference targets, blocked cases stay blocked, and no unapproved edit is applied.

---

**7. Run a small pilot before expanding further**

Recruit about 5–10 people who have an actual Notion export to check. This is a suggested learning sample, not statistical proof of market demand. Include different export sizes and people with different levels of technical knowledge.

Ask them to use the real workflow on their own device. Do not require them to upload or send you their archive. With their permission, observe the workflow or discuss the result. Use synthetic reproductions for debugging whenever possible.

For each session, answer these questions:

| Question | Why it matters |
| --- | --- |
| What were they trying to do with the export? | Establishes the real job, including destination app if relevant. |
| Could they choose the correct export without help? | Tests onboarding and guide clarity. |
| Did the findings match a problem they recognized? | Tests practical usefulness. |
| Could they understand and approve a suggested repair? | Tests the review UI. |
| Could they extract the new ZIP and inspect the important files? | Goes beyond counting download clicks. |
| What was still broken or unclear? | Identifies the next specific fix. |
| Would they use it again or recommend it to someone migrating? | Helps assess demand for an occasional-use tool. |

Keep a de-identified pilot log with outcome, broad issue category, intervention needed, and next action. Do not retain private filenames or note contents in that log.

**Suggested pilot exit target:** at least five people complete the supported task; most can explain the result without coaching; all observed data-integrity and privacy defects are resolved; the main remaining limitations are visible. Treat this as a decision aid, not a certified success rate.

If users mostly need instructions, improve the guide. If they repeatedly need a missing repair, prioritize that repair. If the tool flags problems that users do not care about, revisit the product focus before adding more infrastructure.

---

**8. Launch and operate the verified first version — P0/P1**

**Release work**

- Prepare a production configuration separate from development, following the existing deployment plan.
- Verify HTTPS, worker assets, authentication email delivery, allowed origins, and database migrations on the actual deployment.
- Confirm the public build exposes the real engine and labels the sample clearly.
- Publish a supported-format and limits statement matching observed behavior.
- Publish the current help, privacy, and terms content, including any new feedback storage.
- Add a short changelog entry naming the released capability and known limitations.
- Keep a reproducible build and a documented route back to the last working release.

Do not upgrade the framework, replace authentication, and rewrite the parser as part of a small UI improvement. Make dependency changes separately when needed and verify the relevant fixtures.

**Operational behavior**

| Situation | Response to implement or document |
| --- | --- |
| Metadata service unavailable | Continue guest processing; explain that save/feedback is temporarily unavailable. |
| A release produces incorrect repairs | Disable the affected operation and redeploy the last verified engine if necessary. Keep diagnosis available only if it remains trustworthy. |
| A migration needs rollback | Roll back application behavior first; preserve compatible additive columns and existing records. |
| Browser memory limit reached | Stop clearly, release worker resources, and offer a smaller-export guide. |
| User reports a defect | Collect an error code and consented description; create a synthetic fixture reproducing it. |
| Authentication abuse or failed emails | Inspect provider delivery and rate-limit signals without logging codes or tokens. |

Use a release configuration flag for experimental adapters and renaming. Keep each browser session on the engine version it started with; do not swap rules mid-repair. A new deployment cannot necessarily change code in a tab already open, so treat disabling a feature as protection for subsequent sessions and communicate any affected version through the site.

For operations, record response status, duration, and controlled error codes. Do not add raw archive context to error-monitoring payloads or session replay.

---

**9. Traffic plan: build pages around problems the tool solves**

Your traffic goal should be **relevant visitors who have an export problem**, rather than unrelated visits. Search demand and conversion are still unvalidated; this plan does not predict visitor numbers or revenue.

**9.1 First content pages**

Keep the initial export and results guides. Add a few distinct pages with useful examples.

| Page | What to include | Main action |
| --- | --- | --- |
| `/guides/notion-export-broken-links` | A synthetic broken relative link, common reasons, a reviewed repair example, and limits. | Try the relevant sample. |
| `/guides/notion-export-missing-images` | Difference between a wrong path and an image absent from the export. | Check local image references. |
| `/guides/notion-export-long-paths` | Explain path warnings and practical export/extraction choices. Advertise shortening only after release. | Check path warnings. |
| `/guides/check-notion-export-before-moving` | A short checklist for preserving originals and inspecting files before moving them. | Check an export. |
| `/changelog` | Real dated fixes and changes to check coverage. | Try the current version. |

Each guide should contain an original example, a clear answer near the top, a relevant official source, screenshots from the actual tool, and one obvious route to the checker. Reuse one substantial guide rather than publishing many near-duplicate keyword pages.

Do not publish a destination-specific conversion page until the claimed workflow has been tested. Do not invent testimonials, performance results, or supported platforms.

**9.2 Search setup**

Verify site ownership in Google Search Console, submit the public sitemap, inspect the important pages, and review queries, impressions, and clicks. These are documented Search Console uses [S6].

Keep private account pages and local processing results out of search. Preserve the initial noindex behavior for the workspace and account routes. Authentication must still protect account data; search visibility settings are not access control.

Check public titles, descriptions, canonical URLs, working internal links, and mobile readability. Update guides when the engine's supported behavior changes.

**9.3 Distribution work**

- Make a short demonstration using a synthetic broken export and an actual repair.
- Share a useful explanation in relevant communities where that kind of post is allowed.
- State that you built the tool and explain its current limits.
- Ask early users which wording they searched for and which step confused them.
- Offer a small public sample ZIP so readers can evaluate the workflow safely.

These are tasks for the owner to carry out; this plan does not send messages or publish community posts.

**9.4 What to measure first**

Use Search Console, the pilot log, and voluntary structured feedback initially. You do not need a custom analytics database before learning from your first users.

| Measure | Definition | Limitation |
| --- | --- | --- |
| Search impressions and clicks | Search Console counts for the public pages. | They do not prove the export tool was useful. |
| Observed task completion | Pilot users who complete the supported task without intervention. | Small, selected sample. |
| Main difficulty | Categories from feedback and pilot sessions. | Voluntary feedback can be biased. |
| Successful extraction reported | User says they extracted and inspected the new copy. | Self-reported, not automatically verified. |
| Repeated need | Different people describe the same unresolved problem. | A signal to investigate, not a revenue forecast. |

If aggregate product events are already implemented, audit them before adding more. If adding them later, define consent/settings, exact allowed payloads, retention, and log redaction first. Use controlled event names such as `scan_completed` or `download_started`; never include filenames, note text, hashes, private URLs, or account email.

Calculate a completion rate only when the numerator and denominator cover the same measured sessions. A download-start event is not proof of extraction or migration success. Avoid daily-retention targets for a tool people may use only during occasional migrations.

---

**10. Decide later features using evidence**

Review the pilot findings and feedback before choosing each larger addition.

| Repeated user need | Next feature to consider | Required proof before shipping |
| --- | --- | --- |
| Long filenames prevent use | Eligible filename shortening from section 6. | Complete affected-reference handling and preservation checks. |
| Deep folder paths are the real problem | Folder shortening as a separate project. | Descendant path mapping and all affected reference updates. |
| Users are moving to a particular application | A tested destination guide or adapter. | Actual destination import tests and clear unsupported features. |
| Users regularly hit archive limits | Memory/performance work and revised limits. | Benchmarks on the intended browsers and devices. |
| Users need to check two versions of an export | Local comparison of two ZIPs. | Defined handling of changed, added, removed, and renamed members. |
| Users lose long sessions after closing a tab | Explicit local session saving. | Storage, retention, resume validity, and clear-device-data controls. |
| People need help understanding a report | Better explanations and examples first. | User testing shows improved comprehension. |

**Obsidian-specific work:** verify the current official import route rather than assuming this project's Markdown ZIP is the input for every Obsidian importer. Keep a portable-Markdown workflow distinct from a Notion-specific import workflow [S2].

**Payments:** first identify what people would pay for, such as hands-on migration assistance or a separately designed managed service. Check payment-provider availability for your business location and the actual service before choosing a checkout system. Pricing, entitlements, order storage, refunds, and delivery need their own implementation plan.

**Cloud processing and AI:** keep them outside this follow-up build unless research identifies a concrete requirement. Cloud uploads would change the file-handling promise and require a separate consent, storage, deletion, worker, and access design. Client-side file-size restrictions are not a dependable paid entitlement system.

---

**11. Suggested first-month work plan**

This is a planning sequence, not a delivery promise. It assumes the initial implementation exists. Incomplete core features and serious bugs take priority over the dates.

| Period | Main work | Deliverable / decision |
| --- | --- | --- |
| Days 1–3 | Review the actual build and run the important initial-plan checks. | `CURRENT_BUILD_REVIEW.md` and a prioritized defect list. |
| Days 4–7 | Fix launch blockers; improve coverage explanations and download instructions. | Verified guest workflow on a preview deployment. |
| Week 2 | Run the first pilot sessions; add local diagnostics and, if useful, structured feedback. | Pilot notes, reproduced defects, UI fixes, and tested feedback migration. |
| Week 3 | Release the verified first version; publish two or three useful guides and set up Search Console. | Public tool, real sample demonstration, and discoverable guides. |
| Week 4 | Review results and prototype the most requested missing capability. | Evidence-based next feature decision; reference-map prototype if renaming is justified. |

Do not force filename shortening into the first month. Its finish date depends on archive complexity and the adapter tests. It can follow the public release.

After launch, use a simple weekly cycle: review feedback → choose one important issue → reproduce it → implement the fix → run relevant checks → release → update the guide or changelog when behavior changes.

---

**12. Build backlog with completion checks**

Use these IDs in your task tracker or give them to your coding assistant. Complete dependencies before starting an item.

| ID | Work | Depends on | Finished when |
| --- | --- | --- | --- |
| NEXT-01 | Audit the initial build. | Existing project | Actual status and evidence are recorded. |
| NEXT-02 | Fix critical core defects. | NEXT-01 | Required preservation, access, and privacy checks pass. |
| NEXT-03 | Improve result/coverage explanations. | NEXT-01 | Users can distinguish detected issues from unchecked areas. |
| NEXT-04 | Add local diagnostics and opening instructions. | NEXT-02 | Data is previewable, contains only allowed fields, and downloads locally. |
| NEXT-05 | Add structured feedback UI/API/table and deletion. | NEXT-02 | Real submissions and retries work; cross-user access is denied; deletion works. |
| NEXT-06 | Run pilot sessions and fix observed problems. | NEXT-02, NEXT-03 | Pilot outcomes are documented and critical defects resolved. |
| NEXT-07 | Release the verified version and publish guides. | NEXT-06 | Production flow works and public claims match it. |
| NEXT-08 | Build the local reference map. | NEXT-02 | Supported references have stable identities, ranges, and coverage states. |
| NEXT-09 | Add one evidence-backed diagnosis adapter. | NEXT-08 | Its fixture results and read-only boundaries are correct. |
| NEXT-10 | Build eligible filename planning and preview. | NEXT-08; NEXT-09 if needed | Every proposed rename shows complete required edits or a clear block. |
| NEXT-11 | Apply and validate approved rename plans. | NEXT-10 | Required rename tests pass and file identities are preserved. |
| NEXT-12 | Extend saved summaries for rename counts. | NEXT-11 | Old/new request schemas and dashboard records both work. |
| NEXT-13 | Review traffic and choose the next investment. | NEXT-07 and real usage | Decision records the repeated user problem and supporting evidence. |

NEXT-05 is helpful, but a custom feedback system is not required to run pilot conversations. NEXT-08 through NEXT-12 are conditional feature work; they are not prerequisites for launching the verified initial scope.

Keep progress in `PHASE_2_PROGRESS.md` with task ID, status, implementation notes, relevant verification evidence, and remaining limitation. These repository files are future work outputs, not audits already completed by this document.

---

**13. Copy this instruction into your coding assistant**

> Continue the existing Export Repair and Migration Checker project using `Export_Repair_Initial_Implementation_Plan.md` and this follow-up plan. First inspect the actual repository and compare implemented behavior with the initial plan. Create `CURRENT_BUILD_REVIEW.md` with Done, Partial, Missing, or Blocked states and evidence. Do not assume the UI is connected to a real engine. Work through NEXT-01 to NEXT-04 first, fixing critical defects and improving result explanations. Preserve the browser-only archive processing model and the existing stack. Use the real worker for real files, preserve original bytes, and keep archive content out of APIs, logs, and analytics. Add structured feedback only with its real backend, ownership rules, deletion behavior, and privacy explanation. Run the relevant existing tests and add meaningful regression fixtures for new failure cases. Update `PHASE_2_PROGRESS.md` after each completed task. Move to new reference adapters or filename shortening only after the applicable dependencies and demand decision are satisfied. Do not ship rename controls ahead of complete validation. Report what changed, how it was verified, and what remains. Prepare deployment changes for review; do not publish, send messages, or introduce payments without the owner's authorization.

**Your immediate task:** open the current project and complete NEXT-01. The next build should be determined by what is missing or failing in that review.

---

**14. Sources and assumptions**

Official documentation checked on 24 September 2026. These sources support platform behavior and implementation considerations. Priorities, UI designs, schemas, limits, pilot targets, and scheduling are proposed decisions for this project.

- **[S1]** [Notion — Export your content](https://www.notion.com/help/export-your-content): export formats and content-access limitations.
- **[S2]** [Obsidian — Import from Notion](https://obsidian.md/help/import/notion): documented destination import workflows; verify the chosen route when implementing destination support.
- **[S3]** [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security): table grants, owner policies, and access testing.
- **[S4]** [parse5 — ParserOptions](https://parse5.js.org/interfaces/parse5.ParserOptions.html): source-location support for parsing HTML.
- **[S5]** [Papa Parse — Documentation](https://www.papaparse.com/docs): CSV parsing and serialization behavior and options.
- **[S6]** [Google Search Central — Get started with Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start): site verification, indexing, sitemaps, and search-performance reports.

The current initial-plan document was reviewed to prepare this follow-up. No application repository, deployment, customer usage, traffic measurements, or revenue data was supplied or verified.
