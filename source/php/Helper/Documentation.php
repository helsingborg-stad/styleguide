<?php


namespace HbgStyleGuide\Helper;

use HelsingborgStad\BladeService\BladeServiceInterface;

/**
 * Class Documentation
 * @package HbgStyleGuide\Helper
 */
class Documentation
{
    /**
     * @param $slug
     * @return array
     * @throws \Exception
     */
    public static function getUsageExamples(string $slug, BladeServiceInterface $blade)
    {
        $dir = BASEPATH . 'views/pages/components/usage/' . $slug;
        $examples = array();

        if(file_exists($dir))
        {
            if(file_exists($dir . '/' . $slug . '.json')) {
                $json = Documentation::getJson($dir, $slug);

                foreach(array_keys($json) as $file)
                {
                    $filePath = $file . '.blade.php';

                    if(file_exists($dir . '/' . $filePath)) {

                        //Get doc path
                        $includePath = ('pages.components.usage.' . $slug . '.' . $file);
                        
                        //Make view
                        $html = $blade->makeView($includePath)->render();

                        //Get contents of file 
                        $content = file_get_contents($dir . '/' . $filePath, FILE_USE_INCLUDE_PATH);
                        
                        //Push as example
                        array_push($examples, array(
                            "component" => $includePath,
                            "blade" => ['id' => uniqid('', true), 'code' => $content],
                            "html" => ['id' => uniqid('', true), 'code' => $html],
                            "description" => $json[$file]
                        ));
                    } else {
                        trigger_error("Couldn't find blade file " . $dir . '/' . $filePath, E_USER_NOTICE);
                    }
                }
            }
            return $examples;
        }
    }


    /**
     * @param $dir
     * @param $slug
     * @return mixed
     */
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

            $dir = BASEPATH . '/views/pages/components/' . $atomicDir . '/';
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