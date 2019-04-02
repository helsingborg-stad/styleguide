<?php

namespace HbgStyleGuide;

class Navigation
{
    private static $unlisted = array(
        '.',
        '..',
        'layout',
        '404.blade.php'
    );


    /**
     * Creates a navigation array
     * @param  string  $template      The view path (if in subfolder) and filename
     * @param  boolean $displayErrors Weather to output errors or not
     * @return boolean
     */
    public static function items($folder = "/", $response = array())
    {

        $dirContents = scandir(VIEWS_PATH . $folder);

        if(is_array($dirContents) && !empty($dirContents)) {
            foreach($dirContents as $item) {
                if(!in_array($item, self::$unlisted)) {

                    //Remove blade suffix 
                    $item = self::sanitizeFileName($item); 

                    //Check if is dir (and traverse it)
                    if(is_dir(VIEWS_PATH . $folder . $item)) {
                        if(!array_key_exists($item, $response)) {
                            $response[$item] = self::items($folder . $item); 
                        }
                    }

                    //Add current level item
                    if(!array_key_exists($item, $response)) {
                        $response[$item] = $item;
                    }
                }
            }
        }

        return $response;
    }

    public static function sanitizeFileName($name) {
        return str_replace(".blade.php", "", $name); 
    }

    public static function readableFilename($name) {
        return ucfirst(self::sanitizeFileName($name)); 
    }

    public static function currentClass($item, $currentPage) {
        if(preg_match("/".$item."/i", $currentPage)) {
            return "current-page"; 
        }
        return ""; 
    }
}
