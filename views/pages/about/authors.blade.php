@extends('layout.master')

@section('content')
<article>

    {!! markdown("

        #Authors

        These are the authors behind this styleguide. 

    ") !!}

    <div class="grid">

        <div class="grid-sm-4">

            @card(['title' => 'Sebastian Thulin', 'byline' => 'Lead developer'])

                @slot('top')
                    @avatar(['image' => 'https://picsum.photos/70/70?image=64', 'name' => 'Sebastian Thulin'])
                    @endavatar
                @endslot

                @slot('bottom')
                    @link(['link' => 'https://github.com/sebastianthulin', 'target' => '_blank'])
                        @icon(['icon' => 'github', 'isTipBoxLabel' => true])
                            Github
                        @endicon
                    @endlink

                    @link(['link' => 'mailto:sebastian.thulin@helsingborg.se', 'target' => '_blank'])
                        @icon(['icon' => 'email', 'isTipBoxLabel' => true])
                            Email
                        @endicon
                    @endlink

                    @link(['link' => 'tel:+46723949388', 'target' => '_blank'])
                        @icon(['icon' => 'phone', 'isTipBoxLabel' => true])
                            Call
                        @endicon
                    @endlink
                @endslot

            @endcard

        </div>

        <div class="grid-sm-4">

            @card(['title' => 'Nikolas Ramstedt', 'byline' => 'Web developer'])

                @slot('top')
                    @avatar(['image' => 'https://picsum.photos/70/70?image=65', 'name' => 'Nikolas Ramstedt'])
                    @endavatar
                @endslot

                @slot('bottom')
                    @link(['link' => 'https://github.com/sebastianthulin', 'target' => '_blank'])
                        @icon(['icon' => 'github', 'isTipBoxLabel' => true])
                            Github
                        @endicon
                    @endlink

                    @link(['link' => 'mailto:sebastian.thulin@helsingborg.se', 'target' => '_blank'])
                        @icon(['icon' => 'email', 'isTipBoxLabel' => true])
                            Email
                        @endicon
                    @endlink

                    @link(['link' => 'tel:+46723949388', 'target' => '_blank'])
                        @icon(['icon' => 'phone', 'isTipBoxLabel' => true])
                            Call
                        @endicon
                    @endlink
                @endslot

            @endcard

        </div>

        <div class="grid-sm-4">

            @card(['title' => 'Jonatan Hanson', 'byline' => 'Web developer'])

                @slot('top')
                    @avatar(['image' => 'https://picsum.photos/70/70?image=66', 'name' => 'Jonatan Hanson'])
                    @endavatar
                @endslot

                @slot('bottom')
                    @link(['link' => 'https://github.com/sebastianthulin', 'target' => '_blank'])
                        @icon(['icon' => 'github', 'isTipBoxLabel' => true])
                            Github
                        @endicon
                    @endlink

                    @link(['link' => 'mailto:sebastian.thulin@helsingborg.se', 'target' => '_blank'])
                        @icon(['icon' => 'email', 'isTipBoxLabel' => true])
                            Email
                        @endicon
                    @endlink

                    @link(['link' => 'tel:+46723949388', 'target' => '_blank'])
                        @icon(['icon' => 'phone', 'isTipBoxLabel' => true])
                            Call
                        @endicon
                    @endlink
                @endslot

            @endcard

        </div>

        <div class="grid-sm-4">

            @card(['title' => 'Johan Silvergrund', 'byline' => 'Web consultant'])

                @slot('top')
                    @avatar(['image' => 'https://picsum.photos/70/70?image=67', 'name' => 'Johan Silvergrund'])
                    @endavatar
                @endslot

                @slot('bottom')
                    @button(['link' => 'https://github.com/sebastianthulin', 'target' => '_blank'])
                        @icon(['icon' => 'github', 'isTipBoxLabel' => true])
                            Github
                        @endicon
                    @endbutton

                    @button(['link' => 'mailto:sebastian.thulin@helsingborg.se', 'target' => '_blank'])
                        @icon(['icon' => 'email', 'isTipBoxLabel' => true])
                            Email
                        @endicon
                    @endbutton

                    @button(['link' => 'tel:+46723949388', 'target' => '_blank'])
                        @icon(['icon' => 'phone', 'isTipBoxLabel' => true])
                            Call
                        @endicon
                    @endbutton
                @endslot

            @endcard

        </div>

    </div>

</article>
@stop
