<div class="o-grid">
  @foreach(['bordered', 'compact', 'sharp', 'sharpBottom', 'sharpTop', 'unbox'] as $modifier)  
    <div class="o-grid-4">
      @collection(
          [
              $modifier => true,
              'list' => [
                  ['title' => 'Collection modifier', 'content' => 'This utilizes the "' . $modifier . '" and will therefore display differently.'],
                  ['content' => 'Linked item', 'link' => "https://helsingborg.se"],
                  'Unlinked item',
                  ['content' => 'Unlinked item', 'link' => false],
              ], 
  
          ]
      )
      @endcollection
    </div>
  @endforeach
</div>