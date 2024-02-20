<?php

use HelsingborgStad\GlobalBladeService\GlobalBladeService;

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

        $reflector = new \ReflectionClass($componentClass);
        $classFilePath = $reflector->getFileName();

        $init = new ComponentLibrary\Init([dirname($classFilePath)]);
        $component = new $componentClass($data);

        $data = $component->getData();
        $blade = GlobalBladeService::getInstance();

        return $blade->makeView($view, $data)->render();
    }
}

require_once 'Bootstrap.php';
$cli = new CLI();
$cli->executeCommand($argv);
