<?php


namespace HbgStyleGuide\Helper;

/**
 * Class ModifierExample
 * @package HbgStyleGuide\Helper
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
        $example = "@$slug([ 'classList' => ['$modifierPrefix$modifier'] ])@end$slug";
        return $example;
    }
}
