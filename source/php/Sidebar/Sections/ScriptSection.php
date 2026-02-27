<?php

namespace HbgStyleGuide\Sidebar\Sections;

use HbgStyleGuide\Contracts\SidebarSectionInterface;

/**
 * Sidebar section for script pages.
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
        return 'Script';
    }
}
