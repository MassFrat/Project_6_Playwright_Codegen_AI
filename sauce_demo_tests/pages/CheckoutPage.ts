import { type Page, type Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  // Step One: information form
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  // Step Two: overview
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // Complete
  readonly successHeader: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');

    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');

    this.successHeader = page.getByTestId('complete-header');
    this.successMessage = page.getByTestId('complete-text');
  }

  async fillShippingInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
    await expect(this.totalLabel).toBeVisible();
  }

  /**
   * Parses the displayed subtotal/tax/total and asserts that
   * subtotal + tax === total, catching pricing/calculation regressions.
   */
  async assertOrderTotalIsCorrect() {
    const parseAmount = (text: string) => parseFloat(text.replace(/[^0-9.]/g, ''));

    const subtotalText = await this.subtotalLabel.innerText();
    const taxText = await this.taxLabel.innerText();
    const totalText = await this.totalLabel.innerText();

    const subtotal = parseAmount(subtotalText);
    const tax = parseAmount(taxText);
    const total = parseAmount(totalText);

    expect(total).toBeCloseTo(subtotal + tax, 2);
  }

  async assertTotalEquals(expectedTotal: number) {
    await expect(this.totalLabel).toContainText(expectedTotal.toFixed(2));
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async assertOrderSuccess() {
    await expect(this.successHeader).toBeVisible();
    await expect(this.successHeader).toHaveText('Thank you for your order!');
    await expect(this.successMessage).toBeVisible();
  }
}
