import { test, expect } from '@playwright/test';

test('user can place a collection order without an address', async ({
  page
}) => {
  await page.goto('/menu');

  await page.getByTestId('cart-control-add-item_1001').click();

  await page.getByRole('link', { name: 'Go To Checkout' }).click();

  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByRole('textbox', { name: 'Name' }).fill('Collection User');

  await page.getByRole('textbox', { name: 'Phone' }).fill('999 999 9999');

  await page
    .getByRole('textbox', { name: 'Email' })
    .fill('collection@test.com');

  await page
    .locator('label')
    .filter({ hasText: 'I will collect the order myself' })
    .click();

  await expect(
    page.getByTestId('fulfillment-fields-addressLine1-input')
  ).not.toBeVisible();

  await page
    .getByRole('textbox', { name: 'Credit Card' })
    .fill('4242424242424242');

  await page.getByRole('textbox', { name: 'Expiration Date' }).fill('01/99');

  await page.getByRole('textbox', { name: 'CVC Code' }).fill('111');

  await page.getByTestId('checkout-page-submit-button').click();

  await expect(page).toHaveURL(/\/order-confirmation\/[0-9a-fA-F-]+$/);

  await expect(
    page.getByRole('heading', { name: 'Order Confirmed' })
  ).toBeVisible();
});
