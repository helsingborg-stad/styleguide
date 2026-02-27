<?php

namespace HbgStyleGuide\Sidebar\Sections;

use HbgStyleGuide\Contracts\SidebarSectionInterface;

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
        return 'Components';
    }
}
