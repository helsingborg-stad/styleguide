<?php

// Write results to the workflow job summary, including release runs whose
// tested commit can differ from the commit that triggered the workflow.
[$script, $title, $path] = $argv;
$summary = fopen(getenv('GITHUB_STEP_SUMMARY'), 'a');
fwrite($summary, "## " . htmlspecialchars($title) . "\n\n");
if (!is_file($path) || !($xml = simplexml_load_file($path))) {
    fwrite($summary, "No test results were produced. Check the test step logs.\n");
    exit(0);
}
$cases = $xml->xpath('//testcase');
$counts = ['passed' => 0, 'failed' => 0, 'skipped' => 0];
$failures = [];
foreach ($cases as $case) {
    $failure = $case->failure[0] ?? $case->error[0] ?? null;
    if ($failure !== null) {
        $counts['failed']++;
        $failures[] = [(string) $case['classname'] . ' :: ' . (string) $case['name'], (string) $failure];
    } elseif (isset($case->skipped)) {
        $counts['skipped']++;
    } else {
        $counts['passed']++;
    }
}
fwrite($summary, "| Passed | Failed | Skipped |\n| ---: | ---: | ---: |\n| {$counts['passed']} | {$counts['failed']} | {$counts['skipped']} |\n\n");
foreach ($failures as [$name, $message]) {
    fwrite($summary, '<details><summary>' . htmlspecialchars($name) . "</summary>\n\n<pre>" . htmlspecialchars($message) . "</pre>\n</details>\n\n");
}
