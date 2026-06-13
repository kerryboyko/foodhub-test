import { test, expect } from '@playwright/test';

test('shows validation errors when submitting an incomplete order', async ({
  page
}) => {
  await page.goto('/menu');

  await page.getByTestId('cart-control-add-item_1001').click();

  await page.getByRole('link', { name: 'Go To Checkout' }).click();

  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByTestId('checkout-page-submit-button').click();

  await expect(page.getByTestId('customer-fields-name-error')).toBeVisible();

  await expect(page.getByTestId('customer-fields-phone-error')).toBeVisible();

  await expect(page.getByTestId('customer-fields-email-error')).toBeVisible();

  await expect(
    page.getByTestId('payment-fields-creditCard-error')
  ).toBeVisible();

  await expect(page).toHaveURL(/\/checkout$/);
});
