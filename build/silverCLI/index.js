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
    /**
     *
     */
    constructor() {
        this.runSilverFisk(buildHeader.ConsoleHeader).then(r => this.test());
    }

    test() {}

    /**
     *
     */
    sysQuestion() {
        let question = [];

        question['cliMenu'] = [
            {
                name: 'Menu',
                type: 'list',
                message: 'What can I help you with?',
                choices: ['FileSystem', 'Commands', 'SSH', 'Valet'],
            },
        ];

        question['files'] = [
            {
                name: 'DIRECTORY',
                type: 'input',
                message: 'Where do you want to create a file?',
            },
            {
                name: 'FILENAME',
                type: 'input',
                message: 'What is the name of the file without extension?',
            },
            {
                type: 'list',
                name: 'EXTENSION',
                message: 'What is the file extension?',
                choices: ['.scss', '.js', '.php', '.blade.php'],
                filter: function(val) {
                    return val.split('.')[1];
                },
            },
        ];

        return inquirer.prompt(question['cliMenu']);
    }

    /**
     *
     * @param filename
     * @param extension
     * @returns {string}
     */
    createFile(filename, extension) {
        const filePath = `${process.cwd()}/${filename}.${extension}`;
        shell.touch(filePath);
        return filePath;
    }

    /**
     *
     * @param filepath
     */
    success(filepath) {
        log.info(chalk.white.bgGreen.bold(`Done! File created at ${filepath}`));
    }

    /**
     *
     * @returns {Promise<void>}
     */
    async runSilverFisk(data) {
        //ask questions
        const answers = this.sysQuestion();
        const { FILENAME, EXTENSION } = answers;

        if (answers) {
            //create the file
            const filePath = await this.createFile(FILENAME, EXTENSION);

            //show success message
            await this.success(filePath);
        }
    }
}

module.exports = new SilverFisk();
