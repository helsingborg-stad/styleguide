@option([
    'type' => 'radio',
    'label' => 'Up to 15 m²<span class="c-option__description">A small shed or playhouse</span><span class="c-option__aside c-option__aside--success">No permit</span>',
    'name' => 'building-size',
    'value' => 'small',
    'classList' => ['c-option--card'],
])
@endoption

@option([
    'type' => 'radio',
    'label' => '15–30 m²<span class="c-option__description">An attefall house or an extension</span><span class="c-option__aside c-option__aside--warning">Notification</span>',
    'name' => 'building-size',
    'value' => 'medium',
    'checked' => true,
    'classList' => ['c-option--card'],
])
@endoption

@option([
    'type' => 'radio',
    'label' => 'More than 30 m²<span class="c-option__aside c-option__aside--danger">Permit required</span>',
    'name' => 'building-size',
    'value' => 'large',
    'classList' => ['c-option--card'],
])
@endoption
