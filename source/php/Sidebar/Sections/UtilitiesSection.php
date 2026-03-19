<?php

namespace MunicipioStyleGuide\Sidebar\Sections;

use MunicipioStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Utilities sidebar section.
 */
class UtilitiesSection implements SidebarSectionInterface
{
    /**
     * @return string
     */
    public function getKey(): string
    {
        return 'utilities';
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return 'Utility';
    }
}
