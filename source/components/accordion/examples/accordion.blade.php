@paper(['padding' => 0]) 
    @accordion(
        [
            'list'=> [
                ['heading' => "Your heading", 'content' => "Lorem ipsum dolor sit amet."],
                ['heading' => "Your heading", 'content' => "Lorem ipsum dolor sit amet."],
                ['heading' => "Your heading", 'content' => "Lorem ipsum dolor sit amet."],
                ['heading' => "Your heading", 'content' => "Lorem ipsum dolor sit amet."]
            ]
        ]
    )
    @endaccordion
@endpaper

@element(['classList' => ['c-test']])
<details>
  <summary>Title</summary>
  <div class="content">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
  </div>
</details>
@endelement