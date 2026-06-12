import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const springRolls = 'item_1001';

async function addItemAndGoToCheckout(page: Page) {
  await page.goto('/menu');
  await page.getByTestId(`cart-control-add-${springRolls}`).click();
  await page
    .getByTestId(`item-${springRolls}`)
    .getByRole('link', { name: 'Go To Cart' })
    .click();
  await page.getByRole('link', { name: 'Go to checkout' }).click();
}

test.describe('checkout guardrails', () => {
  test('does not allow checkout with an empty cart', async ({ page }) => {
    await page.goto('/cart');

    await page.getByRole('link', { name: 'Go to checkout' }).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await expect(
      page.getByTestId('checkout-page-submit-button')
    ).toBeDisabled();
    await expect(page.getByTestId('checkout-totals-total')).toContainText(
      'Total: €3.00'
    );
  });

  test('shows validation errors for required checkout fields', async ({
    page
  }) => {
    await addItemAndGoToCheckout(page);

    await page.getByTestId('checkout-page-submit-button').click();

    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Phone is required')).toBeVisible();
    await expect(page.getByText('Enter a valid email')).toBeVisible();
    await expect(
      page.getByText('Address is required for delivery')
    ).toBeVisible();
    await expect(
      page.getByText('Postcode is required for delivery')
    ).toBeVisible();
    await expect(page.getByText('Card number is required')).toBeVisible();
    await expect(page.getByText('Expiration date is required')).toBeVisible();
    await expect(page.getByText('CVC is required')).toBeVisible();
  });
});
