<?php

namespace HbgStyleGuide;

use HbgStyleGuide\Contracts\JsonDataLoaderInterface;
use HbgStyleGuide\Contracts\NavigationDataParserInterface;
use HbgStyleGuide\Contracts\SidebarSectionInterface;
use HbgStyleGuide\Data\JsonDataLoader;
use HbgStyleGuide\Data\NavigationDataParser;
use HbgStyleGuide\Http\Request;
use HbgStyleGuide\Sidebar\Sections\ComponentsSection;
use HbgStyleGuide\Sidebar\Sections\ObjectsSection;
use HbgStyleGuide\Sidebar\Sections\ScriptSection;
use HbgStyleGuide\Sidebar\Sections\UtilitiesSection;

class Navigation
{
    private static ?self $defaultInstance = null;

    public function __construct(
        private Request $request,
        private JsonDataLoaderInterface $jsonDataLoader,
        private NavigationDataParserInterface $navigationDataParser,
        private string $viewsPath,
        private array $sidebarSections = [],
        private string $componentsPath = '',
    ) {
    }

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
            self::defaultSidebarSections(),
            BASEPATH . 'source/components',
        );

        return self::$defaultInstance;
    }

    public static function defaultSidebarSections(): array
    {
        return [
            new ComponentsSection(),
            new ObjectsSection(),
            new ScriptSection(),
            new UtilitiesSection(),
        ];
    }

    public function buildSidebarNavigation(): array
    {
        $allPages = $this->buildItems('pages/');
        $sections = !empty($this->sidebarSections)
            ? $this->sidebarSections
            : self::defaultSidebarSections();

        $sidebarNavigation = [];

        foreach ($sections as $section) {
            if (!$section instanceof SidebarSectionInterface) {
                continue;
            }

            $key = $section->getKey();
            $sidebarItem = $allPages[$key] ?? [
                'href' => '//' . $this->getPageDomain() . '/' . $key,
                'children' => false,
                'async' => false,
            ];

            if (!is_array($sidebarItem)) {
                $sidebarItem = [
                    'href' => '//' . $this->getPageDomain() . '/' . $key,
                    'children' => false,
                    'async' => false,
                ];
            }

            if ($key === 'components') {
                $sidebarItem['children'] = $this->buildComponentsMenuItems();
            }

            $sidebarItem['label'] = $section->getLabel();
            $sidebarNavigation[$key] = $sidebarItem;
        }

        return $sidebarNavigation;
    }

    private function buildComponentsMenuItems(): array
    {
        $basePath = $this->componentsPath !== ''
            ? rtrim($this->componentsPath, '/')
            : rtrim(BASEPATH . 'source/components', '/');

        $componentConfigPaths = glob($basePath . '/*/component.json') ?: [];
        $items = [];

        foreach ($componentConfigPaths as $componentConfigPath) {
            $configContent = file_get_contents($componentConfigPath);
            if ($configContent === false) {
                continue;
            }

            $config = json_decode($configContent, true);
            if (!is_array($config)) {
                continue;
            }

            $slug = isset($config['slug']) ? strtolower((string) $config['slug']) : '';
            $label = isset($config['name']) ? (string) $config['name'] : '';
            if ($slug === '' || $label === '') {
                continue;
            }

            $hrefPath = '/components/' . $slug;

            $items[$slug] = [
                'label' => $label,
                'href' => '//' . $this->getPageDomain() . $hrefPath,
                'children' => false,
                'async' => false,
                'active' => $this->isActiveItem($slug, true),
            ];
        }

        uasort($items, fn (array $left, array $right): int => strcmp((string) $left['label'], (string) $right['label']));

        return $items;
    }

    private function resolveComponentDocumentationPath(string $slug): ?string
    {
        $normalizedSlug = $this->normalizeIdentifier($slug);

        foreach (['atoms', 'molecules', 'organisms'] as $level) {
            $viewPattern = rtrim($this->viewsPath, '/') . '/pages/components/' . $level . '/*.blade.php';
            $viewPaths = glob($viewPattern) ?: [];

            foreach ($viewPaths as $viewPath) {
                $fileName = basename($viewPath, '.blade.php');
                if ($this->normalizeIdentifier($fileName) === $normalizedSlug) {
                    return $level . '/' . $fileName;
                }
            }
        }

        return null;
    }

    private function normalizeIdentifier(string $value): string
    {
        return strtolower((string) preg_replace('/[^a-zA-Z0-9]/', '', $value));
    }

    public function buildItems($folder = '/', $response = [], $includeChildren = true)
    {
        $config = $this->jsonDataLoader->load('assets/data/navigation-config.json');
        $unlisted = is_array($config['unlisted'] ?? null) ? $config['unlisted'] : [];
        $icons = is_array($config['icons'] ?? null) ? $config['icons'] : [];
        $externalMenuItems = is_array($config['externalMenuItems'] ?? null) ? $config['externalMenuItems'] : [];

        $dirContents = scandir($this->viewsPath . $folder);

        if (is_array($dirContents) && !empty($dirContents)) {
            foreach ($dirContents as $item) {
                if (!in_array($item, $unlisted, true)) {
                    $item = $this->sanitizeFileName($item);

                    if (!isset($response[$item]) || !is_array($response[$item])) {
                        $response[$item] = [];
                    }

                    if (array_key_exists($item, $response)) {
                        $response[$item]['label'] = $this->readableFilename($item);
                        $response[$item]['href'] = str_replace(
                            '///',
                            '/',
                            '//' . $this->getPageDomain() . str_replace('pages', '/', $folder) . '/' . $item,
                        );

                        if (isset($icons[$item])) {
                            $response[$item]['icon'] = $icons[$item];
                        }

                        if ($this->isAncestorItem($item)) {
                            $response[$item]['ancestor'] = true;
                        }

                        if ($this->isActiveItem($item)) {
                            $response[$item]['active'] = true;
                        }

                        $response[$item]['async'] = false;
                    }

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
                if (is_string($key) && is_array($menuItem)) {
                    $response[$key] = $menuItem;
                }
            }
        }

        return $response;
    }

    public static function itemsStatic($folder = '/', $response = [], $includeChildren = true)
    {
        return self::default()->buildItems($folder, $response, $includeChildren);
    }

    public static function items($folder = '/', $response = [], $includeChildren = true)
    {
        return self::default()->buildItems($folder, $response, $includeChildren);
    }

    public function sanitizeFileName($name)
    {
        return str_replace('.blade.php', '', $name);
    }

    public function readableFilename($name)
    {
        return str_replace('-', ' ', ucfirst($this->sanitizeFileName($name)));
    }

    public function isActiveItem($item, $showFullRoute = false)
    {
        $pathArray = $this->getPathArray();

        if (!$showFullRoute) {
            return end($pathArray) === $item;
        }

        foreach ($pathArray as $pathItem) {
            if ($pathItem === $item) {
                return true;
            }
        }

        return false;
    }

    public function isAncestorItem($item, $showFullRoute = false)
    {
        $pathArray = $this->getPathArray();

        if (in_array($item, $pathArray, true) && $item !== end($pathArray)) {
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

    public static function getMockedTopLevel()
    {
        $data = self::default()->jsonDataLoader->load('assets/data/navigation-mocks.json');
        $topLevel = $data['topLevel'] ?? [];

        return is_array($topLevel)
            ? self::default()->navigationDataParser->parse($topLevel)
            : [];
    }

    public static function getMockedMultilevel()
    {
        $data = self::default()->jsonDataLoader->load('assets/data/navigation-mocks.json');
        $multiLevel = $data['multiLevel'] ?? [];

        return is_array($multiLevel)
            ? self::default()->navigationDataParser->parse($multiLevel)
            : [];
    }
}
