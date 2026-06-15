<div class="o-grid">
  <div class="o-grid-4@md">
    @card([
        'classList' => [

            'c-card--accented'
        ]
    ])
      @card__header()
        @typography([
            'variant' => 'h2'
        ])
          Heading
        @endtypography
        @typography([
            'variant' => 'h4'
        ])
          SubHeading
        @endtypography
      @endcard__header
        @card__image()
          @image([
              'src' => 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=500&q=80',
              'alt' => 'Card illustration',
              'cover' => true,
              'classList' => [
                  'c-card__image'
              ]
          ])
          @endimage
        @endcard__image
        @card__body()
          @typography([
              'variant' => 'p'
          ])
            Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.
          @endtypography
        @endcard__body
    @endcard
  </div>
  <div class="o-grid-4@md">
    @card([
        'classList' => [

            'c-card--accented'
        ]
    ])
      @card__header()
        @typography([
            'variant' => 'h2'
        ])
          Heading
        @endtypography
        @typography([
            'variant' => 'h4'
        ])
          SubHeading
        @endtypography
      @endcard__header

        @card__body()
          @typography([
              'variant' => 'p'
          ])
            Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.
          @endtypography
        @endcard__body
    @endcard
  </div>
</div>
