<?php

namespace HbgStyleGuide\Validators\Tests;

use PHPUnit\Framework\TestCase;
use HbgStyleGuide\Validators\Sass\CssVariablesNamespacedValidator;

class CssVariablesNamespacedTest extends TestCase
{
    private static function getComponentPath(): string
    {
        return getenv('VALIDATOR_COMPONENT_PATH')
            ?: dirname(__DIR__, 2) . '/sass/component';
    }

    /** @return array<string, array{string}> */
    public static function componentFilesProvider(): array
    {
        $path  = self::getComponentPath();
        $files = glob($path . '/*.scss');

        if ($files === false || empty($files)) {
            return ['no_files_found' => ['/dev/null']];
        }

        $cases = [];
        foreach ($files as $file) {
            $name         = basename($file, '.scss');
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
        $result    = $validator->validate($filePath);

        $this->assertTrue(
            $result->isValid(),
            sprintf(
                "Un-namespaced CSS custom properties in %s:\n%s",
                basename($filePath),
                $result->format($filePath)
            )
        );
    }
}
