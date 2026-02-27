@php
    $navItems = [
        ['thumb' => 'https://picsum.photos/id/10/400/300',  'large' => 'https://picsum.photos/id/10/800/600',  'caption' => 'Forest path'],
        ['thumb' => 'https://picsum.photos/id/20/400/300',  'large' => 'https://picsum.photos/id/20/800/600',  'caption' => 'Mountain lake'],
        ['thumb' => 'https://picsum.photos/id/30/400/300',  'large' => 'https://picsum.photos/id/30/800/600',  'caption' => 'Coastal view'],
    ];
@endphp

<div style="display: flex; gap: 8px;">
    @foreach ($navItems as $i => $item)
        @image([
            'src' => $item['thumb'],
            'alt' => $item['caption'],
            'attributeList' => [
                'data-open'     => 'modal-navigation',
                'data-large-img' => $item['large'],
                'data-stepping' => $i,
                'data-caption'  => $item['caption'],
                'style'         => 'cursor: pointer; width: 150px;',
            ],
        ])
        @endimage
    @endforeach
</div>

@modal([
    'id'              => 'modal-navigation',
    'navigation'      => true,
    'transparent'     => true,
    'closeButtonText' => 'Close',
    'ariaLabels'      => (object) ['prev' => 'Previous image', 'next' => 'Next image'],
    'classList'       => ['c-modal--gallery'],
])
    @image(['src' => ''])
    @endimage
@endmodal
