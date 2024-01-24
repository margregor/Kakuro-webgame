import { expect, test } from '@playwright/test';

test('verify page changes switching to editing mode', async ({ page }) => {
	await page.goto('/');

	await page.getByLabel('Edytuj planszę').click();

	await expect(page.getByText('Dodaj rząd')).toBeVisible();
	await expect(page.getByText('Dodaj rząd')).toBeEnabled();

	await expect(page.getByText('Usuń rząd')).toBeVisible();
	await expect(page.getByText('Usuń rząd')).toBeEnabled();

	await expect(page.getByText('Dodaj kolumnę')).toBeVisible();
	await expect(page.getByText('Dodaj kolumnę')).toBeEnabled();

	await expect(page.getByText('Usuń kolumnę')).toBeVisible();
	await expect(page.getByText('Usuń kolumnę')).toBeEnabled();

	await expect(page.locator('css=[id^=input]')).toHaveCount(10);
	await expect(page.locator('css=[id^=clue]')).toHaveCount(10);
	await expect(page.locator('css=[id^=vclue]')).toHaveCount(10);
	await expect(page.locator('css=[id^=hclue]')).toHaveCount(10);

	for (const verticalClue of await page.locator('css=[id^=vclue0x]').all()) {
		await expect(verticalClue).toHaveText('0');
	}
	for (const verticalClue of await page.locator('css=[id^=vclue][id$=x4]').all()) {
		await expect(verticalClue).toHaveText('0');
	}
	for (const verticalClue of await page.locator('css=[id^=hclue][id$=x0]').all()) {
		await expect(verticalClue).toHaveText('0');
	}
	for (const verticalClue of await page.locator('css=[id^=hclue3x]').all()) {
		await expect(verticalClue).toHaveText('0');
	}
});

test('test changing cell type', async ({ page }) => {
	await page.goto('/');

	await page.getByLabel('Edytuj planszę').click();

	await page.locator('#input1x1').focus();

	await page.keyboard.press('c');

	await expect(page.locator('#input1x1')).not.toBeAttached();
	await expect(page.locator('#vclue1x1')).toBeVisible();
	await expect(page.locator('#hclue1x1')).toBeVisible();
	await expect(page.locator('#clue1x1')).toBeVisible();

	await page.locator('#vclue1x1').focus();

	await page.keyboard.press('f');

	await expect(page.locator('#clue1x1')).not.toBeAttached();
	await expect(page.locator('#input1x1')).toBeVisible();
});

test('test changing clue value', async ({ page }) => {
	await page.goto('/');

	await page.getByLabel('Edytuj planszę').click();

	await expect(page.locator('#vclue1x0')).toHaveText('6');

	page.on('dialog', (dialog) => dialog.accept('10'));

	await page.locator('#vclue1x0').focus();
	await page.keyboard.press('e');

	await expect(page.locator('#vclue1x0')).toHaveText('10');
});

test('test adding and removing row', async ({ page }) => {
	await page.goto('/');

	await page.getByLabel('Edytuj planszę').click();

	await expect(page.locator('css=[id^=clue0x]')).toHaveCount(5);

	await page.getByText('Dodaj rząd').click();

	await expect(page.locator('css=[id^=clue0x]')).toHaveCount(6);

	await page.getByText('Usuń rząd').click();

	await expect(page.locator('css=[id^=clue0x]')).toHaveCount(5);

	await page.getByText('Usuń rząd').click();

	await expect(page.locator('css=[id^=clue0x]')).toHaveCount(4);

	await page.getByText('Usuń rząd').click();

	await expect(page.locator('css=[id^=clue0x]')).toHaveCount(3);

	await expect(page.getByText('Usuń rząd')).not.toBeEnabled();
});

test('test adding and removing column', async ({ page }) => {
	await page.goto('/');

	await page.getByLabel('Edytuj planszę').click();

	await expect(page.locator('css=[id^=clue][id$=x0]')).toHaveCount(4);

	await page.getByText('Dodaj kolumnę').click();

	await expect(page.locator('css=[id^=clue][id$=x0]')).toHaveCount(5);

	await page.getByText('Usuń kolumnę').click();

	await expect(page.locator('css=[id^=clue][id$=x0]')).toHaveCount(4);

	await page.getByText('Usuń kolumnę').click();

	await expect(page.locator('css=[id^=clue][id$=x0]')).toHaveCount(3);

	await expect(page.getByText('Usuń kolumnę')).not.toBeEnabled();
});
