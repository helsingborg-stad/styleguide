@extends('layout.master')

@section('content')
<article>

    @markdown
        #Overflow
    @endmarkdown

    @utility_doc(['viewDoc' => ['type' => 'utility', 'root' => 'overflow', 'config' => 'overflow']])
        <div class="grid">
            <div class="grid-md-3">
                <h3>Scroll</h3>
                <div class="u-overflow--scroll" style="width:100px; height:100px;"> 
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                </div>
            </div>
            <div class="grid-md-3">
                <h3>Hidden</h3>
                <div class="u-overflow--hidden" style="width:100px; height:100px;"> 
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                </div>
            </div>
            <div class="grid-md-3">
                <h3>Visible</h3>
                <div class="u-overflow--visible" style="width:100px; height:100px;"> 
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    
                </div>
            </div>
            <div class="grid-md-3">
                <h3>Auto</h3>
                <div class="u-overflow--auto" style="width:100px; height:100px;"> 
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s'
                </div>
            </div>
        </div>
        
    @endutility_doc

    

</article>
@stop
