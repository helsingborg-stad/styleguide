<nav>
    <ul class="nav-aside">
        @foreach ($nav as $item => $subitems)
            <li class="">
                <a href="/{{ $item }}">{{ \HbgStyleGuide\Navigation::readableFilename($item) }}</a>
                @if (is_array($subitems) && !empty($subitems))
                    <ul class="sub-menu" style="display: block;">
                        @foreach ($subitems as $subitem)
                            <li><a href="/{{ $item }}/{{ $subitem }}">{{ \HbgStyleGuide\Navigation::readableFilename($subitem) }}</a></li>
                        @endforeach
                    </ul>
                @endif
            </li>
        @endforeach
    </ul>
</nav>
