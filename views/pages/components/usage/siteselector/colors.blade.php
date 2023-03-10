@foreach(['primary', 'secondary'] as $color)
<div class="u-padding--2">
  @siteselector([
    'color' => $color,
    'items' => [
      ['label' => 'This site', 'href' => 'https://' . $_SERVER['HTTP_HOST']],
      ['label' => 'Google', 'href' => 'https://google.com'],
      ['label' => 'Facebook', 'href' => 'https://facebok.com'],
      ['label' => 'Twitter', 'href' => 'https://twitter.com']
    ]
  ])
  @endsiteselector
</div>
@endforeach