<?php

namespace MunicipioStyleGuide\Tests;

use MunicipioStyleGuide\Helper\ComponentCssParameters;
use PHPUnit\Framework\TestCase;

/**
 * @covers \MunicipioStyleGuide\Helper\ComponentCssParameters
 */
class ComponentCssParametersTest extends TestCase
{
    private string $tempBasePath;

    protected function setUp(): void
    {
        $this->tempBasePath = sys_get_temp_dir() . '/styleguide-css-params-' . uniqid('', true);

        mkdir($this->tempBasePath . '/source/components/alpha', 0777, true);
        mkdir($this->tempBasePath . '/source/data', 0777, true);

        file_put_contents(
            $this->tempBasePath . '/source/components/alpha/component.json',
            json_encode(
                [
                    'name' => 'Alpha',
                    'slug' => 'alpha',
                    'tokens' => ['base', 'shadow-color', 'shadow-color-opacity', 'shadow-amount', 'color--primary'],
                    'componentSettings' => [
                        [
                            'id' => 'typography',
                            'label' => 'Typography',
                            'settings' => [
                                [
                                    'variable' => '--font-size-multiplier',
                                    'label' => 'Font Size Multiplier',
                                    'description' => 'Scales component font sizes locally.',
                                    'type' => 'range',
                                    'default' => '1',
                                    'min' => 0.1,
                                    'max' => 4,
                                    'step' => 0.1,
                                ],
                            ],
                        ],
                    ],
                ],
                JSON_PRETTY_PRINT,
            ),
        );

        file_put_contents(
            $this->tempBasePath . '/source/data/design-tokens.json',
            json_encode(
                [
                    'name' => 'Design System',
                    'version' => '1.0.0',
                    'categories' => [
                        [
                            'id' => 'base',
                            'label' => 'Base',
                            'settings' => [
                                [
                                    'variable' => '--base',
                                    'label' => 'Base Unit',
                                    'description' => 'Main unit.',
                                    'type' => 'range',
                                    'default' => '8px',
                                ],
                            ],
                        ],
                        [
                            'id' => 'shadows',
                            'label' => 'Shadows',
                            'settings' => [
                                [
                                    'variable' => '--shadow-color',
                                    'label' => 'Shadow Color',
                                    'type' => 'color',
                                    'default' => '#000000',
                                ],
                                [
                                    'variable' => '--shadow-color-opacity',
                                    'label' => 'Shadow Opacity',
                                    'type' => 'range',
                                    'default' => 0.25,
                                ],
                                [
                                    'variable' => '--shadow-amount',
                                    'label' => 'Shadow Amount',
                                    'type' => 'range',
                                    'default' => 2,
                                ],
                            ],
                        ],
                        [
                            'id' => 'color',
                            'label' => 'Colors',
                            'settings' => [
                                [
                                    'variable' => '--color--primary',
                                    'label' => 'Primary Color',
                                    'type' => 'select',
                                    'default' => '#0055ff',
                                    'options' => [
                                        ['value' => '#0055ff', 'label' => 'Blue'],
                                        ['value' => '#0f766e', 'label' => 'Teal'],
                                    ],
                                ],
                                [
                                    'variable' => '--color--primary-contrast',
                                    'label' => 'Primary Contrast',
                                    'type' => 'color',
                                    'default' => '#ffffff',
                                ],
                            ],
                        ],
                    ],
                ],
                JSON_PRETTY_PRINT,
            ),
        );
    }

    protected function tearDown(): void
    {
        @unlink($this->tempBasePath . '/source/components/alpha/component.json');
        @unlink($this->tempBasePath . '/source/data/design-tokens.json');
        @rmdir($this->tempBasePath . '/source/components/alpha');
        @rmdir($this->tempBasePath . '/source/components');
        @rmdir($this->tempBasePath . '/source/data');
        @rmdir($this->tempBasePath . '/source');
        @rmdir($this->tempBasePath);
    }

    public function testGetForComponentReturnsLocalizedComponentVariables(): void
    {
        $rows = ComponentCssParameters::getForComponent('alpha', $this->tempBasePath);

        $this->assertCount(6, $rows);

        $this->assertSame('--c-alpha--base', $rows[0]['key']);
        $this->assertSame('var(--base)', $rows[0]['defaultValue']);
        $this->assertSame('Main unit.', $rows[0]['description']);

        $this->assertSame('--c-alpha--shadow-color', $rows[1]['key']);
        $this->assertSame('--c-alpha--shadow-color-opacity', $rows[2]['key']);
        $this->assertSame('--c-alpha--shadow-amount', $rows[3]['key']);
        $this->assertSame('--c-alpha--color--primary', $rows[4]['key']);
        $this->assertSame('--c-alpha--font-size-multiplier', $rows[5]['key']);
        $this->assertSame('1', $rows[5]['defaultValue']);
        $this->assertSame('Scales component font sizes locally.', $rows[5]['description']);

        $this->assertSame('#0055ff, #0f766e', $rows[4]['availableValues']);
    }

    public function testGetForComponentReturnsEmptyArrayWhenFilesAreMissing(): void
    {
        $rows = ComponentCssParameters::getForComponent('missing', $this->tempBasePath);

        $this->assertSame([], $rows);
    }
}
