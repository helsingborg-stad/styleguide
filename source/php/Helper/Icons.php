<?php

namespace HbgStyleGuide\Helper;

class Icons
{
    private static function getCategories()
    {
        $jsonString = file_get_contents(BASEPATH . "assets/dist/css/fonts/icons.json");
        
        return json_decode($jsonString, true)['icons'];
    }

    public static function getIcons()
    {
        $categories = self::getCategories();
        $names = self::getNames();
        $icons = [];
        
        foreach ($names as $key => $name) {
            foreach ($categories as $key => $icon) {
                if ($icon['name'] == $name) {
                    $icons[ucfirst($icon['categories'][0])][] = $icon['name'];
                }
            }
        }
        return $icons;
    }

    private static function getNames()
    {
        $icons = json_decode(file_get_contents((BASEPATH . 'assets/dist/css/fonts/MaterialIcons-Regular.json')), true);
        
        return $icons = array_keys($icons);
    }
}
