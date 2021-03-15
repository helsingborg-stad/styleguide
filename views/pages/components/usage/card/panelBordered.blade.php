@grid([
    "container" => true,
    "columns" => "auto-fit",
    "min_width" => "300px",
    "max_width" => "400px",
    "col_gap" => 5,
    "row_gap" => 5
])
    @grid([])
        @card([
            'classList' => [

                'c-card--panel-bordered'
            ]
        ])
        <div class="c-card__header">
            <!-- typography.blade.php -->
            <h2 id="" class="c-typography c-typography__variant--h2" data-uid="5f7c265caf00d">
              Heading
            </h2><!-- typography.blade.php -->
            <h4 id="" class="c-typography c-typography__variant--h4" data-uid="5f7c265caf43a">
              SubHeading
            </h4><!-- typography.blade.php -->
          </div>
            <div class="c-card__image c-card__image--secondary">
              <div class="c-card__image-background" style=
              "background-image:url('https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;w=1000&amp;q=80');"></div>
            </div>
            <div class="c-card__body">
              <!-- typography.blade.php -->
              <p id="" class="c-typography c-typography__variant--p" data-uid="5f7c265caf970">
                Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.
              </p>
            </div>
        @endcard
    @endgrid


    @grid([])
        @card([
            'classList' => [

                'c-card--panel-bordered'
            ]
        ])
        <div class="c-card__header">
            <!-- typography.blade.php -->
            <h2 id="" class="c-typography c-typography__variant--h2" data-uid="5f7c265caf00d">
              Heading
            </h2><!-- typography.blade.php -->
            <h4 id="" class="c-typography c-typography__variant--h4" data-uid="5f7c265caf43a">
              SubHeading
            </h4><!-- typography.blade.php -->
          </div>
    
            <div class="c-card__body">
              <!-- typography.blade.php -->
              <p id="" class="c-typography c-typography__variant--p" data-uid="5f7c265caf970">
                Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.
              </p>
            </div>
        @endcard
    @endgrid
@endgrid