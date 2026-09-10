@image([
    'src'=> \MunicipioStyleGuide\Helper\MockImage::responsive('styleguide-eager'),
    'preferSrcset' => true,
    'imgAttributeList' => [
        'loading' => 'eager',
        'fetchpriority' => 'high',
        'sizes' => '100vw',
    ],
    'fullWidth' => true,
    'caption' => "Overriding imgAttributeList lets a caller opt out of the lazy-loading default, e.g. for above-the-fold images. preferSrcset is also set, since a prioritized image should render once, not switch between several candidates.",
])
@endimage
