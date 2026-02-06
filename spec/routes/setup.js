// Configuration pour les tests de routes
// IMPORTANT: Les tests de routes NE DOIVENT JAMAIS utiliser la vraie base de données
// Ils doivent toujours utiliser des mocks de la couche de persistance
// Chaque fichier de test doit mocker '../../src/persistence' explicitement

// S'assurer que NODE_ENV est en mode test
process.env.NODE_ENV = 'test';

// Note: Les mocks de persistance doivent être définis dans chaque fichier de test
// pour garantir l'isolation complète des tests de routes
