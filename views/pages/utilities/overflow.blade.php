@extends('layout.containers.doc')

@section('doc-content')
<article>

    @markdown
        #Overflow
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'overflow', 'config' => 'overflow']])

        @typography([])
            <code>u-overflow</code> allows you to specify how an element should handle any over flowing elements or text.
            In the first example we're using <code>u-overflow--scroll</code> which sets the element to allways show a scrollbar.
        @endtypography

        <div class="grid u-padding--3">
            <div class="grid-md-7" style="max-height: 200px">
                @typography([])
                    In the first example we're using <code>u-overflow--scroll</code> which sets the element to allways show a scrollbar.
                @endtypography
            </div>

            <div class="grid-md-3 u-color__bg--secondary u-overflow--scroll" style="height: 200px">
                <h3>Scroll</h3>
                <div> 
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                </div>
            </div>

            <div class="g-divider g-divider--md u-margin__top--6 u-margin__bottom--6"></div>
        </div>

        

        <div class="grid u-padding--3">
            <div class="grid-md-7" style="max-height: 200px">
                @typography([])
                    The second example has <code>u-overflow--hidden</code>, this hides any over flow even if that means cutting through an element.
                @endtypography
            </div>
            <div class="grid-md-3 u-color__bg--secondary u-overflow--hidden" style="max-height: 200px">
                <h3>Hidden</h3>
                <div>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                </div>
            </div>

            <div class="g-divider g-divider--md u-margin__top--6 u-margin__bottom--6"></div>
        </div>

        

        <div class="grid u-padding--3 u-overflow--hidden">
            <div class="grid-md-7" style="max-height: 200px">
                @typography([])
                    For the third example we're using <code>u-overflow--visible</code> to allow all overflow to be visible.
                @endtypography
            </div>

            <div class="grid-md-3 u-color__bg--secondary u-overflow--visible" style="max-height: 200px">
                <h3>Visible</h3>
                <div> 
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                </div>
            </div>

            <div class="g-divider g-divider--md u-margin__top--6 u-margin__bottom--6"></div>
        </div>

        <div class="grid u-padding--3">
            <div class="grid-md-7" style="max-height: 200px">
                @typography([])
                    The fourth example is great for when we have an element with a set height but we're not sure how tal the content will be.
                    <code>u-overflow--auto</code> will add scroll to the element if needed.
                @endtypography
            </div>

            <div class="grid-md-3 u-color__bg--secondary u-overflow--auto" style="max-height: 200px">
                <h3>Auto</h3>
                <div>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                </div>
            </div>
        </div>
        
    @endutility_doc

</article>
@stop
