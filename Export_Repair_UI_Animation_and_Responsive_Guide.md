**Export Repair and Migration Checker — UI, Animation, and Responsive Upgrade Guide**

Prepared: 25 September 2026  
Use with: `Export_Repair_Initial_Implementation_Plan.md` and `Export_Repair_Next_Steps_and_Phase_2_Plan.md`  
Status: implementation guide. The existing plans were reviewed; application source code and a live site were not supplied for this update.

**Goal:** make the website look more polished, feel smoother, and remain easy to use on phones, tablets, laptops, and large monitors.

Here, “transition effects” means the visual changes between screens, tabs, panels, and control states.

Start with the layout and readable content. Add animation after the responsive behavior works. The finished interface should help a user select an export, understand findings, approve changes, and download a copy comfortably at different screen sizes.

**What this upgrade delivers**

- A consistent visual system for every existing page.
- A mobile layout designed for touch, including readable issue cards.
- Tablet and desktop layouts that use the available space well.
- Short, consistent animations and transitions.
- Keyboard access, visible focus, and reduced-motion behavior.
- Verification steps that check real interactions and preserve the active repair session.

This is an improvement to the existing application. Its local file-processing model, authentication, approved repair rules, and saved-summary contracts remain the foundation. Phase 2 features appear in the UI only when their actual functionality is ready.

---

**1. Visual direction**

Use a calm, modern document workspace: clear headings, white surfaces, a soft background, indigo primary actions, and small teal success accents. The actual export report should be the visual focus.

Improve the existing design through spacing, typography, alignment, and clear states. Avoid filling the workspace with large decorative graphics that compete with filenames and findings.

| Design item | Proposed specification |
| --- | --- |
| Page background | `#F8FAFC` |
| Main surface | `#FFFFFF` |
| Main text | `#0F172A` |
| Secondary text | `#475569` |
| Primary action | `#4F46E5` with white text; hover `#4338CA` |
| Positive state | `#0F766E` text on `#F0FDFA` |
| Warning state | `#92400E` text on `#FFFBEB` |
| Error state | `#B91C1C` text on `#FEF2F2` |
| Soft surface border | `#CBD5E1`; decorative separation only |
| Essential control boundary | A stronger neutral such as `#64748B`, checked against the actual surface |
| Focus | A clearly visible indigo outline with an offset; test on every control background |
| Panels | 16px corners; subtle shadow only where useful |
| Controls | 8–10px corners; at least 44px-high main touch targets |
| Body text | 1rem, about 1.5–1.65 line height |
| Helper text | Normally 0.875rem; keep important messages at body size |
| Public hero heading | Fluid size around 2rem–4rem; wrap naturally |
| Workspace heading | Around 1.5rem–2rem |
| Icons | Consistent Lucide icons, generally 18–20px; important actions also have labels |
| Spacing | Use a shared 4px scale; main gaps 12, 16, 24, and 32px |
| Reading width | Guides around 65–72 characters per line |
| Maximum width | Public content about 72rem; workspace about 100rem |

These are proposed tokens, not proof that every assembled component passes contrast checks. Test normal, hover, selected, disabled, error, and focus states against their actual backgrounds. A pale border alone should not be the only way to identify an input.

Use the existing system font or existing self-hosted font. Do not introduce several font families. If the site already supports dark mode, define equivalent semantic tokens and test it; a new theme switch is not required for this upgrade.

**Visual details to add**

- A compact product mark and aligned navigation.
- A soft, static indigo tint behind the home-page report example.
- Clear section spacing and shorter text blocks.
- Consistent icons and labels for issue types.
- Distinct primary, secondary, and destructive buttons.
- Well-designed empty, loading, error, and success states.

Keep live findings accurate. Do not decorate the interface with an invented migration score, fake success count, or unsupported platform logos.

---

**2. Responsive layout specification**

Build from the smallest layout upward. Use the available CSS width and component space, rather than trying to detect a particular device brand. Tailwind supports this mobile-first approach; check the installed version before using its container-query utilities [S1]. Plain CSS container queries are also an option where the supported browser baseline allows them.

