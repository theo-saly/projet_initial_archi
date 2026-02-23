import type { TodoItem, TodoRepository } from './TodoRepository';
import path from 'path';

import sqlite3 from 'sqlite3';
import fs from 'fs';
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';

let db;

function init() {
    const dirName = path.dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise<void>((acc, rej) => {
        db = new sqlite3.Database(location, err => {
            if (err) return rej(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            db.run(
                'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
                (err) => {
                    if (err) return rej(err);
                    acc();
                },
            );
        });
    });
}

async function teardown() {
    return new Promise<void>((acc, rej) => {
        db.close(err => {
            if (err) rej(err);
            else acc();
        });
    });
}


async function getItems(): Promise<TodoItem[]> {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM todo_items', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map((item: Record<string, unknown>) =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                ) as TodoItem[],
            );
        });
    });
}

async function getItem(id: string): Promise<TodoItem | undefined> {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            const mapped = rows.map((item: Record<string, unknown>) =>
                Object.assign({}, item, {
                    completed: item.completed === 1,
                })
            ) as TodoItem[];
            acc(mapped[0]);
        });
    });
}

async function storeItem(item) {
    return new Promise<void>((acc, rej) => {
        db.run(
            'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise<void>((acc, rej) => {
        db.run(
            'UPDATE todo_items SET name=?, completed=? WHERE id = ?',
            [item.name, item.completed ? 1 : 0, id],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
} 

async function removeItem(id) {
    return new Promise<void>((acc, rej) => {
        db.run('DELETE FROM todo_items WHERE id = ?', [id], err => {
            if (err) return rej(err);
            acc();
        });
    });
}

const repository: TodoRepository = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};

export default repository;
