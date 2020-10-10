<div class="o-grid">
  <div class="o-grid-4">

    <h2>Multiline text + icon + action</h2>

    @collection()
        @collection__item([
          'icon' => 'home',
          'action' => [
            'icon' => 'star',
            'link' => 'http://link.link'
          ],
          'link' => 'http://helsingborg.se'
        ])
          @typography(['element' => 'h4'])
            This is a multiline
          @endtypography
          @typography([])
            We also have defined a icon and a action link.
          @endtypography
        @endcollection__item

        @collection__item()

          @slot('prefix')
            <div class="c-collection__icon">
              @icon(['icon' => 'home', 'size' => 'md'])
              @endicon
            </div>
          @endslot

          @typography(['element' => 'h4'])
            I'm an imposter!
          @endtypography
          @typography([])
            I use my slots to mimic the above collection item. 
          @endtypography

          @slot('secondary')
            @link(['href' => 'https://link.link'])
              @icon(['icon' => 'star', 'size' => 'md'])
              @endicon
            @endlink
          @endslot

        @endcollection__item
    @endcollection
  </div>

  <div class="o-grid-4">

    <h2>Plain text</h2>

    @collection()

      @collection__item()
        Pharetra Ultricies
      @endcollection__item

      @collection__item()
        Aenean lacinia
      @endcollection__item

      @collection__item()
        Maecenas faucibus 
      @endcollection__item

    @endcollection

  </div>

  <div class="o-grid-4">
    <h2>Plain text - List input</h2>
    @collection(['list' => ['Pharetra Ultricies', 'Aenean lacinia', 'Maecenas faucibus ']])
    @endcollection
  </div>

  <div class="o-grid-4">

    <h2>Multiline text + icon + 1 action</h2>

    @collection()

        @collection__item([
          'icon' => 'home',
          'action' => [
            'icon' => 'star',
            'link' => 'http://link.link'
          ],
          'link' => 'http://helsingborg.se'
        ])
          @typography(['element' => 'h4'])
            This is a multiline
          @endtypography
          @typography([])
            We also have defined a icon and a action link.
          @endtypography
        @endcollection__item

        @collection__item([
          'icon' => 'home',
          'link' => 'http://helsingborg.se'
        ])
          @typography(['element' => 'h4'])
            This is a multiline
          @endtypography
          @typography([])
            We also have defined a icon and a action link.
          @endtypography
        @endcollection__item

    @endcollection
  </div>
</div>


@collection()
    @collection__item(['link' => "https://google.se"])
      Dolor Bibendum Inceptos Nibh
    @endcollection__item
    @collection__item()
      Condimentum Ullamcorper
    @endcollection__item
    @collection__item()
      Pharetra Ultricies Nullam Venenatis Adipiscing
    @endcollection__item
@endcollection





