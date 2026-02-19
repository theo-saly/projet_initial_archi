module.exports = {
    testPathIgnorePatterns: ['/node_modules/', '/tests-e2e/'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { diagnostics: false }],
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
