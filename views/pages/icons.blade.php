@extends('layout.containers.doc')

@section('doc-content')
    <article>
        @typography([
            'element' => 'h1',
            'variant' => 'h1'
        ])
            Icon Library
        @endtypography
        <div js-filter-container="5da57cccd46c6" js-sort-container js-sort-order="asc">
            @field([
                'label' => 'Filter icons',
                'classList' => [],
                'textarea' => false,
                'attributeList' => [
                'name' => 'search',
                'id' => '303',
                'placeholder' => 'Search',
                'type' => 'text',
                'js-filter-input' => '5da57cccd46c6'
                ]
            ])
            @endfield
        
        @paper(['padding' => 3])
            <div class="d-icons__controlls">
                @buttonGroup(['borderColor' => 'default'])
                    @button([
                        'text' => 'Expand all',
                        'icon' => 'unfold_more',
                        'size' => 'lg',
                        'attributeList' => ['icons_expand' => '']
                    ])
                    @endbutton

                    @button([
                        'text' => 'Minimize all',
                        'size' => 'lg',
                        'icon' => 'unfold_less',
                        'attributeList' => ['icons_minimize' => '']
                    ])
                    @endbutton

                    @button([
                        'text' => 'Sort icons',
                        'size' => 'lg',
                        'icon' => 'sort_by_alpha',
                        'attributeList' => ['js-sort-button' => '111-0']
                    ])
                    @endbutton
                @endbuttonGroup 
            </div>



            <div class="o-grid">
                @foreach(HbgStyleGuide\Helper\Icons::getIcons() as $category => $icons)
                    
                    <div class="o-grid-12@md icon-category"  js-toggle-item="{{$loop->index}}" js-toggle-class="d-icons--close" js-filter-item="">
                        
                        <div class="d-icons__category">
                            <h2>{{$category}}</h2>
                            @icon([
                                'icon' => 'expand_less',
                                'color' => 'black',
                                'size' => 'sm',
                                "attributeList" => ['js-toggle-trigger' => $loop->index]
                            ])
                            @endbutton
                        </div>

                        <div class="o-grid d-icons__sheet" js-sort-data-container>
                            @foreach($icons as $icon)
                                <div class="o-grid-6@xs o-grid-4@sm o-grid-3@md o-grid-2@lg d-animation"  onclick="copy(this)"  style="word-break: break-word; text-align:center; cursor: pointer" js-filter-item="" js-sort-sortable js-sort-data="111-0">
                                    <div class="d-animation__content">      
                                        @icon(["icon" => $icon, "size" => "xl", "classList" => ["d-animation__icon"]])
                                        @endicon
                                        <p class="d-animation__copied">Copied!</p>
                                    </div>

                                    <span js-filter-data="" js-copy-data>
                                        {{$icon}}
                                    </span>
                                </div>
                            @endforeach
                        </div>
                        
                    </div>
                @endforeach   
            </div>

        @endpaper

    </article>
@stop

<script>

    window.onload = function() {
        const expand = document.querySelector('[icons_expand]');
        const minimize = document.querySelector('[icons_minimize]');
        const sort = document.querySelector('[icons_sort]');

        minimize.addEventListener('click', (event)=>{
            let categories = document.getElementsByClassName('icon-category');
         
            
            categories.forEach(category => {
                if(![...category.classList].includes('d-icons--close')) category.classList.add('d-icons--close');
            });
        });

        expand.addEventListener('click', (event)=>{
            let categories = document.getElementsByClassName('icon-category');
         
            
            categories.forEach(category => {
                if([...category.classList].includes('d-icons--close')) category.classList.remove('d-icons--close');
            });
        });
    };

    function copy(element) {
        const copyElement = element.querySelector("[js-copy-data]");

        navigator.clipboard.writeText(copyElement.innerText).then(() => {
            element.classList.add("d-animation--show");

            setTimeout(() => {
                element.classList.remove("d-animation--show");
            }, 2000)
        }, () => {
        });

        
    }
</script>
