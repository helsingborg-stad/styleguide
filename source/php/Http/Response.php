<?php

namespace HbgStyleGuide\Http;

/**
 * HTTP response writer.
 */
class Response
{
    /**
     * Writes JSON response and exits.
     *
     * @param mixed $payload Data payload.
     * @param int $statusCode HTTP status code.
     *
     * @return void
     */
    public function json(mixed $payload, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($payload);
    }
}
