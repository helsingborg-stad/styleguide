@collection()
    @collectionItem()
      Dolor Bibendum Inceptos Nibh
    @endcollectionItem
    @collectionItem()
      Condimentum Ullamcorper
    @endcollectionItem

    <!-- Alternative 1 for subitem -->
    @collectionItem()
      Pharetra Ultricies Nullam Venenatis Adipiscing
      @slot('subItem')
        @collectionItem()
          Second level. Pharetra Ultricies Nullam. Alternative 1. 
        @endcollectionItem
      @endslot
    @endcollectionItem

    <!-- Alternative 2 for subitem -->
    @collectionItem()
      Pharetra Ultricies Nullam Venenatis Adipiscing
      @collection(['subCollection' => true])
        @collectionItem()
          Second level. Pharetra Ultricies Nullam. Alternative 2. 
        @endcollectionItem
      @endcollection
    @endcollectionItem

@endcollection