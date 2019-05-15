@extends('layout.master')

@section('content')
    @markdown
        #Table
    @endmarkdown

    @doc(['slug' => 'table'])

        @table([
            'list' => [
                ['Hello', 'Hi!', 'Howdy'],
                ['Goodbye', 'Bye', 'See ya!']
            ],
            'headings' => ['Formal', 'Casual', 'Redneck'],
            'showFooter' => true
        ])
        @endtable

        @table([
            'list' => [
                ['Mr. Unknown', 'Cras justo odio, dapibus ac facilisis in, egestas eget quam. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.', 'Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum.', 'https://helsingborg.se/kommun-och-politik/kontakt-och-paverkan/kontakta-kommunen/skicka-meddelande/'],
                ['Mrs. Unknown', 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor.', 'https://helsingborg.se/kommun-och-politik/kontakt-och-paverkan/kontakta-kommunen/specialistfunktioner-pa-helsingborg-kontaktcenter/']
            ],
            'headings' => ['Name', 'Description', 'Details', 'Link'],
            'showFooter' => true
        ])
        @endtable

    @enddoc
@stop



