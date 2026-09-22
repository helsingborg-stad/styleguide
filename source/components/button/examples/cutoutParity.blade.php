<div class="u-display--flex u-flex-direction--column u-gap--2" data-cutout-parity style="color: var(--color--surface-contrast);">
    <div data-cutout-case="short" style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--base);">
        @button(['text' => 'Short', 'style' => 'filled', 'color' => 'primary', 'attributeList' => ['data-cutout-role' => 'standard']])
        @endbutton
        @button(['text' => 'Short', 'style' => 'filled', 'color' => 'inherit', 'attributeList' => ['data-cutout-role' => 'cutout']])
        @endbutton
    </div>

    <div data-cutout-case="icon-after" style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--base);">
        @button(['text' => 'Continue', 'icon' => 'arrow_forward', 'style' => 'filled', 'color' => 'primary', 'attributeList' => ['data-cutout-role' => 'standard']])
        @endbutton
        @button(['text' => 'Continue', 'icon' => 'arrow_forward', 'style' => 'filled', 'color' => 'inherit', 'attributeList' => ['data-cutout-role' => 'cutout']])
        @endbutton
    </div>

    <div data-cutout-case="icon-before" style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--base);">
        @button(['text' => 'Back', 'icon' => 'arrow_back', 'reversePositions' => true, 'style' => 'filled', 'color' => 'primary', 'attributeList' => ['data-cutout-role' => 'standard']])
        @endbutton
        @button(['text' => 'Back', 'icon' => 'arrow_back', 'reversePositions' => true, 'style' => 'filled', 'color' => 'inherit', 'attributeList' => ['data-cutout-role' => 'cutout']])
        @endbutton
    </div>

    <div data-cutout-case="icon-sm" style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--base);">
        @button(['text' => 'Small', 'icon' => 'arrow_forward', 'size' => 'sm', 'style' => 'filled', 'color' => 'primary', 'attributeList' => ['data-cutout-role' => 'standard']])
        @endbutton
        @button(['text' => 'Small', 'icon' => 'arrow_forward', 'size' => 'sm', 'style' => 'filled', 'color' => 'inherit', 'attributeList' => ['data-cutout-role' => 'cutout']])
        @endbutton
    </div>

    <div data-cutout-case="icon-md" style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--base);">
        @button(['text' => 'Medium', 'icon' => 'arrow_forward', 'size' => 'md', 'style' => 'filled', 'color' => 'primary', 'attributeList' => ['data-cutout-role' => 'standard']])
        @endbutton
        @button(['text' => 'Medium', 'icon' => 'arrow_forward', 'size' => 'md', 'style' => 'filled', 'color' => 'inherit', 'attributeList' => ['data-cutout-role' => 'cutout']])
        @endbutton
    </div>

    <div data-cutout-case="icon-lg" style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--base);">
        @button(['text' => 'Large', 'icon' => 'arrow_forward', 'size' => 'lg', 'style' => 'filled', 'color' => 'primary', 'attributeList' => ['data-cutout-role' => 'standard']])
        @endbutton
        @button(['text' => 'Large', 'icon' => 'arrow_forward', 'size' => 'lg', 'style' => 'filled', 'color' => 'inherit', 'attributeList' => ['data-cutout-role' => 'cutout']])
        @endbutton
    </div>

    <div data-cutout-case="long" style="display: flex; flex-wrap: wrap; align-items: center; gap: var(--base);">
        @button(['text' => 'A longer label that verifies the component keeps its normal padding and width', 'style' => 'filled', 'color' => 'primary', 'attributeList' => ['data-cutout-role' => 'standard']])
        @endbutton
        @button(['text' => 'A longer label that verifies the component keeps its normal padding and width', 'style' => 'filled', 'color' => 'inherit', 'attributeList' => ['data-cutout-role' => 'cutout']])
        @endbutton
    </div>

    <div data-cutout-case="ellipsis" style="display: grid; gap: var(--base); grid-template-columns: repeat(2, minmax(0, 15rem));">
        @button(['text' => 'A deliberately long label that must truncate with an ellipsis at this width', 'fullWidth' => true, 'style' => 'filled', 'color' => 'primary', 'attributeList' => ['data-cutout-role' => 'standard']])
        @endbutton
        @button(['text' => 'A deliberately long label that must truncate with an ellipsis at this width', 'fullWidth' => true, 'style' => 'filled', 'color' => 'inherit', 'attributeList' => ['data-cutout-role' => 'cutout']])
        @endbutton
    </div>
</div>
