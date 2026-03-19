<?php

namespace MunicipioStyleGuide\Sidebar\Sections;

use MunicipioStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Components sidebar section.
 */
class ComponentsSection implements SidebarSectionInterface
{
    /**
     * @return string
     */
    public function getKey(): string
    {
        return 'components';
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return 'Component';
    }
}
