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
                <div class="grid-md-2 d-animation" onclick="copy(this)"  style="word-break: break-word; text-align:center; cursor: pointer" js-filter-item="">
                    
                    <div class="d-animation__content">      
                        @icon(['icon' => $iconName, 'size' => 'xl', 'classList' => ['d-animation__icon']])
                        @endicon

                        <p class="d-animation__copied">Copied!</p>
                    </div>

                    <span js-filter-data="" js-copy-data>
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
