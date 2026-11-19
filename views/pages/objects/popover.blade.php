@extends('layout.containers.doc')

@section('doc-content')
<article>
  @markdown([])
    #Popover
    The popover object documents the native HTML element and attribute based API for popovers.
    The examples below use normal elements and attributes such as `popovertarget`, `popovertargetaction`, `popover`, and the styleguide placement attributes.

    ## Change the relative element at runtime

    The `popover:initialized` event exposes the popover instance as `event.detail.popover`. Call `setRelativeElement()` with an `HTMLElement` to replace the current `relativeElement`; the method updates the popover data and repositions immediately. Pass `null` to stop using a relative element and return to viewport positioning.

    ```js
    document.addEventListener('popover:initialized', (event) => {
      const popover = event.detail.popover;

      if (popover.getPopoverData().id !== 'popover-example') {
        return;
      }

      const firstAnchor = document.getElementById('first-anchor');
      const secondAnchor = document.getElementById('second-anchor');
      const switchAnchorButton = document.getElementById('switch-anchor');
      let currentAnchor = firstAnchor;

      switchAnchorButton?.addEventListener('click', () => {
        if (!firstAnchor || !secondAnchor) {
          return;
        }

        currentAnchor = currentAnchor === firstAnchor ? secondAnchor : firstAnchor;
        popover.setRelativeElement(currentAnchor);
      });
    });
    ```

    Register the event listener before the popover is initialized. The positioner assigns the generated anchor name (`--<popover id>`) to the selected element; it does not select an existing CSS anchor name. `setRelativeElement()` clears that generated name from the previously selected element, updates the reference, and repositions, so the example can switch between both anchors without extra cleanup.
  @endmarkdown
    @doc(['viewDoc' => ['type' => 'objects', 'root' => 'popover', 'config' => 'Popover']])
    @enddoc
</article>
@stop
