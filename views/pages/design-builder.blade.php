@extends('layout.master')

@section('content')
@php
    $tokens = json_decode(file_get_contents(BASEPATH . 'source/data/design-tokens.json'), true);
    $customizeComponentData = json_decode($customizeAssets['data'] ?? 'null', true);
    $customizeTokenLibrary = json_decode($customizeAssets['tokenLibrary'] ?? 'null', true);
    $themePresetDefinitions = [
        ['id' => 'dark', 'label' => 'Dark Ember', 'path' => 'source/themes/dark.json'],
        ['id' => 'nordic-dawn', 'label' => 'Nordic Dawn', 'path' => 'source/themes/nordic-dawn.json'],
        ['id' => 'forest-mist', 'label' => 'Forest Mist', 'path' => 'source/themes/forest-mist.json'],
        ['id' => 'sunset-clay', 'label' => 'Sunset Clay', 'path' => 'source/themes/sunset-clay.json'],
        ['id' => 'ocean-ink', 'label' => 'Ocean Ink', 'path' => 'source/themes/ocean-ink.json'],
        ['id' => 'aurora-light', 'label' => 'Aurora Light', 'path' => 'source/themes/aurora-light.json'],
        ['id' => 'high-contrast', 'label' => 'High Contrast A11y', 'path' => 'source/themes/high-contrast.json'],
    ];
    $designBuilderPresets = [];
    foreach ($themePresetDefinitions as $themePresetDefinition) {
        $tokenOverrides = json_decode(file_get_contents(BASEPATH . $themePresetDefinition['path']), true);
        if (!is_array($tokenOverrides)) {
            continue;
        }

        $designBuilderPresets[] = [
            'id' => $themePresetDefinition['id'],
            'label' => $themePresetDefinition['label'],
            'token' => $tokenOverrides,
        ];
    }
@endphp

