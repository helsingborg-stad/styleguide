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
                'type' => 'email',
                'placeholder' => 'email@email.com',
                'name' => 'email',
                'autocomplete' => 'e-mail',
                'attributeList' => [
                    'pattern' => '^[^@]+@[^@]+\.[^@]+$',
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
                'type' => 'date',
                'name' => 'text',
                'value' => '',
                'label' => 'Enter a date',
                'required' => true,
                'attributeList' => [
                    'data-invalid-message' => "You need to add a valid date!",
                ],
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
                'attributeList' => [
                    'data-invalid-message' => "Must be a number "
                ]
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
                'attributeList' => [
                    //'type' => 'password', //This will override above type, warning will appear.
                ],
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
                ##Input field - Hidden label
            @endmarkdown

            @field([
                'type' => 'email',
                'placeholder' => 'email@email.com',
                'name' => 'email',
                'autocomplete' => 'e-mail',
                'attributeList' => [
                    'pattern' => '^[^@]+@[^@]+\.[^@]+$',
                    'data-invalid-message' => "You need to add a valid E-mail!"
                ],
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