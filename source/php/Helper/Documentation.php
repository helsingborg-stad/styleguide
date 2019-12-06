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
            $files = array_diff(scandir($dir), array('..', '.'));
            $configContent = file_get_contents($dir . '/' . $slug . '.json');
            $json = json_decode($configContent, true);
           
            foreach($files as $key => $file)
            {
                $content = file_get_contents($dir . '/' . $file, FILE_USE_INCLUDE_PATH);
                
                if(strpos($file, '.blade.php'))
                {
                    $exampleName = str_replace('.blade.php', '', $file);
                    $includePath = ('pages.component.usage.' . $slug . '.' . $exampleName);
                    $temp = array(
                        "component" => $includePath,
                        "blade" => $content,
                        "html" => Blade::instance()->make($includePath)->render(),
                        "description" => $json[$exampleName]
                    );
                    
                    array_push($examples, $temp);
                }
            }
        }
        return $examples;
    }
}
