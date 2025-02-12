@php
    $modals = [
        'standard' => [
            'isPanel' => false,
            'overlay' => 'light',
            'navigation' => true,
        ],
        'small' => [
            'size' => 'sm',
            'padding' => 2,
            'borderRadius' => 'lg',
        ],
        'medium' => [
            'size' => 'md',
            'padding' => 3,
            'borderRadius' => 'md',
        ],
        'large' => [
            'size' => 'lg',
            'padding' => 4,
            'borderRadius' => 'sm',
        ],
        'panel' => [
            'isPanel' => true,
            'animation' => 'slide-up',
            'padding' => 0,
        ],
    ];
@endphp

<div style="display: grid; gap: 16px; justify-content: start;  grid-template-columns: 1fr 1fr;">
    @foreach ($modals as $key => $modal)
        @button([
            'href' => '',
            'type' => 'filled',
            'text' => 'Open ' . $key . ' modal',
            'icon' => 'favorite',
            'size' => 'md',
            'color' => 'secondary',
            'classList' => ['open-modal', 'u-margin__left--0'],
            'attributeList' => ['data-open' => 'modal-' . $key],
        ])
        @endbutton
    @endforeach
</div>


@foreach ($modals as $key => $modal)
    @modal(
        array_merge(
            [
                'closeButtonText' => 'Close',
                'heading' => 'Example modal ' . $key,
                'id' => 'modal-' . $key
            ],
            (array) $modal
        )
    )
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Nullam
        quis risus eget urna mollis ornare vel eu leo. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum
        nibh, ut fermentum massa justo sit amet risus.

        @slot('bottom')
            [Bottom slot]
        @endslot
    @endmodal
@endforeach