#!/usr/bin/env node
const chalk = require('chalk');
const figlet = require('figlet');

class ConsoleHeader {
    constructor() {
        this.buildLogo(this.headerObject());
    }

    /**
     * Logo data object
     * @returns {{designObj: ({color: string, name: string, ascii: string}|{color: string, name: string, ascii: string}|{color: string, name: string, ascii: string}|{color: string, name: string, ascii: string}|{color: string, name: string, ascii: string})[], textElements: [{color: string, name: string, ascii: string, font: string}, {color: string, name: string, ascii: string, font: string}]}}
     */
    headerObject() {
        return {
            designObj: [
                {
                    name: 'designElementHeadLine',
                    ascii:
                        '_____________________________________________________________________________',
                    color: '#ff3469',
                },

                {
                    name: 'designElementHeadFill',
                    ascii:
                        '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
                    color: '#ec045b',
                },

                {
                    name: 'designElementHeadBottomLine',
                    ascii:
                        '¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯\n',
                    color: '#c90047',
                },
                {
                    name: 'designElementFirstFootLine',
                    ascii:
                        '\n_____________________________________________________________________________',
                    color: '#c90047',
                },
                {
                    name: 'designElementSecondFootLine',
                    ascii:
                        '≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡',
                    color: '#e3085a',
                },

                {
                    name: 'designElementFootFill',
                    ascii:
                        '▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒',
                    color: '#c8004b',
                },
                {
                    name: 'designElementFootBottomLine',
                    ascii:
                        '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n',
                    color: '#940138',
                },
            ],
            textElements: [
                {
                    name: 'logoText',
                    ascii: '  LazyNpm',
                    font: 'ANSI Regular',
                    color: '#ff9908',
                },
                {
                    name: 'logoBylineText',
                    ascii: '                    NPM run CLI tool for lazy paople',
                    font: 'term',
                    color: '#ffe673',
                },
            ],
        };
    }

    /**
     *
     * @param headerData
     * @returns {[]}
     */
    buildLogo(headerData) {
        let headerObj = [];
        for (let [index, elementData] of headerData.designObj.entries()) {
            if (index === 3) {
                headerData.textElements.forEach(function(textData, index) {
                    console.log(
                        chalk.hex(textData.color)(
                            figlet.textSync(textData.ascii, {
                                font: textData.font,
                                horizontalLayout: 'default',
                                verticalLayout: 'default',
                            })
                        )
                    );
                });
            }
            console.log(chalk.hex(elementData.color)(elementData.ascii));
        }
    }
}

module.exports = new ConsoleHeader();
