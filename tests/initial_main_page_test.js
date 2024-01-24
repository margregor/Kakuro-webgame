import { expect, test } from '@playwright/test';

test('verify initial state of elements on main page', async ({ page }) => {
	await page.goto('/');
	let fieldLocator = page.locator('css=[id^=input]');
	let clueLocator = page.locator('css=[id^=clue]');
	let verticalClueLocator = page.locator('css=[id^=vclue]');
	let horizontalClueLocator = page.locator('css=[id^=hclue]');
	await expect(fieldLocator).toHaveCount(10);
	for (const field of await fieldLocator.all()) {
		await expect(field).toBeVisible();
		await expect(field).toBeEditable();
	}

	await expect(clueLocator).toHaveCount(10);
	for (const clue of await clueLocator.all()) {
		await expect(clue).toBeVisible();
	}

	await expect(verticalClueLocator).toHaveCount(3);
	for (const vclue of await verticalClueLocator.all()) {
		await expect(vclue).toBeVisible();
	}

	await expect(horizontalClueLocator).toHaveCount(4);
	for (const hclue of await horizontalClueLocator.all()) {
		await expect(hclue).toBeVisible();
	}

	await expect(page.getByLabel('Pokazuj dymki ze wskazówkami')).toBeVisible();
	await expect(page.getByLabel('Pokazuj dymki ze wskazówkami')).toBeEnabled();
	await expect(page.getByLabel('Pokazuj dymki ze wskazówkami')).toBeChecked();

	await expect(page.getByLabel('Wpisuj cyfry pomocnicze')).toBeVisible();
	await expect(page.getByLabel('Wpisuj cyfry pomocnicze')).toBeEnabled();
	await expect(page.getByLabel('Wpisuj cyfry pomocnicze')).not.toBeChecked();

	await expect(page.getByLabel('Wizualizuj procesy')).toBeVisible();
	await expect(page.getByLabel('Wizualizuj procesy')).toBeEnabled();
	await expect(page.getByLabel('Wizualizuj procesy')).not.toBeChecked();

	await expect(page.getByLabel('Edytuj planszę')).toBeVisible();
	await expect(page.getByLabel('Edytuj planszę')).toBeEnabled();
	await expect(page.getByLabel('Edytuj planszę')).not.toBeChecked();

	await expect(page.getByLabel('Szerokość planszy do wygenerowania')).toBeVisible();
	await expect(page.getByLabel('Szerokość planszy do wygenerowania')).toBeEnabled();
	await expect(page.getByLabel('Szerokość planszy do wygenerowania')).toHaveValue('3');

	await expect(page.getByLabel('Wysokość planszy do wygenerowania')).toBeVisible();
	await expect(page.getByLabel('Wysokość planszy do wygenerowania')).toBeVisible();
	await expect(page.getByLabel('Wysokość planszy do wygenerowania')).toHaveValue('3');

	await expect(page.getByText('Wygeneruj nową planszę o rozmiarze 3 na 3')).toBeVisible();
	await expect(page.getByText('Wygeneruj nową planszę o rozmiarze 3 na 3')).toBeEnabled();

	await expect(page.getByText('Rozwiąż planszę')).toBeVisible();
	await expect(page.getByText('Rozwiąż planszę')).toBeEnabled();

	await expect(page.getByText('Rozwiąż metodami logicznymi')).toBeVisible();
	await expect(page.getByText('Rozwiąż metodami logicznymi')).toBeEnabled();

	await expect(page.getByText('Wyczyść planszę')).toBeVisible();
	await expect(page.getByText('Wyczyść planszę')).toBeEnabled();

	await expect(page.getByText('Ogranicz ilość rozwiązań planszy')).toBeVisible();
	await expect(page.getByText('Ogranicz ilość rozwiązań planszy')).toBeEnabled();
});
