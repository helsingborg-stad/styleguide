#!/usr/bin/env node
const inquirer = require('inquirer');
const chalk = require('chalk');
const shell = require('shelljs');
const figlet = require('figlet');
const buildHeader = require('./consoleHeader.js');
const log = require('consola');

/**
 *
 * @type {SilverFisk}
 */
class SilverFisk {
    constructor() {
        this.runSilverFisk(buildHeader.ConsoleHeader).then(r => '');
    }

    /**
     * run npm commands
     * @param cmd
     */
    runCommand(cmd) {
        if (cmd === 'exit') {
            //shell.exit;
        } else {
            process.cwd('npm run ' + cmd);
        }
    }

    /**
     *
     */
    sysQuestion() {
        let question = [
            {
                name: 'Menu',
                type: 'list',
                message: chalk.hex('#ffffff').bold('Compile what?'),
                choices: ['sass', 'js'],
            },
        ];

        return inquirer.prompt(question['cliMenu']);
    }

    /**
     *
     * @param runCmd
     */
    success(runCmd) {
        log.success(chalk.hex('#0aab1d').bold('Executing cmd: npm run ' + runCmd));
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async runSilverFisk(data) {
        const answers = this.sysQuestion();
        const { cmd } = await answers;

        const runCmd = await this.runCommand(cmd);
        await this.success(runCmd);
    }
}

module.exports = new SilverFisk();
