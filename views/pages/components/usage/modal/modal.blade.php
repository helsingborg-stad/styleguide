@php
    $modals = [
        'standard' => [
            'isPanel' => false,
            'overlay' => 'light',
            'navigation' => true
        ],
        'small' => [
            'size' => 'sm',
            'padding' => 2,
            'borderRadius' => 'lg'
        ],
        'medium' => [
            'size' => 'md',
            'padding' => 3,
            'borderRadius' => 'md'
        ],
        'large' => [
            'size' => 'lg',
            'padding' => 4,
            'borderRadius' => 'sm'
        ],
        'panel' => [
            'isPanel' => true,
            'animation' => 'slide-up',
            'padding' => 0
        ],
    ];
@endphp

@foreach($modals as $key => $modal)

    @button(
            [
                'href' => '',
                'type' => 'filled',
                'text' => 'Open ' . $key . ' modal',
                'icon' => 'favorite',
                'size' => 'md',
                'color' => 'secondary',
                'reverseIcon' => true,
                'attributeList' => ['data-open' => 'modal-' . $key]
            ]
        )
    @endbutton

    @modal(array_merge([
            'heading'=> "Example modal " . $key,
            'id'=> 'modal-' . $key
        ], (array) $modal))
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Nullam quis risus eget urna mollis ornare vel eu leo. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.

        @slot('top')
            [Top slot]
        @endslot

        @slot('bottom')
            [Bottom slot]
        @endslot
    @endmodal

@endforeach

