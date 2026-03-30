<?php

namespace MunicipioStyleGuide\Tests;

use MunicipioStyleGuide\Customize\CustomizeAssets;
use PHPUnit\Framework\TestCase;

/**
 * @covers \MunicipioStyleGuide\Customize\CustomizeAssets
 */
class CustomizeAssetsTest extends TestCase
{
    /**
     * @return void
     *
     * @runInSeparateProcess
     */
    public function testGetReturnsCustomizeAssetsAndDataWhenFilesExist(): void
    {
        $tempBasePath = sys_get_temp_dir() . '/styleguide-customize-assets-' . uniqid('', true) . '/';
        mkdir($tempBasePath . 'assets/dist', 0777, true);

        file_put_contents(
            $tempBasePath . 'assets/dist/manifest.json',
            json_encode([
                'js/design-builder.js' => 'js/design-builder.abc.js',
                'css/design-builder.css' => 'css/design-builder.abc.css',
            ]),
        );

        file_put_contents(
            $tempBasePath . 'component-design-tokens.json',
            json_encode([
                'category' => 'theme',
                'tokens' => ['--color' => '#ffffff'],
            ]),
        );

        mkdir($tempBasePath . 'source/data', 0777, true);
        file_put_contents(
            $tempBasePath . 'source/data/design-tokens.json',
            json_encode([
                'name' => 'Design tokens',
                'version' => '1.0.0',
                'categories' => [],
            ]),
        );

        define('BASEPATH', $tempBasePath);

        $result = CustomizeAssets::get();

        $this->assertSame('/assets/dist/js/design-builder.abc.js', $result['script']);
        $this->assertSame('/assets/dist/css/design-builder.abc.css', $result['style']);
        $this->assertSame('{"category":"theme","tokens":{"--color":"#ffffff"}}', $result['data']);
        $this->assertSame('{"name":"Design tokens","version":"1.0.0","categories":[]}', $result['tokenLibrary']);

        @unlink($tempBasePath . 'component-design-tokens.json');
        @unlink($tempBasePath . 'source/data/design-tokens.json');
        @unlink($tempBasePath . 'assets/dist/manifest.json');
        @rmdir($tempBasePath . 'source/data');
        @rmdir($tempBasePath . 'source');
        @rmdir($tempBasePath . 'assets/dist');
        @rmdir($tempBasePath . 'assets');
        @rmdir($tempBasePath);
    }

    /**
     * @return void
     *
     * @runInSeparateProcess
     */
    public function testGetReturnsNullValuesWhenManifestAndDataAreInvalid(): void
    {
        $tempBasePath = sys_get_temp_dir() . '/styleguide-customize-assets-invalid-' . uniqid('', true) . '/';
        mkdir($tempBasePath . 'assets/dist', 0777, true);

        file_put_contents($tempBasePath . 'assets/dist/manifest.json', '{invalid');
        file_put_contents($tempBasePath . 'component-design-tokens.json', '{invalid');
        mkdir($tempBasePath . 'source/data', 0777, true);
        file_put_contents($tempBasePath . 'source/data/design-tokens.json', '{invalid');

        define('BASEPATH', $tempBasePath);

        $result = CustomizeAssets::get();

        $this->assertNull($result['script']);
        $this->assertNull($result['style']);
        $this->assertNull($result['data']);
        $this->assertNull($result['tokenLibrary']);

        @unlink($tempBasePath . 'component-design-tokens.json');
        @unlink($tempBasePath . 'source/data/design-tokens.json');
        @unlink($tempBasePath . 'assets/dist/manifest.json');
        @rmdir($tempBasePath . 'source/data');
        @rmdir($tempBasePath . 'source');
        @rmdir($tempBasePath . 'assets/dist');
        @rmdir($tempBasePath . 'assets');
        @rmdir($tempBasePath);
    }
}
