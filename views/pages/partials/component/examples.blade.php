@if(!empty($examples ?? []))
      @foreach($examples as $example)
          @if(!empty($example['description']['heading']) || !empty($example['description']['description']))
              <article class="u-margin__bottom--2 u-margin__top--10">
                  @if(!empty($example['description']['heading']))
                      @typography(['variant' => 'h3', 'element' => 'h3'])
                          {{ $example['description']['heading'] }}
                      @endtypography
                  @endif

                  @if(!empty($example['description']['description']))
                      @typography(['variant' => 'body', 'element' => 'p'])
                          {{ $example['description']['description'] }}
                      @endtypography
                  @endif
              </article>
          @endif

          @paper(['padding' => 0, 'classList' => ['u-margin__bottom--4']])
              @php
                  $htmlSourceCode = e(\MunicipioStyleGuide\Helper\ParseString::tidyHtml($example['html']['code']));
                  $bladeSourceCode = e($example['blade']['code']);

                  $renderView = static function (string $viewPath, array $viewData = []) use ($__env): string {
                      return $__env->make($viewPath, $viewData)->render();
                  };

                  $exampleTabContent   = $__env->make($example['component'], get_defined_vars())->render();
                  $htmlCodeTemplate    = $renderView('layout.partials.doc.tab-code', ['language' => 'html']);
                  $htmlCodeTabContent  = str_replace('__CODE_PLACEHOLDER__', $htmlSourceCode, $htmlCodeTemplate);
                  $bladeCodeTemplate   = $renderView('layout.partials.doc.tab-code', ['language' => 'php']);
                  $bladeCodeTabContent = str_replace('__CODE_PLACEHOLDER__', $bladeSourceCode, $bladeCodeTemplate);
              @endphp

              @tabs(['tabs' => [
                  ['title' => 'Example', 'content' => $exampleTabContent],
                  ['title' => 'HTML',    'content' => $htmlCodeTabContent],
                  ['title' => 'Blade',   'content' => $bladeCodeTabContent],
              ]])
              @endtabs
          @endpaper
      @endforeach
  @else
      @notice([
          'type' => 'warning',
          'message' => ['text' => 'No component examples available.']
      ])
      @endnotice
  @endif