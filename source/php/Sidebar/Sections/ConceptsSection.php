<?php

namespace MunicipioStyleGuide\Sidebar\Sections;

use MunicipioStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Concepts sidebar section.
 */
class ConceptsSection implements SidebarSectionInterface
{
    /**
     * @return string
     */
    public function getKey(): string
    {
        return 'concepts';
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return 'Concepts';
    }
}