**2.1 Main layout bands**

Pixel equivalents below assume the usual 16px base. They are layout starting points, not device categories that must be detected in JavaScript.

| Available width | Public pages | Export workspace |
| --- | --- | --- |
| Below 40rem, roughly 640px | One column; compact header; stacked main actions. | One column; issue cards; files/filters in a sheet; details in a full-width dialog. |
| 40rem–47.99rem, roughly 640–767px | More breathing room; cards can form two columns if labels fit. | One main column; summary tiles can use two columns. |
| 48rem–63.99rem, roughly 768–1023px | Two-column hero when content fits; wrapped navigation or menu. | Main results area; collapsible file list; detail sheet; two or four summary columns if readable. |
| 64rem–89.99rem, roughly 1024–1439px | Full navigation; wider content sections. | File sidebar plus results; issue details open in a modal sheet. |
| 90rem and above, roughly 1440px+ | Center the content inside its maximum width. | File sidebar, results, and an optional docked issue inspector. |

At large widths, do not stretch paragraphs or tables across the entire monitor. Keep sensible maximum widths. At intermediate widths, collapse a panel before squeezing the main result content.

At desktop size, opening or closing the inspector may change grid columns immediately; animate the inspector's contents rather than continuously animating the width of the whole workspace.

**2.2 Rules for every page**

- Set the viewport through the framework's supported configuration: device width and initial scale 1. Preserve zoom; do not set `user-scalable=no` or a restrictive maximum scale.
- Use flexible widths, `min-width: 0` on grid/flex children, and `minmax(0, 1fr)` for flexible tracks.
- Use `max-width: 100%` for images and previews. Keep their proportions and reserve their display space.
- Allow titles, email addresses, filenames, and paths to wrap. Use `overflow-wrap: anywhere` for long strings.
- Use padding around 16px on phones, 24px on tablets, and 32px on wider screens.
- Keep the main page vertically scrollable. Avoid several nested scrolling regions on mobile.
- Avoid fixed content heights and `width: 100vw` inside a padded page container.
- Fix the element that overflows. Do not hide page-wide overflow to conceal broken content.
- Keep normal content usable at 320 CSS pixels and when text is enlarged. W3C's reflow guidance includes a 320 CSS-pixel reference and a 1280px viewport at 400% zoom [S2].
- Check landscape, split-screen use, and resizing during an active scan.

“Responsive on relevant devices” means verified layouts across representative screen sizes, input methods, and supported browsers. It does not mean that every browser or device can process an arbitrarily large ZIP. Keep the existing archive limits and truthful failure messages.

---

**3. Page-by-page UI improvements**

| Page or area | Improvements | Small-screen behavior |
| --- | --- | --- |
| Home `/` | Strong headline, one clear primary action, actual sample report, concise feature explanations, FAQ. | Text first, report example below; stacked buttons and cards. |
| Header and footer | Consistent spacing, active navigation state, visible account action. | Labelled menu button; accessible sheet; footer groups stack. |
| Choose file | Large accessible chooser, selected-file card, clear source/output labels and limits. | “Choose ZIP file” remains a visible button; drag-and-drop is optional. |
| Scan | Clear stage label, real progress when measurable, cancel action, useful failure recovery. | One compact progress panel; stage labels wrap. |
| Review | Summary, coverage banner, filters, results, and an issue inspector. | Issue cards replace the wide table; details open in a dialog. |
| Repair plan | Before/after destinations, selected count, remove actions, and clear confirmation. | Before and after are stacked; actions remain labelled. |
| Build copy | Real stages and cancellation; clear validation failure. | Avoid large animated graphics; keep status and cancel visible. |
| Download | Clear result heading, remaining issues, primary download, secondary report actions, opening instructions. | Full-width main action; secondary actions wrap or use a labelled menu. |
| Login | Simple email/code form with visible labels and inline errors. | Comfortable input sizes; form scrolls above the keyboard. |
| Dashboard | Clear saved-summary list, filter, pagination, empty state. | Summary cards with View/Delete controls. |
| Saved summary | Readable counts and explanation of what is stored. | One column with a clear Back action. |
| Account | Separate profile, feedback if implemented, and account-deletion sections. | Stacked forms; destructive action separated from routine actions. |
| Guides and help | Narrow reading column, useful examples, headings, anchor links, related guide links. | Optional contents list becomes a disclosure; wide examples scroll locally. |
| Privacy, terms, changelog | Clean document layout and working internal links. | Reading width follows the screen; no tiny legal text. |
| Error and not-found pages | Short explanation and an actionable way back. | All actions fit without horizontal page scrolling. |

