@extends('layout.master')

@section('content')
    @markdown
    #Field
    Displays different type of form fields.
    @endmarkdown

    @doc(['slug' => 'field'])

    @field([

        'label' => 'Text field',
        'classList' => [],
        'textarea' => false,
        'attributeList' => [
            'name' => 'adress',
            'id' => '303',
            'placeholder' => 'TextField',
            'type' => 'text'
        ]
    ])
    @endfield

    @enddoc

    @doc(['slug' => 'field'])

    @field([

    'label' => 'Textarea',
    'classList' => [],
    'textarea' => true,
    'attributeList' => [
    'name' => 'message',
    'id' => '909',
    ]
    ])
    @endfield

    @enddoc
@stop
