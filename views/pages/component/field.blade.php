@extends('layout.master')

@section('content')

    <form autocomplete="on">

    @markdown
        #Field
        Displays different type of form fields.
    @endmarkdown

    @doc(['slug' => 'field', 'displayParams' => false])
        <div class="grid">
            <div class="grid-md-6">

                @markdown
                    ##Checkboxes
                    Simple but still nice looking checkboxes.
                    Styled with CSS for a nicer appearance.
                @endmarkdown

                @field([
                    'type' => 'checkbox',
                    'attributeList' => [
                        'name' => 'CheckBoxGroup'
                    ],
                    'label' => "Im a label"
                ])
                @endfield

                @field([
                    'type' => 'checkbox',
                    'attributeList' => [
                        'name' => 'CheckBoxGroup',
                        'checked' => 'checked'
                    ],
                    'label' => "No, I am a label..."
                ])
                @endfield

                @field([
                    'type' => 'checkbox',
                    'attributeList' => [
                        'name' => 'CheckBoxGroup'
                    ],
                    'label' => "Yes, you are."
                ])
                @endfield

            </div>
            <div class="grid-md-6">

                @markdown
                    ##Radio buttons
                    Or why not Radio buttons that also went through a makeover.
                @endmarkdown

                @field([
                    'type' => 'radio',
                    'attributeList' => [
                        'name' => 'familyName',
                        'checked' => 'checked'
                    ],
                    'label' => "Select me!"
                ])
                @endfield

                @field([
                    'type' => 'radio',
                    'attributeList' => [
                        'name' => 'familyName',
                    ],
                    'label' => "Yes!"
                ])
                @endfield

                @field([
                    'type' => 'radio',
                    'attributeList' => [
                        'name' => 'familyName',
                    ],
                    'label' => "No select me!!!!!"
                ])
                @endfield
            </div>
        </div>
    @enddoc

    @doc(['slug' => 'field'])
        <form name="demoForm">
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
                        ##Input field - Date
                    @endmarkdown


                    @field([
                        'type' => 'text',
                        'attributeList' => [
                            'type' => 'date',
                            'name' => 'date',
                            'value' => date('Y-m-d'),
                            'required' => true,
                            'data-invalid-message' => "Enter a valid date"
                        ],
                        'label' => "Set your date",

                    ])
                    @endfield
                </div>

                <div class="grid-md-6">

                    @markdown
                        ##Input field - Week
                    @endmarkdown

                    @field([
                        'type' => 'text',
                        'attributeList' => [
                            'type' => 'week',
                            'name' => 'week',
                            'required' => true,
                            'data-invalid-message' => "Enter a valid week"
                        ],
                        'label' => "Select week",
                    ])
                    @endfield
                </div>
                <div class="grid-md-6">

                    @markdown
                        ##Input field - Time
                    @endmarkdown

                    @field([
                    'type' => 'text',
                        'attributeList' => [
                            'type' => 'time',
                            'name' => 'time',
                            'required' => true,
                            'data-invalid-message' => "Enter valid timestamp"
                        ],
                        'label' => "Select time",
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
                    ##Input field - Phone
                    @endmarkdown

                    @field([
                        'type' => 'text',
                        'attributeList' => [
                            'type' => 'tel',
                            'name' => 'tel',
                            'required' => true,
                        ],
                        'label' => "Phone number"
                    ])
                    @endfield
                </div>
                <div class="grid-md-6">

                    @markdown
                    ##Input field - search
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
                    ##Input field - Url
                    @endmarkdown

                    @field([
                        'type' => 'text',
                        'attributeList' => [
                            'type' => 'url',
                            'name' => 'url',
                            'required' => true,
                        ],
                        'label' => "Add website"
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

                @markdown
                ##Textarea
                @endmarkdown

                @field([
                    'textarea' => true,
                    'type' => 'text',
                    'attributeList' => [
                        'type' => 'textarea',
                        'name' => 'ImaTextarea',
                    ],
                    'label' => "Normal text field"
                ])
                @endfield

            </div>
        </form>
    @enddoc

    </form>

@stop
