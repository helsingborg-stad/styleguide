<?php

namespace HbgStyleGuide;

use \HbgStyleGuide\Helper\Documentation as DocHelper;
use \HbgStyleGuide\Helper\ModifierExample;
use HelsingborgStad\BladeService\BladeServiceInterface;

class View
{
    /**
     * @param $view
     * @param array $data
     */
    public function show($view, $data = array(), BladeServiceInterface $blade = null)
    {
        $this->registerLayoutViewComposer($blade);
        $this->registerMarkdownViewComposer($blade);

        try {
            $result = $blade->makeView( 'pages.' . $view, $data )->render();
            echo preg_replace('/(id|href)=""/', "", $result);
        } catch (\Throwable $e) {
            if(!$this->viewExists($view)) {
                $data = array_merge( $data, array('errorMessage' => $e) );
                echo $blade->makeView( 'pages.404', $data )->render();
                return;
            }
            $blade->errorHandler($e)->print();
        }
    }

    private function viewExists($view): bool
    {
        return file_exists(BASEPATH . 'views/pages/' . str_replace(".", "/", $view) . '.blade.php');
    }

    /**
     * @param $view
     * @param array $data
     * @throws \Exception
     */
    public function registerLayoutViewComposer(BladeServiceInterface $blade)
    {
        //Documentation module alias
        $blade->registerComponentDirective("layout.doc", "doc");
        $blade->registerComponentDirective("layout.utility_doc", "utility_doc");
        $blade->registerComponentDirective("layout.script_doc", "script_doc");
        $blade->registerComponentDirective("layout.mixins_doc", "mixins_doc");
  
        //Doc templates
        $docTemplates = array('layout.doc', 'layout.utility_doc', 'layout.script_doc', 'layout.mixins_doc');

        //Documentation module
        foreach ($docTemplates as $template) {
            $blade->registerComponent($template, function ($view) use ($blade) {

                $viewData = $this->accessProtected($view, 'data');

                // Get path to specific vendor package
                $componentLibraryPackagePath = $this->getVendorPackagePath('helsingborg-stad/component-library');
    
                if (isset($viewData['slug']) || isset($viewData['viewDoc'])) {
                    $path = (isset($viewData['viewDoc'])) ?
                        BASEPATH . "views/docs/" . $viewData['viewDoc']['type'] . "/" . $viewData['viewDoc']['root'] . "/" . ucfirst($viewData['viewDoc']['config']) . ".json" :
                        $componentLibraryPackagePath . "/source/php/Component/" . ucfirst($viewData['slug']) . "/*.json";
    
                    //Locate config file
                    $configFile = glob($path);
    
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
                    
                    // Check if has modifiers object.
                    if (isset($configJson['modifiers'])) {
                        $modifiers = $configJson['modifiers'];
                    } else {
                        $modifiers = array();
                    }
    
                    // Attempt to set up example usage of modifiers.
                    if (isset($viewData['slug']) && !empty($modifiers)) {
                        $firstModifier = array_keys((array)$modifiers)[0];
                        $modifiersExample = ModifierExample::get($viewData['slug'], $firstModifier);
                    } else {
                        $modifiersExample = null;
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
                    'modifiers' => $modifiers,
                    'available' => $available,
                    'settings' => $settings,
                    'settingsLocation' => $configFile,
                    'componentSlug' => isset($viewData['slug']) ? $viewData['slug'] : false,
                    'displayParams' => isset($viewData['displayParams']) ? $viewData['displayParams'] : true,
                    'paper' => $paper,
                    'examples' => isset($viewData['slug']) ? DocHelper::getUsageExamples($viewData['slug'], $blade) : "",
                    'modifiersExample' => $modifiersExample
                ]);
    
                
    
            });   
        }

        return $blade;
    }

    private function getVendorPackagePath($package):string {
        $path = getcwd() . '/vendor/' . $package;
        if (!is_dir($path)) {
            throw new \Exception("Package not found at " . $path);
        }
        return $path;
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
    public function registerMarkdownViewComposer(BladeServiceInterface $blade)
    {
        // Register component alias
        $blade->registerComponentDirective('layout.markdown', 'markdown');

        // Markdown module
        $blade->registerComponent('layout.markdown', function ($view) {
            $viewData = $this->accessProtected($view, 'data');

            $viewData['slot'] = isset($viewData['slot']) ? \markdown($viewData['slot']) : '';

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
