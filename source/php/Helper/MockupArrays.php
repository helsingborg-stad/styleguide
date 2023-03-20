<?php

namespace HbgStyleGuide\Helper;

class MockupArrays
{
    public static function optionsList($keys, $amount)
    {
        $arr = [];
        foreach ($keys as $key) {
            for ($i = 0; $i < $amount; $i++) {
                $arr[$key . ' ' . $i] = $key . ' ' . $i;
            }
        };

        return $arr;
    }
}
