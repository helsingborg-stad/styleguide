<?php

namespace MunicipioStyleGuide\Validators\Tests;

use MunicipioStyleGuide\Validators\Sass\ComponentCompositionArchitectureValidator;
use PHPUnit\Framework\TestCase;

/**
 * Verifies that parent components only affect nested components via approved composition APIs.
 */
class ComponentCompositionArchitectureValidatorTest extends TestCase
{
    /**
     * Ensures a parent component does not reach into another component's internal BEM elements.
     *
     * @return void
     */
    public function testRejectsNestedComponentInternalSelectors(): void
    {
        $filePath = $this->createTempScssFile(
            <<<'SCSS'
.c-header {
    .c-nav .c-nav__link {
        color: red;
    }
}
SCSS
        );

        $validator = new ComponentCompositionArchitectureValidator();
        $result = $validator->validate($filePath);

        @unlink($filePath);

        $this->assertFalse($result->isValid(), 'Expected nested component internal selector to be rejected.');
    }

    /**
     * Ensures the outermost element of a nested component can still be targeted directly.
     *
     * @return void
     */
    public function testAllowsTargetingNestedComponentOutermostElement(): void
    {
        $filePath = $this->createTempScssFile(
            <<<'SCSS'
.c-block {
    [data-component="group"] {
        width: 100%;
    }

    .c-nav {
        --c-nav--item-color: red;
    }
}
SCSS
        );

        $validator = new ComponentCompositionArchitectureValidator();
        $result = $validator->validate($filePath);

        @unlink($filePath);

        $this->assertTrue(
            $result->isValid(),
            sprintf("Expected outermost component targeting to be allowed:\n%s", $result->format($filePath)),
        );
    }

    /**
     * Ensures descendant targeting inside a data-component boundary is rejected.
     *
     * @return void
     */
    public function testRejectsTargetingInsideDataComponentBoundary(): void
    {
        $filePath = $this->createTempScssFile(
            <<<'SCSS'
.c-hero {
    [data-component="typography"] .c-typography__variant--h1 {
        color: red;
    }
}
SCSS
        );

        $validator = new ComponentCompositionArchitectureValidator();
        $result = $validator->validate($filePath);

        @unlink($filePath);

        $this->assertFalse($result->isValid(), 'Expected nested selector inside [data-component] to be rejected.');
    }

    /**
     * Creates a temporary SCSS file for validator tests.
     *
     * @param string $content SCSS content to write.
     *
     * @return string
     */
    private function createTempScssFile(string $content): string
    {
        $filePath = tempnam(sys_get_temp_dir(), 'scss_component_architecture_');
        $this->assertNotFalse($filePath);

        file_put_contents($filePath, $content);

        return $filePath;
    }
}
