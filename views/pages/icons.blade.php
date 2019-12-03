@extends('layout.master')

@section('hero')
    @hero([
        'backgroundColor' => '#fff',
        'textColor' => 'dark',
        'headline' => 'The icon library', 
        'byline' => 'Material icons', 
    ])

    @slot('content')
        We utilize a icon library provided by the Google Material Design team. The pack has been complemented with our very own icons to siut the needs of a municipality.
    @endslot

    @endhero
@endsection

@section('content')
<article>

    @markdown
        #Icons
        Can be utilized by the component <?php echo "@icon(['icon' => 'home']) @endicon"; ?>. This page represents the complete list of icons avabile. 
    @endmarkdown


    @paper(['padding' => 3])
        <div class="grid" style="margin-bottom: 16px;" js-filter-container="5da57cccd46c6">
        
            @field(
                [
                    'label' => false,
                    'classList' => [],
                    'textarea' => false,
                    'attributeList' => [
                    'name' => 'search',
                    'id' => '303',
                    'placeholder' => 'Search',
                    'type' => 'text',
                    'js-filter-input' => '5da57cccd46c6'
                    ]
                ]
            )
            @endfield

            @foreach(HbgStyleGuide\Helper\Icons::getTxt() as $iconKey => $iconName)
                <div class="grid-md-2 " style="word-break: break-word; text-align:center;" js-filter-item="">
                    
                    <div class="u-margin__bottom--3">      
                        @icon(['icon' => $iconName, 'size' => 'xl'])
                        @endicon
                    </div>

                    <span js-filter-data="" onclick="copy(this)" style="cursor:copy;">
                        {{$iconName}}
                    </span>
                    
                </div>
            @endforeach
        </div>
    @endpaper

</article>
@stop

<script>
    function copy(element) {
        navigator.clipboard.writeText(element.innerText).then(function() {
           
        }, function() {
          
        });
    }
    
</script>
