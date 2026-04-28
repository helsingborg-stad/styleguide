@php
    $items = $items ?? [];
    $classList = $classList ?? [];
    $attributeList = $attributeList ?? [];
@endphp

@php
    $classes = array_merge(['l-docs--sidebar', 'c-sidebar', 'c-sidebar--fixed', 'u-border__right--1', 'u-color--surface'], $classList);
@endphp

<aside class="{{ implode(' ', $classes) }}" @foreach($attributeList as $attrKey => $attrVal) {{ $attrKey }}="{{ $attrVal }}" @endforeach>
    <div class="c-sidebar__inner">
        <div class="c-sidebar__brand u-padding--3 u-border__bottom--1 u-text-align--center">
            @link(['href' => '/', 'classList' => ['u-display-block']])
                @logotype([
                    'src'=> '/assets/img/logotype.svg',
                    'alt' => 'Go to homepage',
                    'classList' => ['c-header__logotype']
                ])
                @endlogotype
            @endlink
        </div>
        <div class="u-padding--3">
            @nav([
                'items' => $items,
                'direction' => 'vertical',
                'classList' => ['u-display--block'],
                'includeToggle' => true,
                'indentSubLevels' => true,
            ])
            @endnav
        </div>
    </div>
</aside>
