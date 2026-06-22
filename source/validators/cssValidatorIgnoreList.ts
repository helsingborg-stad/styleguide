export interface CssValidatorIgnoreRule {
	bundle?: string;
	messageIncludes: string;
	contextIncludes?: string;
	type?: 'error' | 'warning';
}

export const cssValidatorIgnoreList: CssValidatorIgnoreRule[] = [
	{
		messageIncludes: '"corner-shape" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Unrecognized at-rule "@property"',
	},
	{
		messageIncludes: 'Unrecognized at-rule "@container"',
		type: 'error',
	},
	{
		messageIncludes: 'Property "container-name" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Invalid type:',
		type: 'error',
	},
	{
		messageIncludes: 'text-wrap',
		type: 'error',
	},
	{
		messageIncludes: 'Due to their dynamic nature, CSS variables are currently not statically checked',
		type: 'warning',
	},
	{
		messageIncludes: 'Property "pointer-events" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Property "container-type" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Property "interpolate-size" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Property "clip-path" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Property "fill" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Property "stroke" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Property "stroke-width" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Property "mask-image" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Property "mask-position" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Property "mask-repeat" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: 'Property "mask-size" doesn\'t exist',
		type: 'error',
	},
	{
		messageIncludes: '"::-webkit-calendar-picker-indicator" is a vendor extended pseudo-element',
		type: 'warning',
	},
	{
		messageIncludes: '"::-webkit-scrollbar" is a vendor extended pseudo-element',
		type: 'warning',
	},
	{
		messageIncludes: '"-webkit-appearance" is a vendor extension',
		type: 'warning',
	},
	{
		messageIncludes: '"-ms-flexbox" is a vendor extension',
		type: 'warning',
	},
	{
		messageIncludes: '"-ms-flex-align" is a vendor extension',
		type: 'warning',
	},
	{
		messageIncludes: '"-ms-flex-pack" is a vendor extension',
		type: 'warning',
	},
	{
		messageIncludes: '"-ms-high-contrast" is a vendor extension',
		type: 'warning',
	},
	{
		messageIncludes: 'The property "clip" is deprecated',
		type: 'warning',
	},
	{
		messageIncludes: '"var(--color--border-mix-amount)" is not a "*invalid*" value',
		type: 'error',
	},
	{
		messageIncludes: '"var(--color--alt-mix-amount)" is not a "*invalid*" value',
		type: 'error',
	},
	{
		messageIncludes: 'One operand must be a number',
		type: 'error',
	},
	{
		messageIncludes: '"allow-discrete" is not a "transition" value',
		contextIncludes: 'details.c-accordion__item::details-content',
		type: 'error',
	},
];
