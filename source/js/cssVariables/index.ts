/**
 * CSS Variables Feature Entry Point
 *
 * Auto-initializes the CSS Variable Manager and Settings Center on DOM ready.
 * Also exports classes for external use (third-party apps).
 */

import { CSSVariableManager } from './CSSVariableManager';
import { LocalStorageConnector } from './connectors/LocalStorageConnector';
import { FileConnector } from './connectors/FileConnector';
import { DatabaseConnector } from './connectors/DatabaseConnector';
import { SettingsCenter } from './SettingsCenter';
import { ControlFactory } from './controls/ControlFactory';

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Create connector (localStorage by default)
    const connector = new LocalStorageConnector();

    // Create and initialize manager
    const manager = new CSSVariableManager(connector);
    await manager.initialize();

    // Create control factory
    const controlFactory = new ControlFactory(manager);

    // Create and initialize settings center
    const settingsCenter = new SettingsCenter(manager);
    settingsCenter.setControlFactory(controlFactory);
    settingsCenter.initialize();

    // Make available globally for debugging
    if (typeof window !== 'undefined') {
      (window as any).cssVariableManager = manager;
      (window as any).settingsCenter = settingsCenter;
    }

    console.log('✅ CSS Variables feature initialized');
  } catch (error) {
    console.error('❌ Failed to initialize CSS Variables feature:', error);
  }
});

// Export for external use
export {
  CSSVariableManager,
  LocalStorageConnector,
  FileConnector,
  DatabaseConnector,
  SettingsCenter,
  ControlFactory,
};

// Export types
export type {
  CSSVariable,
  CSSVariablesData,
  UserConfig,
  SettingsCenterOptions,
  ControlOptions,
} from './types';

export { CSSVariableType, ConnectorType } from './types';
