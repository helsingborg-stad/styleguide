<?php

namespace HbgStyleGuide;

class Navigation
{
    private static $unlisted = array(
        '.',
        '..',
        '.DS_Store',
        'layout',
        '404.blade.php',
        'home.blade.php'
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

                    //Create array
                    if(!isset($response[$item]) ||!is_array($response[$item])) {
                        $response[$item] = []; 
                    }

                    //Add current level item
                    if(array_key_exists($item, $response)) {
                        $response[$item]['label'] = self::readableFilename($item);
                        $response[$item]['href'] = implode(
                            "/", 
                            array_filter([
                                str_replace("/", "", $folder), 
                                str_replace("/", "", $item), 
                            ])
                        ); 

                        //Remove pages prefix 
                        $response[$item]['href'] =  str_replace("pages", "", $response[$item]['href']);
                    }

                    //Check if is dir (and traverse it)
                    if(is_dir(VIEWS_PATH . $folder . $item)) {
                        if(array_key_exists($item, $response)) {
                            $response[$item]['children'] = self::items($folder . $item); 
                        }
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
        return str_replace("-", " ",
                ucfirst(
                    self::sanitizeFileName($name)
                )
            );
    }

    public static function currentClass($item, $currentPage) {
        if(preg_match("/".$item."/i", $currentPage)) {
            return "current-page"; 
        }
        return ""; 
    }
}
