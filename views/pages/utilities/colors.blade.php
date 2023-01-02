@extends('layout.containers.doc')

@section('doc-content')
<article>

@markdown
    ###Text color
@endmarkdown

@utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'colors', 'config' => 'colors__text']])
    <div class="o-grid">    

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--primary']
            ])
                Primary Text
            @endtypography
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--secondary']
            ])
                Secondary Text
            @endtypography
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--danger']
            ])
            Danger Text
            @endtypography
        </div>
        
        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--info']
            ])
                Info Text
            @endtypography
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--success']
            ])
                Success Text
            @endtypography
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--warning']
            ])
                Warning Text
            @endtypography
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--light', 'u-color__bg--lighter']
            ])
                Light Text
            @endtypography
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--lighter', 'u-color__bg--light']
            ])
                Lighter Text
            @endtypography
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--lightest', 'u-color__bg--light']
            ])
                Lightest Text
            @endtypography
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--dark']
            ])
                Dark Text
            @endtypography
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--darker']
            ])
                Darker Text
            @endtypography
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            @typography([
                'element' => 'h6',
                'variant' => 'h4',
                'classList' => ['u-color__text--darkest']
            ])
                Darkest Text
            @endtypography
        </div>
    </div>
@endutility_doc

@markdown
    ###Background color
@endmarkdown

@utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'colors', 'config' => 'colors__bg']])

    <div class="o-grid">
        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--default u-rounded" style="height: 20px;"></div>
            <span>Default</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--primary u-rounded" style="height: 20px;"></div>
            <span>Primary</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--secondary u-rounded" style="height: 20px;"></div>
            <span>Secondary</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--danger u-rounded" style="height: 20px;"></div>
            <span>Danger</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--warning u-rounded" style="height: 20px;"></div>
            <span>Warning</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--info u-rounded" style="height: 20px;"></div>
            <span>Info</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--success u-rounded" style="height: 20px;"></div>
            <span>Success</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--darkest u-rounded" style="height: 20px;"></div>
            <span>Darkest</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--darker u-rounded" style="height: 20px;"></div>
            <span>Darker</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--dark u-rounded" style="height: 20px;"></div>
            <span>Dark</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--light u-rounded" style="height: 20px;"></div>
            <span>Light</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--lighter u-rounded" style="height: 20px;"></div>
            <span>Lighter</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--lightest u-rounded" style="height: 20px;"></div>
            <span>Lightest</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--complementary u-rounded" style="height: 20px;"></div>
            <span>Compl.</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--complementary-light u-rounded" style="height: 20px;"></div>
            <span>Compl. light</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--complementary-lighter u-rounded" style="height: 20px;"></div>
            <span>Compl. lighter</span>
        </div>

        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--complementary-lightest u-rounded" style="height: 20px;"></div>
            <span>Compl. lightest</span>
        </div>
        
        <div class="o-grid-4@sm o-grid-3@md o-grid-2@lg u-text-align--center">
            <div class="u-color__bg--transparent u-rounded" style="height: 20px;"></div>
            <span>Transparent</span>
        </div>

    </div>

@endutility_doc
</article>
@stop

