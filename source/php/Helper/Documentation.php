<?php


namespace HbgStyleGuide\Helper;
use \HelsingborgStad\GlobalBladeEngine as Blade;

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
    public static function getUsageExamples($slug)
    {
        $dir = BASEPATH . 'views/pages/component/usage/' . $slug;
        $examples = array();

        if(file_exists($dir))
        {
            $files = array_diff(scandir($dir), array('..', '.'));

            if(file_exists($dir . '/' . $slug . '.json')) {
                $configContent = file_get_contents($dir . '/' . $slug . '.json');
                $json = json_decode($configContent, true);

                foreach($files as $key => $file)
                {
                    if(strpos($file, '.blade.php'))
                    {
                        $exampleName = str_replace('.blade.php', '', $file);
                        $includePath = ('pages.component.usage.' . $slug . '.' . $exampleName);
                        $html = Blade::instance()->make($includePath)->render();
                        $blade = file_get_contents($dir . '/' . $file, FILE_USE_INCLUDE_PATH);
                        $temp = array(
                            "component" => $includePath,
                            "blade" => ['id' => uniqid('', true), 'code' => $blade],
                            "html" => ['id' => uniqid('', true), 'code' => $html],
                            "description" => $json[$exampleName]
                        );

                        array_push($examples, $temp);
                    }
                }
            }
            return $examples;
        }

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