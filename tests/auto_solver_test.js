import { expect, test } from '@playwright/test';

test('verify pure logic solver', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Rozwiąż metodami logicznymi')).toBeVisible();
    await expect(page.getByText('Rozwiąż metodami logicznymi')).toBeEnabled();
    await expect(page.getByText('Rozwiązanie poprawne! Brawo!!')).not.toBeAttached();
    await page.getByText('Rozwiąż metodami logicznymi').click();
    await expect(page.getByText('Rozwiązanie poprawne! Brawo!!')).toBeAttached();

    await page.getByLabel('Szerokość planszy do wygenerowania').fill(String(10));
    await page.getByLabel('Wysokość planszy do wygenerowania').fill(String(10));
    await page.getByText('Wygeneruj nową planszę o rozmiarze 10 na 10').click();

    await page.getByText('Rozwiąż metodami logicznymi').click();
    await expect(page.getByText('Rozwiązanie poprawne! Brawo!!')).not.toBeAttached();
    await expect(page.locator('css=[id^=cell]>label>svg>text').first()).toBeAttached();
});

test('verify stack based solver', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Szerokość planszy do wygenerowania').fill(String(10));
    await page.getByLabel('Wysokość planszy do wygenerowania').fill(String(10));

    for (let i = 0; i < 10; i++) {
        await page.getByText('Wygeneruj nową planszę o rozmiarze 10 na 10').click();
        await expect(page.getByText('Rozwiązanie poprawne! Brawo!!')).not.toBeAttached();
        await page.getByText('Rozwiąż planszę').click();
        await expect(page.getByText('Rozwiązanie poprawne! Brawo!!')).toBeAttached();
    }
});