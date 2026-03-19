<?php

namespace MunicipioStyleGuide\Contracts;

/**
 * Contract for a sidebar section entry.
 */
interface SidebarSectionInterface
{
    /**
     * Returns sidebar section key.
     *
     * @return string
     */
    public function getKey(): string;

    /**
     * Returns sidebar section label.
     *
     * @return string
     */
    public function getLabel(): string;
}
