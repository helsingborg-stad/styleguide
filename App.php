<?php

namespace HbgStyleGuide;

class App
{
    protected $default = 'home';
    protected $page = null;

    public function __construct()
    {

        $url = preg_replace('/\?.*/', '', $_SERVER['REQUEST_URI']);
        $this->page = ($url !== "/") ? $url : $this->default;

        $this->loadPage();
    }

    /**
     * Loads a page and it's navigation
     * @return bool Returns true when the page is loaded
     */
    public function loadPage()
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
        return \HbgStyleGuide\View::show(
            $this->page,
            $data
        );
    }
}
