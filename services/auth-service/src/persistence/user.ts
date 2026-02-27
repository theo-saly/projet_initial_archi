import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface User {
    id: number;
    email: string;
    password: string;
    consent: boolean;
}

const users: User[] = [];

export function createUser(
    email: string,
    password: string,
    consent: boolean,
): User {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user: User = {
        id: users.length + 1,
        email,
        password: hashedPassword,
        consent,
    };
    users.push(user);
    return user;
}

export function authenticateUser(
    email: string,
    password: string,
): string | null {
    const user = users.find((u) => u.email === email);
    if (!user) return null;
    if (!bcrypt.compareSync(password, user.password)) return null;
    if (!user.consent) return null;
    return jwt.sign({ id: user.id, email: user.email }, 'SECRET_KEY', {
        expiresIn: '1h',
    });
}

export function deleteUser(id: number): boolean {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
}
