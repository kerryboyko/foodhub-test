import { test, expect } from '@playwright/test';

test('Should not checkout if there is nothing in the cart', async ({
  page
}) => {
  // we're going to checkout but there's nothing in the cart.
  await page.goto('http://localhost:3000/cart');
  await page.getByRole('link', { name: 'Go to checkout' }).click();
  await page.getByRole('textbox', { name: 'Name' }).dblclick();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('asdf');
  await page.getByTestId('checkout-totals-total').click();
  await page.getByRole('textbox', { name: 'Phone' }).click();
  await page.getByRole('textbox', { name: 'Phone' }).fill('qwer');
  await page.getByRole('textbox', { name: 'Phone' }).click();
  await page.getByRole('textbox', { name: 'Phone' }).fill('5555555555');
  await page.getByRole('textbox', { name: 'Phone' }).press('Tab');
  await page.getByRole('textbox', { name: 'Email' }).fill('asdf@asdaf.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('radio', { name: 'Delivery' }).press('Tab');
  await page.getByText('Collection').click();
  await page.getByRole('textbox', { name: 'Notes optional' }).click();
  await page
    .getByRole('textbox', { name: 'Notes optional' })
    .fill('This Should not work');
  await page.getByRole('textbox', { name: 'Notes optional' }).press('Tab');
  await page
    .getByRole('textbox', { name: 'Credit Card' })
    .fill('4242424242424242');
  await page.getByRole('textbox', { name: 'Expiration Date' }).click();
  await page.getByRole('textbox', { name: 'Expiration Date' }).click();
  await page.getByRole('textbox', { name: 'Expiration Date' }).fill('09/99');
  await page.getByRole('textbox', { name: 'Expiration Date' }).press('Tab');
  await page.getByRole('textbox', { name: 'CVC Code' }).fill('999');
  await expect(page.getByTestId('checkout-page-submit-button')).toBeDisabled();
});

test('should show validation errors if tries to submit with incorrect fields', async ({
  page
}) => {
  await page.goto('http://localhost:3000/menu');
  await page.getByTestId('cart-control-add-item_1001').click();
  await page
    .getByTestId('item-item_1001')
    .getByRole('link', { name: 'Go To Cart' })
    .click();
  await page.getByRole('link', { name: 'Go to checkout' }).click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.locator('body').click(); // blurring.
  await expect(page.getByText('Name is required')).toBeVisible();
  await expect(page.getByRole('paragraph')).toContainText('Name is required');
  await page.getByRole('textbox', { name: 'Phone' }).click();
  await page.locator('body').click();
  await page.getByRole('textbox', { name: 'Phone' }).click();
  await page.locator('body').click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.locator('body').click();
  await page.getByRole('textbox', { name: 'Address Line 1' }).click();
  await page.locator('body').click();
  await page.getByRole('textbox', { name: 'Postcode/Zipcode' }).click();
  await page.locator('body').click();
  await page.getByRole('textbox', { name: 'Credit Card' }).click();
  await page.locator('body').click();
  await page.getByRole('textbox', { name: 'CVC Code' }).click();
  await page.locator('body').click();
  // let's submit without putting anything in the fields.
  await page.getByTestId('checkout-page-submit-button').click();
  await expect(page.getByText('Phone is required')).toBeVisible();
  await expect(page.getByText('Enter a valid email')).toBeVisible();
  await expect(page.locator('form')).toContainText('Enter a valid email');
  await expect(page.getByText('Address is required for')).toBeVisible();
  await expect(page.locator('form')).toContainText(
    'Address is required for delivery'
  );
  await expect(page.getByText('Postcode is required for')).toBeVisible();
  await expect(page.locator('form')).toContainText(
    'Postcode is required for delivery'
  );
  await expect(page.getByText('Card number is required')).toBeVisible();
  await expect(page.locator('form')).toContainText('Card number is required');
  await expect(page.getByText('Expiration date is required')).toBeVisible();
  await expect(page.locator('form')).toContainText(
    'Expiration date is required'
  );
  await expect(page.getByText('CVC is required')).toBeVisible();
  await expect(page.locator('form')).toContainText('CVC is required');
  await page.getByTestId('checkout-page-submit-button').click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Final name');
  await page.getByRole('textbox', { name: 'Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Phone' }).click();
  await page.getByRole('textbox', { name: 'Phone' }).fill('5555555555');
  await page.getByRole('textbox', { name: 'Phone' }).press('Tab');
  await page.getByRole('textbox', { name: 'Email' }).fill('asdf@asdf.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Notes optional' }).click();
  await page
    .getByRole('textbox', { name: 'Notes optional' })
    .fill("I'm filling in the notes");
  await page.getByTestId('fulfilment-fields-radio-delivery').click();
  await page.getByRole('textbox', { name: 'Address Line 1' }).click();
  await page
    .getByRole('textbox', { name: 'Address Line 1' })
    .fill('Some address');
  await page.getByRole('textbox', { name: 'Address Line 1' }).press('Tab');
  await page.getByRole('textbox', { name: 'Address Line 2' }).press('Tab');
  await page.getByRole('textbox', { name: 'Postcode/Zipcode' }).fill('82028');
  await page.getByRole('textbox', { name: 'Credit Card' }).click();
  await page.getByRole('textbox', { name: 'Credit Card' }).fill('4242424242');
  await page.getByRole('textbox', { name: 'Credit Card' }).press('Enter');
  await page
    .getByRole('textbox', { name: 'Credit Card' })
    .fill('4242424242424242');
  await page.getByRole('textbox', { name: 'Expiration Date' }).click();
  await page.getByRole('textbox', { name: 'Expiration Date' }).fill('09/99');
  await page.getByRole('textbox', { name: 'Expiration Date' }).press('Tab');
  await page.getByRole('textbox', { name: 'CVC Code' }).fill('111');

  const checkoutResponsePromise = page.waitForResponse('**/api/checkout');

  await page.getByTestId('checkout-page-submit-button').click();

  const checkoutResponse = await checkoutResponsePromise;

  expect(checkoutResponse.ok()).toBe(true);

  await expect(page).toHaveURL(/\/order-confirmation\/[^/]+\/?$/);
  await expect(
    page.getByRole('heading', { name: 'Order Confirmed' })
  ).toBeVisible();
});
