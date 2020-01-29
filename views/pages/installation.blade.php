@extends('layout.master')
<script src = "node_modules/clientside-require/dist/bundle.js"></script>
@section('hero')
    @hero([
    'backgroundColor' => '#fff',
    'textColor' => 'dark',
    'headline' => 'The icon library',
    'byline' => 'Material icons',
    ])

    @slot('content')
        Installation is pretty simple.
    @endslot

    @endhero
@endsection

@section('content')
        @markdown
        #Installation
        Getting started
        Lorem ipsum about installation

        @endmarkdown


        @paper(['padding' => 3])

        @markdown
            ##Compile CSS for selected components
            Just check those components you want to use and press generate CSS.

        @endmarkdown

            <div class="grid">
                @foreach(HbgStyleGuide\Helper\Documentation::getComponentDirectories() as $atomic => $atomicValue)
                    @typography([
                        "variant" => "headline",
                        "element" => "h5"
                    ])
                        {{ucfirst($atomic)}}
                    @endtypography

                     @foreach($atomicValue as $keys => $values)
                        <div class="grid-md-3 grid-sm-3 grid-xs-2">
                            @option([
                                'type' => 'checkbox',
                                'attributeList' => [
                                    'name' => 'componentGroup'
                                ],
                                'value' => $values,
                                'label' => ucfirst($values),
                            ])
                            @endoption

                        </div>
                    @endforeach
                @endforeach
            </div>
            <div class="u-padding__bottom--8">
                @button([
                    'color' => 'secondary',
                    'href' => '',
                    'size' => 'lg',
                    'text' => 'Generate CSS',
                    'background' => 'default',
                    'classList' => ['u-float--right', 'c-button--generateCSS']
                ])
                @endbutton
            </div>

            <pre class="onlineCompiledComponents"></pre>
        @endpaper


@stop

<script>
    function copy(element) {
        navigator.clipboard.writeText(element.innerText).then(function () {

        }, function () {

        });
    }

</script>
