<?php

namespace HbgStyleGuide\Controllers;

use HbgStyleGuide\Asset;
use HbgStyleGuide\Contracts\ControllerInterface;
use HbgStyleGuide\Navigation;
use HbgStyleGuide\View;
use HelsingborgStad\BladeService\BladeServiceInterface;

/**
 * Controller for page rendering.
 */
class PageController extends BaseController implements ControllerInterface
{
    /**
     * @param \HelsingborgStad\BladeService\BladeServiceInterface $bladeService Blade service.
     * @param View $view View renderer.
     * @param Navigation $navigation Navigation service.
     */
    public function __construct(
        \HbgStyleGuide\Http\Request $request,
        \HbgStyleGuide\Http\Response $response,
        private BladeServiceInterface $bladeService,
        private View $view,
        private Navigation $navigation,
    ) {
        parent::__construct($request, $response);
    }

    /**
     * Handles page request rendering.
     *
     * @return void
     */
    public function handle(): void
    {
        $page = $this->request->resolvePage();

        $data = [
            'assets' => Asset::getAll(),
            'topNavigation' => $this->navigation->buildItems('pages/', [], false),
            'sideNavigation' => $this->navigation->buildSidebarNavigation(),
            'pageNow' => $page,
        ];

        $this->view->show($page, $data, $this->bladeService);
    }
}
