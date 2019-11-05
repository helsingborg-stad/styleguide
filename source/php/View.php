<?php

namespace HbgStyleGuide;

use \HelsingborgStad\GlobalBladeEngine as Blade; 

class View
{
    /**
     * @param $view
     * @param array $data
     */
    public static function show($view, $data = array())
    {
        self::registerLayoutViewComposer();
        self::registerMarkdownViewComposer();

        try {
            echo Blade::instance()->make(
                'pages.' . $view,
                $data
            )->render();
        } catch(\Throwable $e) {
            echo Blade::instance()->make(
                'pages.404',
                array_merge(
                    $data,
                    array('errorMessage' => $e->getMessage())
                )
            )->render();
        }
    }

    /**
     * @param $view
     * @param array $data
	 * @throws \Exception
	 */
    public static function registerLayoutViewComposer()
    {
        //Documentation module alias
        Blade::instance()->component("layout.doc", "doc");
        Blade::instance()->component("layout.utility_doc", "utility_doc");
        Blade::instance()->component("layout.script_doc", "script_doc");

        //Doc templates
        $docTemplates = array('layout.doc','layout.utility_doc', 'layout.script_doc');

        //Documentation module
        Blade::instance()->composer($docTemplates, function ($view) {
            
            $viewData = self::accessProtected($view, 'data');
         
            if(isset($viewData['slug']) || isset($viewData['viewDoc'])) {
                $path = (isset($viewData['viewDoc'])) ?
                    "views/docs/" . $viewData['viewDoc']['type'] . "/". $viewData['viewDoc']['root'] . "/" . ucfirst($viewData['viewDoc']['config']) . ".json":
                    "source/library/src/Component/". ucfirst($viewData['slug']) . "/*.json" ;
                
                //Locate config file
                $configFile = glob(BASEPATH . $path);
                
                //Get first occurance of config
                if(is_array($configFile) && !empty($configFile)) {
                    $configFile = array_pop($configFile); 
                } else {
                    throw new \Exception("No config file found in " . $configFile);
                }

                //Read config
                if(!$configJson = file_get_contents($configFile)) {
                    throw new \Exception("Configuration file unreadable at " . $configFile);
                }

                //Check if valid json
                if(!$configJson = json_decode($configJson, true)) {
                    throw new \Exception("Invalid formatting of configuration file in " . $configFile);
                }

                //Check if has default object
                if(isset($configJson['default'])) {
                    $settings = $configJson['default'];
                } else if (isset($configJson['modifiers'])) {
                    $settings = $configJson['modifiers'];
                } else if (isset($configJson['attributes'])) {
                    $settings = $configJson['attributes'];
                } else {
                    $settings = array(); 
                }

                 //Check if has description object
                if(isset($configJson['description'])) {
                    $description = $configJson['description']; 
                } else {
                    $description = array(); 
                }

                if(isset($configJson['responsive'])) {
                    $responsive = $configJson['responsive']; 
                } else {
                    $responsive = array(); 
                }

                if(isset($configJson['summary'])) {
                    $summary = implode(' ', $configJson['summary']); 
                } else {
                    $summary = null; 
                }

                if(isset($configJson['format'])) {
                    $format = $configJson['format']; 
                } else {
                    $format = array(); 
                }

            } else {
                $settings = array(); 
                $description = array(); 
                $configFile = false; 
            }

            $view->with([
                'summary' => $summary,
                'format' => $format,
                'responsive' => $responsive,
                'description' => $description,
                'settings' => $settings,
                'settingsLocation' => $configFile,
                'componentSlug' => isset($viewData['slug']) ? $viewData['slug'] : false,
				'displayParams' => isset($viewData['displayParams']) ? $viewData['displayParams'] : true
            ]); 

        });
    }

    /**
     * Register Markdown component alias and view composer
     * @throws \Exception
     */
    public static function registerMarkdownViewComposer()
    {
        // Register component alias
        Blade::instance()->component('layout.markdown', 'markdown');

        // Markdown module
        Blade::instance()->composer('layout.markdown', function ($view) {
            $viewData = self::accessProtected($view, 'data');

            $viewData['slot'] = isset($viewData['slot']) ? markdown($viewData['slot']) : '';

            $view->with($viewData);
        });
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
