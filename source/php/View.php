<?php

namespace HbgStyleGuide;

class View
{
    /**
     * @param $view
     * @param array $data
     */
    public static function show($view, $data = array())
    {
        if (!class_exists('\LaravelBladeOneStatic\BladeOneStatic\BladeOneStatic')) {
            return false;
        }

        $bladeOne = new \LaravelBladeOneStatic\BladeOneStatic\BladeOneStatic();
        echo $bladeOne::loadPageTemplate($params = array(
            'template' => str_replace('/','.', $view),
            'data' => $data
        ));
    }
}
