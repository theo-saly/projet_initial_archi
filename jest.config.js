module.exports = {
    testEnvironment: 'node',
    // Séparation claire entre les tests de persistance et de routes
    projects: [
        {
            displayName: 'persistence',
            testMatch: ['**/spec/persistence/**/*.spec.js'],
            testEnvironment: 'node',
            // Les tests de persistance utilisent une base de données de test isolée
            setupFilesAfterEnv: ['<rootDir>/spec/persistence/setup.js'],
        },
        {
            displayName: 'routes',
            testMatch: ['**/spec/routes/**/*.spec.js'],
            testEnvironment: 'node',
            setupFilesAfterEnv: ['<rootDir>/spec/routes/setup.js'],
            // Les tests de routes ne doivent JAMAIS toucher la base de données
            // Ils utilisent exclusivement des mocks de la couche de persistance
        },
    ],
    // Configuration globale
    collectCoverageFrom: ['src/**/*.js', '!src/static/**'],
    coveragePathIgnorePatterns: ['/node_modules/', '/spec/'],
};
