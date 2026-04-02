import { ComponentStorageAdapter } from './ComponentStorageAdapter';
import { COMPONENT_STORAGE_KEY, GENERAL_SCOPE_KEY } from '../state/runtimeConstants';

describe('ComponentStorageAdapter compatibility', () => {
beforeEach(() => {
localStorage.clear();
});

it('migrates legacy unscoped overrides into general scope', () => {
const legacyOverrides = {
button: {
'--c-button--color-bg': '#fff',
},
};

localStorage.setItem(COMPONENT_STORAGE_KEY, JSON.stringify(legacyOverrides));
const adapter = new ComponentStorageAdapter();

expect(adapter.load()).toEqual({
[GENERAL_SCOPE_KEY]: legacyOverrides,
});
});

it('normalizes legacy global scope key to general scope when loading scoped data', () => {
const scopedOverrides = {
__global__: {
button: {
'--c-button--color-bg': '#111',
},
},
scope: {
button: {
'--c-button--color-bg': '#222',
},
},
};

localStorage.setItem(COMPONENT_STORAGE_KEY, JSON.stringify(scopedOverrides));
const adapter = new ComponentStorageAdapter();

expect(adapter.load()).toEqual({
[GENERAL_SCOPE_KEY]: {
button: {
'--c-button--color-bg': '#111',
},
},
scope: {
button: {
'--c-button--color-bg': '#222',
},
},
});
});
});
