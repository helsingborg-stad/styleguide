<?php

require_once __DIR__ . '/vendor/autoload.php';

use ComponentLibrary\Init;
use ComponentLibrary\Helper\TagSanitizer;

class CLI
{

    public function executeCommand(array $args): void
    {
        $output = $this->renderComponent($args[1], $args[2], $args[3]);
        echo $output . PHP_EOL;
    }

    private function renderComponent(string $componentClass, string $view, string $componentDataJSON): string
    {
        if (!class_exists($componentClass)) {
            throw new Error("Class $componentClass does not exist");
        }

        try {
            $data = json_decode($componentDataJSON, true);
        } catch (Exception $e) {
            throw new Error("Could not decode JSON data");
        }

        $component = new $componentClass(
            $data, 
            new ComponentLibrary\Cache\StaticCache(),
            new TagSanitizer()
        );
        $componentClassPath = (new ReflectionClass($componentClass))->getFileName();
        $componentClassDir = dirname($componentClassPath);

        $data = $component->getData();
        $bladeService = (new Init([]))->getEngine();
        return $bladeService->makeView($view, $data, [], $componentClassDir)->render();
    }
}

$cli = new CLI();
$cli->executeCommand($argv);
