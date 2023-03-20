@filterSelect([
    'options' => ['option-1' => 'Option 1', 'option-2' => 'Option 2', 'option-3' => 'Option 3', 'option-4' => 'Option 4', 'option-5' => 'Option 5', 'option-6' => 'Option 6'],
    'attributeList' => ['style' => 'height: 400px'],
    'placeholder' => 'Options with custom keys/values'
])
@endfilterSelect
@filterSelect([
    'options' => ['option-1', 'option-2', 'option-3', 'option-4', 'option-5', 'option-6'],
    'attributeList' => ['style' => 'height: 400px'],
    'placeholder' => 'Options without keys'
])
@endfilterSelect
@filterSelect([
    'options' => HbgStyleGuide\Helper\MockupArrays::optionsList(['value'], 101),
    'attributeList' => ['style' => 'height: 400px'],
    'placeholder' => 'A lot of options'
])
@endfilterSelect
