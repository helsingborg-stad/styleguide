
<div>
  @date([
    'action' => 'timesince',
    'timestamp' => '2020-01-01 17:25:43',
    'labels' => [
      'year' => 'år',
      'month' => 'månad',
      'week' => 'vecka',
      'day' => 'dag',
      'hour' => 'timme',
      'minute' => 'minut',
      'second' => 'sekund'
    ],
    'labelsPlural' => [
      'year' => 'år',
      'month' => 'månader',
      'week' => 'veckor',
      'day' => 'dagar',
      'hour' => 'timmar',
      'minute' => 'minuter',
      'second' => 'sekund'
    ]
  ])
  @enddate
</div>

<div>
  @date([
    'action' => 'timesince',
    'timestamp' => date("Y-m-d H:i:s"), //'2020-01-01 17:25:43',
    'labels' => [
      'year' => 'år',
      'month' => 'månad',
      'week' => 'vecka',
      'day' => 'dag',
      'hour' => 'timme',
      'minute' => 'minut',
      'second' => 'sekund'
    ],
    'labelsPlural' => [
      'year' => 'år',
      'month' => 'månader',
      'week' => 'veckor',
      'day' => 'dagar',
      'hour' => 'timmar',
      'minute' => 'minuter',
      'second' => 'sekund'
    ]
  ])
  @enddate
</div>