The changelog, diagnostics, feedback, or rename controls from Phase 2 should be styled if present. Do not create working-looking controls for unfinished features.

**3.1 Home page composition**

Use a two-column hero only when both columns remain readable. The left side contains the headline, short explanation, “Check my export,” and “Try a sample.” The right side contains a clearly labelled sample report.

Below it, show the workflow, supported checks, privacy explanation, FAQ, and final action. Use original synthetic examples. The main heading and action should be visible immediately; decorative motion must not delay them.

**3.2 Mobile issue card**

Each card must retain the information needed to make a repair decision:

1. Issue type and severity, with text and an icon.
2. Source filename or path, with expansion/copy where useful.
3. A short explanation.
4. Current status: unresolved, approved, skipped, or unchecked.
5. “Review issue” and an eligible selection control.

Use the same issue IDs and selection state as the desktop table. Keep filters, search, and pagination available. Do not make users swipe horizontally through a desktop table to reach its main repair action.

**3.3 Responsive inspector**

Use one `IssueDetails` content component with responsive presentation: a modal dialog/sheet at smaller widths and a labelled non-modal aside on wide screens.

Keep the selected issue, target choice, and draft approval state outside the presentation wrapper. When switching between modal and docked mode, release modal scroll locks and focus traps correctly. Preserve the selected issue and move focus to a sensible visible control. Never leave an invisible overlay intercepting clicks.

On a phone, the inspector should have a visible title and Close button, a scrollable body, and reachable actions. On short screens or with the keyboard open, allow its actions to scroll with the form rather than covering inputs.

**3.4 Tables, paths, and before/after previews**

Use semantic tables where columns are useful and space is available. For mobile issue lists and saved summaries, use labelled cards. If both presentations exist in the DOM, render only the current bounded page, hide the inactive view with `display: none`, use unique element IDs, and bind both views to the same controlled state.

A code or diff panel may have its own horizontal scroll when preserving its structure is useful. Provide a wrap option for long paths and stack before/after panels on phones. Escaped imported text remains text; UI effects must not turn it into executable HTML.

---

**4. Animation and transition system**

Use motion to show what changed, where a panel came from, and whether an action was accepted. Keep motion short enough that users can continue immediately.

**4.1 Shared timings**

| Effect | Normal behavior | Reduced-motion behavior |
| --- | --- | --- |
| Button hover/focus | Color or border change in 120–160ms. Optional 1px lift for a fine pointer. | Color/focus change without movement. |
| Button press | Small 0.98 scale for about 80ms on eligible controls. | No scale. |
| Navigation highlight | Underline or background transition around 150ms. | Immediate change. |
| Workspace step change | Short fade and up to 8px movement, around 180ms. | Immediate swap or short fade; no movement. |
| Issue inspector | Fade with up to 24px movement, around 220ms. | Immediate appearance or short fade. |
| Modal | Fade with a subtle 0.98-to-1 scale, around 160ms. | Fade only or immediate appearance. |
| Small disclosure | Existing accessible component's open/close effect, around 160ms. | Immediate opening/closing. |
| Selected issue | Background/border update around 120ms. | Immediate state update. |
| Progress update | Smooth only between real measured values, up to 120ms. | Immediate value change. |
| Toast | Fade with up to 8px movement, around 160ms. | Fade only or immediate appearance. |
| Verified result | Small icon appearance around 180ms after validation succeeds. | Static success icon and text. |

