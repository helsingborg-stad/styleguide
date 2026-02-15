<?php

namespace HbgStyleGuide\Validators;

class DesignTokensParser
{
    /** @return string[] List of CSS custom property names (e.g., '--base', '--color--primary') */
    public function parseTokensJson(string $tokensJsonPath): array
    {
        if (!is_readable($tokensJsonPath)) {
            return [];
        }

        $json = file_get_contents($tokensJsonPath);
        if ($json === false) {
            return [];
        }

        $data = json_decode($json, true);
        if (!is_array($data) || !isset($data['categories'])) {
            return [];
        }

        $variables = [];
        foreach ($data['categories'] as $category) {
            if (!isset($category['settings']) || !is_array($category['settings'])) {
                continue;
            }
            foreach ($category['settings'] as $setting) {
                if (isset($setting['variable'])) {
                    $variables[] = $setting['variable'];
                }
                if (isset($setting['contrast'])) {
                    $contrast = $setting['contrast'];
                    if (is_string($contrast)) {
                        $variables[] = $contrast;
                    } elseif (is_array($contrast)) {
                        foreach ($contrast as $c) {
                            $variables[] = $c;
                        }
                    }
                }
            }
        }

        return $variables;
    }

    /** @return string[] List of CSS custom property names declared in _var_css.scss */
    public function parseVarCss(string $varCssPath): array
    {
        if (!is_readable($varCssPath)) {
            return [];
        }

        $content = file_get_contents($varCssPath);
        if ($content === false) {
            return [];
        }

        $variables = [];
        if (preg_match_all('/^\s*(--[a-z][a-z0-9-]*)\s*:/m', $content, $matches)) {
            $variables = $matches[1];
        }

        return $variables;
    }

    /** @return string[] Combined unique list from both sources */
    public function getAllowedVariables(string $tokensJsonPath, string $varCssPath): array
    {
        $fromTokens = $this->parseTokensJson($tokensJsonPath);
        $fromCss    = $this->parseVarCss($varCssPath);

        return array_values(array_unique(array_merge($fromTokens, $fromCss)));
    }
}
