<?php

namespace HbgStyleGuide\Helper;

class MockupArrays
{
    public static function getMockupArray($keys, $amount)
    {
        $arr = [];
            for ($i = 0; $i < $amount; $i++) {
                $keyArr = [];
                foreach ($keys as $key) {
                    $keyArr[$key] = $key . ' ' . $i;
                }
            $arr[] = $keyArr;
        };

        return $arr;
    }
}
