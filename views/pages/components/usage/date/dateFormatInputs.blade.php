@php
    
    $dates = [
        '2024-10-03 14:35:00',           // ISO 8601 format
        '03/10/2024',                    // DD/MM/YYYY
        '10/03/2024',                    // MM/DD/YYYY
        'October 3, 2024',               // Full date with month name
        '03-Oct-2024 14:35',             // DD-MMM-YYYY with time
        'Thu, 03 Oct 2024 14:35:00 +0000',// RFC 2822 format
        '2024-10-03T14:35:00Z',          // UTC in ISO 8601
        '2024-W40-4',                    // ISO week date (2024 Week 40, Thursday)
        'Thursday, October 3, 2024',     // Full weekday name
        '20241003T143500Z',              // Basic ISO 8601 without separators
        '2024-10-03T14:35:00+01:00',     // ISO 8601 with time zone offset
        '03/10/24',                      // Short date format (DD/MM/YY)
        '10/03/24',                      // Short date format (MM/DD/YY)
        '2024-Oct-03',                   // Year, short month, day
        'Oct 03 14:35:00 2024',          // Unix-style format
        '03 October 2024 14:35',         // Day before month with time
        '03/Oct/2024:14:35:00 +0000',    // Combined format (Apache log style)
        '2024-Q4',                       // Year and quarter
        '3rd of October, 2024',          // Ordinal day format
        '2024.10.03 AD at 14:35:00',     // Dot-separated with AD suffix
        '03-10-2024 14.35.00',           // Dashes with dots for time
        'Oct 3rd, 2024, 2:35 PM',        // Informal format with AM/PM
        '24-03-2024',                    // DD-MM-YYYY
        '03-Oct-2024',                   // Day, short month, year
        '2024/10/03 14:35:00',           // Slash-separated with time
        '10-03-2024T14:35',              // Dash-separated, no seconds
        '3 October 14:35',               // Day, month, and time
        'Thursday, 03-Oct-2024',         // Full day and short date
        '2024, 3rd of October',          // Year, day with ordinal
        '03 October, 2024 14:35',        // Day, month, year with time
    ];

@endphp

<div style="display: grid;">
    @foreach ($dates as $date)

        <div style="grid-column: 1;">{{ $date }}</div>
        <div style="grid-column: 2;">
            @date([
                'action' => 'formatDate',
                'timestamp' => $date
            ])
            @enddate
        </div>

    @endforeach
</div>