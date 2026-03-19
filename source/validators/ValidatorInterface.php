<?php

namespace MunicipioStyleGuide\Validators;

interface ValidatorInterface
{
    public function validate(string $filePath): ValidationResult;
}
