import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	reporter: [['list'], ['html', { open: 'never' }]],
	webServer: {
		command: 'sh -c "HOSTNAME=127.0.0.1 PORT=3000 npm run dev"',
		url: 'http://localhost:3000',
		reuseExistingServer: true,
		timeout: 120000,
	},
	use: {
		baseURL: process.env.BASE_URL || 'http://localhost:3000',
		headless: true,
	},
});
