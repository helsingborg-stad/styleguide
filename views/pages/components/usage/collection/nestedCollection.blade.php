@collection()
    @collection__item()
      Dolor Bibendum Inceptos Nibh
    @endcollection__item
    @collection__item()
      Condimentum Ullamcorper
    @endcollection__item

    <!-- Alternative 1 for subitem -->
    @collection__item()
      Pharetra Ultricies Nullam Venenatis Adipiscing
      @slot('subItem')
        @collection__item()
          Second level. Pharetra Ultricies Nullam. Alternative 1. 
        @endcollection__item
      @endslot
    @endcollection__item

    <!-- Alternative 2 for subitem -->
    @collection__item()
      Pharetra Ultricies Nullam Venenatis Adipiscing
      
      @collection(['subCollection' => true])
        @collection__item()
          Second level. Pharetra Ultricies Nullam. Alternative 2. 
        @endcollection__item
      @endcollection
      
    @endcollection__item

@endcollection