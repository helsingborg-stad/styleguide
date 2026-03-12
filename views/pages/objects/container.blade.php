@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Container
        
    @endmarkdown

    @paper(['padding' => '3'])
      @typography(['element' => 'h3'])
        Regular container
      @endtypography

      <div class="d-code__toggle c-code__toggle">
        @button([
            'text' => 'HTML',
            'color' => 'default',
            'type' => 'basic',
            'size' => 'md',
            'icon' => 'code'
        ])
        @endbutton
      </div>

      @code(['language' => 'html', 'content' => "", 'classList' => ['d-code']])
        {{\HbgStyleGuide\Helper\ParseString::tidyHtml('
          <div class="o-container"></div>
          <div class="o-container o-container--wide"></div>
          <div class="o-container o-container--fullwidth"></div>
        ')}}
      @endcode

      @element(['classList' => ['u-display--flex', 'u-flex-direction--column', 'u-flex--gridgap']])
        
        @typography(['element' => 'h4', 'classList' => ['u-margin__top--2']])
          Examples
        @endtypography

        <div class="o-container">
          @paper(['padding' => '4'])
            @typography(['variant' => 'h4', 'element' => 'h4'])
              This is a default container
            @endtypography
            @typography()
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fermentum porta elit, sit amet elementum purus. Vivamus sit amet augue a sapien tempor efficitur. Nulla bibendum sapien justo, quis laoreet eros lacinia a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis ex faucibus, tincidunt dui ut, dapibus nunc. In varius lorem sit amet accumsan molestie. Sed tincidunt justo sed ex imperdiet aliquet. Morbi auctor pulvinar justo, quis mollis lorem commodo non. Cras ut facilisis lacus. Sed non nunc cursus, feugiat tellus vitae, gravida mauris. Ut ultricies porttitor quam. Fusce vitae erat convallis, gravida elit sed, luctus elit. Pellentesque quis sodales enim. In gravida ut nisi quis viverra. Proin porttitor scelerisque libero, id pulvinar leo euismod sit amet. Nunc lorem nunc, efficitur et placerat vel, mollis tempus lorem.
            @endtypography
          @endpaper
        </div>
        
        <div class="o-container o-container--wide">
          @paper(['padding' => '4'])
            @typography(['variant' => 'h4', 'element' => 'h4'])
              This is a wide container
            @endtypography
            @typography()
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fermentum porta elit, sit amet elementum purus. Vivamus sit amet augue a sapien tempor efficitur. Nulla bibendum sapien justo, quis laoreet eros lacinia a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis ex faucibus, tincidunt dui ut, dapibus nunc. In varius lorem sit amet accumsan molestie. Sed tincidunt justo sed ex imperdiet aliquet. Morbi auctor pulvinar justo, quis mollis lorem commodo non. Cras ut facilisis lacus. Sed non nunc cursus, feugiat tellus vitae, gravida mauris. Ut ultricies porttitor quam. Fusce vitae erat convallis, gravida elit sed, luctus elit. Pellentesque quis sodales enim. In gravida ut nisi quis viverra. Proin porttitor scelerisque libero, id pulvinar leo euismod sit amet. Nunc lorem nunc, efficitur et placerat vel, mollis tempus lorem.
            @endtypography
          @endpaper
        </div>
        
        <div class="o-container o-container--fullwidth">
          @paper(['padding' => '4'])
            @typography(['variant' => 'h4', 'element' => 'h4'])
              This is a fullwidth container
            @endtypography
            @typography()
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fermentum porta elit, sit amet elementum purus. Vivamus sit amet augue a sapien tempor efficitur. Nulla bibendum sapien justo, quis laoreet eros lacinia a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis ex faucibus, tincidunt dui ut, dapibus nunc. In varius lorem sit amet accumsan molestie. Sed tincidunt justo sed ex imperdiet aliquet. Morbi auctor pulvinar justo, quis mollis lorem commodo non. Cras ut facilisis lacus. Sed non nunc cursus, feugiat tellus vitae, gravida mauris. Ut ultricies porttitor quam. Fusce vitae erat convallis, gravida elit sed, luctus elit. Pellentesque quis sodales enim. In gravida ut nisi quis viverra. Proin porttitor scelerisque libero, id pulvinar leo euismod sit amet. Nunc lorem nunc, efficitur et placerat vel, mollis tempus lorem.
            @endtypography
          @endpaper
        </div>
      @endelement

    @endpaper
@stop
