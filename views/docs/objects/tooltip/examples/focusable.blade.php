<div class="u-display--flex u-flex-direction--column u-gap--2">
    @typography(['variant' => 'body', 'element' => 'p'])
        This example uses a native button so the tooltip appears on both hover and keyboard focus.
    @endtypography

    <button type="button" class="c-button c-button--filled c-button--primary" data-tooltip="Shown on hover and focus">
        Focusable trigger
    </button>
</div>