@form([
    'errorMessage' => 'In some mysterious way, you failed to fill in the form correctly. Please try again.',
    'validateMessage' => "Yay! we've done it! Form is submitted!",
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
                'type' => 'email',
                'placeholder' => 'email@email.com',
                'name' => 'email',
                'autocomplete' => 'e-mail',
                'invalidMessage' => 'You need to add a valid E-mail!',
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
                'type' => 'date',
                'name' => 'text',
                'value' => '',
                'label' => 'Enter a date',
                'required' => true,
                'invalidMessage' => 'You need to add a valid date!',
                'datepicker' => [
                    'minDate'               => "6/29/1997",
                    'maxDate'               => "tomorrow",
                ]
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @markdown
            ##Input field - Number
            @endmarkdown

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
            @markdown
            ##Input field - Password
            @endmarkdown

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
            @markdown
            ##Input field - Search (with icon)
            @endmarkdown

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
            @markdown
            ##Input field - Text
            @endmarkdown

            @field([
                'type' => 'text',
                'name' => 'text',
                'label' => "Normal text field"
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @markdown
                ##Input field - Validated: invalid
            @endmarkdown

            @field([
                'type' => 'email',
                'placeholder' => 'email@email.com',
                'name' => 'email',
                'autocomplete' => 'e-mail',
                'invalidMessage' => 'You need to add a valid E-mail!',
                'label' => "Add your E-mail",
                'required' => true,
                'classList' => [
                    'is-invalid'
                ]
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @markdown
                ##Input field - Validated: valid
            @endmarkdown

            @field([
                'type' => 'email',
                'placeholder' => 'email@email.com',
                'name' => 'email',
                'autocomplete' => 'e-mail',
                'invalidMessage' => 'You need to add a valid E-mail!',
                'label' => "Add your E-mail",
                'required' => true,
                'classList' => [
                    'is-valid'
                ]
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @markdown
                ##Input field - Hidden label
            @endmarkdown

            @field([
                'type' => 'email',
                'placeholder' => 'email@email.com',
                'name' => 'email',
                'autocomplete' => 'e-mail',
                'invalidMessage' => 'You need to add a valid E-mail!',
                'label' => "Add your E-mail",
                'required' => true,
                'hideLabel' => true,
            ])
            @endfield
        </div>

        <div class="grid-md-6">
            @markdown
                ##Input field - Custom validation (email)
            @endmarkdown

            @field([
                'type' => 'text',
                'placeholder' => 'email@email.com',
                'name' => 'email_regexp',
                'autocomplete' => 'e-mail',
                'validationRegexp' => '^[^@]+@[^@]+\.[^@]+$',
                'invalidMessage' => 'You need to add a valid E-mail!',
                'label' => "Add your E-mail",
                'required' => true,
                'hideLabel' => true,
            ])
            @endfield
        </div>

        <div class="grid-md-12">
            <input type="submit">
        </div>
    </div>
@endform