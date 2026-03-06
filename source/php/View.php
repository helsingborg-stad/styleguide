<?php

namespace HbgStyleGuide;

use HbgStyleGuide\Helper\ComponentCssParameters;
use \HbgStyleGuide\Helper\Documentation as DocHelper;
use \HbgStyleGuide\Helper\ModifierExample;
use HelsingborgStad\BladeService\BladeServiceInterface;

class View
{
    /**
     * @param $view
     * @param array $data
     */
    public function show($view, $data = array(), BladeServiceInterface $blade = null)
    {
        $this->registerLayoutViewComposer($blade);
        $this->registerMarkdownViewComposer($blade);

        try {
            $result = $blade->makeView( 'pages.' . $view, $data )->render();
            echo preg_replace('/(id|href)=""/', "", $result);
        } catch (\Throwable $e) {
            if(!$this->viewExists($view)) {
                $data = array_merge( $data, array('errorMessage' => $e) );
                echo $blade->makeView( 'pages.404', $data )->render();
                return;
            }
            $blade->errorHandler($e)->print();
        }
    }

    private function viewExists($view): bool
    {
        return file_exists(BASEPATH . 'views/pages/' . str_replace(".", "/", $view) . '.blade.php');
    }

    /**
     * @param $view
     * @param array $data
     * @throws \Exception
     */
    public function registerLayoutViewComposer(BladeServiceInterface $blade)
    {
        $blade->registerComponentDirective("layout.doc", "doc");

        //Doc template
        $docTemplates = array(
            'layout.doc',
            'template.component',
            'template.utility',
            'template.script',
            'template.object',
            'template.mixin',
        );

        //Documentation module
        foreach ($docTemplates as $template) {
            $blade->registerComponent($template, function ($view) use ($blade) {

                $viewData = $this->accessProtected($view, 'data');

                // Get path to specific vendor package
                $componentLibraryPackagePath = $this->getVendorPackagePath('helsingborg-stad/component-library');
    
                if (isset($viewData['slug']) || isset($viewData['viewDoc'])) {
                    $viewDoc = (isset($viewData['viewDoc']) && is_array($viewData['viewDoc'])) ? $viewData['viewDoc'] : [];
                    if (isset($viewData['viewDoc']) && strtolower((string) ($viewDoc['type'] ?? '')) === 'utility') {
                        [$configFile, $configJson] = $this->resolveUtilityDocumentationConfiguration($viewDoc);
                    } else {
                        $path = (isset($viewData['viewDoc'])) ?
                            $this->resolveDocumentationConfigPath($viewDoc) :
                            $this->resolveComponentConfigPath($componentLibraryPackagePath, (string) $viewData['slug']);

                        //Locate config file
                        $configFile = glob($path);

                        //Get first occurance of config
                        if (is_array($configFile) && !empty($configFile)) {
                            $configFile = array_pop($configFile);
                        } else {
                            throw new \Exception(
                                isset($viewData['slug']) ? "No configuration file found for component with slug '" . $viewData['slug'] . "' at " . $path : "No configuration file found at " . $path
                            );
                        }

                        //Read config
                        if (!$configJson = file_get_contents($configFile)) {
                            throw new \Exception("Configuration file unreadable at " . $configFile);
                        }

                        //Check if valid json
                        if (!$configJson = json_decode($configJson, true)) {
                            throw new \Exception("Invalid formatting of configuration file in " . $configFile);
                        }
                    }
    
                    //Check if has default object
                    if (isset($configJson['default'])) {
                        $settings = $configJson['default'];
                    } else if (isset($configJson['modifiers'])) {
                        $settings = $configJson['modifiers'];
                    } else if (isset($configJson['attributes'])) {
                        $settings = $configJson['attributes'];
                    } else {
                        $settings = array();
                    }
    
                    //Check if has available object
                    if (isset($configJson['available'])) {
                        $available = $configJson['available'];
                    } else {
                        $available = array();
                    }
    
                    //Check if has description object
                    if (isset($configJson['description'])) {
                        $description = $configJson['description'];
                    } else {
                        $description = array();
                    }
                    
                    // Check if has modifiers object.
                    if (isset($configJson['modifiers'])) {
                        $modifiers = $configJson['modifiers'];
                    } else {
                        $modifiers = array();
                    }
    
                    // Attempt to set up example usage of modifiers.
                    if (isset($viewData['slug']) && !empty($modifiers)) {
                        $firstModifier = array_keys((array)$modifiers)[0];
                        $modifiersExample = ModifierExample::get($viewData['slug'], $firstModifier);
                    } else {
                        $modifiersExample = null;
                    }
    
                    if (isset($configJson['responsive'])) {
                        $responsive = $configJson['responsive'];
                    } else {
                        $responsive = array();
                    }
    
                    if (isset($configJson['summary'])) {
                        $summary = implode(' ', $configJson['summary']);
                    } else {
                        $summary = null;
                    }
    
                    if (isset($configJson['format'])) {
                        $format = $configJson['format'];
                    } else {
                        $format = array();
                    }

                    if (isset($configJson['includesPath'])) {
                        $includesPath = $configJson['includesPath'];
                    } else {
                        $includesPath = "";
                    }
    
                } else {
                    $settings = array();
                    $description = array();
                    $configFile = false;
                }
    
                if (isset($viewData['slug']) && $viewData['slug'] === 'card') {
                    $paper = [
                        'transparencyContainer' => true,
                        'transparencyDocContainer' => false,
                        'containerPadding' => 0,
                        'docContainerPadding' => 3,
                    ];
                } else {
                    $paper = [
                        'transparencyContainer' => false,
                        'transparencyDocContainer' => true,
                        'containerPadding' => 3,
                        'docContainerPadding' => 0,
                    ];
                }

                $view->with($x = [
                    'title' => isset($viewData['title']) ? $viewData['title'] : (isset($configJson['name']) ? $configJson['name'] : 'abc'),
                    'description' => 'hello',
                    'summary' => $summary,
                    'format' => $format,
                    'responsive' => $responsive,
                    'description' => $description,
                    'modifiers' => $modifiers,
                    'available' => $available,
                    'settings' => $settings,
                    'settingsLocation' => $configFile,
                    'componentSlug' => isset($viewData['slug']) ? $viewData['slug'] : false,
                    'displayParams' => isset($viewData['displayParams']) ? $viewData['displayParams'] : true,
                    'paper' => $paper,
                    'examples' => isset($viewData['slug']) ? DocHelper::getUsageExamples($viewData['slug'], $blade) : ($configJson['examples'] ?? ""),
                    'cssParameters' => isset($viewData['slug']) ? ComponentCssParameters::getForComponent($viewData['slug']) : [],
                    'modifiersExample' => $modifiersExample,
                    'includesPath' => $includesPath,
                ]);
    
                
    
            });   
        }

        return $blade;
    }

