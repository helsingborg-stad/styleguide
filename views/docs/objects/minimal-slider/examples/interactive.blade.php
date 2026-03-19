<section class="o-minimal-slider" data-minimal-slider style="--slides-per-view: 1;">
    <div class="o-minimal-slider__toolbar" aria-label="Slider options">
        <div class="o-minimal-slider__field">
            @select([
                'label' => 'Slides per view',
                'preselected' => '1',
                'options' => [
                    '1' => '1',
                    '2' => '2',
                    '3' => '3',
                ],
                'classList' => ['o-minimal-slider__select'],
                'attributeList' => [
                    'data-slider-per-view-wrapper' => '',
                ],
                'selectAttributeList' => [
                    'data-slider-per-view' => '',
                ]
            ])
            @endselect
        </div>

    </div>

    <div class="o-minimal-slider__viewport">
        <ul class="o-minimal-slider__track" id="minimal-slider-track" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Highlighted stories" data-slider-track>
            <li class="o-minimal-slider__slide" role="group" aria-roledescription="slide" aria-label="1 of 6">
                @segment([
                    'title' => 'Story One',
                    'content' => 'Swipe, drag or use arrow keys. Native scroll snap does the heavy lifting.',
                    'layout' => 'card',
                    'image' => 'https://picsum.photos/id/19/720/400',
                    'containerAware' => true,
                    'link' => 'https://getmunicipio.com'
                ])
                @endsegment
            </li>
            <li class="o-minimal-slider__slide" role="group" aria-roledescription="slide" aria-label="2 of 6">
                @segment([
                    'title' => 'Story Two',
                    'content' => 'Works with one slide or several per page through a CSS custom property.',
                    'layout' => 'card',
                    'image' => 'https://picsum.photos/id/47/720/400',
                    'containerAware' => true,
                    'link' => 'https://getmunicipio.com',
                    'reverseColumns' => true
                ])
                @endsegment
            </li>
            <li class="o-minimal-slider__slide" role="group" aria-roledescription="slide" aria-label="3 of 6">
                @segment([
                    'title' => 'Story Three',
                    'content' => 'Screen readers get status updates through a polite live region.',
                    'layout' => 'card',
                    'image' => 'https://picsum.photos/id/102/720/400',
                    'containerAware' => true,
                    'link' => 'https://getmunicipio.com'
                ])
                @endsegment
            </li>
            <li class="o-minimal-slider__slide" role="group" aria-roledescription="slide" aria-label="4 of 6">
                @segment([
                    'title' => 'Story Four',
                    'content' => 'Touch interaction remains native and smooth on mobile screens.',
                    'layout' => 'card',
                    'image' => 'https://picsum.photos/id/110/720/400',
                    'containerAware' => true,
                    'link' => 'https://getmunicipio.com',
                    'reverseColumns' => true
                ])
                @endsegment
            </li>
            <li class="o-minimal-slider__slide" role="group" aria-roledescription="slide" aria-label="5 of 6">
                @segment([
                    'title' => 'Story Five',
                    'content' => 'The script only handles controls, focus, and accessibility state.',
                    'layout' => 'card',
                    'image' => 'https://picsum.photos/id/144/720/400',
                    'containerAware' => true,
                    'link' => 'https://getmunicipio.com'
                ])
                @endsegment
            </li>
            <li class="o-minimal-slider__slide" role="group" aria-roledescription="slide" aria-label="6 of 6">
                @segment([
                    'title' => 'Story Six',
                    'content' => 'Try different animation styles to match the surrounding interface tone.',
                    'layout' => 'card',
                    'image' => 'https://picsum.photos/id/168/720/400',
                    'containerAware' => true,
                    'link' => 'https://getmunicipio.com',
                    'buttons' => [['text' => 'Read more', 'href' => 'https://getmunicipio.com']]
                ])
                @endsegment
            </li>
        </ul>
    </div>

    <div class="o-minimal-slider__controls">
        @button([
            'style' => 'filled',
            'color' => 'secondary',
            'shape' => 'pill',
            'classList' => ['o-minimal-slider__button'],
            'icon' => 'chevron_backward',
            'attributeList' => [
                'type' => 'button',
                'data-slider-prev' => '',
                'aria-controls' => 'minimal-slider-track'
            ]
        ])
        @endbutton

        @button([
            'icon' => 'chevron_forward',
            'style' => 'filled',
            'color' => 'secondary',
            'classList' => ['o-minimal-slider__button'],
            'shape' => 'pill',
            'attributeList' => [
                'type' => 'button',
                'data-slider-next' => '',
                'aria-controls' => 'minimal-slider-track'
            ]
        ])
        @endbutton

        <!-- Status element for screen readers -->
        <p class="o-minimal-slider__meta u-sr__only" data-slider-status aria-live="polite">Slide 1 of 6</p>
    </div>
</section>

