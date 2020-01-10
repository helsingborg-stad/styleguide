@extends('layout.master')

@section('content')
    @doc(['slug' => 'option'])
        @form([
        ])
        <div class="grid">
            <div class="grid-md-6">

                @markdown
                    ##Checkboxes
                    Simple but still nice looking checkboxes.
                    Styled with CSS for a nicer appearance.
                @endmarkdown

                @option([
                    'type' => 'checkbox',
                    'attributeList' => [
                        'name' => 'CheckBoxGroup'
                    ],
                    'label' => "Im a label"
                ])
                @endoption

                @option([
                    'type' => 'checkbox',
                    'attributeList' => [
                        'name' => 'CheckBoxGroup',
                        'checked' => 'checked'
                    ],
                    'label' => "No, I am a label..."
                ])
                @endoption

                @option([
                    'type' => 'checkbox',
                    'attributeList' => [
                        'name' => 'CheckBoxGroup'
                    ],
                    'label' => "Yes, you are."
                ])
                @endoption

            </div>
            <div class="grid-md-6">

                @markdown
                    ##Radio buttons
                    Or why not Radio buttons that also went through a makeover.
                @endmarkdown

                @option([
                    'type' => 'radio',
                    'attributeList' => [
                        'name' => 'radioGroup',
                        'checked' => 'checked'
                    ],
                    'label' => "Select me!"
                ])
                @endoption

                @option([
                    'type' => 'radio',
                    'attributeList' => [
                        'name' => 'radioGroup',
                    ],
                    'label' => "Yes!"
                ])
                @endoption

                @option([
                    'type' => 'radio',
                    'attributeList' => [
                        'name' => 'radioGroup',
                    ],
                    'label' => "No select me!!!!!"
                ])
                @endoption
            </div>
        </div>
        @endform
    @enddoc
@endsection