<?php

namespace HbgStyleGuide\Sidebar\Sections;

use HbgStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Sidebar section for objects pages.
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
        return 'Objects';
    }
}
