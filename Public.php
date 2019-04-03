<?php 

    if(!function_exists('markdown')) {
        function markdown($string) {
            $Parsedown = new Parsedown();
            return $Parsedown->text(implode("\n", array_map('trim', explode("\n", $string))));
        }
    }