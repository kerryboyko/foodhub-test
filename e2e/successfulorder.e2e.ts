import { test, expect } from '@playwright/test';

test('user can place a delivery order and see confirmation', async ({
  page
}) => {
  await page.goto('/menu');
  await expect(page.getByTestId('restaurant-name')).toContainText(
    'Harbour Wok & Grill'
  );
  await expect(
    page.getByTestId('category-cat_starters').locator('h2')
  ).toContainText('Starters');
  await expect(
    page.getByTestId('category-cat_mains').locator('h2')
  ).toContainText('Mains');
  await expect(
    page.getByTestId('category-cat_burgers').locator('h2')
  ).toContainText('Burgers');
  await expect(
    page.getByTestId('category-cat_sides').locator('h2')
  ).toContainText('Sides');
  await expect(
    page.getByTestId('category-cat_drinks').locator('h2')
  ).toContainText('Drinks');
  await expect(
    page.getByRole('img', { name: 'Vegetable Spring Rolls:' })
  ).toBeVisible();
  await expect(
    page.getByTestId('item-item_1001').getByRole('heading')
  ).toContainText('Vegetable Spring Rolls');
  await expect(page.getByTestId('item-item_1001')).toContainText(
    'Crispy pastry rolls filled with cabbage, carrot, mushrooms, and glass noodles. Served with sweet chilli dip.'
  );
  await expect(
    page.getByTestId('item-item_1001').getByTestId('menu-item-allergens')
  ).toContainText('Allergens: gluten, soy');
  await expect(page.getByTestId('item-item_1001')).toContainText(
    'Price: €5.95'
  );
  await expect(page.getByTestId('item-item_1001')).toMatchAriaSnapshot(`
    - heading "Vegetable Spring Rolls" [level=3]
    - 'img "Vegetable Spring Rolls: Crispy pastry rolls filled with cabbage, carrot, mushrooms, and glass noodles. Served with sweet chilli dip."'
    - paragraph: Crispy pastry rolls filled with cabbage, carrot, mushrooms, and glass noodles. Served with sweet chilli dip.
    - paragraph: "Allergens: gluten, soy"
    - paragraph: "/Price: €\\\\d+\\\\.\\\\d+/"
    - button "Add Vegetable Spring Rolls to cart": Add to cart
    `);
  await page.getByTestId('cart-control-add-item_1001').click();
  await page.getByTestId('cart-control-increment-item_1001').click();
  await expect(page.getByTestId('cart-bar')).toBeVisible();
  await expect(page.getByTestId('cart-bar')).toMatchAriaSnapshot(`
    - heading "Your Order:" [level=3]
    - text: "/2 x Vegetable Spring Rolls: €\\\\d+\\\\.\\\\d+ Subtotal: €\\\\d+\\\\.\\\\d+ Delivery: €\\\\d+\\\\.\\\\d+/"
    - link "Go To Checkout":
      - /url: /checkout
    `);
  await page.getByTestId('cart-control-decrement-item_1001').click();
  await expect(page.getByTestId('cart-bar')).toMatchAriaSnapshot(`
    - heading "Your Order:" [level=3]
    - text: "/1 x Vegetable Spring Rolls: €\\\\d+\\\\.\\\\d+ Subtotal: €\\\\d+\\\\.\\\\d+ Delivery: €\\\\d+\\\\.\\\\d+/"
    - link "Go To Checkout":
      - /url: /checkout
    `);
  await page.getByTestId('cart-control-add-item_2002').click();
  await page.getByTestId('cart-control-add-item_5002').click();
  await page.getByTestId('cart-control-increment-item_5002').click();
  await expect(page.getByTestId('cart-bar')).toMatchAriaSnapshot(`
    - heading "Your Order:" [level=3]
    - text: "/1 x Vegetable Spring Rolls: €\\\\d+\\\\.\\\\d+ 1 x Thai Green Chicken Curry: €\\\\d+\\\\.\\\\d+ 2 x Sparkling Water 500ml: €\\\\d+\\\\.\\\\d+ Subtotal: €\\\\d+\\\\.\\\\d+ This order qualifies for free delivery!/"
    - link "Go To Checkout":
      - /url: /checkout
    `);
  await page.getByRole('link', { name: 'Go To Checkout' }).click();

  await expect(page).toHaveURL(/\/checkout$/);

  await expect(page.locator('h2')).toContainText('Checkout');
  await page.getByTestId('cart-control-changeOrder-link').click();
  await page.getByTestId('cart-control-increment-item_1001').click();
  await expect(page.getByTestId('cart-bar')).toMatchAriaSnapshot(`
    - heading "Your Order:" [level=3]
    - text: "/2 x Vegetable Spring Rolls: €\\\\d+\\\\.\\\\d+ 1 x Thai Green Chicken Curry: €\\\\d+\\\\.\\\\d+ 2 x Sparkling Water 500ml: €\\\\d+\\\\.\\\\d+ Subtotal: €\\\\d+\\\\.\\\\d+ This order qualifies for free delivery!/"
    - link "Go To Checkout":
      - /url: /checkout
    `);
  await page.getByRole('link', { name: 'Go To Checkout' }).click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('End Toend');
  await page.getByRole('textbox', { name: 'Name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Phone' }).fill('999 999 9999');
  await page.getByRole('textbox', { name: 'Phone' }).press('Tab');
  await page.getByRole('textbox', { name: 'Email' }).fill('happypath@e2e.com');
  await page
    .locator('label')
    .filter({ hasText: 'Deliver the order to me' })
    .click();
  await page.getByTestId('fulfillment-fields-addressLine1-input').click();
  await page
    .getByTestId('fulfillment-fields-addressLine1-input')
    .fill('139 Oliver Plunkett Rd.');
  await page.getByTestId('fulfillment-fields-notes-postcode').click();
  await page.getByTestId('fulfillment-fields-notes-postcode').fill('A96 E8Y9');
  await page.getByTestId('fulfillment-fields-notes-postcode').press('Tab');
  await page
    .getByTestId('fulfillment-fields-notes-input')
    .fill('Please Do Not Poison Me. ');
  await page.getByRole('textbox', { name: 'Credit Card' }).click();
  await page
    .getByRole('textbox', { name: 'Credit Card' })
    .fill('4242424242424242');
  await page.getByRole('textbox', { name: 'Expiration Date' }).click();
  await page.getByRole('textbox', { name: 'Expiration Date' }).fill('01/99');
  await page.getByRole('textbox', { name: 'CVC Code' }).click();
  await page.getByRole('textbox', { name: 'CVC Code' }).fill('111');
  await expect(page.getByTestId('checkout-totals-total')).toContainText(
    'Total: €28.90'
  );
  await expect(page.getByTestId('checkout-page-submit-button')).toBeVisible();
  await page.getByTestId('checkout-page-submit-button').click();
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Order Confirmed" [level=1]
    - paragraph: "/Order ID: [0-9a-fA-F-]+/"
    - heading "Customer" [level=2]
    - paragraph: End Toend
    - paragraph: happypath@e2e.com
    - paragraph: /\\d+ \\d+ \\d+/
    - heading "Items" [level=2]
    - paragraph: 2 × Vegetable Spring Rolls
    - paragraph: /€\\d+\\.\\d+/
    - paragraph: 1 × Thai Green Chicken Curry
    - paragraph: /€\\d+\\.\\d+/
    - paragraph: 2 × Sparkling Water 500ml
    - paragraph: /€\\d+\\.\\d+/
    - heading "Total" [level=2]
    - paragraph: /€\\d+\\.\\d+/
    `);
  await expect(
    page.getByRole('heading', { name: 'Order Confirmed' })
  ).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Customer');
  await expect(page.getByTestId('order-confirmation-name')).toContainText(
    'End Toend'
  );
  await expect(page.getByTestId('order-confirmation-email')).toContainText(
    'happypath@e2e.com'
  );
  await expect(page.getByTestId('order-confirmation-phone')).toContainText(
    '999 999 9999'
  );
  await expect(page.getByRole('main')).toContainText('Items');
  await expect(
    page.getByTestId('order-confirmation-item-item_1001')
  ).toContainText('2 × Vegetable Spring Rolls€11.90');
  await page.getByTestId('order-confirmation-item-item_2002').click();
  await expect(
    page.getByTestId('order-confirmation-item-item_2002')
  ).toContainText('1 × Thai Green Chicken Curry€13.50');
  await expect(page.getByRole('main')).toContainText('Total');
  await expect(
    page.getByTestId('order-confirmation-total-price')
  ).toContainText('€28.90');
});
