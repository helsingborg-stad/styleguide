<?php

namespace HbgStyleGuide;

class App
{
    protected $default = 'home';
    protected $page = null;

    public function __construct()
    {

        $this->page = ($_SERVER['REQUEST_URI'] !== "/") ? $_SERVER['REQUEST_URI'] : $this->default;

        $this->loadPage();

        $router = require_once('router.php');
    }

    /**
     * Loads a page and it's navigation
     * @return bool Returns true when the page is loaded
     */
    public function loadPage()
    {

        
        // Navigation
        //$data['topNavigation']  = Navigation::items('pages/', []);
        $data['sideNavigation'] = Navigation::items('pages/');  

        if($this->page == 'home'){
            $data['updates'] = \HbgStyleGuide\Updates::getUpdates();
        }

        //Current page 
        $data['pageNow'] = $this->page;
        if($_GET['p'] === 'api/navigation'){
            $parent = isset($_GET['parent']) ? 'pages/' . $_GET['parent'] : 'pages/'; 
            $data = Navigation::items($parent);

            header('Content-Type: application/json');
            echo json_encode($data);
            return;
        }
        

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
