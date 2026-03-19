<?php

namespace HbgStyleGuide\Validators\Tests;

use HbgStyleGuide\Validators\Sass\TokenMixingValidator;
use PHPUnit\Framework\TestCase;

class TokenMixingTest extends TestCase
{
    /** @var string[] Utility files allowed to use Sass variables (not yet migrated) */
    private const ALLOWED_FILES = [
        '_border.scss',
        '_container.scss',
        '_layouts.scss',
    ];

    private static function getUtilityPath(): string
    {
        return getenv('VALIDATOR_UTILITY_PATH') ?: dirname(__DIR__, 2) . '/sass/utility';
    }

    /**
     * @return string[]
     */
    private static function getUtilityFiles(): array
    {
        $configuredPath = getenv('VALIDATOR_UTILITY_PATH');
        if (is_string($configuredPath) && $configuredPath !== '') {
            $files = glob(rtrim($configuredPath, '/') . '/*.scss');
            return $files === false ? [] : $files;
        }

        $legacyPath = dirname(__DIR__, 2) . '/sass/utility';
        $legacyFiles = glob($legacyPath . '/*.scss');
        if ($legacyFiles !== false && !empty($legacyFiles)) {
            return $legacyFiles;
        }

        $genericUtilityFiles = glob(dirname(__DIR__, 2) . '/sass/generic/*.scss');
        return $genericUtilityFiles === false ? [] : $genericUtilityFiles;
    }

    /** @return array<string, array{string}> */
    public static function utilityFilesProvider(): array
    {
        $files = self::getUtilityFiles();

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
     * @dataProvider utilityFilesProvider
     */
    public function testNoTokenMixinInUtility(string $filePath): void
    {
        if ($filePath === '/dev/null') {
            $this->markTestSkipped('No utility SCSS files found in: ' . self::getUtilityPath());
        }

        if (in_array(basename($filePath), self::ALLOWED_FILES, true)) {
            $this->markTestSkipped(basename($filePath) . ' is temporarily allowed to use Sass variables.');
        }

        $validator = new TokenMixingValidator();
        $result = $validator->validate($filePath);

        $this->assertTrue(
            $result->isValid(),
            sprintf(
                "Token mixing found in %s — use CSS custom properties instead of Sass variables:\n%s",
                basename($filePath),
                $result->format($filePath),
            ),
        );
    }
}
