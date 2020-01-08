@extends('layout.master')

@section('content')
<div>
    @markdown
    ##Textarea
    @endmarkdown

    @doc(['slug' => 'textarea'])
        @form([
        ])
            @textarea([
                'required' => true,
                'attributeList' => [
                    'type' => 'textarea',
                    'name' => 'poetric',
                    'data-invalid-message' => "Write 1 - 250 characters!!!!!",
                    'pattern' => '[a-z]{1,255}',
                    'max' => '250'
                ],
                'label' => "Normal text field"
            ])
            @endtextarea
        @endform
    @enddoc

</div>
@endsection