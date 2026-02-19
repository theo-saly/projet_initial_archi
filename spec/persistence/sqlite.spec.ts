const fs = require('fs');
const path = require('path');
const os = require('os');

// Variable pour stocker l'emplacement de la base de données et le module db
// Chaque test utilisera une base de données unique pour garantir l'isolation
let location;
let db;

const ITEM = {
    id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
    name: 'Test',
    completed: false,
};

// Nettoyer avant chaque test pour garantir l'isolation
beforeEach(async () => {
    // Fermer la connexion précédente si elle existe
    try {
        if (db && db.teardown) {
            await db.teardown();
        }
    } catch (err) {
        // Ignorer les erreurs si la base n'est pas ouverte
    }

    // Créer un nouveau fichier de base de données unique pour chaque test
    // Cela garantit une isolation complète entre les tests
    location = path.join(
        os.tmpdir(),
        `todo-test-${Date.now()}-${Math.random().toString(36).substring(7)}.db`,
    );
    process.env.SQLITE_DB_LOCATION = location;

    // Forcer le rechargement du module sqlite pour qu'il utilise la nouvelle location
    jest.resetModules();
    db = require('../../src/persistence/sqlite');

    // Réinitialiser la base de données pour chaque test
    await db.init();
});

// Nettoyer après tous les tests
afterAll(async () => {
    try {
        if (db && db.teardown) {
            await db.teardown();
        }
        if (location && fs.existsSync(location)) {
            fs.unlinkSync(location);
        }
    } catch (err) {
        // Ignorer les erreurs de nettoyage
    }
});

test('it initializes correctly', async () => {
    // L'initialisation est déjà faite dans beforeEach
    expect(true).toBe(true);
});

test('it can store and retrieve items', async () => {
    // La base de données est déjà initialisée dans beforeEach
    await db.storeItem(ITEM);

    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(ITEM);
});

test('it can update an existing item', async () => {
    // La base de données est déjà initialisée dans beforeEach
    const initialItems = await db.getItems();
    expect(initialItems.length).toBe(0);

    await db.storeItem(ITEM);

    await db.updateItem(
        ITEM.id,
        Object.assign({}, ITEM, { completed: !ITEM.completed }),
    );

    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0].completed).toBe(!ITEM.completed);
});

test('it can remove an existing item', async () => {
    // La base de données est déjà initialisée dans beforeEach
    await db.storeItem(ITEM);

    await db.removeItem(ITEM.id);

    const items = await db.getItems();
    expect(items.length).toBe(0);
});

test('it can get a single item', async () => {
    // La base de données est déjà initialisée dans beforeEach
    await db.storeItem(ITEM);

    const item = await db.getItem(ITEM.id);
    expect(item).toEqual(ITEM);
});
