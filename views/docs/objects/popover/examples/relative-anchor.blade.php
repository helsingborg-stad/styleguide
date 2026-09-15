<div class="u-display--flex u-flex-direction--column u-gap--2">
    <p>This example positions the popover relative to a separate anchor element.</p>

    <button popovertarget="popover-relative-anchor" type="button">
        Open anchored popover
    </button>

    <div data-js-popover-relative="popover-relative-anchor" class="u-display--inline-flex">
        <span>Anchor element</span>
    </div>

    <div
        id="popover-relative-anchor"
        popover
        data-js-popover-relative="true"
        data-js-popover-horizontal-placement="right"
        data-js-popover-vertical-placement="bottom"
    >
        <p>This popover is placed relative to the anchor element instead of the trigger.</p>
    </div>
</div>
