<?php

namespace HbgStyleGuide;

use Philo\Blade\Blade as Blade;

class View
{
    /**
     * Displays the given view
     * @param  string  $template      The view path (if in subfolder) and filename
     * @param  boolean $displayErrors Weather to output errors or not
     * @return boolean
     */
    public static function show($view, $data = array())
    {
        $blade = new Blade(VIEWS_PATH, CACHE_PATH);

        if($blade->view()->exists($view)) {
            echo $blade->view()->make($view, $data)->render();
            return true;
        } else {
            echo $blade->view()->make('404', $data)->render();
            return false;
        }
    }
}
