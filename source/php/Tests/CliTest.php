<?php

declare(strict_types=1);

namespace MunicipioStyleGuide\Tests;

use CLI;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

/**
 * @covers \CLI
 */
class CliTest extends TestCase
{
    /**
     * @return void
     *
     * @runInSeparateProcess
     */
    public function testExecuteCommandClearsBladeCacheWhenSupportedFlagsAreUsed(): void
    {
        $cachePath = sys_get_temp_dir() . '/styleguide-cli-cache-' . uniqid('', true);
        mkdir($cachePath . '/nested', 0777, true);
        file_put_contents($cachePath . '/compiled.php', '<?php echo 1;');
        file_put_contents($cachePath . '/nested/compiled-nested.php', '<?php echo 2;');

        define('BLADE_CACHE_PATH', $cachePath);

        require_once dirname(__DIR__, 3) . '/cli.php';

        $cli = new CLI();

        ob_start();
        $cli->executeCommand(['cli.php', 'cache', '--clear', '--blade', 'blade']);
        $output = (string) ob_get_clean();

        $this->assertStringContainsString('Cleared blade cache at', $output);
        $this->assertDirectoryExists($cachePath);
        $this->assertSame(['.', '..'], scandir($cachePath));

        @rmdir($cachePath);
    }

    /**
     * @return void
     *
     * @runInSeparateProcess
     */
    public function testExecuteCommandThrowsForUnsupportedCacheOptions(): void
    {
        require_once dirname(__DIR__, 3) . '/cli.php';

        $cli = new CLI();

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Unsupported cache options');

        $cli->executeCommand(['cli.php', 'cache', '--clear']);
    }
}
