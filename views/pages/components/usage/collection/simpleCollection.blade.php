<div class="o-grid">

    <div class="o-grid-4">
      @collection()
  
        @collection__item(['link' => "https://link.link"])
          Linked item
        @endcollection__item
  
        @collection__item()
            Unlinked item
        @endcollection__item
  
        @collection__item()
            Unlinked item
        @endcollection__item
  
      @endcollection
    </div>
  
    <div class="o-grid-4">
      @collection(
          [
              'list' => [
                  ['content' => 'Linked item', 'link' => "https://helsingborg.se"],
                  'Unlinked item',
                  ['content' => 'Unlinked item', 'link' => false],
              ], 
  
          ]
      )
      @endcollection
    </div>

</div>