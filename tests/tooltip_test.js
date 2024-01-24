import { expect, test } from '@playwright/test';

test('verify tooltip appears when clue is in focus', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByText('1+2+3')).not.toBeAttached();

	await page.locator('#vclue1x0').focus();

	await expect(page.getByText('1+2+3')).toBeVisible();

	await page.locator('#input1x1').focus();

	await expect(page.getByText('1+2+3')).not.toBeAttached();
});

test('verify tooltips can be turned off', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Pokazuj dymki ze wskazówkami').click();

	await expect(page.getByText('1+2+3')).not.toBeAttached();

	await page.locator('#vclue1x0').focus();

	await expect(page.getByText('1+2+3')).not.toBeAttached();

	await page.locator('#input1x1').focus();

	await expect(page.getByText('1+2+3')).not.toBeAttached();
});
