<section>
    @if(isset($summary) && $summary)
        <div class="u-margin__bottom--3">
            @typography(['element' => 'p'])
                {{$summary}}
            @endtypography
        </div>
    @endif

    @if(isset($description) && $description)
        <div class="u-margin__bottom--3">
            @typography(['element' => 'p'])
                @if(is_array($description))
                    @foreach($description as $desc)
                        {{$desc}}<br>
                    @endforeach
                @else
                    {{$description}}
                @endif
            @endtypography
        </div>
    @endif
    @if(!empty($examples) && is_array($examples))
    @accordion([])
        @foreach($examples as $exampleKey => $example)
            @paper([
                'classList' => [
                    'u-margin__y--2'
                ]
            ])
                @accordion__item([
                    'heading' => $example['title'] ?? $exampleKey,
                ])
                    @slot('beforeContent')
                        @if($example['description'])
                            {{$example['description']}}
                        @endif
                    @endslot
                    @includeIf(($includesPath ?? 'null') . '.' . $exampleKey, ['example' => $example])
                    @if(!empty($example['available']))
                        <table class="u-margin__top--4">
                            <thead>
                                <td>Class</td>
                                <td>Allowed values</td>
                                <td>Description</td>
                                <td>Viewport Responsive</td>
                                <td>Container Query Responsive</td>
                            </thead>
                            @foreach($example['available'] as $class => $data)
                            <tr>
                                <td>{{$class}}</td>
                                <td>{{$data['allowedValues'] ?? '-'}}</td>
                                <td>{{$data['description'] ?? '-'}}</td>
                                <td>{{$data['responsive'] ? '@{breakpoint}' : 'no'}}</td>
                                <td>{{$data['containerQuery'] ? '@cq-{breakpoint}' : 'no'}}</td>
                            </tr>
                            @endforeach
                        </table>
                    @endif
                @endaccordion__item
            @endpaper
        @endforeach
    @endaccordion
        @typography([
            'element' => 'h2',
            'variant' => 'h3',
            'classList' => [
                'u-margin__top--6',
                'u-margin__bottom--3'
            ]
        ])
            Classes reference
        @endtypography
        @foreach ($examples as $key => $example)
            @if(!empty($example['available']))
            @paper([
                'classList' => [
                    'u-margin__y--4'
                ]
            ])
                @typography([
                    'element' => 'h3',
                    'variant' => 'h4',
                    'classList' => [
                        'u-padding__x--2',
                        'u-padding__top--2'
                    ]
                ])
                    {{$example['title'] ?? $key}}
                @endtypography
                <table class="u-margin__top--2">
                    <thead>
                        <td>Class</td>
                        <td>Allowed values</td>
                        <td>Description</td>
                        <td>Viewport Responsive</td>
                        <td>Container Query Responsive</td>
                    </thead>
                    @foreach($example['available'] as $class => $data)
                    <tr>
                        <td>{{$class}}</td>
                        <td>{{$data['allowedValues'] ?? '-'}}</td>
                        <td>{{$data['description'] ?? '-'}}</td>
                        <td>{{$data['responsive'] ? '@{breakpoint}' : 'no'}}</td>
                        <td>{{$data['containerQuery'] ? '@cq-{breakpoint}' : 'no'}}</td>
                    </tr>
                    @endforeach
                </table>
                @endpaper
            @endif
        @endforeach
    @endif

</section>