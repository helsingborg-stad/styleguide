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
        try {
            echo Blade::instance()->make(
                $view,
                $data
            )->render();
        } catch(\Throwable $e) {
            echo Blade::instance()->make(
                '404',
                $data
            )->render();
        }
    }
}
