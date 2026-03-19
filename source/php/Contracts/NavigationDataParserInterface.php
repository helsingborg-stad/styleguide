<?php

namespace MunicipioStyleGuide\Contracts;

/**
 * Contract for parsing structured navigation data.
 */
interface NavigationDataParserInterface
{
    /**
     * Parses structured navigation entries.
     *
     * @param array<mixed> $items Raw items.
     *
     * @return array<mixed>
     */
    public function parse(array $items): array;
}
