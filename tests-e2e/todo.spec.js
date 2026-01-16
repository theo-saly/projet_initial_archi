const { test, expect } = require('@playwright/test');


const BASE_URL = 'http://localhost:3000';

// Fonction pour delete tt todos
async function clearAllTodos(page) {
  while (await page.locator('.item .fa-trash').count() > 0) {
    const firstTrash = page.locator('.item .fa-trash').first();
    await firstTrash.click();
    await firstTrash.waitFor({ state: 'detached', timeout: 1000 });
  }
}

test.describe('Todo List E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearAllTodos(page);
  });
  test('Ajout d’un todo', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[placeholder="New Item"]', 'Ma première tâche');
    await page.click('button.btn-success');
    await expect(page.locator('.item .name', { hasText: 'Ma première tâche' }).first()).toBeVisible();
  });

  test('Compléter un todo', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[placeholder="New Item"]', 'À compléter');
    await page.click('button.btn-success');
    await page.click('.item:has(.name:text("À compléter")) .toggles');
    // Ici, tu peux vérifier l’état visuel ou la classe de l’icône si besoin
  });

  test('Supprimer un todo', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('input[placeholder="New Item"]', 'À supprimer');
    await page.click('button.btn-success');
    await page.click('.item:has(.name:text("À supprimer")) .fa-trash');
    await expect(page.locator('.item .name', { hasText: 'À supprimer' })).toHaveCount(0);
  });
});
