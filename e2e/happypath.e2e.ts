import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const springRolls = 'item_1001';
const thaiCurry = 'item_2002';

async function addStandardOrder(page: Page) {
  await page.goto('/menu');

  await page.getByTestId(`cart-control-add-${springRolls}`).click();
  await page.getByTestId(`cart-control-increment-${springRolls}`).click();

  await page.getByTestId(`cart-control-add-${thaiCurry}`).click();
}

async function goToCheckoutWithStandardOrder(page: Page) {
  await addStandardOrder(page);
  await page.getByRole('link', { name: 'Go To Cart' }).first().click();
  await page.getByRole('link', { name: 'Go to checkout' }).click();
}

async function fillValidCheckoutForm(page: Page) {
  await page.getByRole('textbox', { name: 'Name' }).fill('Foodhub Test');
  await page.getByRole('textbox', { name: 'Phone' }).fill('202 1010 010');
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');

  await expect(page.getByRole('radio', { name: 'Delivery' })).toBeChecked();

  await page
    .getByRole('textbox', { name: 'Address Line 1' })
    .fill('139 Oliver Plunkett Rd.');
  await page
    .getByRole('textbox', { name: 'Postcode/Zipcode' })
    .fill('A96 E8Y9');
  await page
    .getByRole('textbox', { name: 'Notes optional' })
    .fill("Don't Poison Me Please.");

  await page
    .getByRole('textbox', { name: 'Credit Card' })
    .fill('4242424242424242');
  await page.getByRole('textbox', { name: 'Expiration Date' }).fill('03/99');
  await page.getByRole('textbox', { name: 'CVC Code' }).fill('123');
}

test.describe('happy path', () => {
  test('displays the restaurant menu', async ({ page }) => {
    await page.goto('/menu');

    await expect(page.getByTestId('restaurant-name')).toContainText(
      'Harbour Wok & Grill'
    );

    await expect(page.getByRole('heading', { name: 'Starters' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Burgers' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sides' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Drinks' })).toBeVisible();

    await expect(page.getByTestId(`item-${springRolls}`)).toContainText(
      'Vegetable Spring Rolls'
    );
    await expect(page.getByTestId(`item-${springRolls}`)).toContainText(
      'Price: €5.95'
    );
    await expect(page.getByTestId(`item-${springRolls}`)).toContainText(
      'Allergens: gluten, soy'
    );

    await expect(page.getByTestId('item-item_4003')).toContainText(
      'Price: €4.95 (Unavailable)'
    );
  });

  test('updates item quantities from the menu', async ({ page }) => {
    await page.goto('/menu');

    await page.getByTestId(`cart-control-add-${springRolls}`).click();
    await expect(
      page.getByTestId(`cart-control-quantity-${springRolls}`)
    ).toContainText('1');

    await page.getByTestId(`cart-control-increment-${springRolls}`).click();
    await page.getByTestId(`cart-control-increment-${springRolls}`).click();

    await expect(
      page.getByTestId(`cart-control-quantity-${springRolls}`)
    ).toContainText('3');

    await page.getByTestId(`cart-control-decrement-${springRolls}`).click();

    await expect(
      page.getByTestId(`cart-control-quantity-${springRolls}`)
    ).toContainText('2');
  });

  test('shows the cart summary', async ({ page }) => {
    await addStandardOrder(page);

    await page.getByRole('link', { name: 'Go To Cart' }).first().click();

    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'Cart' })).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Vegetable Spring Rolls' })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Thai Green Chicken Curry' })
    ).toBeVisible();

    await expect(page.locator('body')).toContainText('Subtotal: €25.40');
    await expect(page.locator('body')).toContainText(
      'This order qualifies for free delivery!'
    );

    await expect(
      page.getByTestId(`cart-control-quantity-${springRolls}`)
    ).toContainText('2');
    await expect(
      page.getByTestId(`cart-control-quantity-${thaiCurry}`)
    ).toContainText('1');
  });

  test('shows checkout totals and accepts valid customer details', async ({
    page
  }) => {
    await goToCheckoutWithStandardOrder(page);

    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();

    await expect(page.getByTestId('checkout-totals-subtotal')).toContainText(
      'Subtotal: €25.40'
    );
    await expect(
      page.getByTestId('checkout-totals-delivery-fee-text')
    ).toContainText('This order qualifies for free delivery!');
    await expect(page.getByTestId('checkout-totals-total')).toContainText(
      'Total: €25.40'
    );

    await fillValidCheckoutForm(page);

    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(
      'Foodhub Test'
    );
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
      'test@test.com'
    );
    await expect(
      page.getByRole('button', { name: /place order/i })
    ).toBeEnabled();
  });

  test('submits an order and displays the confirmation page', async ({
    page
  }) => {
    await goToCheckoutWithStandardOrder(page);
    await fillValidCheckoutForm(page);

    const checkoutResponsePromise = page.waitForResponse('**/api/checkout');

    await page.getByRole('button', { name: /place order/i }).click();

    const checkoutResponse = await checkoutResponsePromise;
    expect(checkoutResponse.ok()).toBe(true);

    await expect(page).toHaveURL(/\/order-confirmation\/[^/]+\/?$/);

    await expect(
      page.getByRole('heading', { name: 'Order Confirmed' })
    ).toBeVisible();

    await expect(page.getByTestId('order-confirmation-name')).toContainText(
      'Foodhub Test'
    );
    await expect(page.getByTestId('order-confirmation-email')).toContainText(
      'test@test.com'
    );
    await expect(page.getByTestId('order-confirmation-phone')).toContainText(
      '202 1010 010'
    );

    await expect(
      page.getByTestId(`order-confirmation-item-quantity-name-${springRolls}`)
    ).toContainText('2 × Vegetable Spring Rolls');

    await expect(
      page.getByTestId(`order-confirmation-item-price-${springRolls}`)
    ).toContainText('€11.90');

    await expect(
      page.getByTestId(`order-confirmation-item-quantity-name-${thaiCurry}`)
    ).toContainText('1 × Thai Green Chicken Curry');

    await expect(
      page.getByTestId(`order-confirmation-item-price-${thaiCurry}`)
    ).toContainText('€13.50');

    await expect(
      page.getByTestId('order-confirmation-total-price')
    ).toContainText('€25.40');

    await expect(
      page.getByTestId('order-confirmation-kitchen-summary')
    ).toContainText(
      "delivery order with 3 item(s). Customer note: Don't Poison Me Please."
    );
  });
});