Use one standard easing curve such as `cubic-bezier(0.2, 0.8, 0.2, 1)`. Keep any public-page card stagger small, for example 30ms between at most a few cards. Do not stagger long lists of issues.

These timings are design choices, not required library settings or measured performance results.

**4.2 Implementation choices**

Use CSS for hover, focus, press, simple entry effects, and the existing component library's dialog/disclosure transitions. Reuse any motion library already present.

If React-managed enter/exit effects need Motion for React, use the package compatible with the project's existing dependencies and place a stable `MotionConfig` around the relevant UI. Set `reducedMotion="user"`. Motion documents that this disables transform/layout motion while other effects can remain, so separately control CSS animations and unwanted decorative loops [S3]. Do not install both `motion` and `framer-motion` to implement the same effects.

Prefer `transform` and `opacity` for animation. Frequently animating layout properties across a whole page can be expensive; web.dev describes this performance tradeoff [S4]. A small disclosure can use its established component behavior, but do not continuously animate the workspace grid or every result row.

**4.3 Keep application behavior independent of animation**

- An animation must never start a scan, apply a repair, approve a suggestion, or trigger a download.
- Enable actions from actual application state, not animation completion callbacks.
- Keep the worker and selected File above animated panels in the component tree.
- Do not key the entire `/check` workspace by step, screen width, or selected tab.
- Animate only the presentation of the active step; keep the underlying session mounted.
- On public route changes, use simple entry effects. Do not add a routing workaround that freezes navigation to force an exit animation.
- Never convert a worker error into a timed “success” animation.
- Do not delay Cancel while an animation is running.

**4.4 Effects to leave out**

Avoid cursor trails, background particles, automatic carousels, large parallax movement, bouncing error messages, continuous decorative loops, and blurred text transitions. Reserve animation for the user's current action and useful feedback.

---

**5. Mobile details that need special attention**

**5.1 Navigation and overlays**

Keep the product name and labelled menu button visible. Put secondary links inside an accessible navigation sheet. Use the existing accessible dialog/sheet primitive so focus management, Escape, and background interaction are handled consistently.

The menu must work by touch and keyboard. A hover interaction must never be the only way to reveal an action. Avoid nested dialogs where one sheet can present the same information.

Define a small shared stacking order for the header, action bar, overlay, dialog, and notifications. Inspect overlapping components together, including a sign-in dialog opened from an active review session.

**5.2 Action bars and phone keyboards**

Give the user one clear main action for the current step. Put secondary actions in a wrapping row or a labelled “More actions” menu.

Use a sticky action bar only when enough vertical space remains. On short landscape screens or when it would cover focused fields, use normal document flow. Sticky UI can obscure keyboard focus; account for its height and verify the actual focused element remains visible [S5].

If an implementation uses a fixed bar, reserve its measured height in the content below it. Do not assume a fixed 64px height: labels wrap and accessibility text settings change dimensions. Use safe-area padding where necessary; CSS `env()` exposes safe-area values for such layouts [S6].

For dialogs, use a viewport-aware maximum height with a `100vh` fallback and `100dvh` where supported. These units alone do not guarantee that a virtual keyboard will never cover a field. Test on a physical phone, allow scrolling, and keep the focused input and its action reachable. Use `VisualViewport` adjustments only if a reproduced issue needs them.

**5.3 File selection and downloads**

- Keep the native file input and a large labelled chooser button.
- Do not require dragging a ZIP into the page.
- Show a long selected filename without pushing the Remove action off-screen.
- Test choosing the same file again after clearing it.
- Keep the current local archive limits; screen size is not a reliable measure of memory capacity.
- Test the actual browser download behavior on iOS and Android.
- Show “Download started” after initiating the browser action, with a way to retry.
- Preserve the original archive and the currently built output when opening a UI panel.

**5.4 Forms**