<div class="o-container">
  {{-- Plain --}}
  <div class="o-grid">
      <div class="o-grid-12">
      </div>
      <div class="o-grid-4">
          <h2>Plain text</h2>
          <br>
          <div class="c-collection c-collection--compact">
              <a href="#" class="c-collection__item">
                  <span class="c-collection__content">
                      Plain text
                  </span>
              </a>
              <a href="#" class="c-collection__item">
                  <span class="c-collection__content">
                      Plain text
                  </span>
              </a>
              <a href="#" class="c-collection__item">
                  <span class="c-collection__content">
                      Plain text
                  </span>
              </a>
              <a href="#" class="c-collection__item">
                  <span class="c-collection__content">
                      Plain text
                  </span>
              </a>
          </div>
      </div>
      <div class="o-grid-4">
          <h2>Multi-line text</h2>
          <br>
          <ul class="c-collection  c-collection--compact">
              <li class="c-collection__item">
                  <div class="c-collection__content">
                      <h4>Multi-line</h4>
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
              </li>
              <hr class="c-collection__divider">
              <li class="c-collection__item">
                  <div class="c-collection__content">
                      <h4>Multi-line</h4>
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
              </li>
              <li class="c-collection__item">
                  <div class="c-collection__content">
                      <h4>Multi-line</h4>
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                  </div>
              </li>
          </ul>
      </div>
  </div>
  {{-- Icon --}}
  <div class="o-grid">
      <div class="o-grid-12">
      </div>
      <div class="o-grid-4">
          <h2>Plain text + Icon</h2>
          <br>
          <ul class="c-collection">
              <li class="c-collection__item">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <span class="c-collection__content">
                      Plain text
                      <div class="c-collection__secondary">
                          <a href="#sss"><i class="material-icons">star</i></a>
                      </div>
                  </span>
              </li>
              <li class="c-collection__item is-open">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <span class="c-collection__content">
                      Plain text
                      <div class="c-collection__secondary">
                          <a href="#sss"><i class="material-icons">star</i></a>
                      </div>
                  </span>
              </li>
              <ul class="c-collection">
                  <li class="c-collection__item">
                      <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                      <span class="c-collection__content">
                          Plain text
                          <div class="c-collection__secondary">
                              <a href="#sss"><i class="material-icons">star</i></a>
                          </div>
                      </span>
                  </li>
                  <li class="c-collection__item">
                      <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                      <span class="c-collection__content">
                          Plain text
                          <div class="c-collection__secondary">
                              <a href="#sss"><i class="material-icons">star</i></a>
                          </div>
                      </span>
                  </li>
                  <li class="c-collection__item">
                      <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                      <span class="c-collection__content">
                          Plain text
                          <div class="c-collection__secondary">
                              <a href="#sss"><i class="material-icons">star</i></a>
                          </div>
                      </span>
                  </li>
              </ul>
              <li class="c-collection__item">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <span class="c-collection__content">
                      Plain text
                      <div class="c-collection__secondary">
                          <a href="#sss"><i class="material-icons">star</i></a>
                      </div>
                  </span>
              </li>
          </ul>
      </div>
      
      <div class="o-grid-4">
          <h2>Multi-line text + icon</h2>
          <br>
          <ul class="c-collection">
              <li class="c-collection__item">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <div class="c-collection__content c-collection__content--icon">
                      <div>
                          <h4>Multi-line</h4>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                      </div>
                      <div class="c-collection__secondary">
                          <a href="#sss"><i class="material-icons">star</i></a>
                      </div>
                  </div>
              </li>
              <li class="c-collection__item">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <div class="c-collection__content c-collection__content--icon">
                      <div>
                          <h4>Multi-line</h4>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                      </div>
                      <div class="c-collection__secondary">
                          <a href="#sss"><i class="material-icons">star</i></a>
                      </div>
                  </div>
              </li>
              <li class="c-collection__item">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <div class="c-collection__content">
                      <div>
                          <h4>Multi-line</h4>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                      </div>
                  </div>
              </li>
          </ul>
      </div>
  </div>
  {{-- Links --}}
  <div class="o-grid">
      <div class="o-grid-12">
      </div>
      <div class="o-grid-4">
          <h2>Plain link + Icon</h2>
          <br>
          <nav class="c-collection">
              <a href="#lol" class="c-collection__item c-collection__item--action">
                  <span class="c-collection__icon"><i class="material-icons">photo</i></span>
                  <span class="c-collection__content">
                      Plain text
                      <span class="c-collection__secondary">
                          <i class="material-icons">star</i>
                      </span>
                  </span>
              </a>
              <a href="#lol" class="c-collection__item c-collection__item--action">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <span class="c-collection__content">
                      Plain text
                      <span class="c-collection__secondary">
                          <i class="material-icons">star</i>
                      </span>
                  </span>
              </a>
              <a href="#lol" class="c-collection__item c-collection__item--action">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <span class="c-collection__content">
                      Plain text
                      <span class="c-collection__secondary">
                          <i class="material-icons">star</i>
                      </span>
                  </span>
              </a>
          </nav>
      </div>

      <div class="o-grid-4">
          <h2>Multi-line text + icon</h2>
          <br>
          <nav class="c-collection">
              <a href="#omg" class="c-collection__item">
                  <span class="c-collection__icon"><i class="material-icons">photo</i></span>
                  <span class="c-collection__content">
                      <span>
                          <h4>Multi-line</h4>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                      </span>
                  </span>
                  <div class="c-collection__secondary">
                      <i class="material-icons">star</i>
                  </div>
              </a>
              {{-- <hr class="c-collection__divider c-collection__divider--inset"> --}}
              <a href="#omg" class="c-collection__item">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <div class="c-collection__content c-collection__content--icon">
                      <div>
                          <h4>Multi-line</h4>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                      </div>
                      <div class="c-collection__secondary">
                          <i class="material-icons">star</i>
                      </div>
                  </div>
              </a>
              {{-- <hr class="c-collection__divider c-collection__divider--inset"> --}}
              <a href="#omg" class="c-collection__item">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <div class="c-collection__content c-collection__content--icon">
                      <div>
                          <h4>Multi-line</h4>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                      </div>
                      <div class="c-collection__secondary">
                          <i class="material-icons">star</i>
                      </div>
                  </div>
              </a>
          </nav>
      </div>
  </div>
  
  {{-- Nested Links --}}
  <div class="o-grid">
      <div class="o-grid-12">
      </div>
      <div class="o-grid-4">
          <h2>Nested toggle</h2>
          <br>
          <ul class="c-collection c-collection--nav  c-collection--bordered">
              <li class="c-collection__item c-collection__action is-open">
                  <a  href="#lol" class="c-collection__content">
                      Plain text
                  </a>
                  <a href="#wtf" class="c-collection__secondary c-collection__action">
                      <i class="material-icons">keyboard_arrow_down</i>
                  </a>
              </li>
              <ul class="c-collection c-collection--nav">
                  <li class="c-collection__item c-collection__action is-open">
                      <a  href="#lol" class="c-collection__content">
                          Plain text
                      </a>
                      <a href="#wtf" class="c-collection__secondary c-collection__action">
                          <i class="material-icons">keyboard_arrow_down</i>
                      </a>
                  </li>
                  <ul class="c-collection c-collection--nav">
                      <li class="c-collection__item c-collection__action">
                          <a  href="#lol" class="c-collection__content">
                              Lorem ipsum dolor sit amet consectetur adipisicing elit.
                          </a>
                          <a href="#wtf" class="c-collection__secondary c-collection__action">
                              <i class="material-icons">keyboard_arrow_down</i>
                          </a>
                      </li>
                      <li class="c-collection__item c-collection__action is-open">
                          <a  href="#lol" class="c-collection__content">
                              Plain text
                          </a>
                          <a href="#wtf" class="c-collection__secondary c-collection__action">
                              <i class="material-icons">keyboard_arrow_down</i>
                          </a>
                      </li>
                      <ul class="c-collection c-collection--nav">
                          <li class="c-collection__item c-collection__action">
                              <a  href="#lol" class="c-collection__content">
                                  Plain text
                              </a>
                              <a href="#wtf" class="c-collection__secondary c-collection__action">
                                  <i class="material-icons">keyboard_arrow_down</i>
                              </a>
                          </li>
                          <li class="c-collection__item c-collection__action">
                              <a  href="#lol" class="c-collection__content">
                                  Plain text
                              </a>
                              <a href="#wtf" class="c-collection__secondary c-collection__action">
                                  <i class="material-icons">keyboard_arrow_down</i>
                              </a>
                          </li>
                      </ul>
                  </ul>
              </ul>
                  <li class="c-collection__item c-collection__action">
                      <a  href="#lol" class="c-collection__content">
                          Plain text
                      </a>
                      <a href="#wtf" class="c-collection__secondary c-collection__action">
                          <i class="material-icons">keyboard_arrow_down</i>
                      </a>
                  </li>
              </ul>
          </ul>
      </div>

      <div class="o-grid-4">
          <h2>Multi-line text + icon</h2>
          <br>
          <nav class="c-collection c-collection--unbox">
              <a href="#omg" class="c-collection__item">
                  <span class="c-collection__icon"><i class="material-icons">photo</i></span>
                  <span class="c-collection__content c-collection__content--icon">
                      <span>
                          <h4>Multi-line</h4>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                      </span>
                      <div class="c-collection__secondary">
                          <i class="material-icons">star</i>
                      </div>
                  </span>
              </a>
              <a href="#omg" class="c-collection__item">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <div class="c-collection__content c-collection__content--icon">
                      <div>
                          <h4>Multi-line</h4>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                      </div>
                      <div class="c-collection__secondary">
                          <i class="material-icons">star</i>
                      </div>
                  </div>
              </a>
              <a href="#omg" class="c-collection__item">
                  <div class="c-collection__icon"><i class="material-icons">photo</i></div>
                  <div class="c-collection__content c-collection__content--icon">
                      <div>
                          <h4>Multi-line</h4>
                          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                      </div>
                      <div class="c-collection__secondary">
                          <i class="material-icons">star</i>
                      </div>
                  </div>
              </a>
          </nav>
      </div>
  </div>
</div>