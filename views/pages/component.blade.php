@extends('layout.master')

@section('hero')
    @hero([
        'backgroundColor' => '#fff',
        'headline' => 'Components', 
        'byline' => 'Independent views', 
        'textColor' => 'dark',
    ])

    @slot('content')
        A component is a independent functional view. They can accept multiple attributes as an array and acts accordiongly without writing a single row of markup, if you don't want to. 
    @endslot

    @endhero
@endsection

@section('content')
    @markdown
        #Components
        The component library is a collection of robust views with builtin logic to handle common scenarios. 

        ##Why use components? 
        The basic purpose of the component library is that they allows third party developer to manipulate data before it enters the view. 

        This simple concept makes it a powerful tool to manipulate display of content without to touch a single line of html. And hey, if thay want to they can replace both controllers and views to make deep customizations.
    @endmarkdown

    @segment([
        'template' => 'featured',
        'containContent' => true,
        'height' => 'md',
        'width' => 'lg',
        'text_alignment' => 'center',
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'right'
        ],
        'article_heading' => [
            "variant" => "h1",
            "element" => "h2",
            "slot" => "Atomic design"
        ],
        'article_body' => "We based our component structure on the Atmoic Design System. This allows us to build components with a deliberate goal.
            The Atomic Design System give structure to the components by organising them in three different levels: Atoms, Molecules and Organisms."
    ])
    @endsegment

    @segment([
        'template' => 'split',
        'containContent' => true,
        'reverse_layout' => true,
        'card' => [
            'isCard' => true,
            'background' => "white",
            'padding' => "0"
        ],
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'left'
        ],
        'article_heading' => [
            "variant" => "h1",
            "element" => "h2",
            "slot" => "Atoms"
        ],
        'article_body' => "Atoms are the fundemental building blocks. They are rarely used just by them self but mostly used to build more advanced components.",
        'image' => "https://images.unsplash.com/photo-1531956656798-56686eeef3d4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=956&q=80",
        'cta' => array( 
            array(
                'href' => 'component/atoms',
                'text' => 'See our atoms',
                'isOutlined' => true,
                'size' => 'lg'
            )
        )
    ])

    @endsegment

    @segment([
        'template' => 'split',
        'containContent' => true,
        'card' => [
            'isCard' => true,
            'background' => "white",
            'padding' => "0"
        ],
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'left'
        ],
        'article_heading' => [
            "variant" => "h1",
            "element" => "h2",
            "slot" => "Molecules"
        ],
        'article_body' => "Molecules are the next level in the Atomic Design System. These are components that bring funtionality and interactive elements to your pages.",
        'image' => "https://images.unsplash.com/photo-1557511560-d07d5f64fd59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
        'cta' => array( 
            array(
                'href' => 'component/atoms',
                'text' => 'See our molecules',
                'isOutlined' => true,
                'size' => 'lg'
            )
        )
    ])

    @endsegment

    @segment([
        'template' => 'split',
        'containContent' => true,
        'reverse_layout' => true,
        'card' => [
            'isCard' => true,
            'background' => "white",
            'padding' => "0"
        ],
        'content_alignment' => [
            'vertical' => 'center',
            'horizontal' => 'left'
        ],
        'article_heading' => [
            "variant" => "h1",
            "element" => "h2",
            "slot" => "Organisms"
        ],
        'article_body' => "Organisms are the final level of our Atomic Design System. These components mostly acts as containers for Atoms and Molecules.",
        'image' => "https://images.unsplash.com/photo-1535127022272-dbe7ee35cf33?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
        'cta' => array( 
            array(
                'href' => 'component/atoms',
                'text' => 'See our organisms',
                'isOutlined' => true,
                'size' => 'lg'
            )
        )
    ])

    @endsegment
@stop
