import fs from 'node:fs';
import path from 'node:path';

const buttonDirectory = path.resolve(__dirname, '..');

function readButtonStyle(fileName: string): string {
	return fs.readFileSync(path.join(buttonDirectory, fileName), 'utf8');
}

describe('Button size contract', () => {
	const sharedStyles = readButtonStyle('style.scss');

	it('defines shared geometry for every size', () => {
		expect(sharedStyles).toContain('--#{$_}-height: #{tokens.getCalculatedValue($_, "base", 6)};');
		expect(sharedStyles).toContain('--#{$_}-min-width: #{tokens.getCalculatedValue($_, "base", 9)};');
		expect(sharedStyles).toContain('--#{$_}-padding-x: #{tokens.getCalculatedValue($_, "space", 3)};');
		expect(sharedStyles).toContain('&.#{$_}--sm {');
		expect(sharedStyles).toContain('&.#{$_}--lg {');
	});

	it.each(['__basic.scss', '__filled.scss', '__outlined.scss'])('keeps size modifiers out of %s', (fileName) => {
		const variantStyles = readButtonStyle(fileName);

		expect(variantStyles).not.toContain('&.#{$_}--sm {');
		expect(variantStyles).not.toContain('&.#{$_}--lg {');
	});
});
