<div class="u-display--grid" style="gap: 16px;">
    <div
        data-utility-preview-target
        class="u-preloader"
        style="padding: 20px; background: #ffffff; border: 1px solid #ddd; border-radius: 8px;"
    >
        @typography(['element' => 'h4'])
            User Preferences Form
        @endtypography

        <div class="u-margin__top--2">
            @field([
                'type' => 'text',
                'label' => 'Username',
                'placeholder' => 'Enter your username'
            ])
            @endfield
        </div>

        <div class="u-margin__top--2">
            @select([
                'label' => 'Country',
                'options' => [
                    'se' => 'Sweden',
                    'no' => 'Norway',
                    'dk' => 'Denmark'
                ]
            ])
            @endselect
        </div>

        <div class="u-margin__top--2">
            @typography(['element' => 'label'])
                Notification Preferences
            @endtypography
            @option([
                'type' => 'checkbox',
                'label' => 'Email notifications',
                'id' => 'email-notif'
            ])
            @endoption
            @option([
                'type' => 'checkbox',
                'label' => 'SMS notifications',
                'id' => 'sms-notif'
            ])
            @endoption
        </div>

        <div class="u-margin__top--3">
            @button(['text' => 'Save Settings', 'color' => 'primary'])
            @endbutton
        </div>
    </div>
</div>
