
<div class="o-grid">
  <div class="o-grid-4@md">
    @card([
        'classList' => [
            'c-card--panel',
            'c-card--highlight'
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
