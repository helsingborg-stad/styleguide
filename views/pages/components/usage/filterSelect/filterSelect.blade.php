@php 
$options = [];
    for ($i = 0; i <= 100; $i++) {
        $option = [
            'label' => 'Option' . $i;
            'value' => 'option-' . $i;
        ];
    $options[] = $option;
    }
@endphp
@filterSelect([
    'options' => $options,
    'attributeList' => ['style' => 'height: 400px']
])
@endfilterSelect