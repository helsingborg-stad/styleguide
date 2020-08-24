<?php

namespace HbgStyleGuide;

/**
 * Class App
 * @package HbgStyleGuide
 * 
 */
class App
{
    protected $default = 'home'; //Home
    protected $page = null; // pageVar
    private $blade; // Blade

    /**
     * App constructor.
     * @param $blade
     */
    public function __construct($blade)
    {

        $url = preg_replace('/\?.*/', '', $_SERVER['REQUEST_URI']);
        $this->page = ($url !== "/") ? $url : $this->default;
        
        $this->loadPage($blade);
    }

    /**
     * Loads a page and it's navigation
     * @return bool Returns true when the page is loaded
     */
    public function loadPage($blade)
    {
        // Navigation
        $data['topNavigation']                  = Navigation::items('pages/', [], false);
        $data['sideNavigation']                 = Navigation::items('pages/');

        //Current page 
        $data['pageNow']                        = $this->page;

        //Component library
        $data['componentLibraryIsInstalled']    = \HbgStyleGuide\Helper\Enviroment::componentLibraryIsInstalled();
        $data['isLocalDomain']                  = \HbgStyleGuide\Helper\Enviroment::isLocalDomain();
        //Render page 
        $view = new \HbgStyleGuide\View();

        return $view->show(
            $this->page,
            $data,
            $blade
        );
    }
}
