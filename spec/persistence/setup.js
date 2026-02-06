// Configuration pour les tests de persistance
// Assure que les tests utilisent une base de données de test isolée
const path = require('path');
const os = require('os');

// Utiliser un fichier de base de données temporaire pour les tests
process.env.SQLITE_DB_LOCATION = path.join(
    os.tmpdir(),
    `todo-test-${Date.now()}-${Math.random().toString(36).substring(7)}.db`,
);

// S'assurer que NODE_ENV est en mode test
process.env.NODE_ENV = 'test';
