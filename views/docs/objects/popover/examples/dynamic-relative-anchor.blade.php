<div class="u-display--flex u-flex-direction--column u-gap--2">
    <p>This popover starts at the first anchor. Use the button to switch between both anchors.</p>

    <div class="u-display--flex u-gap--2">
        <button popovertarget="popover-dynamic-anchor" type="button">
            Open popover
        </button>

        <button id="switch-anchor" type="button">
            Switch anchor
        </button>
    </div>

    <div id="first-anchor" data-js-popover-relative="popover-dynamic-anchor" style="margin-right: auto;">
        First anchor
    </div>

    <div id="second-anchor" style="margin-top: 3rem; margin-right: auto;">
        Second anchor
    </div>

    <div
        id="popover-dynamic-anchor"
        popover
        data-js-popover-relative="true"
        data-js-popover-horizontal-placement="left"
        data-js-popover-vertical-placement="bottom"
        style="background-color: orange;"
    >
        <p>This popover starts at the first anchor. Use the button to switch between both anchors.</p>
    </div>
</div>

<script>
document.addEventListener('popover:initialized', (event) => {
    const popover = event.detail.popover;

    if (popover.getPopoverData().id !== 'popover-dynamic-anchor') {
        return;
    }

    const firstAnchor = document.getElementById('first-anchor');
    const secondAnchor = document.getElementById('second-anchor');
    const switchAnchorButton = document.getElementById('switch-anchor');

    if (!firstAnchor || !secondAnchor || !switchAnchorButton) {
        return;
    }

    let currentAnchor = firstAnchor;
    const popoverData = popover.getPopoverData();
    const popoverElement = popoverData.popoverElement;

    const syncSwitchButtonInvoker = () => {
        if (popoverElement.matches(':popover-open')) {
            switchAnchorButton.setAttribute('popovertarget', popoverData.id);
            switchAnchorButton.setAttribute('popovertargetaction', 'show');
            return;
        }

        switchAnchorButton.removeAttribute('popovertarget');
        switchAnchorButton.removeAttribute('popovertargetaction');
    };

    popoverElement.addEventListener('toggle', syncSwitchButtonInvoker);
    syncSwitchButtonInvoker();

    switchAnchorButton.addEventListener('click', () => {
        currentAnchor = currentAnchor === firstAnchor ? secondAnchor : firstAnchor;
        popover.setRelativeElement(currentAnchor);
    });
});
</script>
