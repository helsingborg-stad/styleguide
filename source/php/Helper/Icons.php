<?php

namespace HbgStyleGuide\Helper;

class Icons
{
    public static function getJson()
    {
        if($jsonString = file_get_contents(BASEPATH . "assets/dist/icons/styleguide-icons.json")) {
            return json_decode($jsonString);
        }
        return false;
    }

    public static function getTxt()
    {
        $lines = file(BASEPATH . 'node_modules/material-design-icons/iconfont/codepoints');
        $iconNames = array();
        foreach($lines as $key => $line)
        {
            
            $name = explode(" ", $line);
            $iconNames[] = $name[0];
        }
        return $iconNames;
    }
}
