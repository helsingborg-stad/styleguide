import {dirname} from 'node:path'
import util from 'node:util'
import fs from 'node:fs'
const exec = util.promisify(require('node:child_process').exec)

export interface IComponentData {}

interface IComponentRenderer {
    scriptPath: string
    componentClass: string
    view: string
    data: IComponentData
    render(): Promise<HTMLElement>
}

export class ComponentRenderer implements IComponentRenderer {
    
    scriptPath: string
    componentClass: string
    view: string
    data: IComponentData

    constructor(scriptPath:string, componentClass: string, view: string, data: IComponentData) {
        this.scriptPath = scriptPath
        this.componentClass = componentClass
        this.view = view
        this.data = data
    }

    async render(): Promise<HTMLElement> {
        const command = this.buildCommand()
        const { stdout } = await exec( command )
        return this.getComponentHTMLElement(stdout)
    }

    buildCommand():string {
        const scriptPath = this.getScriptPath()
        return `php ${scriptPath} "${this.componentClass}" "${this.view}" '${JSON.stringify(this.data)}'`;
    }

    getComponentHTMLElement(componentHTML:string):HTMLElement {
        const div = document.createElement('div');
        div.innerHTML = componentHTML;
        return div
    }

    getScriptPath():string {
        const scriptFileName = 'cli.php'
        const currentDir = __dirname
        const relativePath = '/../../../../'
        const rootDir = dirname(`${currentDir}${relativePath}`);
        const filePath =  `${rootDir}/${scriptFileName}`

        if (!fs.existsSync(this.scriptPath)) {
            throw new Error(`${scriptFileName} not found in ${rootDir}`)
        }       

        return this.scriptPath
    }
}

export async function renderComponent(componentClass:IComponentRenderer['componentClass'], view:IComponentRenderer['view'], data:IComponentRenderer['data']):Promise<HTMLElement> {
    const scriptFileName = 'cli.php'
    const currentDir = __dirname
    const relativePath = '/../../../../'
    const rootDir = dirname(`${currentDir}${relativePath}`);
    const scriptPath =  `${rootDir}/${scriptFileName}`

    return await new ComponentRenderer(scriptPath, componentClass, view, data).render()
}