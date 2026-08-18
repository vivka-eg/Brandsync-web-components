// Loaded by BsModal.razor via IJSRuntime.InvokeAsync<IJSObjectReference>('import', './bsModalInterop.js').

export function setOpen(element, isOpen) {
  element.open = isOpen;
}

// dotNetRef is a DotNetObjectReference passed from C#; `onClose` must be a [JSInvokable] method
// on the calling component.
export function addCloseListener(element, dotNetRef) {
  element.addEventListener('bsClose', () => {
    dotNetRef.invokeMethodAsync('OnBsClose');
  });
}
