/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	use: {
		baseURL: 'http://localhost:4173',
		testIdAttribute: 'id'
	},
	testDir: 'tests',
	reporter: [
		[process.env.CI ? 'github' : 'list'],
		['html', { open: 'never' }]
	],
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};

export default config;
