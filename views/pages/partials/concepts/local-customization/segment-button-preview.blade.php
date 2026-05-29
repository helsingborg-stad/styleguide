@scope(['name' => 'campaign-hero'])
  @segment([
      'title'     => 'Scoped button set in a full view',
      'content'   => 'The section forces a readable inherited contrast for the buttons. The scope wrapper marks this rendered button set as one local customization target for Design Builder.',
      'layout'    => 'full-width',
      'image'     => 'https://picsum.photos/id/28/1920/1080',
      'background' => 'primary',
      'buttons'   => [
          [
              'href' => 'https://getmunicipio.com',
              'text' => 'Primary',
              'color' => 'primary',
          ],
          [
              'href' => 'https://getmunicipio.com',
              'text' => 'Secondary',
              'color' => 'secondary',
          ],
          [
              'href' => 'https://getmunicipio.com',
              'text' => 'Default',
              'color' => 'default',

          ],
      ],
  ])
  @endsegment
@endscope