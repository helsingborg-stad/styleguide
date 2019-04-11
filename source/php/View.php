<?php

namespace HbgStyleGuide;
use BC\Blade\Blade as Blade; 
class View
{
    /**
     * @param $view
     * @param array $data
     */
    public static function show($view, $data = array())
    {
        $blade = new Blade(BASEPATH . '/views', BASEPATH . '/cache');
        echo $blade->make($view, $data)->render();
    }
}
