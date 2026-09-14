@image([
    'src'=> \MunicipioStyleGuide\Helper\MockImage::transparentWithLqip('styleguide-transparent-srcset'),
    'preferSrcset' => true,
    'caption' => "A single <img> via srcset. The low quality placeholder loses its transparency, showing a solid colour behind the final transparent image.",
])
@endimage
