import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.checkoutButton = page.getByTestId('checkout');
    this.cartItems = page.getByTestId('inventory-item');
  }

  /**
   * Adds an item to the cart using the product name shown on the
   * inventory page (e.g. "Sauce Labs Backpack"). Internally maps it to the
   * app's slugified data-test id, so callers don't need to know that detail.
   */
  async addItemToCart(productName: string) {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    const addButton = this.page.getByTestId(`add-to-cart-${slug}`);
    await addButton.click();
  }

  async assertCartCount(expectedCount: number) {
    await expect(this.cartBadge).toHaveText(String(expectedCount));
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async assertItemInCart(productName: string) {
    await expect(this.page.getByText(productName, { exact: true })).toBeVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
