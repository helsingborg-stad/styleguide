@if(!empty($entryExamples))
    @typography(['variant' => 'h3', 'element' => 'h3', 'classList' => ['u-margin__top--4', 'u-margin__bottom--2']])
        Examples
    @endtypography

    @foreach($entryExamples as $example)
        @php
            $exampleView        = is_string($example) ? $example : ($example['view'] ?? null);
            $exampleCss         = is_array($example['css'] ?? null) ? $example['css'] : [];
            $exampleTitle       = is_string($example['title'] ?? null) ? $example['title'] : null;
            $exampleDescription = is_string($example['description'] ?? null) ? $example['description'] : null;
        @endphp

        @if($exampleTitle || $exampleDescription)
            <article class="u-margin__bottom--2 u-margin__top--4">
                @if($exampleTitle)
                    @typography(['variant' => 'h4', 'element' => 'h4'])
                        {{ $exampleTitle }}
                    @endtypography
                @endif
                @if($exampleDescription)
                    @typography(['variant' => 'body', 'element' => 'p'])
                        {{ $exampleDescription }}
                    @endtypography
                @endif
            </article>
        @endif

        @if($exampleView)
            @foreach($exampleCss as $cssUrl)
                <link rel="stylesheet" href="{{ $cssUrl }}">
            @endforeach

            @paper(['padding' => 3, 'classList' => ['u-margin__bottom--4']])
                @include($exampleView)
            @endpaper
        @endif
    @endforeach
@endif
