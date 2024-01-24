import { expect, test } from '@playwright/test';

test('verify that only single digits can be entered', async ({ page }) => {
	await page.goto('/');
	const field = page.locator('#input1x1');

	await field.focus();
	await expect(field).toHaveValue('');

	await page.keyboard.press('1');
	await expect(field).toHaveValue('1');

	await page.keyboard.press('2');
	await expect(field).toHaveValue('2');

	await page.keyboard.press('a');
	await expect(field).toHaveValue('2');

	await page.keyboard.press('Backspace');
	await expect(field).toHaveValue('');

	await page.keyboard.press('6');
	await expect(field).toHaveValue('6');

	await page.keyboard.press('0');
	await expect(field).toHaveValue('6');
});

test('verify helper digit entry', async ({ page }) => {
	await page.goto('/');
	const field = page.locator('#input1x1');

	await page.getByText('Wpisuj cyfry pomocnicze').click();

	await page.locator('#input1x1').focus()

	await page.keyboard.press('1');
	await page.keyboard.press('3');
	await expect(page.locator('css=#cell1x1>label>svg>text')).toHaveCount(2);
	await expect(page.locator('css=#cell1x1>label>svg>text:nth-child(1)')).toHaveText('1');
	await expect(page.locator('css=#cell1x1>label>svg>text:nth-child(2)')).toHaveText('3');
	await page.keyboard.press('1');
	await expect(page.locator('css=#cell1x1>label>svg>text')).toHaveCount(1);
	await expect(page.locator('css=#cell1x1>label>svg>text')).toHaveText('3');
	await page.keyboard.down('Alt');
	await expect(page.getByText('Wpisuj cyfry pomocnicze')).toBeChecked();
	await page.keyboard.press('9');
	await expect(page.locator('css=#cell1x1>label>svg>text')).toHaveCount(2);
	await expect(page.locator('css=#cell1x1>label>svg>text:nth-child(2)')).toHaveText('9');
	await page.keyboard.up('Alt');
	await expect(page.getByText('Wpisuj cyfry pomocnicze')).not.toBeChecked();

	await page.keyboard.press('4');
	await expect(page.locator('css=#cell1x1>label>svg>text')).toHaveCount(0);
	await page.keyboard.press('Backspace');

	await expect(page.locator('css=#cell1x1>label>svg>text')).toHaveCount(2);
	await expect(page.locator('css=#cell1x1>label>svg>text:nth-child(1)')).toHaveText('3');
	await expect(page.locator('css=#cell1x1>label>svg>text:nth-child(2)')).toHaveText('9');

	await page.keyboard.press('Backspace');
	await expect(page.locator('css=#cell1x1>label>svg>text')).toHaveCount(0);
});

test('verify keyboard navigation', async ({ page }) => {
	await page.goto('/');
	const field = page.locator('#input1x1');

	await page.locator('#input1x1').focus();
	await expect(page.locator('#input1x1')).toBeFocused();

	await page.keyboard.press('ArrowRight');
	await expect(page.locator('#input2x1')).toBeFocused();

	await page.keyboard.press('ArrowDown');
	await expect(page.locator('#input2x2')).toBeFocused();

	await page.keyboard.press('ArrowLeft');
	await expect(page.locator('#input1x2')).toBeFocused();

	await page.keyboard.press('ArrowUp');
	await expect(page.locator('#input1x1')).toBeFocused();

	await page.getByLabel('Edytuj planszę').click();

	await page.locator('#hclue0x0').focus();
	await expect(page.locator('#hclue0x0')).toBeFocused();

	await page.keyboard.press('ArrowUp');
	await expect(page.locator('#hclue0x0')).toBeFocused();

	await page.keyboard.press('ArrowLeft');
	await expect(page.locator('#vclue0x0')).toBeFocused();

	await page.keyboard.press('ArrowRight');
	await expect(page.locator('#hclue0x0')).toBeFocused();

	await page.keyboard.press('ArrowDown');
	await expect(page.locator('#vclue0x0')).toBeFocused();

	await page.keyboard.press('ArrowUp');
	await expect(page.locator('#hclue0x0')).toBeFocused();

	await page.keyboard.press('ArrowRight');
	await expect(page.locator('#vclue1x0')).toBeFocused();

	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('ArrowLeft');
	await expect(page.locator('#hclue0x1')).toBeFocused();

	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('ArrowRight');
	await expect(page.locator('#vclue3x1')).toBeFocused();

	await page.keyboard.press('ArrowLeft');
	await page.keyboard.press('ArrowLeft');
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('ArrowDown');
	await expect(page.locator('#hclue1x4')).toBeFocused();
});

test('verify solution checking', async ({ page }) => {
	await page.goto('/');
	await page.locator('#input1x1').focus();
	await page.keyboard.press('3');
	await expect(page.locator('css=[id=cell0x1]>svg>polygon[fill=green]')).not.toBeAttached();
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('4');
	await expect(page.locator('css=[id=cell0x1]>svg>polygon[fill=green]')).toBeAttached();
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('2');
	await page.keyboard.press('ArrowLeft');
	await page.keyboard.press('1');
	await page.keyboard.press('ArrowDown');
	await expect(page.locator('css=[id=cell1x0]>svg>polygon[fill=green]')).not.toBeAttached();
	await page.keyboard.press('2');
	await expect(page.locator('css=[id=cell1x0]>svg>polygon[fill=green]')).toBeAttached();
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('3');
	await page.keyboard.press('ArrowDown');
	await page.keyboard.press('1');
	await page.keyboard.press('ArrowRight');
	await page.keyboard.press('6');
	await page.keyboard.press('ArrowUp');
	await page.keyboard.press('9');
	await page.keyboard.press('ArrowUp');
	await expect(page.getByText('Rozwiązanie poprawne! Brawo!!')).not.toBeAttached();
	await page.keyboard.press('5');
	await expect(page.getByText('Rozwiązanie poprawne! Brawo!!')).not.toBeAttached();
	await page.keyboard.press('8');
	await expect(page.locator('css=[id^=cell]>svg>polygon[fill=green]')).toHaveCount(7);
	await expect(page.getByText('Rozwiązanie poprawne! Brawo!!')).toBeVisible();
});
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
test('verify board clearing', async ({ page }) => {
	await page.goto('/');
	for (const field of await page.locator('css=[id^=input]').all()) {
		await field.focus();
		await page.keyboard.press(String(getRandomInt(1,9)));
	}
	await expect(page.getByText('Wyczyść planszę')).toBeVisible();
	await expect(page.getByText('Wyczyść planszę')).toBeEnabled();
	await page.getByText('Wyczyść planszę').click();

	for (const field of await page.locator('css=[id^=input]').all()) {
		await expect(field).toHaveValue("");
	}
});