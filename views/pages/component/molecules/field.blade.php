@extends('layout.master')

@section('content')

    @markdown
        #Field
        Displays different type of form fields.
    @endmarkdown



    @doc(['slug' => 'field', 'displayParams' => false])
        @form([
            'attributeList' => [
                'autocomplete' => 'on'
            ]
        ])
            <div class="grid">
                <div class="grid-md-6">
                    @markdown
                        ##Input field - E-mail
                    @endmarkdown

                    @field([
                        'type' => 'text',
                        'attributeList' => [
                            'type' => 'email',
                            'name' => 'email',
                            'pattern' => '^[^@]+@[^@]+\.[^@]+$',
                            'autocomplete' => 'e-mail',
                            'data-invalid-message' => "You need to add a valid E-mail!"
                        ],
                        'label' => "Add your E-mail",
                        'required' => true,
                    ])
                    @endfield
                </div>

                <div class="grid-md-6">
                    @markdown
                    ##Input field - Date Picker
                    @endmarkdown

                    @field([
                        'type' => 'datepicker',
                        'value' => '',
                        'label' => 'Enter a date',
                        'attributeList' => [
                            'type' => 'text',
                            'name' => 'text',
                            'data-invalid-message' => "You need to add a valid date!",
                        ],
                        'required' => true,
                        'datepicker' => [
                            'title'                 => 'Välj ett datum',
                            'minDate'               => "6/29/1997",
                            'maxDate'               => "tomorrow",
                            'required'              => true,
                            'showResetButton'       => true,
                            'showDaysOutOfMonth'    => true,
                            'showClearButton'       => true,
                            'hideOnBlur'            => true,
                            'hideOnSelect'          => false,
                        ]
                    ])
                    @endfield
                </div>

                <div class="grid-md-6">

                    @markdown
                    ##Input field - Number
                    @endmarkdown

                    @field([
                        'type' => 'text',
                        'attributeList' => [
                            'type' => 'number',
                            'name' => 'number',
                            'required' => true,
                            'data-invalid-message' => "Must be a number "
                        ],
                        'label' => "Number"
                    ])
                    @endfield
                </div>
                <div class="grid-md-6">

                    @markdown
                    ##Input field - Password
                    @endmarkdown

                    @field([
                        'type' => 'text',
                        'attributeList' => [
                            'type' => 'password',
                            'name' => 'password',
                            'required' => true,
                            'autocomplete' => "new-password",
                        ],
                        'label' => "Set your password"
                    ])
                    @endfield
                </div>

                <div class="grid-md-6">

                    @markdown
                    ##Input field - Search
                    @endmarkdown

                    @field([
                        'type' => 'text',
                        'attributeList' => [
                            'type' => 'search',
                            'name' => 'search',
                            'required' => true,
                        ],
                        'label' => "Search"
                    ])
                    @endfield

                </div>

                <div class="grid-md-6">

                    @markdown
                    ##Input field - Text
                    @endmarkdown

                    @field([
                        'type' => 'text',
                        'attributeList' => [
                            'type' => 'text',
                            'name' => 'text',
                        ],
                        'label' => "Normal text field"
                    ])
                    @endfield

                </div>

            </div>
        @endform
    @enddoc

    @doc(['slug' => 'field'])
        @form([])
            <div class="grid">
                <div class="grid-md-6">
                    @markdown
                    ##Range slider
                    @endmarkdown

                    @field(
                    [
                        'type' => 'range',
                        'attributeList' => [
                            'type' => 'range',
                            'name' => 'rangeSlider',
                        ]
                    ])
                    @endfield
                </div>
                <div class="grid-md-6">
                    @markdown
                    ##Color picker
                    @endmarkdown

                    @field(
                    [
                        'type' => 'color',
                        'attributeList' => [
                            'type' => 'color',
                            'name' => 'colorPicker',
                        ]
                    ])
                    @endfield
                </div>
            </div>
        @endform
    @enddoc

@stop
