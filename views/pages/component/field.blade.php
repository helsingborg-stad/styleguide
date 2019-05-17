@extends('layout.master')

@section('content')
    @markdown
    #Field
    Displays different type of form fields.
    @endmarkdown

    @doc(['slug' => 'field'])

    @field([

        'label' => 'Im a simple textfield',
        'classList' => [],
        'textarea' => false,
        'attributeList' => [
            'name' => 'simpleTextField',
            'id' => 'ImAnId',
            'placeholder' => 'simpleTextField',
            'type' => 'text'
        ]
    ])
    @endfield

    @enddoc
@stop
