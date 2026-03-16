import { test, expect } from '@playwright/test';
import { execSync } from 'node:child_process';

const BASE_URL = 'http://localhost:3000';

test.describe('Workflow Front E2E', () => {
    test('Inscription', async ({ page }) => {
        const seed = Date.now();
        const email = `e2e.${seed}@example.com`;
        const password = 'Passw0rd!';

        await page.goto(BASE_URL);
        await page.click('#landing-cta');
        await expect(page.locator('#auth-card')).toBeVisible();

        await page.click('button.auth-tab:has-text("Inscription")');
        await page.fill('#register-form input[type="email"]', email);
        await page.fill('#register-form input[type="password"]', password);
        await page.check('#consentCheck');
        await page.click('#register-form button[type="submit"]');
        await expect(page.locator('#register-form .text-info')).toContainText(/Compte/i);
    });

    test('Connexion', async ({ page }) => {
        const seed = Date.now();
        const email = `e2e.${seed}@example.com`;
        const password = 'Passw0rd!';

        await page.goto(BASE_URL);
        await page.click('#landing-cta');
        await expect(page.locator('#auth-card')).toBeVisible();

        await page.click('button.auth-tab:has-text("Inscription")');
        await page.fill('#register-form input[type="email"]', email);
        await page.fill('#register-form input[type="password"]', password);
        await page.check('#consentCheck');
        await page.click('#register-form button[type="submit"]');

        await page.click('button.auth-tab:has-text("Connexion")');
        await page.fill('#login-form input[type="email"]', email);
        await page.fill('#login-form input[type="password"]', password);
        await page.click('#login-form button[type="submit"]');
        await expect(page.locator('#dashboard-shell')).toBeVisible();
        await expect(page.locator('#project-form')).toBeVisible();
    });

    test('Creation projet', async ({ page }) => {
        const seed = Date.now();
        const email = `e2e.${seed}@example.com`;
        const password = 'Passw0rd!';
        const projectName = `Projet E2E ${seed}`;

        await page.goto(BASE_URL);
        await page.click('#landing-cta');
        await expect(page.locator('#auth-card')).toBeVisible();

        await page.click('button.auth-tab:has-text("Inscription")');
        await page.fill('#register-form input[type="email"]', email);
        await page.fill('#register-form input[type="password"]', password);
        await page.check('#consentCheck');
        await page.click('#register-form button[type="submit"]');

        await page.click('button.auth-tab:has-text("Connexion")');
        await page.fill('#login-form input[type="email"]', email);
        await page.fill('#login-form input[type="password"]', password);
        await page.click('#login-form button[type="submit"]');
        await expect(page.locator('#dashboard-shell')).toBeVisible();

        await page.fill('#project-form input[placeholder="Ex: Refonte portail client"]', projectName);
        await page.fill('#project-form input[placeholder="Objectif du projet"]', 'Validation du workflow complet');
        await page.click('#project-form button[type="submit"]');
        await expect(page.locator('.alert-success')).toContainText(/Projet cr[eé]é? avec succ[eè]s\.?/i);
    });

    test('Creation tache', async ({ page }) => {
        const seed = Date.now();
        const email = `e2e.${seed}@example.com`;
        const password = 'Passw0rd!';
        const projectName = `Projet E2E ${seed}`;
        const taskTitle = `Tache E2E ${seed}`;

        await page.goto(BASE_URL);
        await page.click('#landing-cta');
        await expect(page.locator('#auth-card')).toBeVisible();

        await page.click('button.auth-tab:has-text("Inscription")');
        await page.fill('#register-form input[type="email"]', email);
        await page.fill('#register-form input[type="password"]', password);
        await page.check('#consentCheck');
        await page.click('#register-form button[type="submit"]');

        await page.click('button.auth-tab:has-text("Connexion")');
        await page.fill('#login-form input[type="email"]', email);
        await page.fill('#login-form input[type="password"]', password);
        await page.click('#login-form button[type="submit"]');
        await expect(page.locator('#dashboard-shell')).toBeVisible();

        await page.fill('#project-form input[placeholder="Ex: Refonte portail client"]', projectName);
        await page.fill('#project-form input[placeholder="Objectif du projet"]', 'Validation du workflow complet');
        await page.click('#project-form button[type="submit"]');
        await expect(page.locator('.alert-success')).toContainText(/Projet cr[eé]é? avec succ[eè]s\.?/i);

        await page.fill('#task-form input[placeholder="Ex: Designer la page d\'accueil"]', taskTitle);
        await page.fill('#task-form input[placeholder="Details de la tache"]', 'Realiser la premiere tache du projet');
        await page.click('#task-form button[type="submit"]');
        await expect(page.locator('#task-list .item strong', { hasText: taskTitle })).toBeVisible();
    });

    test('Completion tache', async ({ page }) => {
        const seed = Date.now();
        const email = `e2e.${seed}@example.com`;
        const password = 'Passw0rd!';
        const projectName = `Projet E2E ${seed}`;
        const taskTitle = `Tache E2E ${seed}`;

        await page.goto(BASE_URL);
        await page.click('#landing-cta');
        await expect(page.locator('#auth-card')).toBeVisible();

        await page.click('button.auth-tab:has-text("Inscription")');
        await page.fill('#register-form input[type="email"]', email);
        await page.fill('#register-form input[type="password"]', password);
        await page.check('#consentCheck');
        await page.click('#register-form button[type="submit"]');

        await page.click('button.auth-tab:has-text("Connexion")');
        await page.fill('#login-form input[type="email"]', email);
        await page.fill('#login-form input[type="password"]', password);
        await page.click('#login-form button[type="submit"]');
        await expect(page.locator('#dashboard-shell')).toBeVisible();

        await page.fill('#project-form input[placeholder="Ex: Refonte portail client"]', projectName);
        await page.fill('#project-form input[placeholder="Objectif du projet"]', 'Validation du workflow complet');
        await page.click('#project-form button[type="submit"]');
        await expect(page.locator('.alert-success')).toContainText(/Projet cr[eé]é? avec succ[eè]s\.?/i);

        await page.fill('#task-form input[placeholder="Ex: Designer la page d\'accueil"]', taskTitle);
        await page.fill('#task-form input[placeholder="Details de la tache"]', 'Realiser la premiere tache du projet');
        await page.click('#task-form button[type="submit"]');
        await expect(page.locator('#task-list .item strong', { hasText: taskTitle })).toBeVisible();

        await page.click(`#task-list .item:has(strong:has-text("${taskTitle}")) button`);
        await expect(page.locator('#task-list .item .text-muted', { hasText: 'Statut: terminé' })).toBeVisible();
    });

    test('Suppr un projet (cloture projet)', async ({ page }) => {
        const seed = Date.now();
        const email = `e2e.${seed}@example.com`;
        const password = 'Passw0rd!';
        const projectName = `Projet E2E ${seed}`;
        const taskTitle = `Tache E2E ${seed}`;

        await page.goto(BASE_URL);
        await page.click('#landing-cta');
        await expect(page.locator('#auth-card')).toBeVisible();

        await page.click('button.auth-tab:has-text("Inscription")');
        await page.fill('#register-form input[type="email"]', email);
        await page.fill('#register-form input[type="password"]', password);
        await page.check('#consentCheck');
        await page.click('#register-form button[type="submit"]');

        await page.click('button.auth-tab:has-text("Connexion")');
        await page.fill('#login-form input[type="email"]', email);
        await page.fill('#login-form input[type="password"]', password);
        await page.click('#login-form button[type="submit"]');
        await expect(page.locator('#dashboard-shell')).toBeVisible();

        await page.fill('#project-form input[placeholder="Ex: Refonte portail client"]', projectName);
        await page.fill('#project-form input[placeholder="Objectif du projet"]', 'Validation du workflow complet');
        await page.click('#project-form button[type="submit"]');
        await expect(page.locator('.alert-success')).toContainText(/Projet cr[eé]é? avec succ[eè]s\.?/i);

        await page.fill('#task-form input[placeholder="Ex: Designer la page d\'accueil"]', taskTitle);
        await page.fill('#task-form input[placeholder="Details de la tache"]', 'Realiser la premiere tache du projet');
        await page.click('#task-form button[type="submit"]');
        await expect(page.locator('#task-list .item strong', { hasText: taskTitle })).toBeVisible();

        await page.click(`#task-list .item:has(strong:has-text("${taskTitle}")) button`);
        await page.click('#close-project button');
        await expect(page.locator('.alert-success')).toContainText(/Projet cl[oô]tur[eé]/i);
    });

    test('Check log notification-service', async () => {
        const logs = execSync('docker compose logs --no-color --tail=200 notification-service', {
            encoding: 'utf-8',
        });

        expect(logs).toContain('Notification service listening on port 3004');
    });
});
