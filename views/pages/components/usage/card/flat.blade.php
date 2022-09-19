<div class="o-grid">
  <div class="o-grid-4@md">
    @card([
        'heading' => 'Flat UI Cards',
        'subHeading' => 'SubHeading', 
        'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
        'image' => ['src' => 'https://www.w3schools.com/w3css/img_lights.jpg', 'alt' => 'ALT'],
        'imageFirst' => true,
        'classList' => [
          'c-card--flat'
        ],
        'link' => "https://helsingborg.se"
    ])
    @endcard
  </div>
  <div class="o-grid-12@md">
    @card([
        'heading' => 'Flat UI Cards',
        'subHeading' => 'SubHeading', 
        'content' => 'Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.',
        'image' => ['src' => 'https://www.w3schools.com/w3css/img_lights.jpg', 'alt' => 'ALT'],
        'imageFirst' => true,
        'classList' => [
          'c-card--flat'
        ],
        'containerAware' => true
    ])
    @endcard
  </div>
</div>