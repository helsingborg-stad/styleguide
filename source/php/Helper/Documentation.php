<?php


namespace HbgStyleGuide\Helper;

use HelsingborgStad\BladeService\BladeServiceInterface;

/**
 * Class Documentation
 * @package HbgStyleGuide\Helper
 */
class Documentation
{
    /**
     * @param $slug
     * @return array
     * @throws \Exception
     */
    public static function getUsageExamples(string $slug, BladeServiceInterface $blade)
    {
        $sourceExamplesDir = BASEPATH . 'source/components/' . $slug . '/examples';
        $examples = [];

        $examplesConfig = [];
        $sourceExamplesConfigPath = $sourceExamplesDir . '/examples.json';
        if (file_exists($sourceExamplesConfigPath)) {
            $sourceConfigContent = file_get_contents($sourceExamplesConfigPath);
            $sourceConfig = json_decode((string) $sourceConfigContent, true);
            if (is_array($sourceConfig)) {
                $examplesConfig = $sourceConfig;
            }
        }

        if (empty($examplesConfig) || !is_array($examplesConfig)) {
            return $examples;
        }

        foreach (array_keys($examplesConfig) as $exampleKey) {
            $filePath = $exampleKey . '.blade.php';
            $sourceBladePath = $sourceExamplesDir . '/' . $filePath;

            $includePath = null;
            $contentSourcePath = null;

            if (file_exists($sourceBladePath)) {
                $includePath = 'source.components.' . $slug . '.examples.' . $exampleKey;
                $contentSourcePath = $sourceBladePath;
            }

            if ($includePath === null || $contentSourcePath === null) {
                continue;
            }

            $html = $blade->makeView($includePath)->render();
            $content = file_get_contents($contentSourcePath, FILE_USE_INCLUDE_PATH);

            $description = is_array($examplesConfig[$exampleKey] ?? null) ? $examplesConfig[$exampleKey] : [];

            $normalizedDescription = [
                'heading' => $description['heading'] ?? '',
                'description' => $description['description'] ?? ($description['text'] ?? ''),
            ];

            $examples[] = [
                'component' => $includePath,
                'blade' => ['id' => uniqid('', true), 'code' => $content],
                'html' => ['id' => uniqid('', true), 'code' => $html],
                'description' => $normalizedDescription,
            ];
        }

        return $examples;
    }


    /**
     * @param $dir
     * @param $slug
     * @return mixed
     */
    public static function getJson($dir, $slug)
    {
        $configContent = file_get_contents($dir . '/' . $slug . '.json');
        $json = json_decode($configContent, true);
        return $json;
    }


    /**
     * @return array
     */
    public static function getComponentDirectories()
    {
        $atomic = ['atoms', 'molecules', 'organisms'];
        $results = [];
        foreach ($atomic as $atomicDir) {

            $dir = BASEPATH . '/views/pages/components/' . $atomicDir . '/';
            $files = scandir($dir);
            $results[$atomicDir] = [];
            foreach ($files as $key => $value) {
                if ($value !== "." &&
                    $value !== ".." &&
                    $value !== "" &&
                    $value !== ".dc_store") {

                    array_push($results[$atomicDir], str_replace('.blade.php', '', $value));
                }
            }
        }
        return array_filter($results);
    }

}