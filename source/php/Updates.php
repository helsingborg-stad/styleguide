<?php

namespace HbgStyleGuide;

use \HelsingborgStad\GlobalBladeEngine as Blade;

class Updates{
    public static function getUpdates(){

        return self::getCommitsToMaster();
    }

    private static function getCommitsToMaster(){
        $curl = curl_init('https://api.github.com/repos/helsingborg-stad/blade-component-library/commits');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36");
        $commits = json_decode(curl_exec($curl), true);

        $latestUpdates = [];

        for($i = 0; $i < 10; $i++){
            $authorDate = strtotime($commits[$i]['commit']['author']['date']);
            $year = date('Y', $authorDate);
            $month = date('M', $authorDate);
            $day = date('d', $authorDate);

            $updateDateString = $month . ' ' . $day . ', ' . $year;  
            $latestUpdates[] = [
                'message' => $commits[$i]['commit']['message'],
                'date' => $updateDateString
            ];
        }

        return $latestUpdates;
    }
}