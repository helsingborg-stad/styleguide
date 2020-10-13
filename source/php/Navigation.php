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
    public static function items($folder = "/", $response = array(), $includeChildren = true)
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
                        $response[$item]['href'] = str_replace("///", "/", 
                            "//" . self::getPageDomain() . str_replace("pages", "/", $folder) . '/' . $item
                        );

                        //Set icon
                        if(isset(self::$icons[$item])) {
                            $response[$item]['icon'] = self::$icons[$item]; 
                        }

                        //Add ancestor item
                        if(self::isAncestorItem($item)) {
                            $response[$item]['ancestor'] = true; 
                        }

                        //Add current item
                        if(self::isActiveItem($item)) {
                            $response[$item]['active'] = true; 
                        }

                        //No async on this site
                        $response[$item]['async'] = false; 
                        
                    }

                    //Check if is dir (and traverse it)
                    if($includeChildren) {
                        if(is_dir(VIEWS_PATH . $folder . '/' . $item)) {
                            if(array_key_exists($item, $response)) {
                                $response[$item]['children'] = self::items($folder . '/' . $item); 
                            }
                        }else{
                            $response[$item]['children'] = false;                    
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

    public static function isActiveItem($item, $showFullRoute = false) {
        $pathArray = self::getPathArray();

        if (!$showFullRoute) {
            if (end($pathArray) === $item) {
                return true;
            }
            return false;
        }

        foreach ($pathArray as $pathItem) {
            if ($pathItem === $item)
                return true;
        }
        return false; 
    }

    public static function isAncestorItem($item, $showFullRoute = false) {
        $pathArray = self::getPathArray();

        if(in_array($item, $pathArray) && $item != end($pathArray)) {
            return true;
        } 

        return false;
    }

    public static function getPathArray() {
        return array_filter(explode('/', parse_url(self::getPageUrl(), PHP_URL_PATH)));
    }

    public static function getPageDomain() {
        return $_SERVER['HTTP_HOST']; 
    }

    public static function getPageUrl() {
        return $_SERVER['REQUEST_URI']; 
    }

    public static function getMockedTopLevel()
    {
        $response = [
            [
                'href' => '#p1',
                'label' => 'Page 1',
                'children' => true,
                'active' => true,
                'ancestor' => true,
                'id' => 1
            ],
            [
                'href' => '#p2',
                'label' => 'Page 2',
                'children' => true,
                'active' => false,
                'ancestor' => false,
                'id' => 2
            ],[
                'href' => '#p3',
                'label' => 'Page 3',
                'children' => true,
                'active' => false,
                'ancestor' => false,
                'id' => 3
            ]
        ];

        return $response;
    }

    

    public static function getMockedMultiLevel()
    {
        $response = [
            [
                'href' => '#p1',
                'label' => 'Page 1',
                'children' => false,
                'active' => false,
                'ancestor' => true,
                'id' => 1
            ],
            [
                'href' => '#p2',
                'label' => 'Page 2',
                'active' => false,
                'ancestor' => true,
                'id' => 2,
                'children' => [
                    [
                        'href' => '#p4',
                        'label' => 'Page 4',
                        'children' => true,
                        'active' => false,
                        'ancestor' => false,
                        'id' => 4
                    ],
                    [
                        'href' => '#p5',
                        'label' => 'Page 5',
                        'children' => true,
                        'active' => false,
                        'ancestor' => false,
                        'id' => 5
                    ],
                    [
                        'href' => '#p6',
                        'label' => 'Page 6',
                        'children' => true,
                        'active' => false,
                        'ancestor' => false,
                        'id' => 6
                    ]
                ]
            ],
            [
                'href' => '#p3',
                'label' => 'Page 3',
                'children' => true,
                'active' => false,
                'ancestor' => false,
                'id' => 3
            ]
        ];

        return $response;
    }
}
