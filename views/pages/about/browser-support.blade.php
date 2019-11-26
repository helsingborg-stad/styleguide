@extends('layout.master')

@section('content')
<article>

    {!! markdown("

        # Browser support
        This styleguide has support for modern browsers that still is maintained by the developer. We do not guarantee support for older browsers. They may however render the styleguide well with minor details not displaying correctly. The following is supported at the moment of writing this. 

        - Chrome (76, 77, 78)
        - Firefox (68, 69, 70)
        - Safari (12, 13)
        - Opera (63, 64, 65)
        - Edge (16, 17, 18)
        - Internet Explorer 11 (minor visual defects)
        
    ") !!}

</article>
@stop
