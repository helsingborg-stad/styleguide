<?php

namespace HbgStyleGuide\Helper;

class Icons
{
    public static function getJson()
    {
        if($jsonString = file_get_contents(BASEPATH . "assets/dist/icons/styleguide-icons.json")) {
            return json_decode($jsonString);
        }
        return false;
    }
}
