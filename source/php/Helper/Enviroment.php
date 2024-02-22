<?php

namespace HbgStyleGuide\Helper;

class Enviroment
{
    public static function isLocalDomain()
    {
        return substr($_SERVER['HTTP_HOST'], -strlen(LOCAL_DOMAIN)) === LOCAL_DOMAIN;
    }
}
