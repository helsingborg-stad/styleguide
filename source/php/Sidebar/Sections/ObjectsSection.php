<?php

namespace MunicipioStyleGuide\Sidebar\Sections;

use MunicipioStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Objects sidebar section.
 */
class ObjectsSection implements SidebarSectionInterface
{
    /**
     * @return string
     */
    public function getKey(): string
    {
        return 'objects';
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return 'Object';
    }
}
