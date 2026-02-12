@extends('layout.master')

@section('content')
@php
    $tokens = json_decode(file_get_contents(BASEPATH . 'source/data/design-tokens.json'), true);
@endphp

<div class="db-layout">
    {{-- Left: Token controls --}}
    <div class="design-builder" data-design-builder data-tokens='@json($tokens)'>
        <noscript>
            <p>The Design Builder requires JavaScript to function.</p>
        </noscript>
    </div>

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
                        @button(['text' => 'Primary', 'style' => 'filled', 'color' => 'primary'])
                        @endbutton
                        @button(['text' => 'Secondary', 'style' => 'filled', 'color' => 'secondary'])
                        @endbutton
                        @button(['text' => 'Outlined', 'style' => 'outlined', 'color' => 'primary'])
                        @endbutton
                        @button(['text' => 'Default', 'style' => 'basic', 'color' => 'default'])
                        @endbutton
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
                        @typography(['element' => 'h3', 'variant' => 'h3'])
                            Contact Us
                        @endtypography
                        @field([
                            'label' => 'Full Name',
                            'name' => 'name',
                            'type' => 'text',
                            'placeholder' => 'Enter your name'
                        ])
                        @endfield
                        @field([
                            'label' => 'Email',
                            'name' => 'email',
                            'type' => 'text',
                            'placeholder' => 'your@email.com'
                        ])
                        @endfield
                        @field([
                            'label' => 'Message',
                            'name' => 'message',
                            'multiline' => 3,
                            'placeholder' => 'How can we help?'
                        ])
                        @endfield
                        @button(['text' => 'Send Message', 'style' => 'filled', 'color' => 'primary'])
                        @endbutton
                    @endpaper
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

{{-- Builder-specific assets (excluded from global Asset loading) --}}
@if(isset($assets['manifest']['css/design-builder.css']))
    <link rel="stylesheet" href="/assets/dist/{{ $assets['manifest']['css/design-builder.css'] }}">
@endif
@if(isset($assets['manifest']['js/design-builder.js']))
    <script src="/assets/dist/{{ $assets['manifest']['js/design-builder.js'] }}" type="module"></script>
@endif
@endsection
