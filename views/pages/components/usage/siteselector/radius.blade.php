@foreach(['xs', 'sm', 'md', 'lg', 'pill'] as $radius)
<div class="u-padding--2">
  @siteselector([
    'radius' => $radius,
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