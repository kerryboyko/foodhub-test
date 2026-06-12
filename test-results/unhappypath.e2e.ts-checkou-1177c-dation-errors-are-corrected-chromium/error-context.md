# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: unhappypath.e2e.ts >> checkout guardrails >> allows checkout after validation errors are corrected
- Location: e2e/unhappypath.e2e.ts:75:7

# Error details

```
TimeoutError: page.waitForResponse: Timeout 3000ms exceeded while waiting for event "response"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
        - img [ref=e8]
    - alert [ref=e11]
    - main [ref=e12]:
        - heading "Checkout" [level=2] [ref=e13]
        - separator [ref=e14]
        - generic [ref=e15]:
            - link "Back to menu" [ref=e17] [cursor=pointer]:
                - /url: /menu
            - link "Change Order" [ref=e19] [cursor=pointer]:
                - /url: /cart
            - separator [ref=e20]
            - generic [ref=e21]: 'Subtotal: €5.95'
            - generic [ref=e22]: 'Delivery: €3.00'
            - generic [ref=e23]: 'Total: €8.95'
            - separator [ref=e24]
            - generic [ref=e25]:
                - generic [ref=e26]:
                    - text: Name
                    - textbox "Name" [ref=e27]: Final name
                - generic [ref=e28]:
                    - text: Phone
                    - textbox "Phone" [ref=e29]: '5555555555'
                - generic [ref=e30]:
                    - text: Email
                    - textbox "Email" [ref=e31]: asdf@asdf.com
                - group "How will you receive the order?" [ref=e32]:
                    - generic [ref=e33]: How will you receive the order?
                    - generic [ref=e34]:
                        - radio "Delivery" [checked] [ref=e35]
                        - text: Delivery
                    - generic [ref=e36]:
                        - radio "Collection" [ref=e37]
                        - text: Collection
                - generic [ref=e38]:
                    - text: Address Line 1
                    - textbox "Address Line 1" [ref=e39]: Some address
                - generic [ref=e40]:
                    - text: Address Line 2
                    - textbox "Address Line 2" [ref=e41]
                - generic [ref=e42]:
                    - text: Postcode/Zipcode
                    - textbox "Postcode/Zipcode" [ref=e43]: '82028'
                - generic [ref=e44]:
                    - text: Notes optional
                    - textbox "Notes optional" [ref=e45]: I'm filling in the notes
                - separator [ref=e46]
                - generic [ref=e47]:
                    - text: Credit Card
                    - textbox "Credit Card" [ref=e48]: '4242424242424242'
                - generic [ref=e49]:
                    - text: Expiration Date
                    - textbox "Expiration Date" [ref=e50]:
                        - /placeholder: MM/YY
                        - text: 09/99
                - generic [ref=e51]:
                    - text: CVC Code
                    - textbox "CVC Code" [ref=e52]: '111'
                - separator [ref=e53]
                - button "Placing order..." [disabled] [ref=e54]
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | import type { Page } from '@playwright/test';
  3   |
  4   | const springRolls = 'item_1001';
  5   |
  6   | async function addItemAndGoToCheckout(page: Page) {
  7   |   await page.goto('/menu');
  8   |   await page.getByTestId(`cart-control-add-${springRolls}`).click();
  9   |   await page
  10  |     .getByTestId(`item-${springRolls}`)
  11  |     .getByRole('link', { name: 'Go To Cart' })
  12  |     .click();
  13  |   await page.getByRole('link', { name: 'Go to checkout' }).click();
  14  | }
  15  |
  16  | async function fillValidCheckoutForm(page: Page) {
  17  |   await page.getByRole('textbox', { name: 'Name' }).fill('Final name');
  18  |   await page.getByRole('textbox', { name: 'Phone' }).fill('5555555555');
  19  |   await page.getByRole('textbox', { name: 'Email' }).fill('asdf@asdf.com');
  20  |
  21  |   await page.getByRole('radio', { name: 'Delivery' }).check();
  22  |
  23  |   await page
  24  |     .getByRole('textbox', { name: 'Address Line 1' })
  25  |     .fill('Some address');
  26  |   await page.getByRole('textbox', { name: 'Postcode/Zipcode' }).fill('82028');
  27  |
  28  |   await page
  29  |     .getByRole('textbox', { name: 'Notes optional' })
  30  |     .fill("I'm filling in the notes");
  31  |
  32  |   await page
  33  |     .getByRole('textbox', { name: 'Credit Card' })
  34  |     .fill('4242424242424242');
  35  |   await page.getByRole('textbox', { name: 'Expiration Date' }).fill('09/99');
  36  |   await page.getByRole('textbox', { name: 'CVC Code' }).fill('111');
  37  | }
  38  |
  39  | test.describe('checkout guardrails', () => {
  40  |   test('does not allow checkout with an empty cart', async ({ page }) => {
  41  |     await page.goto('/cart');
  42  |
  43  |     await page.getByRole('link', { name: 'Go to checkout' }).click();
  44  |
  45  |     await expect(page).toHaveURL(/\/checkout$/);
  46  |     await expect(
  47  |       page.getByTestId('checkout-page-submit-button')
  48  |     ).toBeDisabled();
  49  |     await expect(page.getByTestId('checkout-totals-total')).toContainText(
  50  |       'Total: €3.00'
  51  |     );
  52  |   });
  53  |
  54  |   test('shows validation errors for required checkout fields', async ({
  55  |     page
  56  |   }) => {
  57  |     await addItemAndGoToCheckout(page);
  58  |
  59  |     await page.getByTestId('checkout-page-submit-button').click();
  60  |
  61  |     await expect(page.getByText('Name is required')).toBeVisible();
  62  |     await expect(page.getByText('Phone is required')).toBeVisible();
  63  |     await expect(page.getByText('Enter a valid email')).toBeVisible();
  64  |     await expect(
  65  |       page.getByText('Address is required for delivery')
  66  |     ).toBeVisible();
  67  |     await expect(
  68  |       page.getByText('Postcode is required for delivery')
  69  |     ).toBeVisible();
  70  |     await expect(page.getByText('Card number is required')).toBeVisible();
  71  |     await expect(page.getByText('Expiration date is required')).toBeVisible();
  72  |     await expect(page.getByText('CVC is required')).toBeVisible();
  73  |   });
  74  |
  75  |   test('allows checkout after validation errors are corrected', async ({
  76  |     page
  77  |   }) => {
  78  |     await addItemAndGoToCheckout(page);
  79  |
  80  |     await page.getByTestId('checkout-page-submit-button').click();
  81  |
  82  |     await fillValidCheckoutForm(page);
  83  |
  84  |     const submitButton = page.getByTestId('checkout-page-submit-button');
  85  |
  86  |     await expect(submitButton).toBeEnabled();
  87  |
  88  |     const [checkoutResponse] = await Promise.all([
> 89  |       page.waitForResponse(
      |            ^ TimeoutError: page.waitForResponse: Timeout 3000ms exceeded while waiting for event "response"
  90  |         (response) =>
  91  |           response.url().includes('/api/checkout') &&
  92  |           response.request().method() === 'POST',
  93  |         { timeout: 3000 }
  94  |       ),
  95  |       submitButton.click()
  96  |     ]);
  97  |
  98  |     expect(checkoutResponse.ok()).toBe(true);
  99  |
  100 |     await expect(page).toHaveURL(/\/order-confirmation\/[^/]+\/?$/);
  101 |     await expect(
  102 |       page.getByRole('heading', { name: 'Order Confirmed' })
  103 |     ).toBeVisible();
  104 |   });
  105 | });
  106 |
```
