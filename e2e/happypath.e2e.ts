import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('/menu');
  await expect(page.getByTestId('restaurant-name')).toBeVisible();
  await expect(page.getByTestId('restaurant-name')).toContainText(
    'Harbour Wok & Grill'
  );
  await expect(page.getByRole('heading', { name: 'Starters' })).toBeVisible();
  await expect(
    page.getByTestId('category-cat_starters').locator('h2')
  ).toContainText('Starters');
  await page.getByRole('heading', { name: 'Burgers' }).click();
  await expect(page.getByRole('heading', { name: 'Burgers' })).toBeVisible();
  await expect(
    page.getByTestId('category-cat_burgers').locator('h2')
  ).toContainText('Burgers');
  await expect(page.getByRole('heading', { name: 'Sides' })).toBeVisible();
  await expect(
    page.getByTestId('category-cat_sides').locator('h2')
  ).toContainText('Sides');
  await expect(page.getByRole('heading', { name: 'Drinks' })).toBeVisible();
  await expect(
    page.getByTestId('category-cat_drinks').locator('h2')
  ).toContainText('Drinks');
  await expect(
    page.getByRole('img', { name: 'Vegetable Spring Rolls:' })
  ).toBeVisible();
  await expect(page.getByText('Crispy pastry rolls filled')).toBeVisible();
  await expect(page.getByTestId('item-item_1001')).toContainText(
    'Crispy pastry rolls filled with cabbage, carrot, mushrooms, and glass noodles. Served with sweet chilli dip.'
  );
  await expect(
    page.getByTestId('item-item_1001').getByText('Allergens: gluten, soy')
  ).toBeVisible();
  await expect(page.getByTestId('item-item_1001')).toContainText(
    'Allergens: gluten, soy'
  );
  await expect(
    page.getByTestId('item-item_1001').getByText('Price: €')
  ).toBeVisible();
  await expect(page.getByTestId('item-item_1001')).toContainText(
    'Price: €5.95'
  );
  await expect(page.getByTestId('cart-control-add-item_1001')).toBeVisible();
  await expect(page.getByTestId('cart-control-add-item_1001')).toContainText(
    'Add to cart'
  );
  await expect(
    page.getByTestId('item-item_1001').getByRole('link', { name: 'Go To Cart' })
  ).toBeVisible();
  await expect(
    page.getByTestId('item-item_1001').getByRole('link')
  ).toContainText('Go To Cart');
  await expect(
    page.getByRole('heading', { name: 'Egg Fried Rice' })
  ).toBeVisible();
  await expect(page.getByText('Price: €4.95 (Unavailable)')).toBeVisible();
  await expect(page.getByTestId('item-item_4003')).toContainText(
    'Price: €4.95 (Unavailable)'
  );
  await page.getByTestId('cart-control-add-item_1001').click();
  await expect(
    page.getByTestId('cart-control-decrement-item_1001')
  ).toBeVisible();
  await expect(
    page.getByTestId('cart-control-increment-item_1001')
  ).toBeVisible();
  await expect(page.getByTestId('cart-control-remove-item_1001')).toBeVisible();
  await expect(
    page.getByTestId('cart-control-quantity-item_1001')
  ).toBeVisible();
  await expect(
    page.getByTestId('cart-control-quantity-item_1001')
  ).toContainText('1');
  await page.getByTestId('cart-control-increment-item_1001').click();
  await page.getByTestId('cart-control-increment-item_1001').click();
  await expect(
    page.getByTestId('cart-control-quantity-item_1001')
  ).toContainText('3');
  await page.getByTestId('cart-control-decrement-item_1001').click();
  await expect(
    page.getByTestId('cart-control-quantity-item_1001')
  ).toContainText('2');
  await page.getByTestId('cart-control-add-item_2002').click();
  await expect(
    page.getByTestId('cart-control-decrement-item_2002')
  ).toBeVisible();
  await expect(
    page.getByTestId('cart-control-increment-item_2002')
  ).toBeVisible();
  await expect(page.getByTestId('cart-control-remove-item_2002')).toBeVisible();
  await expect(
    page.getByTestId('cart-control-quantity-item_2002')
  ).toContainText('1');
  await page
    .getByTestId('item-item_2001')
    .getByRole('link', { name: 'Go To Cart' })
    .click();
  // Cart
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.getByText('Cart')).toBeVisible();
  await expect(page.getByText('Subtotal: €')).toBeVisible();
  await expect(page.locator('body')).toContainText('Subtotal: €25.40');
  await expect(page.getByText('This order qualifies for free')).toBeVisible();
  await expect(page.locator('body')).toContainText(
    'This order qualifies for free delivery!'
  );
  await expect(
    page.getByRole('heading', { name: 'Vegetable Spring Rolls' })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Thai Green Chicken Curry' })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to menu' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Go to checkout' })
  ).toBeVisible();
  await expect(
    page.getByTestId('cart-control-decrement-item_1001')
  ).toBeVisible();
  await expect(
    page.getByTestId('cart-control-increment-item_1001')
  ).toBeVisible();
  await expect(page.getByTestId('cart-control-remove-item_1001')).toBeVisible();
  await expect(
    page.getByTestId('cart-control-quantity-item_1001')
  ).toContainText('2');
  await expect(
    page.getByTestId('cart-control-decrement-item_2002')
  ).toBeVisible();
  await expect(
    page.getByTestId('cart-control-increment-item_2002')
  ).toBeVisible();
  await expect(page.getByTestId('cart-control-remove-item_2002')).toBeVisible();
  await expect(
    page.getByTestId('cart-control-quantity-item_2002')
  ).toContainText('1');
  await page.getByRole('link', { name: 'Go to checkout' }).click();
  await expect(page.getByText('Checkout')).toBeVisible();
  await expect(
    page.locator('div').filter({ hasText: /^Back to menu$/ })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Change Order' })).toBeVisible();
  await expect(page.getByTestId('checkout-totals-subtotal')).toBeVisible();
  await expect(page.getByTestId('checkout-totals-subtotal')).toContainText(
    'Subtotal: €25.40'
  );
  await expect(
    page.getByTestId('checkout-totals-delivery-fee-text')
  ).toBeVisible();
  await expect(
    page.getByTestId('checkout-totals-delivery-fee-text')
  ).toContainText('This order qualifies for free delivery!');
  await expect(page.getByTestId('checkout-totals-total')).toBeVisible();
  await expect(page.getByTestId('checkout-totals-total')).toContainText(
    'Total: €25.40'
  );
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Foodhub Test');
  await page.getByRole('textbox', { name: 'Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Phone' }).fill('202');
  await page.getByRole('textbox', { name: 'Phone' }).click();
  await page.getByRole('textbox', { name: 'Phone' }).fill('202 1010 010');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('test@test.com');
  // default
  await expect(page.getByRole('radio', { name: 'Delivery' })).toBeChecked();
  await expect(
    page.getByRole('radio', { name: 'Collection' })
  ).not.toBeChecked();

  // set to collect
  await page.getByRole('radio', { name: 'Collection' }).check();
  await expect(page.getByRole('radio', { name: 'Delivery' })).not.toBeChecked();
  await expect(page.getByRole('radio', { name: 'Collection' })).toBeChecked();

  // back to delivery
  await page.getByRole('radio', { name: 'Delivery' }).check();
  await expect(page.getByRole('radio', { name: 'Delivery' })).toBeChecked();
  await expect(
    page.getByRole('radio', { name: 'Collection' })
  ).not.toBeChecked();

  // back to collection
  await page.getByRole('radio', { name: 'Collection' }).check();
  await expect(page.getByRole('radio', { name: 'Delivery' })).not.toBeChecked();
  await expect(page.getByRole('radio', { name: 'Collection' })).toBeChecked();

  // back to delivery
  await page.getByRole('radio', { name: 'Delivery' }).check();
  await expect(page.getByRole('radio', { name: 'Delivery' })).toBeChecked();
  await page.getByRole('textbox', { name: 'Address Line 1' }).click();
  await page
    .getByRole('textbox', { name: 'Address Line 1' })
    .fill('139 Oliver Plunkett Rd.');
  await page.getByRole('textbox', { name: 'Address Line 1' }).press('Tab');
  await page.getByRole('textbox', { name: 'Postcode/Zipcode' }).click();
  await page
    .getByRole('textbox', { name: 'Postcode/Zipcode' })
    .fill('A96 E8Y9');
  await page.getByRole('textbox', { name: 'Notes optional' }).click();
  await page
    .getByRole('textbox', { name: 'Notes optional' })
    .fill("Don't Poison Me Please.");
  await page.getByRole('textbox', { name: 'Credit Card' }).click();
  await page
    .getByRole('textbox', { name: 'Credit Card' })
    .fill('4242424242424242');
  await page.getByRole('textbox', { name: 'Expiration Date' }).click();
  await page.getByRole('textbox', { name: 'Expiration Date' }).fill('03/99');
  await page.getByRole('textbox', { name: 'CVC Code' }).click();
  await page.getByRole('textbox', { name: 'CVC Code' }).fill('123');
  await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(
    'Foodhub Test'
  );
  await expect(page.getByRole('textbox', { name: 'Phone' })).toHaveValue(
    '202 1010 010'
  );
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(
    'test@test.com'
  );
  await expect(
    page.getByRole('textbox', { name: 'Address Line 1' })
  ).toHaveValue('139 Oliver Plunkett Rd.');
  await expect(
    page.getByRole('textbox', { name: 'Address Line 2' })
  ).toBeEmpty();
  await expect(
    page.getByRole('textbox', { name: 'Postcode/Zipcode' })
  ).toHaveValue('A96 E8Y9');
  await expect(
    page.getByRole('textbox', { name: 'Notes optional' })
  ).toHaveValue("Don't Poison Me Please.");
  await expect(page.getByRole('textbox', { name: 'Credit Card' })).toHaveValue(
    '4242424242424242'
  );
  await expect(
    page.getByRole('textbox', { name: 'Expiration Date' })
  ).toHaveValue('03/99');
  await expect(page.getByRole('textbox', { name: 'CVC Code' })).toHaveValue(
    '123'
  );
  await expect(page.getByRole('button', { name: 'Place order' })).toBeVisible();

  await expect(
    page.getByRole('button', { name: /place order/i })
  ).toBeEnabled();

  const checkoutResponsePromise = page.waitForResponse('**/api/checkout');

  await page.getByRole('button', { name: /place order/i }).click();

  const checkoutResponse = await checkoutResponsePromise;

  expect(checkoutResponse.ok()).toBe(true);

  await expect(page).toHaveURL(/\/order-confirmation\/[^/]+\/?$/);
  await expect(
    page.getByRole('heading', { name: 'Order Confirmed' })
  ).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Customer' })).toBeVisible();
  await expect(page.getByTestId('order-confirmation-name')).toBeVisible();
  await expect(page.getByTestId('order-confirmation-email')).toBeVisible();
  await expect(page.getByTestId('order-confirmation-phone')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Items' })).toBeVisible();
  await expect(page.getByTestId('order-confirmation-name')).toContainText(
    'Foodhub Test'
  );
  await expect(page.getByTestId('order-confirmation-email')).toContainText(
    'test@test.com'
  );
  await expect(page.getByTestId('order-confirmation-phone')).toContainText(
    '202 1010 010'
  );
  await expect(page.getByRole('main')).toContainText('Items');
  await expect(
    page.getByTestId('order-confirmation-item-quantity-name-item_1001')
  ).toContainText('2 × Vegetable Spring Rolls');
  await expect(
    page.getByTestId('order-confirmation-item-price-item_1001')
  ).toContainText('€11.90');
  await expect(
    page.getByTestId('order-confirmation-item-quantity-name-item_2002')
  ).toContainText('1 × Thai Green Chicken Curry');
  await expect(
    page.getByTestId('order-confirmation-item-price-item_2002')
  ).toContainText('€13.50');
  await expect(
    page.getByTestId('order-confirmation-kitchen-summary')
  ).toContainText(
    "delivery order with 3 item(s). Customer note: Don't Poison Me Please. AI summary unavailable: using fallback kitchen summary."
  );
  await expect(page.getByRole('main')).toContainText('Total');
  await expect(
    page.getByTestId('order-confirmation-total-price')
  ).toContainText('€25.40');
});
