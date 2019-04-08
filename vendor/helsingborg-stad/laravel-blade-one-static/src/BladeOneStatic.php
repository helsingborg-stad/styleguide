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
     * Run Blade Engine
     * @param $params
     * @return bool
     * @throws \Exception
     */
    public static function initBladeOne($params)
    {
        if (!class_exists('eftec\bladeone\BladeOne')) {
            return false;
        }

        if (class_exists('\BladeComponentLibrary\Register')) {

            return self::$bladeOne->run(
                (string)$params['utilityViewName'],
                (array)$params['utilityArgsControlerData']
            );

        } else {
            throw new \Exception("Error running Blade one");
        }
    }
}