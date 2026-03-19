<?php

namespace MunicipioStyleGuide\Validators\Tests;

use MunicipioStyleGuide\Validators\Sass\CssVariablesNamespacedValidator;
use PHPUnit\Framework\TestCase;

class CssVariablesNamespacedTest extends TestCase
{
    private static function getComponentPath(): string
    {
        return getenv('VALIDATOR_COMPONENT_PATH') ?: dirname(__DIR__, 2) . '/sass/component';
    }

    /**
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

    /** @return array<string, array{string}> */
    public static function componentFilesProvider(): array
    {
        $files = self::getComponentFiles();

        if (empty($files)) {
            return ['no_files_found' => ['/dev/null']];
        }

        $cases = [];
        foreach ($files as $file) {
            $name = basename($file, '.scss');
            $cases[$name] = [$file];
        }

        return $cases;
    }

    /**
     * @dataProvider componentFilesProvider
     */
    public function testCssVariablesAreNamespaced(string $filePath): void
    {
        if ($filePath === '/dev/null') {
            $this->markTestSkipped('No component SCSS files found in: ' . self::getComponentPath());
        }

        $validator = new CssVariablesNamespacedValidator();
        $result = $validator->validate($filePath);

        $this->assertTrue(
            $result->isValid(),
            sprintf(
                "Un-namespaced CSS custom properties in %s:\n%s",
                basename($filePath),
                $result->format($filePath),
            ),
        );
    }
}
