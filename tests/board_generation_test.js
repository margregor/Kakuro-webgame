import { expect, test } from '@playwright/test';

//from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

test('verify generated board size', async ({ page }) => {
    await page.goto('/');

    for (let i = 0; i < 10; i++) {
        //losowo wybierz rozmiar nowej planszy
        const w = getRandomInt(3, 15);
        const h = getRandomInt(3, 15);
        //wprowadź wybrany rozmiar przez suwaki
        await page.getByLabel('Szerokość planszy do wygenerowania').fill(String(w));
        await page.getByLabel('Wysokość planszy do wygenerowania').fill(String(h));
        //zweryfikuj tekst przycisku generującego
        await expect(page.getByText(`Wygeneruj nową planszę o rozmiarze ${w} na ${h}`)).toBeVisible();
        await expect(page.getByText(`Wygeneruj nową planszę o rozmiarze ${w} na ${h}`)).toBeEnabled();
        //użyj przycisku generującego
        await page.getByText(`Wygeneruj nową planszę o rozmiarze ${w} na ${h}`).click();
        //zweryfikuj rozmiar wygenerowanej planszy
        await expect(page.locator('css=[id^=cell]')).toHaveCount(w*h);
        await expect(page.locator('css=[id^=cell][id$=x0]')).toHaveCount(w);
        await expect(page.locator('css=[id^=cell0x]')).toHaveCount(h);
    }
});

test('verify generated board refinement', async ({ page }) => {
    await page.goto('/');

    for (let i = 0; i < 10; i++) {
        await page.getByText('Wygeneruj nową planszę o rozmiarze 3 na 3').click();
        await page.getByText('Ogranicz ilość rozwiązań planszy').click();
        await expect(page.getByText('Rozwiązanie poprawne! Brawo!!')).not.toBeAttached();
        //plasza z ograniczoną ilością rozwiązań powinna być rozwiązywalna metodami logicznymi
        await page.getByText('Rozwiąż metodami logicznymi').click();
        await expect(page.getByText('Rozwiązanie poprawne! Brawo!!')).toBeAttached();
    }
});
