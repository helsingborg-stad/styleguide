@group(['direction' => 'horizontal'])

  @field([
      'type' => 'text',
      'attributeList' => [
          'type' => 'text',
          'name' => 'text',
      ],
      'label' => "What are you looking for?",
      'classList' => ['u-width--50']
  ])
  @endfield

  @button([
    'color' => 'primary',
    'size' => 'md',
    'text' => 'Search',
    'background' => 'default'
  ])
  @endbutton

@endgroup