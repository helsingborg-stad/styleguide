@nav([
    'items' => \HbgStyleGuide\Navigation::getMockedTopLevel(),
    'classList' => ['u-position--relative'],
    'childItemsUrl' => '/', //Currently unsupported in horizontal mode
    'direction' => 'horizontal',
    'includeToggle' => false //Currently unsupported in horizontal mode
])
@endnav