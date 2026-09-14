<div class="u-display--flex u-flex-direction--column u-gap--2">
    <p>This example shows the supported native trigger actions for popovers.</p>

    <div class="u-display--flex u-gap--2 u-flex-wrap--wrap">
        <button popovertarget="popover-actions" popovertargetaction="show" type="button">
            Open
        </button>

        <button popovertarget="popover-actions" popovertargetaction="hide" type="button">
            Close
        </button>

        <button popovertarget="popover-actions" popovertargetaction="toggle" type="button">
            Toggle
        </button>
    </div>

    <div id="popover-actions" popover>
        <p>This popover is controlled by native attributes.</p>
    </div>
</div>
