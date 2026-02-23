import { test, expect } from '@playwright/test';


const BASE_URL = 'http://localhost:3000';



test.describe('Todo List E2E', () => {
  test('Ajout d’un todo', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[placeholder="New Item"]', 'Test');
    await page.click('button.btn-success:not([disabled])');
    await expect(page.locator('.item .name', { hasText: 'Test' }).first()).toBeVisible();
  });

  test('Compléter un todo', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('.item:has(.name:text("Test")) .toggles');
    await expect(page.locator('.item.completed .name', { hasText: 'Test' })).toBeVisible();
  });

  test('Décocher un todo', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('.item:has(.name:has-text("Test")) .toggles');
    await expect(page.locator('.item:not(.false) .name', { hasText: 'Test' })).toBeVisible();
  });

  test('Supprimer un todo', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('.item:has(.name:text("Test")) .fa-trash');
    await expect(page.locator('.item .name', { hasText: 'Test' })).toHaveCount(0);
  });

  test('Inscription utilisateur', async ({ page }) => {
    await page.goto(BASE_URL);
    const registerForm = page.locator('#register-form');
    await registerForm.locator('input[type="email"]').fill('email@exemple.com');
    await registerForm.locator('input[type="password"]').fill('motdepasse');
    await registerForm.locator('#consentCheck').check();
    await registerForm.locator('button.btn-primary').click();
    await expect(registerForm.locator('.mt-2.text-info')).toHaveText('Compte créé !');
  });

  test('Connexion utilisateur', async ({ page }) => {
    await page.goto(BASE_URL);
    const loginForm = page.locator('#login-form');
    await loginForm.locator('input[type="email"]').fill('email@exemple.com');
    await loginForm.locator('input[type="password"]').fill('motdepasse');
    await loginForm.locator('button.btn-success').click();
    await expect(page.locator('input[placeholder="Token JWT"]')).not.toHaveValue('');
  });
});
