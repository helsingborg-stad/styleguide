<?php

namespace LaravelBladeOneStatic\BladeOneStatic;

Use eftec\bladeone\BladeOne as Blade;

/**
 * Class BladeOneStatic
 * @package LaravelBladeOneStatic
 */
class BladeOneStatic
{
    /**
     * @var
     */
    static $bladeOne;

    /**
     * Init BladeOne
     * @return bool|Blade
     */
    public static function init()
    {
        if (!class_exists('\BladeComponentLibrary\Register')) {
            return false;
        }

        self::$bladeOne = new Blade(
            (array)\BladeComponentLibrary\Register::$viewPaths,
            (string)\BladeComponentLibrary\Register::$cachePath
        );

        return self::$bladeOne;
    }


    /**
     * @param $params
     * @return bool|string
     * @throws \Exception
     */
    public static function runBladeOne($params)
    {
        if (!class_exists('eftec\bladeone\BladeOne')) {
            return false;
        }

        if (class_exists('\BladeComponentLibrary\Register')) {

            switch($params['path']){
                case "component":

                    return self::$bladeOne->run(
                        (string)$params['utilityViewName'],
                        (array)$params['utilityArgsControlerData']
                    );
                    break;
                case "page":

                    self::$bladeOne = new Blade(
                        __DIR__ . '/../../../../views/',
                        __DIR__ . '/../../../../cache/'
                    );
                    return self::$bladeOne->run($params['template'],$params['data']);
                    break;
            }


        } else {
            throw new \Exception("Error running Blade one");
        }
    }
}