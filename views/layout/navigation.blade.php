<nav>
    <ul class="nav-aside">
        @foreach ($nav as $item => $subitems)
            <li class="{{ ($subitems) ? 'has-children' : '' }} {{ ($pageNow == $item) ? 'current' : '' }}">
                <a href="/{{ $item }}">{{ ucwords($item) }}</a>
                @if ($pageNow == $item && $subitems)
                    <ul class="sub-menu">
                    @foreach ($subitems as $subitem)
                        <li><a href="#{{ \HbgStyleGuide\Helper\FormatString::slug($subitem) }}">{{ ucwords($subitem) }}</a></li>
                    @endforeach
                    </ul>
                @endif
            </li>
        @endforeach
    </ul>
</nav>
