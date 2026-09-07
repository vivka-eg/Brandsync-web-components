# Component Specs — Storybook Coverage & Unit Test Scope

Source of truth for each component: its `.tsx` (props/events/slots/parts/state) and `.css` (visual states referenced by class). Conventions per `CONVENTIONS.md`: CSS custom properties, shadow parts, slots, and `@Prop` are the only four customization surfaces — specs below don't invent a fifth.

## bs-badge

Source: `src/components/bs-badge/bs-badge.tsx`, `bs-badge.css`

**Prop:** `variant: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error' | 'neutral' | 'inverse'` (default `'default'`). No `size`, no `disabled` — badge is a non-interactive label.
**Slot:** default only (label text). **Part:** `container`.

Coverage matrix:
- [ ] All 8 variants rendered (story already has `AllVariants` — verify it stays in sync if variant type changes).
- [ ] Empty default slot (no text at all) — pill collapses to just padding, no crash.
- [ ] Very long single-word text (e.g. "Supercalifragilisticexpialidocious") — CSS has `white-space: nowrap` and no `max-width`/`text-overflow: ellipsis`, so it will overflow its container rather than truncate or wrap. Story should demonstrate this since it contradicts the doc comment "badges are sized for one or two words" with no enforcement.
- [ ] Slotted markup other than plain text (e.g. `<span>` wrapping text, or two text nodes) — confirm layout still works.
- [ ] Multiple badges wrapping in a flex row (existing `AllVariants` story covers this).

