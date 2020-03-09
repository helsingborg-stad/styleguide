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

    private static function getCateGories(){
        $jsonString = file_get_contents(BASEPATH . "assets/data/icons.json"); 
        return json_decode($jsonString, true)['icons'];
        
        
    }

    public static function getIcons(){
        $categories = self::getCateGories();
        $names = self::getNames();
        $icons = [];
        
        foreach($names as $key => $name){
            foreach($categories as $key => $icon){
                if($icon['name'] == $name){
                    $icons[ucfirst($icon['categories'][0])][] = $icon['name'];
                }
            }
            
        }
        return $icons;
    }

    private static function getNames()
    {
        $lines = file(BASEPATH . 'assets/dist/css/codepoints');
        $icons = array();
        $categories = self::getCateGories();
        foreach($lines as $key => $line)
        {
            
            $name = explode(" ", $line);
            $icons[] = $name[0];
        }
        return $icons;
    }

   
}
