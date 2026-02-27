<?php

namespace HbgStyleGuide\Contracts;

/**
 * Contract for a request controller.
 */
interface ControllerInterface
{
    /**
     * Handles a request.
     *
     * @return void
     */
    public function handle(): void;
}
