@footer()
    @slot('logotype')
        <img id="logotype" src="/assets/img/logotype-grey-full.svg" alt="Helsingborg Stad">
    @endslot

    @slot('about')
        @typography([
            "variant" => "h4",
            "element" => "h4"
        ])
            About
        @endtypography

        <div class="c-footer__links">
            <a href="/about/styleguide-structure">The styleguide</a>
            <span class="c-footer__link-divider"></span>
            <a href="/components">Atomic design</a>
            <span class="c-footer__link-divider"></span>
            <a href="/about/accessability">Accessability</a>
            <span class="c-footer__link-divider"></span>
            <a href="/about/authors">Authors</a>
        </div>
    @endslot

    @slot('documentation')
        @typography([
            "variant" => "h4",
            "element" => "h4"
        ])
            Documentation
        @endtypography

        <div class="c-footer__links">
            <a href="/components">Components</a>
            <span class="c-footer__link-divider"></span>
            <a href="/icons">Icons</a>
            <span class="c-footer__link-divider"></span>
            <a href="/mixins">Mixins</a>
            <span class="c-footer__link-divider"></span>
            <a href="/script">Scripts</a>
            <span class="c-footer__link-divider"></span>
            <a href="/utilities">Utilities</a>
        </div>
    @endslot

    @slot('links')
        @typography([
            "variant" => "h4",
            "element" => "h4"
        ])
            Links
        @endtypography

        <div class="c-footer__links">
            <a target="_blank" href="https://github.com/helsingborg-stad/styleguide">Github (Styleguide)</a>
            <span class="c-footer__link-divider"></span>
            <a target="_blank" href="https://github.com/helsingborg-stad/blade-component-library">Github (Component Library)</a>
            <span class="c-footer__link-divider"></span>
            <a target="_blank" href="https://helsingborg.se">Helsingborg.se</a>
        </div>
    @endslot

@endfooter