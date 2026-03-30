<?php

declare(strict_types=1);

/**
 * CLI script to render components using the Component Library.
 * Usage: php cli.php <componentClass> <view> <componentDataJSON>
 *
 * This is used to do frontend testing of components in the Component Library.
 * Implemented in JEST.
 */

require_once __DIR__ . '/vendor/autoload.php';

use ComponentLibrary\Helper\TagSanitizer;
use ComponentLibrary\Init;

class CLI
{
    /**
     * Runs the CLI command.
     *
     * Supported commands:
     * - cache --clear --blade blade
     * - <componentClass> <view> <componentDataJSON>
     *
     * @param array<int, string> $args CLI arguments including script name.
     *
     * @return void
     */

    public function executeCommand(array $args): void
    {
        if (count($args) < 2) {
            throw new InvalidArgumentException('Missing command.');
        }

        if ($args[1] === 'cache') {
            $this->executeCacheCommand(array_slice($args, 2));
            return;
        }

        if (count($args) < 4) {
            throw new InvalidArgumentException('Invalid component render command arguments.');
        }

        $output = $this->renderComponent($args[1], $args[2], $args[3]);
        echo $output . PHP_EOL;
    }

    /**
     * Executes supported cache command options.
     *
     * @param array<int, string> $args Cache command arguments.
     *
     * @return void
     */
    private function executeCacheCommand(array $args): void
    {
        if ($args !== ['--clear', '--blade', 'blade']) {
            throw new InvalidArgumentException('Unsupported cache options. Use: cache --clear --blade blade');
        }

        $bladeCachePath = $this->resolveBladeCachePath();
        $removedEntries = $this->flushDirectory($bladeCachePath);

        echo
            sprintf(
                'Cleared blade cache at %s (%d entries removed).%s',
                $bladeCachePath,
                $removedEntries,
                PHP_EOL,
            )
        ;
    }

    /**
     * Resolves the Blade cache path using the same fallback order as BladeService.
     *
     * @return string
     */
    private function resolveBladeCachePath(): string
    {
        if (defined('BLADE_CACHE_PATH') && !empty((string) constant('BLADE_CACHE_PATH'))) {
            return (string) constant('BLADE_CACHE_PATH');
        }

        return sys_get_temp_dir() . '/blade-cache';
    }

    /**
     * Removes all files and folders in a directory while keeping the directory itself.
     *
     * @param string $directory Directory to flush.
     *
     * @return int Number of removed filesystem entries.
     */
    private function flushDirectory(string $directory): int
    {
        if (!is_dir($directory)) {
            return 0;
        }

        $removedEntries = 0;
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST,
        );

        /** @var SplFileInfo $item */
        foreach ($iterator as $item) {
            if ($item->isDir()) {
                if (rmdir($item->getPathname())) {
                    $removedEntries++;
                }
                continue;
            }

            if (unlink($item->getPathname())) {
                $removedEntries++;
            }
        }

        return $removedEntries;
    }

    private function renderComponent(string $componentClass, string $view, string $componentDataJSON): string
    {
        if (!class_exists($componentClass)) {
            throw new Error("Class $componentClass does not exist");
        }

        try {
            $data = json_decode($componentDataJSON, true);
        } catch (Exception $e) {
            throw new Error('Could not decode JSON data');
        }

        $component = new $componentClass(
            $data,
            new ComponentLibrary\Cache\StaticCache(),
            new TagSanitizer(),
        );
        $componentClassPath = (new ReflectionClass($componentClass))->getFileName();
        $componentClassDir = dirname($componentClassPath);

        $data = $component->getData();
        $bladeService = (new Init([]))->getEngine();
        return $bladeService->makeView($view, $data, [], $componentClassDir)->render();
    }
}

if (PHP_SAPI === 'cli' && realpath((string) ($_SERVER['SCRIPT_FILENAME'] ?? '')) === __FILE__) {
    $cli = new CLI();
    $cli->executeCommand($argv);
}
