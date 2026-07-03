# SauceDemo Checkout Test (Playwright + TypeScript)

A simple end-to-end test for the [SauceDemo](https://www.saucedemo.com/) checkout flow, written with [Playwright](https://playwright.dev/) using the **Page Object Model (POM)** pattern.

## What it does

Logs in, adds two items to the cart, completes checkout, and checks that:

- The cart shows the correct number of items
- The order total adds up correctly (subtotal + tax = total)
- The "Thank you for your order!" message appears at the end

## Project structure

```
.
├── pages/
│   ├── LoginPage.ts      # login form
│   ├── CartPage.ts       # cart actions
│   └── CheckoutPage.ts   # checkout form + order summary
├── tests/
│   └── checkout.spec.ts  # the actual test
├── playwright.config.ts
└── README.md
```

## Getting started

```bash
npm install
npx playwright install
```

## Run the test

```bash
npx playwright test tests/checkout.spec.ts --headed
```

See the results in a report:

```bash
npx playwright show-report
```

## Why Page Object Model?

Instead of writing every click and selector directly in the test file, each page of the site gets its own class (`LoginPage`, `CartPage`, `CheckoutPage`) with reusable methods like `login()` or `addItemToCart()`. This makes the test easier to read and easier to update if the site's UI changes.

## An issue I ran into

Playwright's `getByTestId()` looks for elements with a `data-testid` attribute by default. SauceDemo actually uses `data-test` instead, so my locators weren't finding anything and every test failed with a "not found" error.

**Fix:** tell Playwright to use `data-test` as the test ID attribute in `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'data-test',
  },
});
```

Once that was added, every `getByTestId()` call in the page objects worked correctly.
