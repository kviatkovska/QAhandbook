import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://kviatkovska.github.io/QAhandbook/pages/sandbox.html');
  await page.getByTestId('level').selectOption('Middle');
  await page.getByTestId('experience').selectOption('1–2');
  await page.getByTestId('generate-question').click();
});