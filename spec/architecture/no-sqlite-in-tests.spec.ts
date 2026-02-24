import * as fs from 'fs';
import * as path from 'path';

function getTestFiles(dir: string, skipDirs: string[] = []): string[] {
    const results: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (skipDirs.includes(entry.name)) continue;
            results.push(...getTestFiles(path.join(dir, entry.name), skipDirs));
        } else if (
            entry.name.endsWith('.spec.ts') ||
            entry.name.endsWith('.test.ts')
        ) {
            results.push(path.join(dir, entry.name));
        }
    }
    return results;
}

describe("Architecture: isolation de l'infrastructure", () => {
    const specDir = path.resolve(__dirname, '..');

    test('aucun test (hors persistence/) ne doit importer sqlite3', () => {
        const testFiles = getTestFiles(specDir, ['persistence']);

        expect(testFiles.length).toBeGreaterThan(0);

        for (const file of testFiles) {
            const content = fs.readFileSync(file, 'utf-8');

            expect(content).not.toMatch(/require\(\s*['"]sqlite3['"]\s*\)/);
            expect(content).not.toMatch(/from\s+['"]sqlite3['"]/);
            expect(content).not.toMatch(
                /require\(\s*['"].*\/persistence\/sqlite['"]\s*\)/,
            );
        }
    });

    test('les tests de routes doivent mocker la couche persistence', () => {
        const routeTestDir = path.join(specDir, 'routes');
        const files = fs
            .readdirSync(routeTestDir)
            .filter((f) => f.endsWith('.spec.ts') || f.endsWith('.test.ts'));

        expect(files.length).toBeGreaterThan(0);

        for (const file of files) {
            const content = fs.readFileSync(
                path.join(routeTestDir, file),
                'utf-8',
            );
            expect(content).toMatch(/jest\.mock\(.+persistence/);
        }
    });
});
