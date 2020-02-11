@extends('layout.containers.doc')

@section('doc-content')
    @markdown
        #Avatar
        The avatar displays a reprensation of a user account in the platform. It adapts to the input, and displays the most fuitful content. It will sort in descending order between the folowing parameters.

        - User image 
        - User icon
        - User initials (calculated form name)

        I'ts benificial for the user if you always provide the full name of the user, since it will be providing screen readers with vital information.

        
    @endmarkdown

    @doc(['slug' => 'avatar'])
        <div class="grid">
            <div class="grid-md-3">
                @avatar([
                    'name' => "Cookie Monster"
                ])
                @endavatar
            </div>

            <div class="grid-md-3">
                @avatar([
                    'image' => "https://picsum.photos/70/70?image=64",
                    'name' => "Cookie Monster"
                ])
                @endavatar
            </div>

            <div class="grid-md-3">
                @avatar([
                    'name' => "Cookie Monster",
                    'icon' => [
                        'name' => 'favorite',
                        'size' => 'xl'
                    ]
                 ])
                @endavatar
            </div>
        </div>
    @enddoc
@stop
