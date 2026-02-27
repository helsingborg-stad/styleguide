<?php

namespace HbgStyleGuide;

use HbgStyleGuide\Contracts\JsonDataLoaderInterface;
use HbgStyleGuide\Contracts\NavigationDataParserInterface;
use HbgStyleGuide\Data\JsonDataLoader;
use HbgStyleGuide\Data\NavigationDataParser;
use HbgStyleGuide\Http\Request;

class Navigation
{
    /**
     * @var self|null
     */
    private static ?self $defaultInstance = null;

    /**
     * @param Request $request Request context.
     * @param JsonDataLoaderInterface $jsonDataLoader JSON loader.
     * @param NavigationDataParserInterface $navigationDataParser Navigation parser.
     * @param string $viewsPath Base path to view files.
     */
    public function __construct(
        private Request $request,
        private JsonDataLoaderInterface $jsonDataLoader,
        private NavigationDataParserInterface $navigationDataParser,
        private string $viewsPath,
    ) {}

    /**
     * Creates default navigation service used by static helper calls.
     *
     * @return self
     */
    private static function default(): self
    {
        if (self::$defaultInstance instanceof self) {
            return self::$defaultInstance;
        }

        self::$defaultInstance = new self(
            Request::fromGlobals(),
            new JsonDataLoader(BASEPATH),
            new NavigationDataParser(),
            VIEWS_PATH,
        );

        return self::$defaultInstance;
    }

    /**
     * Creates a navigation array
     * @param  string  $template      The view path (if in subfolder) and filename
     * @param  boolean $displayErrors Weather to output errors or not
     * @return boolean
     */
    public function buildItems($folder = '/', $response = array(), $includeChildren = true)
    {
        $config = $this->jsonDataLoader->load('assets/data/navigation-config.json');
        $unlisted = is_array($config['unlisted'] ?? null) ? $config['unlisted'] : [];
        $icons = is_array($config['icons'] ?? null) ? $config['icons'] : [];
        $externalMenuItems = is_array($config['externalMenuItems'] ?? null) ? $config['externalMenuItems'] : [];

        $dirContents = scandir($this->viewsPath . $folder);

        if (is_array($dirContents) && !empty($dirContents)) {
            foreach ($dirContents as $item) {
                if (!in_array($item, $unlisted)) {
                    //Remove blade suffix
                    $item = $this->sanitizeFileName($item);

                    //Create array
                    if (!isset($response[$item]) || !is_array($response[$item])) {
                        $response[$item] = [];
                    }

                    //Add current level item
                    if (array_key_exists($item, $response)) {
                        $response[$item]['label'] = $this->readableFilename($item);
                        $response[$item]['href'] = str_replace('///', '/', '//' . $this->getPageDomain() . str_replace('pages', '/', $folder) . '/' . $item);

                        //Set icon
                        if (isset($icons[$item])) {
                            $response[$item]['icon'] = $icons[$item];
                        }

                        //Add ancestor item
                        if ($this->isAncestorItem($item)) {
                            $response[$item]['ancestor'] = true;
                        }

                        //Add current item
                        if ($this->isActiveItem($item)) {
                            $response[$item]['active'] = true;
                        }

                        //No async on this site
                        $response[$item]['async'] = false;
                    }

                    //Check if is dir (and traverse it)
                    if ($includeChildren) {
                        if (is_dir($this->viewsPath . $folder . '/' . $item)) {
                            if (array_key_exists($item, $response)) {
                                $response[$item]['children'] = $this->buildItems($folder . '/' . $item);
                            }
                        } else {
                            $response[$item]['children'] = false;
                        }
                    }
                }
            }
        }

        if ($folder === 'pages/' || $folder === '/') {
            foreach ($externalMenuItems as $key => $menuItem) {
                if (!is_string($key) || !is_array($menuItem)) {
                    continue;
                }

                $response[$key] = $menuItem;
            }
        }

        return $response;
    }

    public static function itemsStatic($folder = '/', $response = array(), $includeChildren = true)
    {
        return self::default()->buildItems($folder, $response, $includeChildren);
    }

    public static function items($folder = '/', $response = array(), $includeChildren = true)
    {
        return self::default()->buildItems($folder, $response, $includeChildren);
    }

    public function sanitizeFileName($name)
    {
        return str_replace('.blade.php', '', $name);
    }

    public function readableFilename($name)
    {
        return str_replace(
            '-',
            ' ',
            ucfirst(
                $this->sanitizeFileName($name),
            ),
        );
    }

    public function isActiveItem($item, $showFullRoute = false)
    {
        $pathArray = $this->getPathArray();

        if (!$showFullRoute) {
            if (end($pathArray) === $item) {
                return true;
            }
            return false;
        }

        foreach ($pathArray as $pathItem) {
            if ($pathItem === $item)
                return true;
        }
        return false;
    }

    public function isAncestorItem($item, $showFullRoute = false)
    {
        $pathArray = $this->getPathArray();

        if (in_array($item, $pathArray) && $item != end($pathArray)) {
            return true;
        }

        return false;
    }

    public function getPathArray()
    {
        return array_filter(explode('/', parse_url($this->getPageUrl(), PHP_URL_PATH)));
    }

    public function getPageDomain()
    {
        return isset($_SERVER['HTTP_X_FORWARDED_HOST']) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : $_SERVER['HTTP_HOST'];
    }

    public function getPageUrl()
    {
        return $this->request->getPath();
    }

    /**
     * @return array<mixed>
     */
    public static function getMockedTopLevel()
    {
        $data = self::default()->jsonDataLoader->load('assets/data/navigation-mocks.json');
        $topLevel = $data['topLevel'] ?? [];

        return is_array($topLevel) ? self::default()->navigationDataParser->parse($topLevel) : [];
    }

    /**
     * @return array<mixed>
     */
    public static function getMockedMultilevel()
    {
        $data = self::default()->jsonDataLoader->load('assets/data/navigation-mocks.json');
        $multiLevel = $data['multiLevel'] ?? [];

        return is_array($multiLevel) ? self::default()->navigationDataParser->parse($multiLevel) : [];
    }
}
