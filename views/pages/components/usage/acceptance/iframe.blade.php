@acceptance([
    "labels"    => (object) [
        'title'     => "Title",
        'info'      => "This is the body of acceptance it can include {{name}}.",
        'button'    => "Hey, i'm okay with that!"
    ],
    "modifier"  => 'iframe',
    "height"    => '500',
    "src"       => 'https://helsingborg.se',
    "policy"    => 'https://helsingborg.se/policy',
    "host"      => 'helsingborg.se',
    "name"      => 'Helsingborg Stad',
])
    Hey! this is the content blocked. Javascript will not run until acceptance is received.
@endacceptance