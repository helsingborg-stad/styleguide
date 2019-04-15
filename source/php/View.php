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
        self::registerViewComposer(); 

        try {
            echo Blade::instance()->make(
                $view,
                $data
            )->render();
        } catch(\Throwable $e) {
            echo Blade::instance()->make(
                '404',
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
    public static function registerViewComposer()
    {
        //Documentation module
        Blade::instance()->composer('layout.doc', function ($view) {
            $view->with(['settings' => ['key' => 'value']]); 
        });
    }
}
