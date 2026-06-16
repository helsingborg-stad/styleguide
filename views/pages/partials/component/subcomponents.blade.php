@if(!empty($subcomponents ?? []))
    @divider(['size' => 'full', 'classList' => ['u-margin__top--6', 'u-margin__bottom--6']])
    @enddivider

    @typography(['variant' => 'h2', 'element' => 'h2', 'classList' => ['u-margin__bottom--2']])
        Subcomponents
    @endtypography

    @typography(['variant' => 'meta', 'element' => 'p', 'classList' => ['u-margin__bottom--3']])
        Child components for {{ $slug ?? 'this component' }}, including purpose and supported Blade parameters.
    @endtypography

    @foreach($subcomponents as $subcomponent)
        <section class="u-margin__bottom--4">
            @if(!$loop->first)
                @divider(['size' => 'full', 'classList' => ['u-margin__top--3', 'u-margin__bottom--3']])
                @enddivider
            @endif

            @typography([
                'variant' => 'h4',
                'element' => 'h3',
                'classList' => ['u-margin__bottom--1'],
                'attributeList' => [
                    'id' => $subcomponent['anchor'] ?? '',
                ],
            ])
                {{ $subcomponent['displayName'] ?? ($subcomponent['name'] ?? '') }}
            @endtypography

            @typography(['variant' => 'meta', 'element' => 'p', 'classList' => ['u-margin__bottom--2']])
                Blade directive: <code>{{ $subcomponent['directive'] ?? ('@' . ($subcomponent['slug'] ?? '') . '()') }}</code>
            @endtypography

            @if(!empty($subcomponent['purpose']))
                @typography(['variant' => 'body', 'element' => 'p', 'classList' => ['u-margin__bottom--2']])
                    {{ $subcomponent['purpose'] }}
                @endtypography
            @endif

            @php
                $renderView = static function (string $viewPath, array $viewData = []) use ($__env): string {
                    return $__env->make($viewPath, $viewData)->render();
                };

                $paramsTabContent = $renderView('pages.partials.component.subcomponent-parameters', ['subcomponent' => $subcomponent]);
                $bladeCodeTemplate = $renderView('layout.partials.doc.tab-code', ['language' => 'php']);
                $usageTabContent = str_replace('__CODE_PLACEHOLDER__', e((string) ($subcomponent['usageExample'] ?? '')), $bladeCodeTemplate);
            @endphp

            @paper(['padding' => 0])
                @tabs(['tabs' => [
                    ['title' => 'Parameters', 'content' => $paramsTabContent],
                    ['title' => 'Usage example', 'content' => $usageTabContent],
                ]])
                @endtabs
            @endpaper
        </section>
    @endforeach
@endif