#!/bin/php
<?php

// Only allow run from cli.
if (php_sapi_name() !== 'cli') {
    exit(0);
}

// Any command needed to run and build plugin assets when newly cheched out of repo.
$arguments = array_slice($argv, 1);
$skipComposer = in_array('--no-composer', $arguments, true);
$shouldCleanup = in_array('--cleanup', $arguments, true);
$isReleaseBuild = in_array('--release', $arguments, true);

$buildCommands = [
    'npm ci --no-progress --no-audit',
    'npm run build',
];

if (!$skipComposer) {
    array_unshift($buildCommands, 'composer install --prefer-dist --no-progress');
}

// Files and directories not suitable for prod to be removed.
$removables = [
    '.eslintrc',
    '.git',
    '.gitignore',
    '.github',
    '.gitmodules',
    '.prettierrc',
    '.stylelintignore',
    '.stylelintrc',
    'build',
    'build.php',
    'composer.json',
    'composer.lock',
    'node_modules',
    'package-lock.json',
    'package.json',
    'phpcbf.phar',
    'phpcs.phar',
    'postcss.config.js',
    'setup.sh',
    'webpack.config.js',
    'source/components/Tests',
];

$dirName = basename(dirname(__FILE__));

// Run all build commands.
$output = '';
$exitCode = 0;
foreach ($buildCommands as $buildCommand) {
    print "---- Running build command '$buildCommand' for $dirName. ----\n";
    $exitCode = executeCommand($buildCommand);
    print "---- Done build command '$buildCommand' for $dirName. ----\n";
    if ($exitCode > 0) {
        exit($exitCode);
    }
}

// Remove files and directories if '--cleanup' argument is supplied to save local developers from disasters.
if ($shouldCleanup) {
    foreach ($removables as $removable) {
        // A release branch is consumed as a Composer package, so retain its metadata.
        if ($isReleaseBuild && in_array($removable, ['composer.json', 'composer.lock'], true)) {
            continue;
        }

        if (file_exists($removable)) {
            print "Removing $removable from $dirName\n";
            shell_exec("rm -rf $removable");
        }
    }
}

/**
 * Better shell script execution with live output to STDOUT and status code return.
 * @param  string $command Command to execute in shell.
 * @return int             Exit code.
 */
function executeCommand($command)
{
    $proc = popen("$command 2>&1 ; echo Exit status : $?", 'r');

    $liveOutput = '';
    $completeOutput = '';

    while (!feof($proc)) {
        $liveOutput = fread($proc, 4096);
        $completeOutput = $completeOutput . $liveOutput;
        print $liveOutput;
        @flush();
    }

    pclose($proc);

    // Get exit status.
    preg_match('/[0-9]+$/', $completeOutput, $matches);

    // Return exit status.
    return intval($matches[0]);
}
