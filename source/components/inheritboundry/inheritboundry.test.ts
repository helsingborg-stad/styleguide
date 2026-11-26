import fs from 'node:fs';
import path from 'node:path';

function scssFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const name = path.join(dir, entry.name);
        return entry.isDirectory() ? scssFiles(name) : name.endsWith('.scss') ? [name] : [];
    });
}

test('the boundary resets every styleguide inheritance hook', () => {
    const hooks = new Set<string>();
    for (const file of scssFiles(path.join(process.cwd(), 'source'))) {
        const contents = fs.readFileSync(file, 'utf8');
        for (const match of contents.matchAll(/--inherit-([\w-]+)/g)) hooks.add(match[1]);
        for (const match of contents.matchAll(/inherit\.(?:property|publish|consume)\(\s*(?:\$_\s*,\s*)?["']([\w-]+)["']/g)) hooks.add(match[1]);
    }
    const reset = fs.readFileSync(path.join(__dirname, 'style.scss'), 'utf8');
    for (const hook of hooks) expect(reset).toContain(`--inherit-${hook}: initial;`);
});
