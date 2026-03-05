<div class="u-margin__bottom--2">
    <div id="{{ $exampleId }}-select-wrapper">
        @select([
            'label' => 'Apply utility class',
            'placeholder' => 'Not applied',
            'preselected' => '',
            'options' => $selectComponentOptions,
        ])
        @endselect
    </div>
</div>

<div class="u-margin__bottom--2">
    <span>Current class:</span>
    <code id="{{ $exampleId }}-current">Not applied</code>
</div>

<div class="u-clearfix u-padding--3" style="overflow: hidden; margin: calc(var(--base) * -3); min-height: 100px; position: relative; contain: layout paint;">
    <div id="{{ $exampleId }}-target" class="{{ $basePreviewClasses }}" style="transition: all 0.3s ease;">Utility preview element</div>
</div>

<script>
    (function () {
        var selectWrapperElement = document.getElementById('{{ $exampleId }}-select-wrapper');
        var selectElement = selectWrapperElement ? selectWrapperElement.querySelector('select') : null;
        var targetElement = document.getElementById('{{ $exampleId }}-target');
        var currentClassElement = document.getElementById('{{ $exampleId }}-current');
        if (!selectElement || !targetElement || !currentClassElement) {
            return;
        }

        var baseClasses = '{{ $basePreviewClasses }}';

        var applySelectedClass = function applySelectedClass() {
            var selectedClass = String(selectElement.value || '').trim();
            targetElement.className = selectedClass === '' ? baseClasses : baseClasses + ' ' + selectedClass;
            currentClassElement.textContent = selectedClass === '' ? 'Not applied' : selectedClass;
        };

        var updateContentWithSelectedClass = function updateContentWithSelectedClass() {
            var selectedClass = String(selectElement.value || '').trim();
            targetElement.textContent = selectedClass === '' ? 'Not applied' : selectedClass;
        };

        selectElement.addEventListener('change', updateContentWithSelectedClass);
        selectElement.addEventListener('change', applySelectedClass);
        applySelectedClass();
        updateContentWithSelectedClass();
    })();
</script>
