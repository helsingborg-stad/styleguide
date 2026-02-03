@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Pre-loader
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'pre-loader', 'config' => 'pre-loader']])
        @typography([
        ])
            The pre-loader utility can be added to create a loading effect when content is being loaded. Below is two similar boxes where only one is using a the preloader utility.
        @endtypography

        <div style="background-color:blue;width:200px;height:200px;"></div>
        <div class="u-preloader" style="background-color:blue;width:200px;height:200px;"></div>

    @endutility_doc
    
    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'pre-loader', 'config' => 'opacity']])

        <div class="u-display--flex u-flex--gridgap">
            <div class="u-preloader u-preloader__opacity--1" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--2" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--3" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--4" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--5" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--6" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--7" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--8" style="background-color:blue;width:200px;height:40px;"></div>
            <div class="u-preloader u-preloader__opacity--9" style="background-color:blue;width:200px;height:40px;"></div>
        </div>

    @endutility_doc

    @markdown
        ## Inner Component Preloader

        The `.u-preloader--inner` variant targets only specific inner components (`.c-typography`, `.c-button`, `.c-avatar`, `.c-datebadge`, `.c-field`, `.c-option`, `.c-select`) instead of the entire container. This is useful when you want to show loading states for content-rich components while keeping the container and other elements visible.
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'pre-loader', 'config' => 'pre-loader']])
        @typography([])
            Below are examples showing the difference between the regular preloader and the inner variant. The inner variant only affects the specified components within the container.
        @endtypography

        <div class="u-display--flex u-flex--gridgap u-flex--wrap">
            <div style="padding: 20px; border: 2px dashed #ccc;">
                <h4>Without Preloader</h4>
                @typography(['element' => 'p'])
                    This is some sample text inside a typography component.
                @endtypography
                @button(['text' => 'Click Me', 'color' => 'primary'])
                @endbutton
            </div>

            <div class="u-preloader--inner" style="padding: 20px; border: 2px dashed #ccc;">
                <h4>With Inner Preloader</h4>
                @typography(['element' => 'p'])
                    This is some sample text inside a typography component.
                @endtypography
                @button(['text' => 'Click Me', 'color' => 'primary'])
                @endbutton
            </div>
        </div>

        @typography(['element' => 'p', 'classList' => ['u-margin__top--4']])
            Notice how the `.u-preloader--inner` only applies the shimmer effect to the typography and button components, while the heading and container border remain visible.
        @endtypography

    @endutility_doc

    @markdown
        ### Inner Preloader with Multiple Components
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'pre-loader', 'config' => 'pre-loader']])
        @typography([])
            The inner preloader can be applied to containers with multiple content components. Each supported component type will show the loading state independently.
        @endtypography

        <div class="u-preloader--inner" style="padding: 20px; background: #f5f5f5; border-radius: 8px;">
            <div class="u-display--flex u-flex--gridgap u-flex--wrap">
                @typography(['element' => 'h3'])
                    Card Title
                @endtypography
                @typography(['element' => 'p'])
                    This is a description text that explains the content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                @endtypography
                <div class="u-display--flex u-flex--gridgap">
                    @button(['text' => 'Primary Action', 'color' => 'primary'])
                    @endbutton
                    @button(['text' => 'Secondary Action', 'color' => 'default'])
                    @endbutton
                </div>
            </div>
        </div>

    @endutility_doc

    @markdown
        ### Inner Preloader with Form Components
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'pre-loader', 'config' => 'pre-loader']])
        @typography([])
            The inner preloader also works with form components like `.c-option` and `.c-select`, making it useful for forms that load with initial data.
        @endtypography

        <div class="u-preloader--inner" style="padding: 20px; background: #ffffff; border: 1px solid #ddd; border-radius: 8px;">
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
                        ['value' => 'se', 'label' => 'Sweden'],
                        ['value' => 'no', 'label' => 'Norway'],
                        ['value' => 'dk', 'label' => 'Denmark']
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

        @typography(['element' => 'p', 'classList' => ['u-margin__top--4']])
            Notice how all form fields, selects, options, and buttons show the shimmer effect while the form title and container remain visible.
        @endtypography

    @endutility_doc

</article>
@stop
