@siteselector([
  'items' => [
    ['label' => 'Google', 'href' => 'https://google.com'],
    ['label' => 'This site', 'href' => 'https://' . $_SERVER['HTTP_HOST']],
    ['label' => 'Facebook', 'href' => 'https://facebok.com'],
    ['label' => 'Twitter', 'href' => 'https://twitter.com']
  ],
  'maxItems' => 2
])
@endsiteselector