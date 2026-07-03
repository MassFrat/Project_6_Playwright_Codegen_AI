import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('SauceDemo checkout flow', () => {
  test('standard user can add items and complete checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // --- Login ---
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // --- Add items to cart ---
    await cartPage.addItemToCart('Sauce Labs Backpack');
    await cartPage.addItemToCart('Sauce Labs Bike Light');
    await cartPage.assertCartCount(2);

    // --- Go to cart and proceed to checkout ---
    await cartPage.goToCart();
    await cartPage.assertItemInCart('Sauce Labs Backpack');
    await cartPage.assertItemInCart('Sauce Labs Bike Light');
    await cartPage.proceedToCheckout();

    // --- Fill shipping info and continue ---
    await checkoutPage.fillShippingInfo('Test', 'User', '12345');
    await checkoutPage.continueToOverview();

    // --- Meaningful assertion: order total math is correct ---
    await checkoutPage.assertOrderTotalIsCorrect();

    // --- Finish order ---
    await checkoutPage.finishCheckout();

    // --- Meaningful assertion: success message ---
    await checkoutPage.assertOrderSuccess();
  });
});
