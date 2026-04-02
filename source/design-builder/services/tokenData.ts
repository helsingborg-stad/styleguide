import type { TokenData } from '../types/runtime';

export function isTokenData(value: unknown): value is TokenData {
if (!value || typeof value !== 'object' || Array.isArray(value)) {
return false;
}

const maybeData = value as { categories?: unknown };
return Array.isArray(maybeData.categories);
}

export async function loadTokenLibrary(): Promise<TokenData | null> {
const embeddedLibrary = window.styleguideDesignTokenLibrary;
if (isTokenData(embeddedLibrary)) {
return embeddedLibrary;
}

return null;
}

export function resolveTokenData(rawValue: unknown): TokenData | null {
if (!rawValue) {
return null;
}

if (isTokenData(rawValue)) {
return rawValue;
}

if (typeof rawValue === 'string') {
try {
const parsed = JSON.parse(rawValue);
return isTokenData(parsed) ? parsed : null;
} catch {
return null;
}
}

return null;
}
