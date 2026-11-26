import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for end-to-end tests.
 *
 * The styleguide PHP server must be running before the tests execute.
 * Start it with: php -S 127.0.0.1:8000 -t . router.php
 *
 * Tests are co-located with each component under:
 * source/components/{slug}/tests/*.spec.ts
 */
export default defineConfig({
	testMatch: 'source/**/tests/*.spec.ts',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	// Hosted runners have 4 vCPUs; Playwright's default (half the cores) only uses 2.
	workers: process.env.CI ? '100%' : undefined,
	reporter: 'list',
	use: {
		baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:8000',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'php -S 127.0.0.1:8000 -t . router.php',
		// The built-in server is single-process by default, so parallel workers would queue
		// behind each other on every page load and its ~50 CSS/JS requests.
		env: { PHP_CLI_SERVER_WORKERS: '8' },
		url: 'http://127.0.0.1:8000',
		reuseExistingServer: !process.env.CI,
		stdout: 'ignore',
		stderr: 'ignore',
	},
});
