<?php

namespace HbgStyleGuide\Helper;

class ParseString
{
    public static function tidyHtml($markup)
    {
        if(class_exists("tidy")) {
            $tidy = new \tidy;
            $tidy->parseString($markup, array(
                'indent'         => true,
                'output-xhtml'   => true,
                'wrap'           => 200,
                'show-body-only' => true
            ), 'utf8');
            
            $tidy->cleanRepair();

            if(isset($tidy->value)) {
                return $tidy->value;
            }
        }

        return $markup; 
    }
}
