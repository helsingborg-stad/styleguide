<?php

namespace HbgStyleGuide\Contracts;

/**
 * Contract for a sidebar navigation section.
 */
interface SidebarSectionInterface
{
    /**
     * Returns section key used in navigation map.
     *
     * @return string
     */
    public function getKey(): string;

    /**
     * Returns section label.
     *
     * @return string
     */
    public function getLabel(): string;
}
