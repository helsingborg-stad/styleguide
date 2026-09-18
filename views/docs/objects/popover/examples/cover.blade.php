<div class="u-display--flex u-flex-direction--column u-gap--2">
    <p>Click on the trigger to show a popover that covers the full viewport.</p>

    <button popovertarget="popover-cover" type="button">
        Open cover popover
    </button>

    <div id="popover-cover" popover data-js-popover-cover style="background: rgba(0, 0, 0, 0.5);">
        <div style="min-height: 100%; display: grid; place-items: center; padding: 2rem; box-sizing: border-box;">
            <div style="width: min(100%, 32rem); background: white; padding: 1rem; border-radius: 0.5rem;">
                <p>This popover covers the whole page.</p>
            </div>
        </div>
    </div>
</div>