    private function getVendorPackagePath($package):string {
        $path = getcwd() . '/vendor/' . $package;
        if (!is_dir($path)) {
            throw new \Exception("Package not found at " . $path);
        }
        return $path;
    }

    /**
     * Resolve component configuration glob path from slug.
     *
     * Supports matching slugs against camel/Pascal-cased vendor component
     * directory names, for example iconsection -> IconSection.
     *
     * @param string $componentLibraryPackagePath Component library package path.
     * @param string $slug Component slug from URL/config.
     *
     * @return string
     */
    private function resolveComponentConfigPath(string $componentLibraryPackagePath, string $slug): string
    {
        $componentBasePath = rtrim($componentLibraryPackagePath, '/') . '/source/php/Component';
        $normalizedSlug = $this->normalizeComponentIdentifier($slug);

        foreach (glob($componentBasePath . '/*', GLOB_ONLYDIR) ?: [] as $componentDirectory) {
            if ($this->normalizeComponentIdentifier(basename($componentDirectory)) === $normalizedSlug) {
                return $componentDirectory . '/*.json';
            }
        }

        return $componentBasePath . '/' . ucfirst($slug) . '/*.json';
    }

    /**
     * Resolve documentation JSON config path from view doc metadata.
     *
    * Utility docs are loaded from source/utilities/(utility)/utility.json.
     * Other doc types continue to load from views/docs.
     *
     * @param array<string, string> $viewDoc View doc metadata.
     *
     * @return string
     */
    private function resolveDocumentationConfigPath(array $viewDoc): string
    {
        $type = strtolower((string) ($viewDoc['type'] ?? ''));
        $config = ucfirst((string) ($viewDoc['config'] ?? ''));

        if ($type === 'utility') {
            return BASEPATH . 'source/utilities/*/docs/' . $config . '.json';
        }

        $root = (string) ($viewDoc['root'] ?? '');
        return BASEPATH . 'views/docs/' . $type . '/' . $root . '/' . $config . '.json';
    }

