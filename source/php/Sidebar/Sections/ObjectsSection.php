<?php

namespace HbgStyleGuide\Sidebar\Sections;

use HbgStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Objects sidebar section.
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
        return 'Object';
    }
}
