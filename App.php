<?php

namespace HbgStyleGuide;

class App
{
    protected $default = 'home';
    protected $documentation = null;
    protected $page = null;

    public function __construct()
    {
        $this->page = isset($_GET['p']) ? $_GET['p'] : 'home';

        $this->createCacheDir();
        $this->loadPage();
    }

    /**
     * Automatically creates a cache dir for blade
     * @return string Theme
     */
    public function createCacheDir()
    {
        if (!is_dir(BASEPATH . "cache")) {
            mkdir(BASEPATH . "cache");
        }
    }

    /**
     * Loads a page and it's navigation
     * @return bool Returns true when the page is loaded
     */
    public function loadPage()
    {
        // Navigation
        $data['nav'] = $this->loadNavigation($this->page);
        $data['pageNow'] = $this->page;
        $data['theme'] = ""; 

        // Home
        if ($this->page == 'home') {
            \HbgStyleGuide\View::show('home', $data);
            return true;
        }

        // Sections
        /*$data['docs'] = $this->loadPageDocumentation($this->page);
        \HbgStyleGuide\View::show('sections', $data);*/ 
        return true;
    }

    /**
     * Reads the navigation from the json
     * @return object Navigation
     */
    public function loadNavigation()
    {
        /*$nav = (array)$this->documentation->nav;
        ksort($nav);
*/ 
        return (object) array();
    }

    /**
     * Loads the documentation of a specific page
     * @param  string $page The page
     * @return array        The documentation
     */
    public function loadPageDocumentation()
    {
        return "HEllo"; 
    }
}
