@extends('layout.master')

@section('content')
    @markdown
        # Tabs
    @endmarkdown

    @doc(['slug' => 'tabs'])
        @paper
            @tabs(['tabs' => array(
                array(
                    'icon' => '',
                    'title' => 'Tab one',
                    'content' => 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo autem nihil veritatis natus, nemo numquam aut veniam, accusamus sapiente illum voluptates porro ad laborum repellendus dolore maiores distinctio obcaecati mollitia.'
                ),
                array(
                    'icon' => 'cloud-upload',
                    'title' => 'Tab two',
                    'content' => 'Doloribus incidunt sapiente inventore! Unde cumque eum inventore! Sit architecto, corrupti in assumenda nulla, totam perspiciatis rem libero voluptates consequuntur illum fuga! Lorem ipsum dolor sit amet consectetur adipisicing elit.'
                ),
                array(
                    'icon' => 'cloud-upload',
                    'title' => 'Tab Three',
                    'content' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus incidunt sapiente inventore! Unde cumque eum inventore! Sit architecto, corrupti in assumenda nulla, totam perspiciatis rem libero voluptates consequuntur illum fuga!'
                ),
            )])
            @endtabs
        @endpaper
    @enddoc
@stop
