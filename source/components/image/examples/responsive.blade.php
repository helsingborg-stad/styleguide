@image([
    'src'=> \MunicipioStyleGuide\Helper\MockImage::responsive(),
    'preferSrcset' => true,
    'caption' => "One responsive <img>, fed by a fake ImageInterface with several candidate sizes. Opted in via preferSrcset, since the default is container-query switching.",
])
@endimage
