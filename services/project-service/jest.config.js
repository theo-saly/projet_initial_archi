module.exports = {
    transform: {
        '^.+\\.ts$': ['ts-jest', { diagnostics: false, tsconfig: 'tsconfig.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testMatch: ['<rootDir>/spec/**/*.spec.ts', '<rootDir>/spec/**/*.test.ts'],
};
