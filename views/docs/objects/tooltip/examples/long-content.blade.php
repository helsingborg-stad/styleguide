<div class="u-display--flex u-flex-direction--column u-gap--2">
    @typography(['variant' => 'body', 'element' => 'p'])
        Longer tooltip messages wrap inside the bubble. This example also uses tabindex so plain text can receive keyboard focus.
    @endtypography

    <span tabindex="0" data-tooltip="A slightly longer tooltip message that wraps within the tooltip bubble for readability.">
        Focusable text
    </span>
</div>