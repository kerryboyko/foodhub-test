import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/hello');
  await expect(
    page.getByRole('heading', { name: 'Hello, World!' }),
  ).toBeVisible();
  await expect(page.getByTestId('subject-input')).toBeVisible();
  await expect(page.getByTestId('display')).toBeVisible();
  await expect(page.getByTestId('display')).toContainText('Hello World!');
  await expect(page.getByTestId('subject-input')).toHaveValue('World');
  await page.getByTestId('subject-input').dblclick();
  await page.getByTestId('subject-input').fill('FoodHub');
  await expect(page.getByTestId('subject-input')).toHaveValue('FoodHub');
  await expect(page.getByTestId('display')).toContainText('Hello FoodHub!');
});
