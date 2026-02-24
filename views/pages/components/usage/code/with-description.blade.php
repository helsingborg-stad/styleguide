@code(['language' => 'php', 'content' => 'A helper function that formats a date string into a human-readable format.'])

    function formatDate(string $date, string $format = 'Y-m-d'): string
    {
        return date($format, strtotime($date));
    }

@endcode
