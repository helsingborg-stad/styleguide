@hero([
    "image" => \MunicipioStyleGuide\Helper\MockImage::responsive('styleguide-hero-responsive'),
    "size" => "large",
    "overlay" => "neutral",
    "title" => "Rendered from a fake responsive image contract",
    "byline" => "Inspect the element: only one <img> should be present, with loading=\"eager\", fetchpriority=\"high\" and sizes=\"100vw\".",
    "paragraph" => "The image is provided as an object implementing several candidate sizes instead of a plain URL, exercising the same srcset/container query data path used for real images."
])
@endhero
