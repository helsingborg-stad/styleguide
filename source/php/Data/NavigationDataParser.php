<?php

namespace MunicipioStyleGuide\Data;

use MunicipioStyleGuide\Contracts\NavigationDataParserInterface;

/**
 * Parses structured navigation input into component-ready arrays.
 */
class NavigationDataParser implements NavigationDataParserInterface
{
    /**
     * @param array<mixed> $items Raw items.
     *
     * @return array<mixed>
     */
    public function parse(array $items): array
    {
        $result = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $id = isset($item['id']) ? (string) $item['id'] : null;
            $label = isset($item['label']) ? (string) $item['label'] : (string) ($item['name'] ?? '');
            $href = isset($item['href']) ? (string) $item['href'] : '#';
            $rawChildren = $item['children'] ?? $item['list'] ?? false;

            $children = false;
            if (is_array($rawChildren)) {
                $children = $this->parse($rawChildren);
            } elseif ($rawChildren === true) {
                $children = true;
            }

            $parsed = [
                'href' => $href,
                'label' => $label,
                'children' => $children,
            ];

            if ($id !== null) {
                $parsed['ID'] = $id;
                $parsed['id'] = $id;
            }

            if (isset($item['style'])) {
                $parsed['style'] = (string) $item['style'];
            }

            if (isset($item['attributeList']) && is_array($item['attributeList'])) {
                $parsed['attributeList'] = $item['attributeList'];
            }

            $result[] = $parsed;
        }

        return $result;
    }
}
