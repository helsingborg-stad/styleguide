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
        Blade::addViewPath(BASEPATH . 'views');
        echo Blade::instance()->make($view, $data)->render();
    }
}
