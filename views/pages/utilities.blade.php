@extends('layout.containers.doc')

@section('doc-content')

<article>

    @markdown
        #Utilities
        List of css utilities.

        Utility classes are meant to do only one thing, and do it well. They are designed to be simple, composable and re-usable, allowing for easy and fast development.

        While a CSS system based on utility classes alone is not desirable, having a set of utility classes that allow you to quickly put together templates is great.
        So where do we draw the line? How do we decide if a utility class is the right approach in any given situation?

        Utility classes should be the exception, not the rule. Only consider using a utility class if the rule you want to apply is:

        Exceptional & Specific:
        ---------------------
        “In this particular case, I want this card to have a larger top margin”. If you find yourself consistently employing the utility class across many instances of the same component, you should consider either using a scope class (if it occurs only inside a specific context) or introducing a new variant to your component.

        Optional:
        ---------------------
        Could it be safely removed without breaking the component’s appearance? Using the previous example, it makes sense to employ a utility class to give your card a larger top margin, but not to give it a white background color or a black box shadow (non-optional, component-specific styling).


        Definite:
        ---------------------
        You don’t expect this rule to be overridden by any other rule in your stylesheet
    @endmarkdown

</article>
@stop
