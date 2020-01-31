<?php

namespace HbgStyleGuide\Helper;
use \HelsingborgStad\GlobalBladeEngine as Blade;

class Documentation
{
    public static function getUsageExamples($slug)
    {   
        $dir = BASEPATH . 'views/pages/component/usage/' . $slug;
        $examples = array();

        if(file_exists($dir))
        {
            if(file_exists($dir . '/' . $slug . '.json')) {
                $json = Documentation::getJson($dir, $slug);

                foreach(array_keys($json) as $file)
                {
                    $filePath = $file . '.blade.php';
                    
                    if(file_exists($dir . '/' . $filePath)) {
                        $includePath = ('pages.component.usage.' . $slug . '.' . $file);
                        $html = Blade::instance()->make($includePath)->render();
                        $blade = file_get_contents($dir . '/' . $filePath, FILE_USE_INCLUDE_PATH);
                        $temp = array(
                            "component" => $includePath,
                            "blade" => ['id' => uniqid('', true), 'code' => $blade],
                            "html" => ['id' => uniqid('', true), 'code' => $html],
                            "description" => $json[$file]
                        );
                        array_push($examples, $temp);
                    } else {
                        trigger_error("Couldn't find blade file " . $dir . '/' . $filePath, E_USER_NOTICE);
                    }
                }
            }
            return $examples;
        }
    }

    public static function getJson($dir, $slug)
    {
        $configContent = file_get_contents($dir . '/' . $slug . '.json');
        $json = json_decode($configContent, true);
        return $json;
    }

    /**
     * @return array
     */
    public static function getComponentDirectories()
    {
        $atomic = ['atoms', 'molecules', 'organisms'];
        $results = [];
        foreach ($atomic as $atomicDir) {

            $dir = BASEPATH . '/views/pages/component/' . $atomicDir . '/';
            $files = scandir($dir);
            $results[$atomicDir] = [];
            foreach ($files as $key => $value) {
                if ($value !== "." &&
                    $value !== ".." &&
                    $value !== "" &&
                    $value !== ".dc_store") {

                    array_push($results[$atomicDir], str_replace('.blade.php', '', $value));
                }
            }
        }
        return array_filter($results);
    }

}