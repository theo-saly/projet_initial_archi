export default {
    testPathIgnorePatterns: ['/node_modules/', '/tests-e2e/'],
    roots: ['<rootDir>/spec', '<rootDir>/services'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { diagnostics: false }],
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