Use visible labels, helpful autocomplete attributes, and appropriate input types. Keep input text at least 1rem and allow error messages to wrap. Choose the keyboard/input mode according to the field's actual expected data.

For email codes, support pasting the complete code and use the provider's real code length and format. A single accessible code input is a suitable default. Do not introduce six separate boxes that lose characters or block paste merely for decoration.

Keep submitted values after validation errors. Place error text near its field and connect it with `aria-describedby`. Account deletion retains its existing confirmation and server-verified behavior.

---

**6. Accessibility and reduced motion**

Treat keyboard, touch, zoom, and reduced motion as normal ways to use the product.

| Area | Implementation requirement |
| --- | --- |
| Keyboard | All functions work without a mouse; use real buttons and links. |
| Focus | Visible focus ring; sensible order; no focused control hidden behind sticky content. |
| Dialogs | Accessible title, focus containment while modal, Escape/Close behavior, and focus restoration. |
| Text contrast | Target at least 4.5:1 for normal text and 3:1 for large text under the applicable WCAG definitions [S7]. |
| Controls | Essential component boundaries and state indicators need sufficient contrast; check the applicable 3:1 requirement [S8]. |
| Touch | Aim for at least 44×44 CSS pixels for important touch controls, with space between adjacent actions. This is the project's usability target. |
| Status | Text and icons explain warnings and success; color alone is insufficient. |
| Progress | Label a real progress bar. Set numeric values only when the total is meaningful. |
| Announcements | Use polite live announcements for stages/results, without announcing every worker message. |
| Errors | Important errors remain visible inline; do not rely on a short-lived toast. |
| Zoom | Preserve browser zoom and usable content at enlarged text sizes. |
| Motion | Respect OS reduced motion in CSS and any animation library [S3, S9]. |

For reduced motion, remove movement, scaling, shimmer, and decorative repetition. Keep the result, label, and progress information visible. A static processing message with real stage updates is acceptable.

If an in-app motion preference is later added, use **System setting** and **Reduce motion**, store only the preference locally, and apply it to both CSS and the motion library. This control is optional. Do not store archives or findings to remember a visual preference.

On user-triggered step navigation, move focus to the new step heading where appropriate. Background progress updates must not repeatedly steal focus, especially while a sign-in dialog is open.

Avoid automatic error shaking and success confetti. A clear message and small state change are enough.

---

**7. CSS foundation to adapt in the project**

This is a reference pattern, not a replacement for the existing stylesheet. Merge these ideas with current tokens and component classes. Keep styles inside the normal application build; use accessible UI primitives for dialog behavior.

```css
:root {
  --er-bg: #f8fafc;
  --er-surface: #ffffff;
  --er-text: #0f172a;
  --er-muted: #475569;
  --er-primary: #4f46e5;
  --er-border: #cbd5e1;
  --er-motion-fast: 140ms;
  --er-motion-panel: 220ms;
  --er-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
}

.er-app,
.er-app *,
.er-app *::before,
.er-app *::after {
  box-sizing: border-box;
}

.er-app {
  min-block-size: 100vh;
  min-block-size: 100svh;
  background: var(--er-bg);
  color: var(--er-text);
}

.er-shell {
  inline-size: 100%;
  max-inline-size: 72rem;
  margin-inline: auto;
  padding-inline: clamp(1rem, 3vw, 2rem);
}

.er-shell--workspace {
  max-inline-size: 100rem;
}

.er-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

.er-workspace > * {
  min-inline-size: 0;
}

.er-files-desktop,
.er-inspector-docked {
  display: none;
}

.er-long-text {
  overflow-wrap: anywhere;
}

.er-media {
  display: block;
  max-inline-size: 100%;
  block-size: auto;
}

.er-touch-control {
  min-inline-size: 2.75rem;
  min-block-size: 2.75rem;
}

.er-action-bar {
  position: sticky;
  bottom: 0;
  z-index: 20;
  padding: 0.75rem 1rem;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom, 0px));
  background: var(--er-surface);
  border-top: 1px solid var(--er-border);
}

.er-dialog-surface {
  max-block-size: calc(100vh - 2rem);
  max-block-size: calc(
    100dvh - 2rem - env(safe-area-inset-top, 0px)
    - env(safe-area-inset-bottom, 0px)
  );
  overflow: auto;
}

.er-ui-transition {
  transition-property: color, background-color, border-color, opacity, transform;
  transition-duration: var(--er-motion-fast);
  transition-timing-function: var(--er-ease);
}

.er-step-enter {
  animation: er-step-in 180ms var(--er-ease);
}

@keyframes er-step-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (min-width: 64rem) {
  .er-workspace {
    grid-template-columns: 14rem minmax(0, 1fr);
  }

  .er-files-desktop { display: block; }
}

@media (min-width: 90rem) {
  .er-workspace[data-inspector-open="true"] {
    grid-template-columns: 15rem minmax(0, 1fr) 22rem;
  }

  .er-workspace[data-inspector-open="true"] .er-inspector-docked {
    display: block;
  }
}

@media (max-height: 32rem) {
  .er-action-bar { position: static; }
}

@media (hover: hover) and (pointer: fine)
       and (prefers-reduced-motion: no-preference) {
  .er-button-lift:hover { transform: translateY(-1px); }
}

@media (prefers-reduced-motion: reduce) {
  .er-step-enter { animation: none; }
  .er-ui-transition { transition-duration: 0ms; }
}
```

