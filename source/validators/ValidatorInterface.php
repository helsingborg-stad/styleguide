<?php

namespace HbgStyleGuide\Validators;

interface ValidatorInterface
{
    public function validate(string $filePath): ValidationResult;
}
