import type { TodoItem, TodoRepository } from './TodoRepository';

let items: TodoItem[] = [];

async function init(): Promise<void> {
    items = [];
}

async function teardown(): Promise<void> {
    items = [];
}

async function getItems(): Promise<TodoItem[]> {
    return items.map((item) => ({ ...item }));
}

async function getItem(id: string): Promise<TodoItem | undefined> {
    const item = items.find((i) => i.id === id);
    return item ? { ...item } : undefined;
}

async function storeItem(item: TodoItem): Promise<void> {
    items.push({ ...item });
}

async function updateItem(id: string, item: TodoItem): Promise<void> {
    const index = items.findIndex((i) => i.id === id);
    if (index !== -1) {
        items[index] = { ...item, id };
    }
}

async function removeItem(id: string): Promise<void> {
    items = items.filter((i) => i.id !== id);
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
