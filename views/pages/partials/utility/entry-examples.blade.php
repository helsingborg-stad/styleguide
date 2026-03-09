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

            @php
                $renderView = static function (string $viewPath, array $viewData = []) use ($__env): string {
                    return $__env->make($viewPath, $viewData)->render();
                };

                $exampleTabContent  = $__env->make($exampleView, get_defined_vars())->render();
                $htmlSourceCode     = e(\HbgStyleGuide\Helper\ParseString::tidyHtml($exampleTabContent));
                $htmlCodeTemplate   = $renderView('layout.partials.doc.tab-code', ['language' => 'html']);
                $htmlCodeTabContent = str_replace('__CODE_PLACEHOLDER__', $htmlSourceCode, $htmlCodeTemplate);
            @endphp

            @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
                @tabs(['tabs' => [
                    ['title' => 'Example', 'content' => $exampleTabContent],
                    ['title' => 'HTML',    'content' => $htmlCodeTabContent],
                ]])
                @endtabs
            @endpaper
        @endif
    @endforeach

@elseif($entryFormat && !empty($entryMods))
    @php
        $previewSelects = [];
        foreach ($entryMods as $modKey => $modValues) {
            $options = array_values(array_filter(array_map('trim', explode(',', $modValues))));
            if (!empty($options)) {
                $previewSelects[$modKey] = $options;
            }
        }
    @endphp

    @if(!empty($previewSelects))
        @typography(['variant' => 'h3', 'element' => 'h3', 'classList' => ['u-margin__top--4', 'u-margin__bottom--2']])
            Preview
        @endtypography

        @php
            $renderView = static function (string $viewPath, array $viewData = []) use ($__env): string {
                return $__env->make($viewPath, $viewData)->render();
            };

            $previewTabContent = $__env->make('pages.partials.utility.entry-examples-preview', get_defined_vars())->render();

            $cssFormat = e($entryFormat);
            $modifierOptions = [];
            foreach ($entryMods as $modValues) {
                foreach (array_values(array_filter(array_map('trim', explode(',', $modValues)))) as $option) {
                    $modifierOptions[] = $option;
                }
            }

            $cssLines = "/* Base class */\n{$cssFormat} {}\n\n/* Modifiers */\n";
            foreach ($modifierOptions as $option) {
                $cssLines .= "{$cssFormat}--" . e($option) . " {}\n";
            }

            $cssCodeTemplate   = $renderView('layout.partials.doc.tab-code', ['language' => 'css']);
            $cssCodeTabContent = str_replace('__CODE_PLACEHOLDER__', e($cssLines), $cssCodeTemplate);
        @endphp

        @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
            @tabs(['tabs' => [
                ['title' => 'Preview', 'content' => $previewTabContent],
                ['title' => 'CSS',     'content' => $cssCodeTabContent],
            ]])
            @endtabs
        @endpaper

    @endif
@endif
