<?php

namespace MunicipioStyleGuide\Sidebar\Sections;

use MunicipioStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Elements sidebar section.
 */
class ElementsSection implements SidebarSectionInterface
{
    /**
     * @return string
     */
    public function getKey(): string
    {
        return 'elements';
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return 'Elements';
    }
}
