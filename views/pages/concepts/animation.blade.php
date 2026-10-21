@extends('layout.containers.doc')

@section('doc-content')
    @breadcrumb([
        'classList' => ['u-margin__bottom--3'],
        'list' => [
            ['href' => '/', 'label' => 'Home'],
            ['href' => '/concepts', 'label' => 'Concepts'],
            ['label' => 'Animation'],
        ]
    ])
    @endbreadcrumb

    @php
        $motionCurve = 'var(--ease-out)';
        $motionCode = <<<'CSS'
.c-popover {
    transform-origin: top center;
    animation: popover-enter var(--duration-180) var(--ease-out) both;
}

@keyframes popover-enter {
    from { opacity: 0; transform: translateY(-0.25rem) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}
CSS;
        $reducedMotionCode = <<<'CSS'
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 1ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 1ms !important;
    }
}
CSS;
    @endphp

    @typography(['element' => 'h1', 'variant' => 'h1', 'classList' => ['u-margin__bottom--2']])
        Animation
    @endtypography

    @typography(['element' => 'p', 'variant' => 'lead', 'classList' => ['u-margin__bottom--4']])
        Motion should make an interface easier to read: acknowledge an action, show where a change came from, or preserve context while the interface changes. If it does none of those things, leave it still.
    @endtypography

    @notice([
        'type' => 'info',
        'message' => [
            'text' => 'Start with the state change, then add the smallest amount of motion needed to explain it. Motion must never delay input, hide information, or be the only way to understand a result.',
        ],
        'classList' => ['u-margin__bottom--6'],
    ])
    @endnotice

    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
        The three jobs of motion
    @endtypography

    <div class="o-grid o-grid--large u-margin__bottom--6">
        <div class="o-grid-12 o-grid-4@md">
            @card(['heading' => 'Confirm input', 'content' => 'A press state, selected option, or saved toast confirms that the system received the action. Keep it immediate and short.'])
            @endcard
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @card(['heading' => 'Connect states', 'content' => 'Menus, panels, and reordered content should make their origin or destination legible, so people do not have to re-orient themselves.'])
            @endcard
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @card(['heading' => 'Direct attention', 'content' => 'Use motion sparingly for a meaningful new result. Do not animate every item competing for attention on a busy screen.'])
            @endcard
        </div>
    </div>

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--6']])
        @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
            Decide before you animate
        @endtypography
        @listing(['list' => [
            ['label' => 'What changed, and does the change need help being understood?'],
            ['label' => 'Can the motion follow the user’s input or a visible source element?'],
            ['label' => 'Will the final state be usable immediately for mouse, keyboard, and assistive-technology users?'],
            ['label' => 'Is the same information clear when motion is reduced or absent?'],
        ], 'elementType' => 'ol'])
        @endlisting
    @endpaper

    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
        Timing and easing
    @endtypography

    @paper(['padding' => 0, 'classList' => ['u-margin__bottom--3']])
        @table(['headings' => ['Interaction', 'Duration', 'Use it for'], 'list' => [
            ['columns' => ['Press feedback', '100–160ms', 'Small scale, elevation, or color feedback while a control is pressed.']],
            ['columns' => ['Popover or tooltip', '125–200ms', 'A compact layer appearing near the control that opened it.']],
            ['columns' => ['Menu or select', '150–250ms', 'A spatial relationship that should be noticed but not hold up selection.']],
            ['columns' => ['Dialog or drawer', '200–300ms', 'A larger context shift; keep the path short and the final focus ready.']],
        ], 'includePaper' => false])
        @endtable

    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__top--3', 'u-margin__bottom--0']])
        Use the shared duration tokens (<code>--duration-100</code>, <code>--duration-120</code>, <code>--duration-160</code>, <code>--duration-180</code>, and <code>--duration-300</code>) instead of one-off values. Use <code>--ease-out</code> when an element enters or settles, and <code>--ease-fade-out</code> for a deliberate fade-out.
    @endtypography
    @endpaper

    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--6']])
        Prefer a quick ease-out curve for elements entering their resting state: <code>{{ $motionCurve }}</code>. It feels responsive because most of the distance is covered early. Use linear timing only when something is intentionally continuous, such as a progress indicator.
    @endtypography

    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
        Live patterns
    @endtypography

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--3']])
        @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
            Press feedback
        @endtypography
        @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
            Press the existing Button component. Its response should be immediate, subtle, and end exactly at its resting position; it is confirmation, not a loading indicator.
        @endtypography
        @button(['text' => 'Save changes', 'style' => 'filled', 'color' => 'primary'])
        @endbutton
    @endpaper

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--3']])
        @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
            Origin-aware reveal
        @endtypography
        @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
            This uses the existing Popover and Card components. Its compact entry stays connected to the trigger, so new actions do not appear from nowhere.
        @endtypography
        @button(['text' => 'More actions', 'style' => 'outlined', 'color' => 'primary', 'attributeList' => ['popovertarget' => 'animation-guideline-actions']])
        @endbutton
        @popover(['id' => 'animation-guideline-actions', 'horizontalPlacement' => 'left', 'verticalPlacement' => 'bottom', 'relative' => true, 'animation' => 'fade'])
            @element(['attributeList' => ['style' => 'width: 20rem']])
                @card(['heading' => 'Actions', 'content' => 'Edit settings, duplicate item, or archive item.'])
                @endcard
            @endelement
        @endpopover
    @endpaper

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--3']])
        @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
            Expand content in place
        @endtypography
        @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
            Use the Accordion component when content should remain connected to its heading. The control already provides focus behavior and an explicit expanded state.
        @endtypography
        @accordion(['list' => [[
            'heading' => 'Motion checklist',
            'content' => 'Keep the final state available immediately, preserve focus, and make the outcome understandable without relying on the transition.',
        ]]])
        @endaccordion
    @endpaper

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--6']])
        @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
            Result, not spectacle
        @endtypography
        @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
            A Toast communicates a completed result in text first. If it enters, travel only a small distance and do not dismiss it before someone can read it.
        @endtypography
        <div style="min-height: 7rem; position: relative;">
            @toast(['position' => 'top-right', 'attributeList' => ['style' => 'position: absolute;']])
                @toast__item(['type' => 'success', 'message' => ['text' => 'Changes saved. Your preferences are up to date.'], 'dismissable' => 'immediate', 'icon' => ['name' => 'check', 'size' => 'md', 'color' => 'white']])
                @endtoast__item
            @endtoast
        </div>
    @endpaper

    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
        Implementation recipes
    @endtypography

    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--3']])
        @typography(['element' => 'h3', 'variant' => 'h3', 'classList' => ['u-margin__bottom--1']])
            Enter a nearby layer
        @endtypography
        @code(['language' => 'css', 'content' => $motionCode])
        @endcode
    @endpaper

    <div class="o-grid o-grid--large u-margin__bottom--6">
        <div class="o-grid-12 o-grid-4@md">
            @card(['heading' => 'Animate cheap properties', 'content' => 'Prefer opacity and transform. Avoid animating layout dimensions, large blurs, and transition: all.'])
            @endcard
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @card(['heading' => 'Match exit to intent', 'content' => 'Exit motion can be faster than entry because the person initiated it. Do not make close actions wait for a long animation.'])
            @endcard
        </div>
        <div class="o-grid-12 o-grid-4@md">
            @card(['heading' => 'Do not create a fake delay', 'content' => 'Do not delay navigation, focus, selection, or validation just to let motion finish. UI state changes immediately.'])
            @endcard
        </div>
    </div>

    @typography(['element' => 'h2', 'variant' => 'h2', 'classList' => ['u-margin__bottom--2']])
        Reduced motion is the baseline fallback
    @endtypography
    @typography(['element' => 'p', 'variant' => 'body', 'classList' => ['u-margin__bottom--2']])
        Respect the operating-system preference. Keep the final state, focus management, and written feedback exactly the same; remove the travel and timing. Do not use motion as the only confirmation that something happened.
    @endtypography
    @paper(['padding' => 4, 'classList' => ['u-margin__bottom--4']])
        @code(['language' => 'css', 'content' => $reducedMotionCode])
        @endcode
    @endpaper
    @notice(['type' => 'success', 'message' => ['text' => 'Review checklist: motion has a purpose, finishes quickly, preserves focus and readable text, uses transform or opacity where possible, and remains understandable with reduced motion enabled.']])
    @endnotice
@stop
