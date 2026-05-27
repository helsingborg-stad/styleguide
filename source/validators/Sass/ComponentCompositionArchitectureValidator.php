<?php

namespace MunicipioStyleGuide\Validators\Sass;

use MunicipioStyleGuide\Validators\ComponentNameResolver;
use MunicipioStyleGuide\Validators\ValidationResult;
use MunicipioStyleGuide\Validators\ValidatorInterface;

/**
 * Validates that a component affects nested components through one of the
 * approved composition patterns:
 * - Setting dedicated --inherit-* hooks on the nested component
 * - Targeting only the nested component's outermost element
 *
 * Reaching into another component's internal BEM elements from a parent
 * component couples their implementations and makes composition brittle.
 */
class ComponentCompositionArchitectureValidator implements ValidatorInterface
{
    /**
     * @var ComponentNameResolver Resolves the owning component name from the file path or content.
     */
    private ComponentNameResolver $componentNameResolver;

    /**
     * @param ComponentNameResolver|null $componentNameResolver Optional component name resolver dependency.
     */
    public function __construct(?ComponentNameResolver $componentNameResolver = null)
    {
        $this->componentNameResolver = $componentNameResolver ?? new ComponentNameResolver();
    }

    /**
     * Validates that the SCSS file does not target another component's inner selectors.
     *
     * @param string $filePath Absolute path to the SCSS file to validate.
     *
     * @return ValidationResult
     */
    public function validate(string $filePath): ValidationResult
    {
        $result = new ValidationResult();

        if (!is_readable($filePath)) {
            $result->addViolation(0, "File not readable: {$filePath}");
            return $result;
        }

        $content = file_get_contents($filePath);
        if ($content === false) {
            $result->addViolation(0, "Could not read file: {$filePath}");
            return $result;
        }

        $ownerComponentName = $this->componentNameResolver->resolve($filePath);
        if ($ownerComponentName === null) {
            $result->addViolation(0, "Could not determine component name for: {$filePath}");
            return $result;
        }

        $ownerComponentClass = 'c-' . $ownerComponentName;

        preg_match_all('/(^|[}\n])\s*(?!@)([^{}]+)\{/m', $content, $matches, PREG_OFFSET_CAPTURE);

        foreach ($matches[2] as [$selectorList, $offset]) {
            if (str_contains($selectorList, ';')) {
                continue;
            }

            $lineNumber = substr_count(substr($content, 0, $offset), "\n") + 1;

            foreach ($this->splitSelectors($selectorList) as $selector) {
                $normalizedSelector = $this->normalizeSelector($selector);
                if ($normalizedSelector === '') {
                    continue;
                }

                if ($this->targetsNestedDataComponentContent($normalizedSelector)) {
                    $result->addViolation(
                        $lineNumber,
                        'Target only a nested component outermost element or use --inherit-* hooks instead of styling inside [data-component="..."]',
                        $normalizedSelector,
                    );
                    continue;
                }

                foreach ($this->extractTargetedNestedComponentClasses($normalizedSelector) as $targetedComponentClass) {
                    if ($targetedComponentClass === $ownerComponentClass) {
                        continue;
                    }

                    $result->addViolation(
                        $lineNumber,
                        sprintf(
                            "Selector reaches into '%s' internals; target '.%s' instead or pass values with --inherit-* variables",
                            $targetedComponentClass,
                            $targetedComponentClass,
                        ),
                        $normalizedSelector,
                    );
                }
            }
        }

        return $result;
    }

    /**
     * Splits a selector list into individual selectors while preserving commas inside functional pseudo-classes.
     *
     * @param string $selectorList Raw selector list text.
     *
     * @return string[]
     */
    private function splitSelectors(string $selectorList): array
    {
        $selectors = preg_split('/,(?![^()]*\))/', $selectorList);
        if ($selectors === false) {
            return [$selectorList];
        }

        return $selectors;
    }

    /**
     * Normalizes selector whitespace for readable messages and matching.
     *
     * @param string $selector Raw selector text.
     *
     * @return string
     */
    private function normalizeSelector(string $selector): string
    {
        $selector = preg_replace('/\s+/', ' ', trim($selector));
        return is_string($selector) ? $selector : '';
    }

    /**
     * Returns true when a selector targets descendants inside a [data-component] boundary.
     *
     * @param string $selector Normalized selector.
     *
     * @return bool
     */
    private function targetsNestedDataComponentContent(string $selector): bool
    {
        return (bool) preg_match('/\[data-component="[^"]+"\][^,{]*[>+~\s]+[^,{]*\./', $selector);
    }

    /**
     * Extracts nested component classes that are being targeted below their outermost element.
     *
     * @param string $selector Normalized selector.
     *
     * @return string[]
     */
    private function extractTargetedNestedComponentClasses(string $selector): array
    {
        preg_match_all('/\.((c-[a-z0-9-]+)(?:__[a-z0-9-]+|--[a-z0-9-]+))/', $selector, $matches);

        $targetedComponentClasses = [];
        foreach ($matches[1] as $index => $fullMatch) {
            $baseComponentClass = $matches[2][$index];
            if ($fullMatch === $baseComponentClass) {
                continue;
            }

            $targetedComponentClasses[] = $baseComponentClass;
        }

        return array_values(array_unique($targetedComponentClasses));
    }
}
