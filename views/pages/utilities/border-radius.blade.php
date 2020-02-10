@extends('layout.containers.doc')

@section('doc-content')
    @markdown
            #Border radius
    @endmarkdown
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'border-radius', 'config' => 'border-radius']])
        <div class="grid">

            <div class="grid-s-12 grid-md-6">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=743',
                    'title' => ['text' => 'Border radius to the left', 'position' => 'top'],
                    'byline' => ['text' => 'That side', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-border--2', 'u-rounded-left--16'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                        därmed annat ännu söka.',
                    'hasRipple' => false
                ])

                @endcard

            </div>

            <div class="grid-s-12 grid-md-6">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=743',
                    'title' => ['text' => 'Border radius on top left', 'position' => 'top'],
                    'byline' => ['text' => 'That one corner', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-border--2', 'u-rounded-top-left--16'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                    därmed annat ännu söka.',
                    'hasRipple' => false
                ])

                @endcard

            </div>

            <div class="grid-s-12 grid-md-6">
                @card([
                    'href' => '#',
                    'image' => 'https://picsum.photos/300/225?image=743',
                    'title' => ['text' => 'Border radius with full modifier', 'position' => 'top'],
                    'byline' => ['text' => 'All of them', 'position' => 'top'],
                    'classList' => ['c-card--shadow-on-hover', 'u-border--2', 'u-border-radius--full'],
                    'content' => 'Löksås ipsum dimmhöljd björnbär regn faktor sitt del har gamla, fram faktor dimma sista precis
                    därmed annat ännu söka.',
                    'hasRipple' => false
                ])

                @endcard

            </div>
        </div>
    @endutility_doc

@stop