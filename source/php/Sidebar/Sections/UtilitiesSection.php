<?php

namespace HbgStyleGuide\Sidebar\Sections;

use HbgStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Sidebar section for utility pages.
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
        return 'Utilities';
    }
}
