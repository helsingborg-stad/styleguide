/**
 * TypeScript Types and Interfaces for CSS Variables Feature
 *
 * This file defines all the types used throughout the CSS variable
 * management system.
 */

/**
 * Enum for CSS variable types
 * Determined by type inference from default values
 */
export enum CSSVariableType {
  Color = 'color',     // Hex colors, rgb(), rgba(), hsl(), hsla()
  Size = 'size',       // px, rem, em, %, vh, vw (font-size, border-width)
  Number = 'number',   // Pure numbers, calc() expressions
  Font = 'font',       // Quoted strings (font families)
  Shadow = 'shadow',   // drop-shadow() functions
  Radius = 'radius',   // Border radius values (should use sliders)
  Spacing = 'spacing', // Spacing values (should use sliders with 8px steps)
  Select = 'select',   // Predefined options (should use dropdown)
  Generic = 'generic', // Fallback for everything else
}

/**
 * Interface for a single CSS variable's metadata
 */
export interface CSSVariable {
  /** The CSS variable name (e.g., --color--primary) */
  name: string;

  /** The default value from _var_css.scss */
  defaultValue: string;

  /** Inferred type from the default value */
  type: CSSVariableType;

  /** Category from comment blocks (e.g., COLORS, SPACING) */
  category: string;

  /** Human-readable description/formatted name */
  description?: string;

  /** Available options for select-type variables */
  options?: string[];
}

/**
 * Interface for the extracted CSS variables JSON data
 */
export interface CSSVariablesData {
  /** Array of all CSS variables */
  variables: CSSVariable[];

  /** Array of unique categories */
  categories: string[];

  /** ISO timestamp of when the data was generated */
  generatedAt: string;
}

/**
 * Interface for user configuration (custom CSS variable values)
 * Key: CSS variable name (e.g., --color--primary)
 * Value: Custom value (e.g., #ff0000)
 */
export interface UserConfig {
  [variableName: string]: string;
}

/**
 * Enum for connector types
 */
export enum ConnectorType {
  LocalStorage = 'localStorage',
  File = 'file',
  Database = 'database',
}

/**
 * Interface for settings center options
 */
export interface SettingsCenterOptions {
  /** Whether to auto-initialize on DOM ready */
  autoInit?: boolean;

  /** Whether to show the floating toggle button */
  showToggleButton?: boolean;

  /** Position of the toggle button */
  toggleButtonPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

  /** Whether to enable localStorage persistence */
  enablePersistence?: boolean;

  /** Custom storage key for localStorage */
  storageKey?: string;
}

/**
 * Interface for control options
 */
export interface ControlOptions {
  /** Whether to show the reset button */
  showReset?: boolean;

  /** Whether to enable real-time updates */
  realTimeUpdate?: boolean;

  /** Callback when value changes */
  onChange?: (variable: CSSVariable, newValue: string) => void;
}
