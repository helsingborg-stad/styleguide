<?php

namespace HbgStyleGuide;

use HelsingborgStad\BladeService\BladeServiceInterface;

/**
 * Class App
 * @package HbgStyleGuide
 * test test test test
 */
class App
{
    protected $default = 'home'; //Home
    protected $page = null; // pageVar
    private BladeServiceInterface $bladeService; // Blade

    /**
     * App constructor.
     * @param $bladeService
     */
    public function __construct(BladeServiceInterface $bladeService)
    {

        $this->bladeService = $bladeService;
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
        $data['assets']                         = Asset::getAll();

        // Navigation
        $data['topNavigation']                  = Navigation::items('pages/', [], false);
        $data['sideNavigation']                 = Navigation::items('pages/');

        //Current page 
        $data['pageNow']                        = $this->page;

        //Component library
        $data['isLocalDomain']                  = \HbgStyleGuide\Helper\Enviroment::isLocalDomain();
        //Render page 
        $view = new \HbgStyleGuide\View();

        return $view->show(
            $this->page,
            $data,
            $this->bladeService
        );
    }
}