The reduced-motion example deliberately does not reset every element's transform: some dialogs use transforms for their resting position. Disable motion without moving the dialog to the wrong place. Extend the reduced-motion rules to every animated primitive actually used.

Use CSS for layout changes where possible. If JavaScript is necessary to change modal behavior, subscribe to media-query changes and clean up subscriptions. Keep server rendering and the first client render consistent; do not read `window.innerWidth` while rendering on the server.

---

**8. Component changes and state ownership**

Adapt the current project structure rather than creating a parallel design system.

| Component or module | Work |
| --- | --- |
| Global styles/design tokens | Add shared spacing, surfaces, focus, motion timings, and responsive patterns. |
| `PublicHeader` / `MobileNavigation` | Responsive navigation and accessible mobile sheet. |
| `WorkspaceShell` | Flexible columns, stable session owner, and responsive panel placement. |
| `WorkflowStepper` | Full labels on larger screens; compact “Step 3 of 5 — Review” on phones. |
| `FileDropzone` / `SelectedFileCard` | Native chooser, touch support, long-name handling, and clear errors. |
| `ScanProgress` | Real stage information, restrained animation, and accessible status. |
| `CoverageBanner` / `SummaryCards` | Flexible grid, clear categories, and expandable limitations. |
| `IssueTable` / `IssueCardList` | Shared data and selection, responsive presentations, bounded rendered items. |
| `IssueDetails` / `ResponsiveInspector` | One detail view with modal/docked presentation. |
| `RepairPlan` / `ChangePreview` | Mobile stacking, readable paths, and current approval states. |
| `WorkspaceActionBar` | Wrapping actions and safe positioning in small/short viewports. |
| `DownloadPanel` | Clear main action, remaining limitations, and opening instructions. |
| Account/dashboard components | Responsive summaries, labelled forms, and reliable dialogs. |
| Notification components | Accessible nonblocking feedback with persistent inline errors. |

Preserve these values across layout changes: selected File, worker/job identity, current processing step, issues, filters, selected issue, approved repairs, generated output, and in-progress form values.

Keep session state in the existing stable workspace owner. Do not create separate mobile and desktop processing sessions. Do not start or terminate workers because a breakpoint changed, an inspector closed, or a reduced-motion preference changed.

Use stable issue IDs as React keys. Avoid full-list animation and expensive rerenders for every progress message. Coalesce display updates if profiling shows a problem, while retaining the latest real values and complete engine results.

**Backend and database impact:** this visual upgrade does not need new tables, repair endpoints, or cloud storage. Use the existing account and summary APIs. Feedback or rename metadata changes remain part of the separate Phase 2 plan. Do not put filenames, selected issues, or private search terms into route URLs or analytics while adding navigation effects.

