<?php

namespace HbgStyleGuide\Controllers;

use HbgStyleGuide\Http\Request;
use HbgStyleGuide\Http\Response;

/**
 * Base controller with shared HTTP context.
 */
abstract class BaseController
{
    /**
     * @param Request $request Current request.
     * @param Response $response Current response.
     */
    public function __construct(
        protected Request $request,
        protected Response $response,
    ) {}
}
