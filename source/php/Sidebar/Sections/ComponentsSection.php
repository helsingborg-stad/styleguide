<?php

namespace HbgStyleGuide\Sidebar\Sections;

use HbgStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Sidebar section for components pages.
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
        return 'Components';
    }
}
