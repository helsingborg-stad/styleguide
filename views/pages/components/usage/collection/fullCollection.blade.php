<div class="o-grid">
  <div class="o-grid-4">
    @collection()
        @collection__item([
          'icon' => 'home',
          'action' => [
            'icon' => 'star',
            'link' => 'http://link.link'
          ]
        ])
          @typography(['element' => 'h4'])
            This is a multiline
          @endtypography
          @typography([])
            We also have defined a icon and a action link.
          @endtypography
        @endcollection__item

        @collection__item()

          @slot('prefix')
            <div class="c-collection__icon">
              @icon(['icon' => 'home', 'size' => 'md'])
              @endicon
            </div>
          @endslot

          @typography(['element' => 'h4'])
            I'm an imposter!
          @endtypography
          @typography([])
            I use my slots to mimic the above collection item. 
          @endtypography

          @slot('secondary')
            @link(['href' => 'https://link.link'])
              @icon(['icon' => 'star', 'size' => 'md'])
              @endicon
            @endlink
          @endslot

        @endcollection__item

        @collection__item([
          'icon' => 'home',
          'action' => [
            'icon' => 'star',
            'link' => 'http://link.link'
          ],
          'link' => 'http://helsingborg.se'
        ])
          @typography(['element' => 'h4'])
            This is a multiline
          @endtypography
          @typography([])
            This has the same configuration as above. But applied a link to the item. Actions then dissapear.
          @endtypography
        @endcollection__item
    @endcollection
  </div>
</div>