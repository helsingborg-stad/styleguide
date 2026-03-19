<?php

namespace MunicipioStyleGuide\Sidebar\Sections;

use MunicipioStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Script sidebar section.
 */
class ScriptSection implements SidebarSectionInterface
{
    /**
     * @return string
     */
    public function getKey(): string
    {
        return 'script';
    }

    /**
     * @return string
     */
    public function getLabel(): string
    {
        return 'Scripts';
    }
}
