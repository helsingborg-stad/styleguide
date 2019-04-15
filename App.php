<?php

namespace HbgStyleGuide;

class App
{
    protected $default = 'home';
    protected $page = null;

    public function __construct()
    {
        $this->page = isset($_GET['p']) ? $_GET['p'] : $this->default;
        $this->loadPage();
    }

    /**
     * Loads a page and it's navigation
     * @return bool Returns true when the page is loaded
     */
    public function loadPage()
    {
        // Navigation
        $data['nav']     = Navigation::items('pages/');
        $data['pageNow'] = $this->page;
        $data['componentLibraryIsInstalled'] = \HbgStyleGuide\Helper\Enviroment::componentLibraryIsInstalled();
        $data['isLocalDomain'] = \HbgStyleGuide\Helper\Enviroment::isLocalDomain();

        //Pages 
        return \HbgStyleGuide\View::show($this->page, $data);
    }
}