---

**9. Verification plan**

Record browser/version, viewport, input method, and result. Screenshots help verify appearance; interactive checks are also needed to establish that the workflow still works.

**9.1 Representative screen sizes**

| Viewport | Main checks |
| --- | --- |
| 320×568 | Long strings, menu, issue cards, full-width dialogs, and readable controls. |
| 360×800 and 390×844 | Main phone workflow; file chooser; action bar; keyboard. |
| 430×932 | Larger phone spacing without unnecessary stretched elements. |
| 844×390 | Landscape phone; reachable actions; no trapped page scrolling. |
| 768×1024 and 820×1180 | Tablet columns, portrait dialogs, and touch navigation. |
| 1024×768 | Tablet landscape or small laptop; sidebar/results layout. |
| 1280×720 and 1366×768 | Common laptop widths and limited height. |
| 1440×900 | Three-panel workspace when the inspector is open. |
| 1920×1080 and 2560×1440 | Centered content and comfortable reading width. |

Also inspect just below and above each chosen breakpoint. With the proposed defaults, examples include 639/640/641, 767/768/769, 1023/1024/1025, and 1439/1440/1441 CSS pixels. Check arbitrary widths between these values too.

Use current supported Chrome, Edge, Firefox, and Safari versions for release verification. Include Android Chrome and iPhone Safari on physical devices when possible. Browser emulation helps with layout but does not fully reproduce native file pickers, keyboards, memory limits, or downloads.

**9.2 Required interaction checks**

| Scenario | Expected result |
| --- | --- |
| Resize from phone to desktop during scanning | Same selected file and job; no duplicate scan or lost status. |
| Rotate the device during issue review | Filters, selections, and approvals stay intact. |
| Resize while issue details are open | No invisible overlay, stranded focus trap, or lost draft target. |
| Open sign-in from an active session | Local archive/results remain available after sign-in. |
| Reduce motion before loading and while using the site | Effects adapt without breaking progress or controls. |
| Use only the keyboard | Navigation, filters, approval, dialogs, and download remain reachable. |
| Use 200% text enlargement and a 320px-equivalent zoomed viewport | Important content and functions reflow without clipped actions. |
| Open the phone keyboard in a dialog | Field, error, and submit action can be reached. |
| Show a very long filename and Unicode title | Text wraps or expands without page overflow. |
| Filter a large result set | Bounded rendering; no animated delay across thousands of rows. |
| Cancel and quickly start another job | Old animations/messages cannot overwrite the new state. |
| Backend fails while a local result is ready | Local download works; metadata error is clear. |
| Output validation fails | Error appears; no success animation or successful-output action. |
| Download ZIP on phone and desktop | Actual browser behavior is usable; UI claims only that download started. |

Reuse existing functional tests. Add focused regressions where the redesign could lose session state, approvals, focus, or actions. Do not add brittle tests that merely assert every CSS class or animation duration.

Capture the home page, review screen, and open inspector at phone, tablet, and desktop widths. Inspect them for clipped text, accidental horizontal page scrolling, uneven spacing, and overlapping controls. Review both normal and reduced motion.

**9.3 Performance review**

Compare the updated UI with the current build using the same representative archive and device/browser. Profile scanning, filtering, and opening details. Check unnecessary list renders, large animation dependencies, excessive shadows, and layout shifts.

Keep public content visible while optional effects load. Heavy scanning remains in the Web Worker. Do not add marketing animation code to the processing bundle unless it is actually needed there. Avoid setting `will-change` permanently on every card.

Record measured results and any remaining limits. Do not promise a perfect Lighthouse score or a fixed frame rate on every device.

---

**10. Implementation order**

