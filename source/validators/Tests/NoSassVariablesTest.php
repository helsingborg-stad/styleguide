<?php

namespace MunicipioStyleGuide\Validators\Tests;

use MunicipioStyleGuide\Validators\Sass\NoSassVariablesValidator;
use PHPUnit\Framework\TestCase;

class NoSassVariablesTest extends TestCase
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
    public function testNoSassVariablesInComponent(string $filePath): void
    {
        if ($filePath === '/dev/null') {
            $this->markTestSkipped('No component SCSS files found in: ' . self::getComponentPath());
        }

        $validator = new NoSassVariablesValidator([
            '$_',
        ]);
        $result = $validator->validate($filePath);

        $this->assertTrue(
            $result->isValid(),
            sprintf(
                "Sass variables found in %s:\n%s",
                basename($filePath),
                $result->format($filePath),
            ),
        );
    }

    public function testAllowsComponentNameVariableInTokenCalls(): void
    {
        $filePath = tempnam(sys_get_temp_dir(), 'sass_');
        $this->assertNotFalse($filePath);

        $content = 'font-family: tokens.get($_, "h6-font-family");' . PHP_EOL;
        file_put_contents($filePath, $content);

        $validator = new NoSassVariablesValidator([
            '$_',
        ]);
        $result = $validator->validate($filePath);

        @unlink($filePath);

        $this->assertTrue(
            $result->isValid(),
            sprintf(
                "Expected \$_ to be allowed in tokens.get call:\n%s",
                $result->format($filePath),
            ),
        );
    }
}
