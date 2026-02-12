/**
 * Type definitions for component design tokens configuration
 * Auto-generated from component-design-tokens.json
 */

export type ControlType = 'slider' | 'number' | 'color-picker' | 'select' | 'text';

export type TokenType = 'number' | 'string' | 'color' | 'shadow';

export type CategoryId = 'typography' | 'colors' | 'borders' | 'effects' | 'layout';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
}

export interface BaseToken {
  label: string;
  description: string;
  type: TokenType;
  control: ControlType;
  category: CategoryId;
}

export interface NumberToken extends BaseToken {
  type: 'number';
  control: 'slider' | 'number';
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export interface ColorToken extends BaseToken {
  type: 'color';
  control: 'color-picker';
  value: string; // hex color
}

export interface SelectToken extends BaseToken {
  control: 'select';
  value: string | number;
  options: SelectOption[];
}

export interface TextToken extends BaseToken {
  type: 'string';
  control: 'text';
  value: string;
  placeholder?: string;
}

export type Token = NumberToken | ColorToken | SelectToken | TextToken;

export interface Component {
  name: string;
  description: string;
  tokens: Record<string, Token>;
  categories: Category[];
}

export interface ControlTypeDefinition {
  description: string;
  properties: string[];
}

export interface DesignTokensConfig {
  $schema: string;
  version: string;
  description: string;
  components: Record<string, Component>;
  controlTypes: Record<ControlType, ControlTypeDefinition>;
  metadata: {
    generatedFrom: string;
    usage: string;
    implementation: {
      example: string;
    };
  };
}

/**
 * Helper type to extract component names
 */
export type ComponentName = keyof DesignTokensConfig['components'];

/**
 * Helper type to get tokens for a specific component
 */
export type ComponentTokens<T extends ComponentName> = DesignTokensConfig['components'][T]['tokens'];
