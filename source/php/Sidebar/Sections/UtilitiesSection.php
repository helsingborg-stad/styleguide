<?php

namespace HbgStyleGuide\Sidebar\Sections;

use HbgStyleGuide\Contracts\SidebarSectionInterface;

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
