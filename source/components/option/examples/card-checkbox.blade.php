@option([
    'type' => 'checkbox',
    'label' => 'Drawings<span class="c-option__description">Floor plan, facade and section</span>',
    'name' => 'attachments[]',
    'value' => 'drawings',
    'checked' => true,
    'classList' => ['c-option--card'],
])
@endoption

@option([
    'type' => 'checkbox',
    'label' => 'Site plan',
    'name' => 'attachments[]',
    'value' => 'site-plan',
    'classList' => ['c-option--card'],
])
@endoption
