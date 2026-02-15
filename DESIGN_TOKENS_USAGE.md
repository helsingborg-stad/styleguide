# Design Tokens UI System

This document explains how to use the `component-design-tokens.json` file to build a dynamic component customization UI.

## Overview

The design tokens JSON file provides a structured definition of all customizable CSS custom properties (design tokens) for each component. It includes:

- **Token definitions**: Each CSS variable with its type, control method, and constraints
- **Categories**: Logical grouping of tokens (typography, colors, borders, effects, layout)
- **Control types**: UI control specifications (sliders, color pickers, selects, etc.)

## File Structure

```json
{
  "components": {
    "c-button": {
      "name": "Button",
      "tokens": {
        "--c-button--base": {
          "label": "Base Unit",
          "type": "number",
          "control": "slider",
          "value": 8,
          "min": 4,
          "max": 16,
          "category": "layout"
        }
      }
    }
  }
}
```

## Implementation Guide

### 1. Loading the Configuration

```typescript
import designTokens from './component-design-tokens.json';
import type { DesignTokensConfig } from './component-design-tokens';

const config: DesignTokensConfig = designTokens;
```

### 2. Generating UI Controls

```typescript
function generateControls(componentName: string) {
  const component = config.components[componentName];

  Object.entries(component.tokens).forEach(([cssVar, token]) => {
    switch (token.control) {
      case 'slider':
        createSliderControl(cssVar, token);
        break;
      case 'color-picker':
        createColorPickerControl(cssVar, token);
        break;
      case 'select':
        createSelectControl(cssVar, token);
        break;
      // ... other control types
    }
  });
}
```

### 3. Applying Token Changes

When a user adjusts a control, update the CSS custom property:

```typescript
function updateToken(componentElement: HTMLElement, cssVar: string, value: string | number) {
  // Add unit if needed
  const token = findToken(cssVar);
  const finalValue = token.unit ? `${value}${token.unit}` : value;

  // Apply to component element
  componentElement.style.setProperty(cssVar, String(finalValue));
}
```

### 4. Example: Creating a Slider Control

```typescript
function createSliderControl(cssVar: string, token: NumberToken) {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = String(token.min);
  slider.max = String(token.max);
  slider.step = String(token.step);
  slider.value = String(token.value);

  const label = document.createElement('label');
  label.textContent = token.label;

  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = `${token.value}${token.unit || ''}`;

  slider.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value;
    valueDisplay.textContent = `${value}${token.unit || ''}`;
    updateToken(componentElement, cssVar, value);
  });

  return { label, slider, valueDisplay };
}
```

### 5. Example: Creating a Color Picker

```typescript
function createColorPickerControl(cssVar: string, token: ColorToken) {
  const input = document.createElement('input');
  input.type = 'color';
  input.value = token.value;

  const label = document.createElement('label');
  label.textContent = token.label;

  input.addEventListener('change', (e) => {
    const value = (e.target as HTMLInputElement).value;
    updateToken(componentElement, cssVar, value);
  });

  return { label, input };
}
```

### 6. Organizing by Categories

```typescript
function renderByCategories(componentName: string) {
  const component = config.components[componentName];

  component.categories.forEach(category => {
    const categorySection = document.createElement('section');
    categorySection.className = 'token-category';

    const heading = document.createElement('h3');
    heading.textContent = category.label;
    categorySection.appendChild(heading);

    // Filter tokens by category
    const categoryTokens = Object.entries(component.tokens)
      .filter(([_, token]) => token.category === category.id);

    categoryTokens.forEach(([cssVar, token]) => {
      const control = generateControl(cssVar, token);
      categorySection.appendChild(control);
    });

    container.appendChild(categorySection);
  });
}
```

## Usage in a Component Playground

