// @ts-expect-error Vite resolves ?inline CSS imports, but standalone tsc does not.
import designBuilderStyles from '../../design-builder.css?inline';

export { designBuilderStyles };
