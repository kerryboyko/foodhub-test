import { expect, test } from '@playwright/test';

test('prevents adding unavailable items to the cart', async ({ page }) => {
  await page.goto('/menu');

  await expect(page.getByTestId('cart-control-add-item_4003')).toBeDisabled();
});

test('updates totals when an item is removed from the cart', async ({
  page
}) => {
  await page.goto('/menu');

  await page.getByTestId('cart-control-add-item_1001').click();
  await page.getByTestId('cart-control-add-item_2002').click();

  await expect(page.locator('body')).toContainText('Subtotal: €19.45');

  await page.getByTestId('cart-control-remove-item_2002').click();

  await expect(page.locator('body')).toContainText('Subtotal: €5.95');
});

test('does not require address fields for collection orders', async ({
  page
}) => {
  await page.goto('/menu');

  await page.getByTestId('cart-control-add-item_1001').click();
  await page.getByRole('link', { name: 'Go To Checkout' }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByTestId('fulfilment-fields-radio-collection').click();

  await expect(
    page.getByRole('textbox', { name: 'Address Line 1' })
  ).not.toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'Postcode/Zipcode' })
  ).not.toBeVisible();
});

test('allows the user to navigate back from checkout to the cart', async ({
  page
}) => {
  await page.goto('/menu');

  await page.getByTestId('cart-control-add-item_1001').click();
  await page.getByRole('link', { name: 'Go To Checkout' }).click();

  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByRole('link', { name: 'Change Your Order' }).click();

  await expect(page).toHaveURL(/\/menu$/);
  await expect(
    page.getByRole('heading', { name: 'Vegetable Spring Rolls' })
  ).toBeVisible();
});
