@foreach(['sm', 'md', 'lg'] as $size)
    <div style="min-height: 100px">
        @form([
            'method' => 'GET',
            'action' => '?q=select-single'
        ])
            @select([
                'label' => 'Select Single Name',
                'hideLabel' => true,
                'placeholder' => "Placeholder in single ",
                'required' => false,

                'size' => $size,
                'options' => [
                    'key'   => 'Option One',
                    'key1'  => 'Option Two',
                    'key2'  => 'Option Three',
                    'key3'  => 'Option & Four',
                ]
            ])
            @endselect
        @endform
    </div>
@endforeach