    /**
     * Resolve a utility documentation entry from utility.json files.
     *
     * @param array<string, string> $viewDoc View doc metadata.
     * @param array<int, string>|null $utilityConfigPaths Optional utility config paths for testing.
     *
     * @return array{0: string, 1: array<string, mixed>}
     *
     * @throws \Exception
     */
    private function resolveUtilityDocumentationConfiguration(array $viewDoc, ?array $utilityConfigPaths = null): array
    {
        $configKey = $this->normalizeUtilityIdentifier((string) ($viewDoc['config'] ?? ''));
        if ($configKey === '') {
            throw new \Exception('Missing utility documentation config key.');
        }

        $root = $this->normalizeUtilityIdentifier((string) ($viewDoc['root'] ?? ''));
        $paths = is_array($utilityConfigPaths)
            ? $utilityConfigPaths
            : (glob(BASEPATH . 'source/utilities/*/utility.json') ?: []);

        $prioritizedPaths = $this->prioritizeUtilityConfigPaths($paths, $root);

        foreach ($prioritizedPaths as $path) {
            $configEntry = $this->readUtilityConfigEntry($path, $configKey);
            if (is_array($configEntry)) {
                return [$path, $configEntry];
            }
        }

        throw new \Exception("No utility configuration entry found for key '" . $configKey . "'.");
    }

    /**
     * @param array<int, string> $paths
     * @param string $root
     *
     * @return array<int, string>
     */
    private function prioritizeUtilityConfigPaths(array $paths, string $root): array
    {
        if ($root === '') {
            return $paths;
        }

        $matchingPaths = [];
        $otherPaths = [];

        foreach ($paths as $path) {
            $folder = basename(dirname($path));
            if ($this->utilityFolderMatchesRoot($folder, $root)) {
                $matchingPaths[] = $path;
                continue;
            }

            $otherPaths[] = $path;
        }

        return array_merge($matchingPaths, $otherPaths);
    }

    /**
     * @param string $folder
     * @param string $root
     *
     * @return bool
     */
    private function utilityFolderMatchesRoot(string $folder, string $root): bool
    {
        $normalizedFolder = $this->normalizeUtilityIdentifier($folder);
        $singularFolder = rtrim($normalizedFolder, 's');
        $singularRoot = rtrim($root, 's');

        return $normalizedFolder === $root || $singularFolder === $singularRoot;
    }

    /**
     * @param string $path
     * @param string $configKey
     *
     * @return array<string, mixed>|null
     */
    private function readUtilityConfigEntry(string $path, string $configKey): ?array
    {
        $content = file_get_contents($path);
        if ($content === false) {
            return null;
        }

        $decoded = json_decode($content, true);
        if (!is_array($decoded)) {
            return null;
        }

        $entries = $decoded['entries'] ?? null;
        if (!is_array($entries)) {
            return null;
        }

        foreach ($entries as $entryKey => $entryValue) {
            if (!is_string($entryKey) || !is_array($entryValue)) {
                continue;
            }

            if ($this->normalizeUtilityIdentifier($entryKey) === $configKey) {
                return $entryValue;
            }
        }

        return null;
    }

    /**
     * @param string $identifier
     *
     * @return string
     */
    private function normalizeUtilityIdentifier(string $identifier): string
    {
        return strtolower((string) preg_replace('/[^a-z0-9]/i', '', $identifier));
    }

    /**
     * Normalize component identifiers for case-insensitive matching.
     *
     * @param string $identifier Component identifier.
     *
     * @return string
     */
    private function normalizeComponentIdentifier(string $identifier): string
    {
        return strtolower((string) preg_replace('/[^a-z0-9]/i', '', $identifier));
    }

    /**
     * Fetch examples from the component examples directory.
     * @throws \Exception
     */
    public static function fetchExamples(string $slug, BladeServiceInterface $blade): array
    {
        return DocHelper::getUsageExamples($slug, $blade);

    }

    /**
     * Register Markdown component alias and view composer
     * @throws \Exception
     */
    public function registerMarkdownViewComposer(BladeServiceInterface $blade)
    {
        // Register component alias
        $blade->registerComponentDirective('layout.markdown', 'markdown');

        // Markdown module
        $blade->registerComponent('layout.markdown', function ($view) {
            $viewData = $this->accessProtected($view, 'data');

            $viewData['slot'] = isset($viewData['slot']) ? \markdown($viewData['slot']) : '';

            $view->with($viewData);
        });

        return $blade;
    }

    /**
     * Proxy for accessing provate props
     *
     * @return string Array of values
     */
    public static function accessProtected($obj, $prop)
    {
        $reflection = new \ReflectionClass($obj);
        $property = $reflection->getProperty($prop);
        $property->setAccessible(true);
        return $property->getValue($obj);
    }
}
