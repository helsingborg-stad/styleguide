<style>
    #site-footer-abc {
        --c-footer--background-image: url('/assets/img/squares-in-squares.svg');
    }
</style>
@footer([
    'slotOnly' => true,
    'id' => 'site-footer-abc',
    'classList' => ['site-footer', 's-footer'],
    'logotype' => '',
    'subfooter' => [
        'flexDirection' => 'row',
        'alignment' => 'center',
        'content' => [
            [
                'title' => '',
                'content' => 'Lorem ipsum',
                'link' => '#lorem-ipsum',
            ],
            [
                'title' => '',
                'content' => 'Dolor sit amet',
                'link' => '#dolor-sit-amet',
            ],
            [
                'title' => '',
                'content' => 'Consectetur adipiscing',
                'link' => '#consectetur-adipiscing',
            ],
        ],
    ],
])
    <div class="o-container">
        <div class="o-grid">
            <div class="o-grid-4@md u-text-align--left">
                <div class="c-element o-grid c-footer__widget-area">
                    <div class="o-grid-12">
                        @typography([
                            'element' => 'h2',
                            'variant' => 'h4',
                        ])
                            Lorem ipsum
                        @endtypography
                    </div>
                    <div class="o-grid-12">
                        @typography([])
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        @endtypography
                        @typography([])
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        @endtypography
                    </div>
                </div>
            </div>

            <div class="o-grid-4@md u-text-align--left">
                <div class="c-element o-grid c-footer__widget-area">
                    <div class="o-grid-12">
                        @typography([
                            'element' => 'h2',
                            'variant' => 'h4',
                        ])
                            Dolor sit amet
                        @endtypography
                    </div>
                    <div class="o-grid-12">
                        @typography([])
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        @endtypography
                    </div>
                </div>
            </div>

            <div class="o-grid-4@md u-text-align--left">
                <div class="c-element o-grid c-footer__widget-area">
                    <div class="o-grid-12">
                        @typography([
                            'element' => 'h2',
                            'variant' => 'h4',
                        ])
                            Consectetur
                        @endtypography
                    </div>
                    <div class="o-grid-12">
                        <ul>
                            <li>
                                @link(['href' => '#lorem-link-1'])
                                    Lorem ipsum dolor
                                @endlink
                            </li>
                            <li>
                                @link(['href' => '#lorem-link-2'])
                                    Sit amet consectetur
                                @endlink
                            </li>
                            <li>
                                @link(['href' => '#lorem-link-3'])
                                    Adipiscing elit sed
                                @endlink
                            </li>
                            <li>
                                @link(['href' => '#lorem-link-4'])
                                    Do eiusmod tempor
                                @endlink
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endfooter