```typescript
class ComponentPlayground {
  private config: DesignTokensConfig;
  private componentElement: HTMLElement;

  constructor(componentName: string) {
    this.config = designTokens;
    this.componentElement = document.querySelector(`.${componentName}`)!;
    this.renderControls(componentName);
  }

  renderControls(componentName: string) {
    const component = this.config.components[componentName];
    const controlsContainer = document.getElementById('controls');

    // Render by category
    component.categories.forEach(category => {
      const section = this.createCategorySection(category, component.tokens);
      controlsContainer.appendChild(section);
    });
  }

  updateComponentToken(cssVar: string, value: any) {
    const token = this.findToken(cssVar);
    const finalValue = this.formatValue(value, token);
    this.componentElement.style.setProperty(cssVar, finalValue);
  }

  formatValue(value: any, token: Token): string {
    if ('unit' in token && token.unit) {
      return `${value}${token.unit}`;
    }
    return String(value);
  }
}

// Initialize playground
const playground = new ComponentPlayground('c-button');
```

## React Example

```tsx
import React, { useState } from 'react';
import designTokens from './component-design-tokens.json';

function TokenControl({ cssVar, token, onChange }) {
  switch (token.control) {
    case 'slider':
      return (
        <div className="control">
          <label>{token.label}</label>
          <input
            type="range"
            min={token.min}
            max={token.max}
            step={token.step}
            defaultValue={token.value}
            onChange={(e) => onChange(cssVar, e.target.value)}
          />
          <span>{token.description}</span>
        </div>
      );

    case 'color-picker':
      return (
        <div className="control">
          <label>{token.label}</label>
          <input
            type="color"
            defaultValue={token.value}
            onChange={(e) => onChange(cssVar, e.target.value)}
          />
        </div>
      );

    case 'select':
      return (
        <div className="control">
          <label>{token.label}</label>
          <select
            defaultValue={token.value}
            onChange={(e) => onChange(cssVar, e.target.value)}
          >
            {token.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
  }
}

export function ComponentPlayground({ componentName }) {
  const [tokenValues, setTokenValues] = useState({});
  const component = designTokens.components[componentName];

  const handleTokenChange = (cssVar: string, value: any) => {
    setTokenValues(prev => ({ ...prev, [cssVar]: value }));
  };

  // Convert token values to CSS custom properties
  const cssVars = Object.entries(tokenValues).reduce((acc, [key, value]) => {
    const token = component.tokens[key];
    const finalValue = token.unit ? `${value}${token.unit}` : value;
    acc[key] = finalValue;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="playground">
      <div className="preview" style={cssVars}>
        <button className="c-button c-button--md c-button__filled c-button__filled--primary">
          <span className="c-button__label">
            <span className="c-button__label-text">Preview Button</span>
          </span>
        </button>
      </div>

      <div className="controls">
        {component.categories.map(category => (
          <section key={category.id} className="category">
            <h3>{category.label}</h3>
            {Object.entries(component.tokens)
              .filter(([_, token]) => token.category === category.id)
              .map(([cssVar, token]) => (
                <TokenControl
                  key={cssVar}
                  cssVar={cssVar}
                  token={token}
                  onChange={handleTokenChange}
                />
              ))}
          </section>
        ))}
      </div>
    </div>
  );
}
```

## Benefits

1. **Single Source of Truth**: All token definitions in one place
2. **Type Safety**: TypeScript definitions ensure correct usage
3. **Auto-generated UI**: Controls are generated based on token metadata
4. **Category Organization**: Tokens grouped logically for better UX
5. **Extensible**: Easy to add new components and token types
6. **Live Preview**: Changes reflected immediately in component preview

## Adding New Components

To add a new component:

1. Create the valuemap in your SCSS file
2. Add component definition to JSON:

```json
{
  "components": {
    "c-newcomponent": {
      "name": "New Component",
      "description": "Component description",
      "tokens": {
        "--c-newcomponent--property": {
          "label": "Property Label",
          "type": "number",
          "control": "slider",
          "value": 1,
          "min": 0,
          "max": 10,
          "category": "layout"
        }
      },
      "categories": [...]
    }
  }
}
```

## Automation Opportunity

Consider creating a script that:
1. Scans `source/sass/component/*.scss` files
2. Extracts valuemap sections automatically
3. Generates/updates the JSON file
4. Infers types from variable names (color, size, etc.)

This would keep the JSON file in sync with your SCSS components automatically.
