<?php

namespace HbgStyleGuide;

use \HelsingborgStad\GlobalBladeEngine as Blade;
use \HbgStyleGuide\Helper\Documentation as DocHelper;

class View
{
    private $blade;

    /**
     * @param $view
     * @param array $data
     */
    public function show($view, $data = array(), $blade)
    {

        $blade = $this->registerLayoutViewComposer($blade);
        $blade = $this->registerMarkdownViewComposer($blade);
        
        try {
            echo $blade->make(
                'pages.' . $view,
                $data
            )->render();
        } catch (\Throwable $e) {
            echo $blade->make(
                'pages.404',
                array_merge(
                    $data,
                    array('errorMessage' => $e)
                )
            )->render();
        }
    }

    /**
     * @param $view
     * @param array $data
     * @throws \Exception
     */
    public function registerLayoutViewComposer($blade)
    {
        //Documentation module alias
        $blade->component("layout.doc", "doc");
        $blade->component("layout.utility_doc", "utility_doc");
        $blade->component("layout.script_doc", "script_doc");
  //Doc templates
        $docTemplates = array('layout.doc', 'layout.utility_doc', 'layout.script_doc');

        //Documentation module
        $blade->composer($docTemplates, function ($view) {

            $viewData = $this->accessProtected($view, 'data');

            if (isset($viewData['slug']) || isset($viewData['viewDoc'])) {
                $path = (isset($viewData['viewDoc'])) ?
                    "views/docs/" . $viewData['viewDoc']['type'] . "/" . $viewData['viewDoc']['root'] . "/" . ucfirst($viewData['viewDoc']['config']) . ".json" :
                    "source/library/src/Component/" . ucfirst($viewData['slug']) . "/*.json";

                //Locate config file
                $configFile = glob(BASEPATH . $path);

                //Get first occurance of config
                if (is_array($configFile) && !empty($configFile)) {
                    $configFile = array_pop($configFile);
                } else {
                    throw new \Exception("No config file found in " . $configFile);
                }

                //Read config
                if (!$configJson = file_get_contents($configFile)) {
                    throw new \Exception("Configuration file unreadable at " . $configFile);
                }

                //Check if valid json
                if (!$configJson = json_decode($configJson, true)) {
                    throw new \Exception("Invalid formatting of configuration file in " . $configFile);
                }

                //Check if has default object
                if (isset($configJson['default'])) {
                    $settings = $configJson['default'];
                } else if (isset($configJson['modifiers'])) {
                    $settings = $configJson['modifiers'];
                } else if (isset($configJson['attributes'])) {
                    $settings = $configJson['attributes'];
                } else {
                    $settings = array();
                }

                //Check if has available object
                if (isset($configJson['available'])) {
                    $available = $configJson['available'];
                } else {
                    $available = array();
                }

                //Check if has description object
                if (isset($configJson['description'])) {
                    $description = $configJson['description'];
                } else {
                    $description = array();
                }

                if (isset($configJson['responsive'])) {
                    $responsive = $configJson['responsive'];
                } else {
                    $responsive = array();
                }

                if (isset($configJson['summary'])) {
                    $summary = implode(' ', $configJson['summary']);
                } else {
                    $summary = null;
                }

                if (isset($configJson['format'])) {
                    $format = $configJson['format'];
                } else {
                    $format = array();
                }

            } else {
                $settings = array();
                $description = array();
                $configFile = false;
            }

            if (isset($viewData['slug']) && $viewData['slug'] === 'card') {
                $paper = [
                    'transparencyContainer' => true,
                    'transparencyDocContainer' => false,
                    'containerPadding' => 0,
                    'docContainerPadding' => 3,
                ];
            } else {
                $paper = [
                    'transparencyContainer' => false,
                    'transparencyDocContainer' => true,
                    'containerPadding' => 3,
                    'docContainerPadding' => 0,
                ];
            }

            $view->with([
                'summary' => $summary,
                'format' => $format,
                'responsive' => $responsive,
                'description' => $description,
                'available' => $available,
                'settings' => $settings,
                'settingsLocation' => $configFile,
                'componentSlug' => isset($viewData['slug']) ? $viewData['slug'] : false,
                'displayParams' => isset($viewData['displayParams']) ? $viewData['displayParams'] : true,
                'paper' => $paper,
                'examples' => isset($viewData['slug']) ? DocHelper::getUsageExamples($viewData['slug']) : ""
            ]);

            

        });

        return $blade;
    }

    /**
     * Fetch examples from the usage directory
     * @throws \Exception
     */
    public static function fetchExamples($slug)
    {
        $examples = DocHelper::getUsageExamples($slug);

    }

    /**
     * Register Markdown component alias and view composer
     * @throws \Exception
     */
    public static function registerMarkdownViewComposer($blade)
    {
        // Register component alias
        $blade->component('layout.markdown', 'markdown');

        // Markdown module
        $blade->composer('layout.markdown', function ($view) {
            $viewData = $this->accessProtected($view, 'data');

            $viewData['slot'] = isset($viewData['slot']) ? markdown($viewData['slot']) : '';

            $view->with($viewData);
        });

        return $blade;
    }

    /**
     * Proxy for accessing provate props
     *
     * @return string Array of values
     */
    public static function accessProtected($obj, $prop)
    {
        $reflection = new \ReflectionClass($obj);
        $property = $reflection->getProperty($prop);
        $property->setAccessible(true);
        return $property->getValue($obj);
    }
}
