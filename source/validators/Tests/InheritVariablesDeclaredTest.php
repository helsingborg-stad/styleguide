<?php

namespace HbgStyleGuide\Validators\Tests;

use HbgStyleGuide\Validators\Sass\InheritVariablesDeclaredValidator;
use PHPUnit\Framework\TestCase;

/**
 * Verifies that every --inherit-* CSS custom property used in component SCSS
 * files is registered via @property with inherits: false.
 *
 * The --inherit-* convention marks runtime hook variables that must not
 * propagate through the cascade. Registering them with inherits: false
 * makes that contract explicit and browser-enforced.
 */
class InheritVariablesDeclaredTest extends TestCase
{
    /**
     * Returns the path to the component directory to scan.
     *
     * @return string
     */
    private static function getComponentPath(): string
    {
        return getenv('VALIDATOR_COMPONENT_PATH') ?: dirname(__DIR__, 2) . '/sass/component';
    }

    /**
     * Collects all component SCSS files to test, preferring the new
     * source/components/{name}/style.scss structure but falling back to the
     * legacy source/sass/component/*.scss layout.
     *
     * @return string[]
     */
    private static function getComponentFiles(): array
    {
        $configuredPath = getenv('VALIDATOR_COMPONENT_PATH');
        if (is_string($configuredPath) && $configuredPath !== '') {
            $files = glob(rtrim($configuredPath, '/') . '/*.scss');
            return $files === false ? [] : $files;
        }

        $legacyPath = dirname(__DIR__, 2) . '/sass/component';
        $legacyFiles = glob($legacyPath . '/*.scss');
        if ($legacyFiles !== false && !empty($legacyFiles)) {
            return $legacyFiles;
        }

        $componentStyleFiles = glob(dirname(__DIR__, 2) . '/components/*/style.scss');
        return $componentStyleFiles === false ? [] : $componentStyleFiles;
    }

    /**
     * Provides one test case per SCSS file.
     *
     * @return array<string, array{string}>
     */
    public static function componentFilesProvider(): array
    {
        $files = self::getComponentFiles();

        if (empty($files)) {
            return ['no_files_found' => ['/dev/null']];
        }

        $cases = [];
        foreach ($files as $file) {
            $name = basename(dirname($file));
            $cases[$name] = [$file];
        }

        return $cases;
    }

    /**
     * Asserts that every --inherit-* variable in the file is declared as
     * an @property block with inherits: false.
     *
     * @dataProvider componentFilesProvider
     *
     * @param string $filePath Absolute path to the component SCSS file.
     *
     * @return void
     */
    public function testInheritVariablesAreDeclaredWithInheritsOff(string $filePath): void
    {
        if ($filePath === '/dev/null') {
            $this->markTestSkipped('No component SCSS files found in: ' . self::getComponentPath());
        }

        $validator = new InheritVariablesDeclaredValidator();
        $result = $validator->validate($filePath);

        $this->assertTrue(
            $result->isValid(),
            sprintf(
                "Undeclared or incorrectly declared --inherit-* variables in %s:\n%s",
                basename(dirname($filePath)),
                $result->format($filePath),
            ),
        );
    }
}
