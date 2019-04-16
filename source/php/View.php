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
     */
    public static function registerLayoutViewComposer()
    {
        //Documentation module alias
        Blade::instance()->component("layout.doc", "doc");

        //Documentation module
        Blade::instance()->composer('layout.doc', function ($view) {
            
            $viewData = self::accessProtected($view, 'data');

            if(isset($viewData['slug'])) {

                //Locate config file
                $configFile = glob(BASEPATH . "source/library/src/Component/". ucfirst($viewData['slug']) . "/*.json");

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
                $settings = $configJson['default']; 

            } else {
                $settings = array(); 
            }

            $view->with([
                'settings' => $settings,
                'settingsLocation' => $configFile,
                'componentSlug' => $viewData['slug']
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
