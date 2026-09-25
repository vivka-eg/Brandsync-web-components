# Consuming `@brandsync/wc` from Blazor / MudBlazor

Unlike React and Angular, Blazor has no Stencil output target that auto-generates a wrapper. Every
`<bs-*>` element works in a `.razor` page exactly like any other HTML tag for the parts that are plain
HTML attributes (strings/numbers/booleans) — no interop needed at all:

```razor
<bs-button variant="primary" size="md">Book room</bs-button>
```

Interop is only needed for the two cases plain attributes can't cover, which is true in every framework,
not just Blazor (see `CONVENTIONS.md` in the repo root): **non-string properties** (arrays/objects/functions,
e.g. `bs-data-table`'s `columns`/`rows`) and **listening to a component's custom events**
(e.g. `bs-dialog`'s `bsClose`). `BsDialog.razor` in this folder is a worked example of both, because
`bs-dialog` needs a non-attribute property (none here, but demonstrates the event side) and a custom event.

## The two interop primitives

1. **Setting a JS property from C#** — call a small JS function via `IJSRuntime.InvokeVoidAsync`, passing
   the element reference (via an `ElementReference` + `getElementByRef`, or a `document.querySelector`
   inside the JS helper) and the value.
2. **Listening to a custom event from C#** — `element.addEventListener('bsClose', ...)` in JS, which then
   calls back into C# via `DotNetObjectReference` and `[JSInvokable]`.

`bsDialogInterop.js` implements both; `BsDialog.razor` shows the Razor side wiring them up.

## What doesn't need any of this

Setting `variant`, `size`, `disabled`, `heading` — plain attributes, works natively, zero JS:

```razor
<bs-dialog heading="Confirm booking" size="md" @ref="_dialogRef">
    <p>Meeting Room 4B, 2:00pm - 3:00pm.</p>
</bs-dialog>
```

The interop layer below only kicks in for opening/closing it programmatically and reacting to its
`bsClose` event.
