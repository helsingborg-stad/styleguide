<?php

namespace HbgStyleGuide\Validators\Tests;

use PHPUnit\Framework\TestCase;
use HbgStyleGuide\Validators\Sass\TokenMixingValidator;

class TokenMixingTest extends TestCase
{
    /** @var string[] Utility files allowed to use Sass variables (not yet migrated) */
    private const ALLOWED_FILES = [
        '_border.scss',
    ];

    private static function getUtilityPath(): string
    {
        return getenv('VALIDATOR_UTILITY_PATH')
            ?: dirname(__DIR__, 2) . '/sass/utility';
    }

    /** @return array<string, array{string}> */
    public static function utilityFilesProvider(): array
    {
        $path  = self::getUtilityPath();
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
     * @dataProvider utilityFilesProvider
     */
    public function testNoTokenMixingInUtility(string $filePath): void
    {
        if ($filePath === '/dev/null') {
            $this->markTestSkipped('No utility SCSS files found in: ' . self::getUtilityPath());
        }

        if (in_array(basename($filePath), self::ALLOWED_FILES, true)) {
            $this->markTestSkipped(basename($filePath) . ' is temporarily allowed to use Sass variables.');
        }

        $validator = new TokenMixingValidator();
        $result    = $validator->validate($filePath);

        $this->assertTrue(
            $result->isValid(),
            sprintf(
                "Token mixing found in %s — use CSS custom properties instead of Sass variables:\n%s",
                basename($filePath),
                $result->format($filePath)
            )
        );
    }
}
