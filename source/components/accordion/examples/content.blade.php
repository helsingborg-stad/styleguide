@accordion([])
    @for ($i = 0; $i < 3; $i++)
        @accordion__item([
            'heading' => 'Lorem ipsum dolor sit amet',
        ])
            <h2>Lorem Ipsum</h2>

            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <h3>Quid est documentum?</h3>

            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
            </p>

            <p>Exempla:</p>

            <ul>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Consectetur adipiscing elit</li>
                <li>Sed do eiusmod tempor</li>
                <li>Incididunt ut labore et dolore magna aliqua</li>
                <li>Ut enim ad minim veniam</li>
            </ul>

            <h3>Quid est documentum publicum?</h3>

            <p>Lorem ipsum dolor sit amet si:</p>

            <ul>
                <li>Consectetur adipiscing elit, et</li>
                <li>Sed do eiusmod tempor incididunt</li>
            </ul>

            <p>
                Documenta publica sine mora registranda sunt.
            </p>

            <h3>Quid significant vocabula conservatum, receptum et constitutum?</h3>

            <ul>
                <li>
                    <strong>Conservatum:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </li>
                <li>
                    <strong>Receptum:</strong> Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </li>
                <li>
                    <strong>Constitutum:</strong> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </li>
            </ul>

            <h3>Quid est documentum secretum?</h3>

            <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>

            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <p>
                Documenta quae informationes secretas continent semper registranda sunt.
            </p>
        @endaccordion__item
    @endfor
@endaccordion
