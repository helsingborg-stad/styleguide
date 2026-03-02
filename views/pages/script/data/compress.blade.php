@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Compress
    @endmarkdown

    @script_doc(["viewDoc" => ["type" => "script", "root" => "compress", "config" => "Compress"]])

        <h2>Uses the display method.</h2>
        <div>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span data-js-compressed="3">...</span>
        </div>

          <h2>Using the class method</h2>
        @tags([
            'compress' => 3,
            'beforeLabel' => '',
            'tags' => [
                [
                    'label' => '1',
                ],
                [
                    'label' => '2',
                ],
                [
                    'label' => '3'
                ],
                [
                    'label' => '4'
                ],
                [
                    'label' => '5'
                ],
                [
                    'label' => '6'
                ],
                [
                    'label' => '7'
                ],
            ]
        ])
    @endtags

    <h2>Allow toggle</h2>
    <div>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
        <span data-js-compressed="3" data-js-compressed-toggle>...Toggle</span>
    </div>
        
    @endscript_doc
@stop
