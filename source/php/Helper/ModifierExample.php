<?php


namespace MunicipioStyleGuide\Helper;

/**
 * Class ModifierExample
 * @package MunicipioStyleGuide\Helper
 */
class ModifierExample
{
    /**
     * @param string $slug
     * @param string $modifier
     * @return string
     */
    public static function get(string $slug, string $modifier)
    {
        $modifierPrefix = "c-$slug";
        return "@$slug([ 'classList' => ['$modifierPrefix$modifier'] ])@end$slug";
    }
}
