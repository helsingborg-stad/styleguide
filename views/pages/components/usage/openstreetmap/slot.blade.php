@openStreetMap([
    'pins' => [['lat' => '56.036647', 'lng' => '12.713098', 'icon' => ['icon' => 'restaurant', 'backgroundColor' => '#ffc1cc'], 'tooltip' => ['title' => 'A title', 'direction' => ['url' => '#s', 'label' => 'Label for the location']]], ['lat' => '56.046029', 'lng' => '12.693904', 'icon' => ['icon' => 'anchor', 'backgroundColor' => '#008000'], 'tooltip' => ['title' => 'A title', 'direction' => ['url' => '#', 'label' => 'Label for the location']]]],
    'startPosition' => [
        'lat'  => '56.046029',
        'lng'  => '12.693904',
        'zoom' => 14,
    ],
    'height' => '60vh',
    'containerAware' => true,
])
@slot('sidebarContent')
<h2>This is the sidebar slot content</h2>
@endslot
@endopenStreetMap