| Stage | Tasks | Completion condition |
| --- | --- | --- |
| UI-01: Inspect | Review routes, components, installed libraries, current styles, and real engine connections. Capture baseline screenshots. | The actual files to change and current layout failures are identified. |
| UI-02: Foundations | Apply tokens, typography, spacing, focus, button/form states, and flexible containers. | Shared components look consistent at small and large widths. |
| UI-03: Public pages | Improve header, hero, sample, guides, footer, and responsive navigation. | All public pages remain readable and navigable. |
| UI-04: Workspace | Add issue cards, adaptable panels, responsive stepper, previews, and action placement. | Guest workflow works at phone, tablet, and desktop sizes. |
| UI-05: Account pages | Improve sign-in, dashboard, summary detail, account forms, and implemented feedback UI. | Controls work with keyboard and touch; data remains intact. |
| UI-06: Motion | Add the shared effects and reduced-motion rules. Keep session owners stable. | Effects are consistent and functionality does not depend on them. |
| UI-07: Verification | Run targeted regression checks, real-device checks, contrast review, and performance comparison. | No launch-blocking layout, interaction, privacy, or state-loss defect remains. |

A planning allowance is roughly 6–10 focused development days if the original components already work and are reasonably structured. Source-code quality, existing defects, and access to test devices can change the effort. Finish the acceptance criteria rather than forcing the work into this estimate.

Create a short `UI_UPGRADE_PROGRESS.md` in the repository during implementation. Record completed stages, changed components, screenshots, checks performed, and unresolved issues. That progress record is future work; it has not been produced by this guide.

**Final acceptance checklist**

- [ ] Every existing public and account route has been reviewed responsively.
- [ ] The core guest journey works at small and large widths.
- [ ] Important actions are visible and usable by keyboard and touch.
- [ ] Long filenames, paths, errors, and translations/Unicode content do not break the layout.
- [ ] Dialogs, menus, and action bars do not hide focused fields or trap scrolling.
- [ ] Resizing, orientation changes, and UI transitions preserve the active session.
- [ ] Animations use consistent timing and respect reduced motion.
- [ ] Live progress, repair approval, and output status remain truthful.
- [ ] Original archive handling, local processing, and account ownership rules still hold.
- [ ] Representative browser/device results and known limitations are documented.

---

**11. Copy this instruction into your coding assistant**

> Improve the existing Export Repair and Migration Checker using this UI, Animation, and Responsive Upgrade Guide. First inspect the actual project and identify current components, styles, dependencies, and working user flows. Continue the existing architecture. Implement UI-01 through UI-07 in order. Use the indigo/slate visual system, better spacing and typography, mobile issue cards, responsive navigation, adaptive issue details, and clearly labelled controls. Make the complete supported workflow usable from 320 CSS pixels through large desktop widths, including intermediate sizes, landscape, zoom, and virtual keyboards. Use restrained CSS transitions and the existing animation library where useful. Respect reduced motion in every animated component. Preserve the selected File, worker identity, filters, repair approvals, form values, and output across layout changes. Keep processing local and reuse the existing APIs. Add UI for Phase 2 features only when their real implementation exists. Verify meaningful interactions and capture representative screenshots; do not claim that screenshots alone prove functionality. Update UI_UPGRADE_PROGRESS.md with actual changes, verification evidence, and remaining issues. Prepare the changes for review and do not publish the site unless the owner has authorized deployment.

**To apply this guide to the real website:** provide the current project ZIP or repository. A live URL or screenshots can support the visual review, but source access is needed to change the implementation.

---

**12. Official references**

Checked on 25 September 2026. The palette, breakpoints, motion timings, components, and effort estimate are proposed project decisions. The following documentation supports implementation and accessibility guidance.

- **[S1]** [Tailwind CSS — Responsive design](https://tailwindcss.com/docs/responsive-design)
- **[S2]** [W3C — Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- **[S3]** [Motion — MotionConfig](https://motion.dev/docs/react-motion-config)
- **[S4]** [web.dev — High-performance CSS animations](https://web.dev/articles/animations-guide)
- **[S5]** [W3C — Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- **[S6]** [MDN — CSS env()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env)
- **[S7]** [W3C — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- **[S8]** [W3C — Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- **[S9]** [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
