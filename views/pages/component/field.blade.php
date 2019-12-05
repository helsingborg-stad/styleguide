@extends('layout.master')

@section('content')
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
                    ],
                    'label' => "Add your E-mail"
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
                    ],
                    'label' => "Set your date"
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
                    ],
                    'label' => "Select week"
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
                        'name' => 'time'
                    ],
                    'label' => "Select time"
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
                        'name' => 'password'
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
                        'name' => 'search'
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
                    'name' => 'text'
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
                    'name' => 'text'
                ],
                'label' => "Normal text field"
            ])
            @endfield

        </div>
    @enddoc
@stop
