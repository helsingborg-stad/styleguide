@nav([
    'items' => \HbgStyleGuide\Navigation::getMockedMultilevel(),
    'classList' => ['u-position--relative'],
    'childItemsUrl' => '/',
    'direction' => 'horizontal',
    'includeToggle' => true,
    'allowStyle' => false
])
@endnav
<div style="height: 200px;"></div><!-- Padder -->