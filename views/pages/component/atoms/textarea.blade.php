@extends('layout.master')

@section('content')
<div class="grid-md-12">
    @markdown
    ##Textarea
    @endmarkdown

    @textarea([
        'type' => 'text',
        'attributeList' => [
        'type' => 'textarea',
        'name' => 'ImaTextarea',
        ],
        'label' => "Normal text field"
    ])
    @endtextarea

</div>
@endsection