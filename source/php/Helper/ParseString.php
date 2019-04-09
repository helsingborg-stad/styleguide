<?php

namespace HbgStyleGuide\Helper;

class ParseString
{
    public static function tidyHtml($markup)
    {
        $tidy = new \tidy;
        $tidy->parseString($markup, array(
            'indent'         => true,
            'output-xhtml'   => true,
            'wrap'           => 200,
            'show-body-only' => true
        ), 'utf8');
        $tidy->cleanRepair();
        return $tidy->value;
    }
}
