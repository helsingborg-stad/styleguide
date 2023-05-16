import { ComponentRenderer } from "./ComponentRenderer"
import fs from 'node:fs'

jest.mock('node:fs', () => {
    return {
        existsSync: jest.fn().mockReturnValue(true)
    }
})

describe('ComponentRenderer', () => {

    describe('buildCommand', () => {

        it('builds command from parameters', () => {
            const componentRenderer = new ComponentRenderer('/foo.php', "class", 'view', {})
            const command = componentRenderer.buildCommand()

            expect(command).toEqual(`php /foo.php "class" "view" '{}'`)
        })
    })

    describe('getComponentHTMLElement', () => {
        
        it( 'returns an HTMLElement', () => {
            const componentRenderer = new ComponentRenderer('/foo.php', "class", 'view', {})
            const componentHTML = '<div>Test</div>'
            const component = componentRenderer.getComponentHTMLElement(componentHTML)

            expect(component).toBeInstanceOf(HTMLElement)
        })
    })

    describe('getPHPScriptPath', () => {
            
            it( 'returns the path on success', () => {
                jest.spyOn(fs, 'existsSync').mockReturnValue(true)
                const componentRenderer = new ComponentRenderer('/foo.php', "class", 'view', {})
                const scriptPath = componentRenderer.getScriptPath()
    
                expect(typeof scriptPath).toEqual('string')
            })
            
            it( 'throws if script file not found', () => {
                jest.spyOn(fs, 'existsSync').mockReturnValue(false)
                const componentRenderer = new ComponentRenderer('/foo.php', "class", 'view', {})
                expect(() => componentRenderer.getScriptPath()).toThrow()
            })
    })

})