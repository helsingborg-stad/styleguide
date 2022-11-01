@form([
    'attributeList' => [
        'autocomplete' => 'on'
    ]
])
    <div class="grid">
        <div class="grid-md-12">
            @markdown
                ##Textarea
            @endmarkdown

            @field([
                'type' => 'text',
                'placeholder' => 'Elit Quam Porta Parturient Adipiscing',
                'name' => 'message',
                'autocomplete' => 'off',
                'label' => "Send us a message!",
                'required' => true,
                'multiline' => true
            ])
            @endfield
        </div>

        <div class="grid-md-12">
            @markdown
                ##Textarea - Invalid
            @endmarkdown

            @field([
                'type' => 'text',
                'placeholder' => 'Elit Quam Porta Parturient Adipiscing',
                'name' => 'message',
                'autocomplete' => 'off',
                'label' => "Send us a message!",
                'required' => true,
                'multiline' => 15,
                'classList' => [
                    'is-invalid'
                ]
            ])
            @endfield
        </div>

        <div class="grid-md-12">
            @markdown
                ##Textarea - Valid
            @endmarkdown

            @field([
                'type' => 'text',
                'placeholder' => 'Elit Quam Porta Parturient Adipiscing',
                'name' => 'message',
                'autocomplete' => 'off',
                'label' => "Send us a message!",
                'required' => true,
                'multiline' => 15,
                'classList' => [
                    'is-valid'
                ]
            ])
            @endfield
        </div>

        <div class="grid-md-12">
            <input type="submit">
        </div>
    </div>
@endform