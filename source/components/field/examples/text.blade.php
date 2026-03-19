@form([
    'errorMessage' => 'In some mysterious way, you failed to fill in the form correctly. Please try again.',
    'validateMessage' => "Yay! we've done it! Form is submitted!",
    'attributeList' => [
        'autocomplete' => 'on'
    ]
])
    <div class="grid">
        <div class="grid-md-6">
            @field([
                'type' => 'email',
                'placeholder' => 'email@email.com',
                'name' => 'email',
                'autocomplete' => 'email',
                'invalidMessage' => 'Please enter a valid email',
                'label' => "Add your email",
                'required' => true,
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @field([
                'type' => 'date',
                'name' => 'text',
                'value' => '',
                'label' => 'Enter a date',
                'required' => true,
                'invalidMessage' => 'You need to add a valid date!',
                'datepicker' => [
                    'minDate'               => "6/29/1997",
                    'maxDate'               => "tomorrow",
                ],
                'icon' => ['icon' => 'date_range']
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @field([
                'type' => 'number',
                'name' => 'number',
                'required' => true,
                'label' => "Number",
                'invalidMessage' => 'Must be a number.',
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @field([
                'type' => 'password',
                'name' => 'password',
                'placeholder' => 'correct horse battery staple',
                'required' => true,
                'autocomplete' => "new-password",
                'invalidMessage' => 'You need to fill in this field.',
                'label' => "Set your password",
                'helperText' => "Hey! Want some help with this?"
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @field([
                'type' => 'search',
                'name' => 'search',
                'required' => true,
                'label' => "Search",
                'icon' => ['icon' => 'search']
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @field([
                'type' => 'text',
                'name' => 'text',
                'label' => "Normal text field"
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @field([
                'type' => 'email',
                'placeholder' => 'email@email.com',
                'name' => 'email',
                'autocomplete' => 'email',
                'invalidMessage' => 'Please enter a valid email',
                'label' => "Add your e-mail",
                'required' => true,
                'classList' => [
                    'is-invalid'
                ]
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @field([
                'type' => 'email',
                'placeholder' => 'email@email.com',
                'name' => 'email',
                'autocomplete' => 'email',
                'invalidMessage' => 'Please enter a valid email',
                'label' => "Add your email",
                'required' => true,
                'classList' => [
                    'is-valid'
                ]
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @field([
                'type' => 'email',
                'placeholder' => 'email@email.com',
                'name' => 'email',
                'autocomplete' => 'email',
                'invalidMessage' => 'Please enter a valid email',
                'label' => "Add your email",
                'required' => true,
                'hideLabel' => true,
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @field([
                'type' => 'text',
                'placeholder' => 'email@email.com',
                'name' => 'email_regexp',
                'autocomplete' => 'email',
                'validationRegexp' => '^[^@]+@[^@]+\.[^@]+$',
                'invalidMessage' => 'Please enter a valid email',
                'label' => "Add your email (custom regexp validation)",
                'required' => true,
                'hideLabel' => true,
            ])
            @endfield
        </div>


        <div class="grid-md-6">
            @field([
                'type' => 'text',
                'placeholder' => 'email@email.com',
                'name' => 'email_regexp',
                'autocomplete' => 'email',
                'validationRegexp' => '^[^@]+@[^@]+\.[^@]+$',
                'invalidMessage' => 'Please enter a valid email',
                'label' => "Add your email",
                'required' => true,
                'hideLabel' => true,
                'shadow' => true
            ])
            @endfield
        </div>

        <div class="grid-md-12">
            <input type="submit">
        </div>
    </div>
@endform
