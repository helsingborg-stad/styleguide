<?php

namespace MunicipioStyleGuide\Controllers;

use MunicipioStyleGuide\Http\Request;
use MunicipioStyleGuide\Http\Response;

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
