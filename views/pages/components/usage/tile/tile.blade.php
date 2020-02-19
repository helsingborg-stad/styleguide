<div class="c-tile__container">
    @tile([
        "width" => "2",
        "backgroundImage" => "https://images.unsplash.com/photo-1557511560-d07d5f64fd59?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1500&amp;q=80",
        "classList" => [
            'u-color__bg--info'
        ]
    ])
    
    @endtile

    @tile([
        "classList" => [
            'u-color__bg--warning'
        ]
    ])
        
    @endtile

    @tile([
        "classList" => [
            'u-color__bg--danger'
        ]
    ])
    @endtile

    @tile([
        "classList" => [
            'u-color__bg--success',
            "c-tile__sizer"
        ]
    ])
    @endtile
</div>