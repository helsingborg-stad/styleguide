@extends('layout.master')

@section('content')
<article>

    {!! markdown("

        #Styleguide structure

        A breif documentation of the styleguide webpage structure, and how to develop and display new components on this page. 

        ##Creating a component

        A component should always be added in the repository for blade components. This package is designed to be reused and to be modular. The ultimate goal of the package is to minimize the need to copy and paste markup between different platforms.

        The Blade component library is automatically initialized in this repo on composer install and can be found at source/php/library. The package contains views (located in /views/) and their respective controllers (located in /controllers/). 

        It's not a requirement tecnically to create a controller, but for structural purposes you should always consider to create a controller. 

        All components can be called with a nifty public function.

        ##Editing sass

        ###Overriding sass

        ##Add documentation page

    ") !!}

</article>
@stop