<script>
(function () {
    const slider = document.querySelector('[data-minimal-slider]');
    if (!slider) {
        return;
    }

    const track = slider.querySelector('[data-slider-track]');
    const prevButton = slider.querySelector('[data-slider-prev]');
    const nextButton = slider.querySelector('[data-slider-next]');
    const perViewSelect = slider.querySelector('[data-slider-per-view]') || slider.querySelector('[data-slider-per-view-wrapper] [data-js-select-element]');
    const status = slider.querySelector('[data-slider-status]');
    const slides = Array.from(track.querySelectorAll('.o-minimal-slider__slide'));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentIndex = 0;
    let isTicking = false;

    const getMaxStartIndex = () => {
        return Math.max(0, slides.length - getStep());
    };

    const clampToStartIndex = (index) => {
        return Math.max(0, Math.min(index, getMaxStartIndex()));
    };

    const getMaxScrollLeft = () => {
        return Math.max(0, track.scrollWidth - track.clientWidth);
    };

    const getSlideTargetLeft = (index) => {
        const slide = slides[index];
        if (!slide) {
            return 0;
        }

        return Math.min(slide.offsetLeft, getMaxScrollLeft());
    };

    const getStep = () => {
        const perView = Math.max(1, parseInt(getComputedStyle(slider).getPropertyValue('--slides-per-view'), 10) || 1);
        return Math.max(1, perView);
    };

    const scrollToIndex = (index) => {
        const boundedIndex = clampToStartIndex(index);
        const targetLeft = getSlideTargetLeft(boundedIndex);

        track.scrollTo({
            left: targetLeft,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    };

    const getNearestIndex = () => {
        const maxStartIndex = getMaxStartIndex();
        const startIndices = Array.from({ length: maxStartIndex + 1 }, (_, index) => index);

        return startIndices.reduce((bestIndex, slideIndex) => {
            const bestDistance = Math.abs(getSlideTargetLeft(bestIndex) - track.scrollLeft);
            const currentDistance = Math.abs(getSlideTargetLeft(slideIndex) - track.scrollLeft);
            return currentDistance < bestDistance ? slideIndex : bestIndex;
        }, 0);
    };

    const getSlideStepPx = () => {
        if (slides.length < 2) {
            return track.clientWidth || 1;
        }

        return Math.max(1, slides[1].offsetLeft - slides[0].offsetLeft);
    };

    const updateSlideMotionFromScroll = () => {
        const visibleCount = getStep();
        const slideStepPx = getSlideStepPx();
        const slotOffsets = Array.from({ length: visibleCount }, (_, slotIndex) => track.scrollLeft + (slotIndex * slideStepPx));

        slides.forEach((slide) => {
            const slideOffset = slide.offsetLeft;
            const nearestDistance = slotOffsets.reduce((bestDistance, slotOffset) => {
                return Math.min(bestDistance, Math.abs(slideOffset - slotOffset));
            }, Number.POSITIVE_INFINITY);

            const progress = Math.max(0, Math.min(1, 1 - (nearestDistance / slideStepPx)));
            slide.style.setProperty('--slide-progress', progress.toFixed(3));
            slide.style.setProperty('--slide-inactive', (1 - progress).toFixed(3));
        });
    };

    const setCurrentSlide = (index) => {
        currentIndex = clampToStartIndex(index);
        const visibleCount = getStep();
        const visibleEndIndex = Math.min(slides.length - 1, currentIndex + visibleCount - 1);

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex >= currentIndex && slideIndex <= visibleEndIndex;
            slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        if (status) {
            if (visibleCount > 1 && visibleEndIndex > currentIndex) {
                status.textContent = 'Slides ' + (currentIndex + 1) + '-' + (visibleEndIndex + 1) + ' of ' + slides.length;
            } else {
                status.textContent = 'Slide ' + (currentIndex + 1) + ' of ' + slides.length;
            }
        }

        if (prevButton) {
            prevButton.disabled = currentIndex === 0;
        }

        if (nextButton) {
            nextButton.disabled = currentIndex >= slides.length - getStep();
        }
    };

    const updateIndexFromScroll = () => {
        const nearest = getNearestIndex();

        setCurrentSlide(nearest);
    };

    if (prevButton) {
        prevButton.addEventListener('click', () => scrollToIndex(currentIndex - getStep()));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => scrollToIndex(currentIndex + getStep()));
    }

    if (perViewSelect) {
        perViewSelect.addEventListener('change', (event) => {
            const selectedValue = parseInt(event.target.value, 10);
            slider.style.setProperty('--slides-per-view', String(Math.max(1, Math.min(selectedValue, 3))));
            currentIndex = clampToStartIndex(currentIndex);
            scrollToIndex(currentIndex);
            updateIndexFromScroll();
            updateSlideMotionFromScroll();
        });
    }

    track.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            scrollToIndex(currentIndex + getStep());
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            scrollToIndex(currentIndex - getStep());
        }

        if (event.key === 'Home') {
            event.preventDefault();
            scrollToIndex(0);
        }

        if (event.key === 'End') {
            event.preventDefault();
            scrollToIndex(slides.length - 1);
        }
    });

    track.addEventListener('scroll', () => {
        if (isTicking) {
            return;
        }

        isTicking = true;
        window.requestAnimationFrame(() => {
            updateSlideMotionFromScroll();
            updateIndexFromScroll();
            isTicking = false;
        });
    }, { passive: true });

    track.scrollLeft = getSlideTargetLeft(0);
    setCurrentSlide(0);
    updateSlideMotionFromScroll();
})();
</script>