Accessibility: badge conveys status via color + text only, no icon slot exists — confirm (not fix) that text is always present since color alone would fail WCAG 1.4.1. No keyboard interaction (correct — it's not a control).

Open question: `variant` has no runtime fallback/validation. If a consumer (e.g. Blazor/plain-HTML, not TS-checked) sets an unrecognized string, the produced class `bs-badge--<value>` matches no CSS rule and the badge renders with no background/color (invisible pill). Worth a unit test asserting current (unstyled) behavior, and flag to the team whether an invalid-value fallback to `default` is wanted — not decided here.

## bs-button

Source: `src/components/bs-button/bs-button.tsx`, `bs-button.css`, existing test `bs-button.cmp.test.tsx`

**Props:** `variant: 'primary'|'neutral'` (default `primary`), `size: 'sm'|'md'|'lg'` (default `md`), `disabled: boolean` (default `false`), `type: 'button'|'submit'|'reset'` (default `button`).
**State:** `hasIcon` (internal, driven by `icon` slot's `slotchange`).
**Slots:** default (label), `icon`. **Parts:** `icon`, `label`. **Shadow:** `{ delegatesFocus: true }`.

Coverage matrix (existing test file only covers default label/variant/size class + disabled attribute + variant reflection — expand):
- [ ] All 6 `variant` × `size` combinations (2×3).
- [ ] `disabled=true` for each variant (verify `.bs-button--primary:disabled` / `.bs-button--neutral:disabled` token classes apply — CSS defines distinct disabled colors per variant).
- [ ] `type="submit"` inside a `<form>` — actually submits; `type="reset"` resets a form. Flag: hard to unit-test meaningfully in Stencil's isolated `render()` harness without a real `<form>` wrapper — decide whether this is in scope for unit tests or left to Storybook interaction tests.
- [ ] Icon slot: no content → `hasIcon` stays `false`, `bs-button__icon--visible` class absent, no extra margin. With content (e.g. `<span slot="icon">★</span>`) → `hasIcon` becomes `true` after `slotchange`, margin applied. Test both directions: adding icon after initial mount, and removing it (re-triggers `slotchange`, `hasIcon` reverts to `false`).
- [ ] Icon slotted at **initial mount** (not added dynamically) — confirm `slotchange` still fires for content present at connection time (it does per spec, but worth an explicit regression test since the whole icon-gap feature depends on it).
- [ ] Long label text — no `white-space:nowrap`/truncation in CSS; button will grow or wrap. Storybook-only concern (layout), not a meaningful unit test.
- [ ] `disabled` + click: native `disabled` attribute means the inner `<button>` never dispatches `click` at all — a listener attached directly to the `<bs-button>` host also never fires (unlike badge/card, this is a real interactive element, so this is worth an explicit unit test since it's easy to assume the host needs its own guard).
- [ ] Keyboard: since this is a real `<button>`, Enter/Space activation and `:focus-visible` outline are native — not meaningfully unit-testable in jsdom; call out in Storybook a11y notes instead.

Accessibility: `shadow: { delegatesFocus: true }` — confirm `bsButtonEl.focus()` (host-level, e.g. from `bs-modal` restoring focus to a trigger button) actually moves focus into the shadow `<button>`. This is the exact reason the comment in source calls this out — should be a unit test (`root.focus()` then assert `document.activeElement`/shadow-active-element is the inner button), not just relied on implicitly.

No open ambiguities beyond the badge-style "unvalidated prop value" pattern (unrecognized `variant`/`size`/`type` string → unstyled or browser-default fallback) — same caveat applies here, not repeating in depth.

## bs-card

Source: `src/components/bs-card/bs-card.tsx`, `bs-card.css`

**Prop:** `surface: 'base'|'raised'|'container'` (default `'raised'`). **Slots:** `header`, default (body), `footer`. **Parts:** `container`, `header`, `body`, `footer`. No `disabled`, no interactive state.

Coverage matrix — this is genuinely a "variant × content-presence" matrix, not "variant × surface" (card only has one variant axis, `surface`; there is no second cross-cutting axis to combine it with):
- [ ] All 3 `surface` values, each with header+body+footer populated (existing stories cover default content only, one per surface — keep).
- [ ] Content-presence combinations, independent of surface: body only (no header/footer), header+body (no footer), body+footer (no header), header+body+footer, and **completely empty** (no slots filled at all — should render as an empty bordered box, not crash).
- [ ] Unlike `bs-modal`, `bs-card` has **no `hasHeader`/`hasFooter` state** — the header/footer `<div>` wrappers always render in the DOM regardless of slot content. Verify (don't assume) that this is visually inert when empty: CSS only applies `margin` via `::slotted(*)`, not padding on the wrapper divs themselves, so an empty header/footer contributes zero extra height. Worth an explicit test asserting no stray visible spacing when `header`/`footer` slots are unused — this is a real behavioral difference from `bs-modal`'s footer that's easy to regress if someone "fixes" the header/footer CSS later.
- [ ] Long/overflowing body content: no `max-height`/`overflow` on `.bs-card__body` — card grows unbounded with content (no scroll clipping). A long unbroken string (no spaces) will overflow the card's fixed padding/border since there's no `overflow-wrap`/`word-break` rule either — worth a Storybook demo of a long unbroken token or URL to visually confirm it isn't clipped or contained.
- [ ] Nested `bs-button` in `footer` slot (as in the existing story) and nested `bs-card` inside another card's default slot (not prevented by anything) — visually verify shadow-DOM boundary styling doesn't leak (e.g. the inner card's own border shows correctly against the outer card's background).

Open question: same "invalid `surface` value" fallback gap as badge/button — flagged once here, applies identically.

## bs-input

Source: `src/components/bs-input/bs-input.tsx`, `bs-input.css`

**Props:** `value` (string, default `''`), `type: 'text'|'email'|'password'|'number'` (default `text`), `label?`, `placeholder?`, `description?`, `error?`, `disabled` (default `false`).
**Events:** `bsInput` (per-keystroke, from native `input`), `bsChange` (from native `change`, i.e. on commit/blur).
**Parts:** `label`, `control`, `description`, `error`. **Shadow:** `{ delegatesFocus: true }`.

Coverage matrix:
- [ ] All 4 `type` values.
- [ ] No `label` → `<label>` element is not rendered at all (conditional `this.label &&`), not just visually hidden. Confirm via shadow DOM query that it's absent, not empty.
- [ ] `description` only, `error` only, **both `description` and `error` set simultaneously** — source explicitly prioritizes `error`: only the error `<span>` renders (`this.error ? ... : this.description ? ... : null`), description is fully suppressed, not just visually hidden. This exact combination needs an explicit unit test since it's the one place two props interact.
- [ ] `aria-describedby="description-or-error"` is present on the `<input>` whenever *either* `error` or `description` is set, and absent (`undefined`) when neither is set — test all three states.
- [ ] `aria-invalid="true"` present only when `error` is set (not when only `description` is set, not when `disabled`).
- [ ] `error` + `disabled` combined: CSS applies `.bs-input__control:disabled` (background/text-color/cursor only) and `.bs-input--error .bs-input__control` (border-color) — since `:disabled` doesn't touch `border-color`, **the red error border remains visible on a disabled+errored input**. Flag as open question for the team: is a visibly-errored-but-disabled field intentional (e.g. "this field failed validation and is now locked"), or should disabled suppress error styling? Not resolved here — call out explicitly, write the test to assert current behavior either way.
- [ ] Empty `value=""` (default) vs a very long `value` string — native input scrolls internally, no component-level truncation; not much to assert beyond "doesn't throw."
- [ ] `value="0"` / other falsy-but-valid values — since `value` is bound directly to the native `value` attribute (not coerced through `??`), confirm `0`/`false`-as-string render correctly (this prop is always a string per its type, so this is lower-risk than the data-table's cell-value coercion below, but still worth one assertion).
- [ ] `bsInput` fires on every native `input` event with the correct current value; `bsChange` fires on native `change` (blob/commit) with the correct value — test them as **distinct** events, and explicitly assert that a listener for the *native* `input`/`change` event on the host does **not** fire (only the re-dispatched `bsInput`/`bsChange` custom events do) — this is the whole reason the component re-dispatches, per its own doc comment, and deserves a regression test.
- [ ] `disabled=true`: native input can't receive focus or fire `input`/`change` at all — confirm `.focus()` on the host (delegatesFocus) is a no-op when the inner control is disabled, rather than assuming focus silently succeeds.

Accessibility: `shadow: { delegatesFocus: true }` — same pattern as `bs-button`; test that `.focus()` on the host reaches the inner `<input>` (this is explicitly why the comment cites "focusing a field with a validation error").

Open question (real gap, not just theoretical): there is **no `aria-label` prop and no attribute pass-through** to the inner `<input>`. If a consumer omits `label` (e.g. wants a visually-labeled-elsewhere or icon-only field) and sets `aria-label="Foo"` directly on `<bs-input>`, that attribute stays on the host element — Stencil does not forward arbitrary host attributes into the shadow-internal `<input>` — so the accessible name is lost. Flag this to the team as a possible missing prop (`ariaLabel` or similar) rather than assuming a workaround; don't add stories/tests pretending it works.

## bs-modal

Source: `src/components/bs-modal/bs-modal.tsx`, `bs-modal.css`, existing story `bs-modal.stories.ts`

**Props:** `open` (mutable + reflected, default `false`), `heading?`, `size: 'sm'|'md'|'lg'` (default `md`). **Event:** `bsClose`. **State:** `hasFooter`. **Slots:** default (body), `footer`. **Parts:** `backdrop`, `dialog`, `header`, `close`, `body`, `footer`.

Coverage matrix:
- [ ] `open=false` → `render()` returns `null`; confirm nothing is in the shadow DOM at all (not just hidden via CSS) — no backdrop/dialog markup exists in the DOM while closed.
- [ ] `open=true` transition: `previouslyFocused` captures `document.activeElement` at the moment of the `false→true` edge (in `componentDidRender`), then `.focus()` is called on the dialog container (`tabIndex=-1`). Test: focus some element, programmatically set `open=true`, assert the dialog element becomes the active element.
- [ ] `open=true→false` transition (via `close()`, backdrop click, or Escape) restores focus to whatever `previouslyFocused` captured. Test explicitly with a real trigger button per the existing story's pattern (open via a `bs-button`, close via Escape/backdrop/close-button, assert the trigger regains focus) — this is the canonical "restore focus to trigger" scenario called out in the task.
- [ ] Escape key: `@Listen('keydown', { target: 'document' })` closes only when `this.open` is true — fire Escape while closed and assert no `bsClose` emitted / no error, since the listener is always attached regardless of `open` state.
- [ ] Backdrop click: `onBackdropClick` only closes when `ev.target === ev.currentTarget`, i.e. clicking the dialog itself (or its children) must **not** close the modal, only a click that lands directly on the backdrop div does. Test both: click on `part="backdrop"` closes; click on `part="dialog"` (or a child inside it) does not.
- [ ] Close button (`part="close"`, `aria-label="Close"`) click closes and emits `bsClose`.
- [ ] Focus trap mechanism (`@Listen('focusin', { target: 'document' })`): this does **not** enumerate/cycle first-and-last focusable elements like a conventional trap — it redirects any `focusin` whose `composedPath()` doesn't include the dialog element back onto the dialog container itself. Test this literally: while open, dispatch/fire `focusin` on an element outside the dialog (e.g. `document.body` or a sibling element) and assert focus is redirected back to the dialog element (`tabIndex=-1` container), not to any particular child. Note for the tester: **jsdom does not natively move focus on a Tab keypress** — there is no real browser tab-order simulation available, so "tab cycling" tests must manually fire `focusin` events on specific elements to simulate what a real Tab press would produce, rather than dispatching `keydown Tab` and expecting focus to move on its own.
- [ ] `heading` omitted: `aria-label={this.heading}` becomes `aria-label={undefined}` — the dialog has **no accessible name** at all in that case (no fallback to `aria-labelledby` pointing at the visible heading `<span>`, no default label). Flag as an open a11y gap: should `heading` be required, or should there be an `aria-labelledby` fallback? Not resolved here — write the story/test to document current (nameless) behavior, don't silently work around it.
- [ ] `size` sm/360px, md/560px, lg/800px — all three, plus explicitly a **narrow-viewport story** (e.g. Storybook viewport addon at ~375px width) with `size="lg"`: the dialog has no `max-width: 100vw`/responsive clamp, so an 800px dialog will overflow a narrow viewport. Flag as a real visual edge case worth a story, not assumed to already be handled.
- [ ] Footer slot presence: mirrors `bs-button`'s icon pattern — no footer content → `hasFooter=false`, `bs-modal__footer--visible` class absent (no border/padding); footer content present → class applied. Test both, plus dynamic add/remove via `slotchange`.
- [ ] Body content overflow: `.bs-modal__dialog` has `max-height: calc(100vh - var(--bs-spacing-800))` and `.bs-modal__body { overflow-y: auto }` — story with a long body (e.g. a long list) to confirm header/footer stay fixed and only the body scrolls.
- [ ] `role="dialog"` / `aria-modal="true"` present on the dialog part at all times while open.

Open question — **multiple simultaneously-open `bs-modal` instances are not guarded against**: both the Escape-key listener and the focusin trap operate per-instance against `document`, each checking only its own `this.open`/`this.dialogRef`. If two modals are open at once: (a) Escape closes *both* rather than just the topmost, and (b) each instance's focus trap will fight to redirect focus back to its own dialog whenever focus lands in the other modal. Flag explicitly to the team/developer: is stacking multiple open modals in scope at all (if not, no fix needed, just don't write a story implying it works), or does this need a "topmost modal only" guard? Do not silently add a workaround in stories/tests — call it out as unsupported.

## bs-data-table

Source: `src/components/bs-data-table/bs-data-table.tsx`, `bs-data-table.css`, existing story `bs-data-table.stories.ts`

**Props (JS-property-only for `columns`/`rows`/`cellRenderer` per CONVENTIONS.md — must be set via `el.columns = [...]`, never as an HTML attribute):**
`columns: BsDataTableColumn[]` (`{key, label, sortable?}`, default `[]`), `rows: BsDataTableRow[]` (`{id, ...}`, default `[]`), `sortColumn?: string`, `sortDirection: 'asc'|'desc'` (default `asc`), `selectable: boolean` (default `false`), `cellRenderer?: (row, column) => string`.
**Events:** `bsSort`, `bsRowSelect`. **State:** `selectedIds: Set` (internal only). **Parts:** `table`, `head`, `body`, `row`, `header-cell`, `cell`.

**Critical spec point developer/tester must not assume away:** the component does **not sort rows itself**. `onHeaderClick` only computes the next `direction` and emits `bsSort({column, direction})` — it never reorders `this.rows`. Sorting is entirely the consumer's responsibility (they must listen for `bsSort`, sort their own data, and pass back updated `rows`/`sortColumn`/`sortDirection` props). The current `Default` story only `console.log`s `bsSort` and never re-sorts — clicking a sortable header in Storybook today visibly does nothing to row order. This needs to be called out explicitly in the story's description/docs (and the dev picking up story work should fix the demo to actually re-sort on `bsSort`), and unit tests should assert `bsSort`'s payload/direction-toggle logic, **not** assert that rows reorder (they won't, by design).

Sort-direction toggle logic (exact, testable): clicking a sortable column computes `direction = (sortColumn === clicked.key && sortDirection === 'asc') ? 'desc' : 'asc'`. Consequences to test explicitly:
- [ ] Click an unsorted sortable column → emits `asc`.
- [ ] Click the same column again while `sortDirection` prop is `asc` → emits `desc`.
- [ ] Click the same column again while `sortDirection` prop is `desc` → emits `asc` (cycles asc↔desc only — there is **no third "unsorted/clear" state** reachable via clicking). Flag as a design point: some tables cycle asc→desc→none; this one doesn't. Not a bug, just document it so nobody writes a test expecting a clear state.
- [ ] Click a *different* sortable column while another column is currently sorted → always emits `asc` for the new column, regardless of the old column's direction.
- [ ] Click a non-sortable column (`sortable` falsy/absent) → no button rendered at all (plain text label), `onHeaderClick` returns early, no event emitted, `aria-sort` is `undefined` on that `<th>`.
- [ ] `aria-sort` values: `"ascending"`/`"descending"` only on the currently-`sortColumn`'d header; `"none"` on other *sortable* headers; `undefined` (attribute absent) on non-sortable headers.

Selection (`selectable=true`):
- [ ] Checking/unchecking a row checkbox emits `bsRowSelect({id, selected})` with the correct boolean, and the internal `selectedIds` Set updates the checkbox's `checked` state on re-render.
- [ ] **No select-all header checkbox exists** — the header's select column `<th>` is entirely empty (no checkbox, no label). Flag as open question: is bulk select-all in scope, or intentionally excluded from v1? Don't add it in stories/tests as if it exists.
- [ ] **No external selection control** — there is no `selectedIds`/`value` prop and no public method to programmatically pre-select or clear rows; selection lives entirely in unexported internal state, discoverable to the consumer only by listening to `bsRowSelect` and tracking it themselves. Flag as open question for the team: is a controlled-selection prop needed?
- [ ] Selection state is **not reset or pruned when `rows` changes** (no `@Watch('rows')`). If a consumer replaces `rows` with new data reusing the same `id` values, previously-selected ids remain checked after the swap. If an id is removed from `rows` then later reused by a different row, that new row could appear pre-checked. Flag as an explicit open question (not a fix) — does selection need to be tied to `rows` identity somehow, or is "persist by id across data reloads" the intended behavior?
- [ ] Row checkboxes have no `aria-label`/associated `<label>` tying them to row identity (e.g. "Select Amelia Torres") — flag as an a11y gap.

Cell rendering / value edge cases (default path, no `cellRenderer`): `String(row[column.key] ?? '')`.
- [ ] `null`/`undefined` cell value → renders empty string (not `"null"`/`"undefined"`).
- [ ] `0` and `false` → render as `"0"`/`"false"` (the `??` only catches null/undefined, not falsy-but-defined values) — explicitly test these aren't swallowed into empty strings.
- [ ] A plain object or array as a cell value → `String({...})`/`String([...])` produces `"[object Object]"` or a comma-joined array string — flag as a known, unfixed rendering edge case (not in scope to change, just confirm/document current output rather than assume something nicer happens).
- [ ] A cell value containing HTML-like text (e.g. `"<b>bold</b>"`) via the **default** (no-`cellRenderer`) path renders as literal text, not interpreted markup — this is a security-relevant assertion explicitly worth a unit test given the source comment about the "trusted function" model for `cellRenderer`.
- [ ] `cellRenderer` path uses `innerHTML` directly (intentionally unescaped/trusted, per source comment) — test that its output renders as real markup (e.g. `<button>` appears in the DOM), and separately note/flag that any inline event handlers a consumer might embed in that HTML string won't be wired up the way JSX event props would be (interactive `cellRenderer` content requires the consumer to attach event delegation on the table itself) — the existing `WithCustomCellRenderer` story's "Edit" button has no click handler at all, which is a good example to point at when writing docs about this limitation.

Structural edge cases:
- [ ] `rows=[]` (default) → renders header only, **no empty-state placeholder message** (no "No results" row). Confirm this is current/expected, don't add a placeholder story implying one exists.
- [ ] `columns=[]` with non-empty `rows` → each body `<tr>` renders with zero `<td>` (or just the checkbox `<td>` if `selectable`) — effectively invisible rows; worth a test confirming no crash, not a visual story.
- [ ] Large row count (e.g. 500–1000 generated rows) — no virtualization exists; a Storybook story at this scale is useful to visually confirm no crash/hang, but this is a performance observation, not something to "fix" as part of this work.
- [ ] `selectable=false` (default) → no checkbox column rendered at all, `bsRowSelect` never emitted, `selectedIds` state unused.

---

## Cross-component note (flag once, applies to badge/button/card/modal `size`/`variant`/`surface`/`type` props)

None of the enum-typed `@Prop`s (`variant`, `size`, `surface`, `type`) validate or fall back at runtime — they're only constrained by TypeScript types at compile time. A non-TS consumer (per CONVENTIONS.md's explicit multi-framework goal — React/Angular/Blazor/plain HTML) can set an attribute to any string value, producing a generated CSS class that matches nothing, resulting in silently unstyled output rather than a warning or safe fallback. This is consistent across all affected components, so it's called out once here rather than per-section — worth a single team decision (add a fallback-to-default guard vs. leave as-is) rather than five separate implementations.

---

### Files read to produce this spec
- `CONVENTIONS.md`
- `src/components/bs-badge/bs-badge.tsx`, `bs-badge.css`, `bs-badge.stories.ts`
- `src/components/bs-button/bs-button.tsx`, `bs-button.css`, `bs-button.stories.ts`, `bs-button.cmp.test.tsx`
- `src/components/bs-card/bs-card.tsx`, `bs-card.css`, `bs-card.stories.ts`
- `src/components/bs-input/bs-input.tsx`, `bs-input.css`, `bs-input.stories.ts`
- `src/components/bs-modal/bs-modal.tsx`, `bs-modal.css`, `bs-modal.stories.ts`
- `src/components/bs-data-table/bs-data-table.tsx`, `bs-data-table.css`, `bs-data-table.stories.ts`, `bs-data-table/readme.md`