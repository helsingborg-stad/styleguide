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
        'home.blade.php',
        'usage',
        'about'
    );

    private static $icons = array(
        'mixins' => 'local_bar',
        'script' => 'code',
        'icons' => 'brush',
        'component' => 'extension',
        'utilities' => 'build'
    ); 

    /**
     * Creates a navigation array
     * @param  string  $template      The view path (if in subfolder) and filename
     * @param  boolean $displayErrors Weather to output errors or not
     * @return boolean
     */
    public static function items($folder = "/", $response = array())
    {

        $dirContents = scandir(VIEWS_PATH .  $folder);

        if(is_array($dirContents) && !empty($dirContents)) {
            foreach($dirContents as $item) {
                if(!in_array($item, self::$unlisted)) {

                    //Remove blade suffix 
                    $item = self::sanitizeFileName($item); 

                    //Create array
                    if(!isset($response[$item]) ||!is_array($response[$item])) {
                        $response[$item] = []; 
                    }

                    $itemsDir = VIEWS_PATH . 'pages/' .  $item;
                    
                    $hasChildren = (is_dir($itemsDir)) ? true : false;
                   
                    

        
                    //Add current level item
                    if(array_key_exists($item, $response)) {
                        $response[$item]['label'] = self::readableFilename($item);
                        $response[$item]['ID'] = $folder . self::readableFilename($item);
                        $response[$item]['children'] = $hasChildren;
                        $response[$item]['href'] = str_replace("///", "/", 
                            "//" . self::getPageDomain() . str_replace("pages", "/", $folder) . '/' . $item
                        );

                        if($item == 'setup'){
                            
                            //die(var_dump(VIEWS_PATH . 'pages/' . $item));
                        }

                        //Set icon
                        if(isset(self::$icons[$item])) {
                            $response[$item]['icon'] = self::$icons[$item]; 
                        }

                        //Add current item
                        if(self::isActiveItem($item)) {
                            $response[$item]['active'] = true; 
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

    public static function isActiveItem($item) {
        if(preg_match("/".$item."/i", self::getPageUrl())) {
            return true; 
        }
        return false; 
    }

    public static function getPageDomain() {
        return $_SERVER['HTTP_HOST']; 
    }

    public static function getPageUrl() {
        return $_SERVER['REQUEST_URI']; 
    }
}