<div class="db-layout">
    {{-- Left: Token controls --}}
    <design-builder
        class="design-builder"
        mode="full-page"
        token-data='@json($tokens)'
        component-data='@json($customizeComponentData)'
        presets='@json($designBuilderPresets)'
        data-design-builder-storage="local-storage"
    >
        <noscript>
            <p>The Design Builder requires JavaScript to function.</p>
        </noscript>
    </design-builder>

    {{-- Draggable divider --}}
    <div class="db-divider" data-db-divider></div>

    {{-- Right: Live preview --}}
    <div class="db-preview">
        <div class="db-preview__inner">

            {{-- Hero --}}
            <div class="db-preview__section">
                @segment([
                    'title' => 'Welcome to the City',
                    'content' => 'A modern, accessible and inclusive digital experience built for everyone.',
                    'background' => 'primary',
                    'textColor' => 'light',
                    'height' => 'sm',
                    'hasPlaceholder' => false
                ])
                @endsegment
            </div>

            {{-- Cards --}}
            <div class="db-preview__section">
                <div class="o-container">
                    <div class="o-grid">
                        <div class="o-grid-6@md">
                            @card([
                                'heading' => 'Services',
                                'content' => 'Explore municipal services available to residents and businesses.',
                                'link' => '#',
                                'hasPlaceholder' => false
                            ])
                            @endcard
                        </div>
                        <div class="o-grid-6@md">
                            @card([
                                'heading' => 'News & Events',
                                'content' => 'Stay updated with the latest announcements and upcoming events.',
                                'link' => '#',
                                'hasPlaceholder' => false
                            ])
                            @endcard
                        </div>
                    </div>
                </div>
            </div>

            {{-- Buttons --}}
            <div class="db-preview__section">
                <div class="o-container">
                    <div class="db-preview__section--buttons">
                        @foreach(['sm', 'md', 'lg'] as $size)
                            
                            @typography(['element' => 'h3', 'variant' => 'h3'])
                                Button size: {{ $size }}
                            @endtypography
                            <div class="u-width--100">
                                @button(['text' => 'Primary', 'style' => 'filled', 'color' => 'primary', 'size' => $size])
                                @endbutton
                                @button(['text' => 'Secondary', 'style' => 'filled', 'color' => 'secondary', 'size' => $size])
                                @endbutton
                                @button(['text' => 'Default', 'style' => 'filled', 'color' => 'default', 'size' => $size])
                                @endbutton
                                @button(['text' => 'Primary', 'style' => 'outlined', 'color' => 'primary', 'size' => $size])
                                @endbutton
                                @button(['text' => 'Secondary', 'style' => 'outlined', 'color' => 'secondary', 'size' => $size])
                                @endbutton
                                @button(['text' => 'Default', 'style' => 'outlined', 'color' => 'default', 'size' => $size])
                                @endbutton
                                @button(['text' => 'Primary', 'style' => 'basic', 'color' => 'primary', 'size' => $size])
                                @endbutton
                                @button(['text' => 'Secondary', 'style' => 'basic', 'color' => 'secondary', 'size' => $size])
                                @endbutton
                                @button(['text' => 'Default', 'style' => 'basic', 'color' => 'default', 'size' => $size])
                                @endbutton
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- Notices --}}
            <div class="db-preview__section">
                <div class="o-container">
                    @notice(['type' => 'info', 'message' => ['text' => 'Information: Office hours have been updated.']])
                    @endnotice
                    @notice(['type' => 'success', 'message' => ['text' => 'Your application was submitted successfully.']])
                    @endnotice
                    @notice(['type' => 'warning', 'message' => ['text' => 'Maintenance scheduled for this weekend.']])
                    @endnotice
                    @notice(['type' => 'danger', 'message' => ['text' => 'Service temporarily unavailable.']])
                    @endnotice
                </div>
            </div>

            {{-- Form --}}
            <div class="db-preview__section">
                <div class="o-container">
                    @paper(['padding' => 4])
                        @form(['action' => '#', 'method' => 'GET'])
                            <div class="o-grid o-grid--half-gutter">
                                <div class="o-grid-12">
                                    @typography(['element' => 'h3', 'variant' => 'h3'])
                                        Contact Us
                                    @endtypography
                                </div>
                                <div class="o-grid-12">
                                    @field([
                                        'label' => 'Full Name',
                                        'name' => 'name',
                                        'type' => 'text',
                                        'placeholder' => 'Enter your name'
                                    ])
                                    @endfield
                                </div>
                                <div class="o-grid-12">
                                    @field([
                                        'label' => 'Email',
                                        'name' => 'email',
                                        'type' => 'text',
                                        'placeholder' => 'your@email.com',
                                        'isValid' => false,
                                    ])
                                    @endfield
                                </div>
                                <div class="o-grid-12">
                                    @field([
                                        'label' => 'Message',
                                        'name' => 'message',
                                        'multiline' => 3,
                                        'placeholder' => 'How can we help?'
                                    ])
                                    @endfield
                                </div>
                                <div class="o-grid-12">
                                    @button(['text' => 'Send Message', 'style' => 'filled', 'color' => 'primary'])
                                    @endbutton
                                </div>
                            </div>
                            @endform
                    @endpaper
                </div>
            </div>


            <div class="db-preview__section">
                <div class="o-container">
                    @form(['action' => '#', 'method' => 'GET'])
                    <div class="o-grid o-grid--half-gutter">
                        <div class="o-grid-12">
                            @typography(['element' => 'h3', 'variant' => 'h3'])
                                Contact Us
                            @endtypography
                        </div>
                        <div class="o-grid-12">
                            @field([
                                'label' => 'Full Name',
                                'name' => 'name',
                                'type' => 'text',
                                'placeholder' => 'Enter your name'
                            ])
                            @endfield
                        </div>
                        <div class="o-grid-12">
                            @field([
                                'label' => 'Email',
                                'name' => 'email',
                                'type' => 'text',
                                'placeholder' => 'your@email.com',
                                'classList' => ['is-invalid']
                            ])
                            @endfield
                        </div>
                        <div class="o-grid-12">
                            @field([
                                'label' => 'Message',
                                'name' => 'message',
                                'multiline' => 3,
                                'placeholder' => 'How can we help?'
                            ])
                            @endfield
                        </div>
                        <div class="o-grid-12">
                            @button(['text' => 'Send Message', 'style' => 'filled', 'color' => 'primary'])
                            @endbutton
                        </div>
                    </div>
                    @endform
                </div>
            </div>

            {{-- Typography --}}
            <div class="db-preview__section">
                <div class="o-container">
                    @paper(['padding' => 4])
                        @typography(['element' => 'h1', 'variant' => 'h1'])
                            Heading 1
                        @endtypography
                        @typography(['element' => 'h2', 'variant' => 'h2'])
                            Heading 2
                        @endtypography
                        @typography(['element' => 'h3', 'variant' => 'h3'])
                            Heading 3
                        @endtypography
                        @typography(['element' => 'h4', 'variant' => 'h4'])
                            Heading 4
                        @endtypography
                        @typography(['element' => 'p'])
                            Body text: The quick brown fox jumps over the lazy dog. This paragraph demonstrates the default body typography settings including font family, size, weight, and line height.
                        @endtypography
                    @endpaper
                </div>
            </div>

        </div>
    </div>
</div>

@if(isset($assets['manifest']['js/design-builder.js']))
    <script src="/assets/dist/{{ $assets['manifest']['js/design-builder.js'] }}" type="module"></script>
@endif
@endsection
