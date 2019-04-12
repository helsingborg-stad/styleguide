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
        Blade::addViewPath(BASEPATH . 'source/library/src/Component');
        echo Blade::instance()->make($view, $data)->render();
    }
}
