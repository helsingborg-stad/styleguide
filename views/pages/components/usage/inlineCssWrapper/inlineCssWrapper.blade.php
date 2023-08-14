@typography([
    'element' => 'h2',
    'classList' => ['u-margin__bottom--2']
])
With styling parameter.
@endtypography
@inlineCssWrapper([
    'styles' => [
        'padding' => '8px',
        'background-color' => 'blue',
        'border-radius' => '100%',
        'display' => 'inline-flex'
    ]
])
@icon([
    'icon' => 'restaurant',
    'size' => 'xl',
    'color' => 'primary',
])
@endicon
@endinlineCssWrapper

@typography([
    'element' => 'h2',
    'classList' => ['u-margin__bottom--2']
])
Without styling parameter.
@endtypography
@inlineCssWrapper([
])
@icon([
    'icon' => 'restaurant',
    'size' => 'xl',
    'color' => 'primary',
])
@endicon
@endinlineCssWrapper
@alert([
    'title' => 'title',
    'dismiss' => 'dismiss',
    'accept' => 'accept'
])
This is the main content
@endalert