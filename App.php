<?php

namespace HbgStyleGuide;

class App
{
    protected $default = 'home';
    protected $page = null;

    public function __construct()
    {
        $this->page = isset($_GET['p']) ? $_GET['p'] : $this->default;

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
        $data['nav']     = Navigation::items();
        $data['pageNow'] = $this->page;

        //Pages 
        \HbgStyleGuide\View::show($this->page, $data);
        return true; 
    }
}
