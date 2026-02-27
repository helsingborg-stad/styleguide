<div class="o-grid">
  <div class="o-grid-4">
    @collection([])
      @collection__item(['link' => 'https://link.link'])
        @typography(['element' => 'h4'])
          This is a multiline
        @endtypography
        @typography([])
          We also have defined link.
        @endtypography
      @endcollection__item

      @collection__item()
        @typography(['element' => 'h4'])
          This is a multiline
        @endtypography
        @typography([])
          Nothing more than that. 
        @endtypography
      @endcollection__item
    @endcollection
  </div>

  <div class="o-grid-4">
    @collection([])
      @collection__item([
        'icon' => 'account_circle',
        'link' => 'https://link.link'
      ])
        @typography(['element' => 'h4'])
          This is a multiline with an icon
        @endtypography
        @typography([])
          We also have defined link.
        @endtypography
      @endcollection__item
  
      @collection__item()
  
        @slot('prefix')
          <div class="c-collection__icon">
            @icon(['icon' => 'assignment', 'size' => 'md'])
            @endicon
          </div>
        @endslot
  
        @typography(['element' => 'h4'])
          This is a multiline with an icon
        @endtypography
        @typography([])
          Nothing more than that. Donec sed odio dui. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.
        @endtypography
      @endcollection__item
    @endcollection
    </div>
</div>