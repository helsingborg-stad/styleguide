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
                    ##Input field - Search (with icon)
                    @endmarkdown

                    @field([
                        'type' => 'text',
                        'attributeList' => [
                            'type' => 'search',
                            'name' => 'search',
                            'required' => true,
                        ],
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