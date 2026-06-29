import { Router } from 'express';
import {
    createUserV2,
    authenticateUser,
    deleteUser,
    getUserByIdV2,
} from '../persistence/user';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: number;
    email: string;
}

const router = Router();

router.post('/register', (req, res) => {
    const { email, password, consent, birthDate } = req.body;
    if (!email || !password || consent === undefined || !birthDate) {
        return res.status(400).json({
            error: 'Champs manquants (email, password, consent, birthDate)',
        });
    }
    const consentBool =
        consent === true ||
        consent === 'true' ||
        consent === 1 ||
        consent === '1';
    const user = createUserV2(email, password, consentBool, birthDate);
    if (!user) {
        return res
            .status(409)
            .json({ error: 'Un compte avec cet email existe déjà' });
    }
    res.status(201).json({
        id: user.id,
        email: user.email,
        consent: user.consent,
        birthDate: user.birthDate,
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const token = authenticateUser(email, password);
    if (!token) {
        return res
            .status(401)
            .json({ error: 'Identifiants invalides ou consentement manquant' });
    }
    res.json({ token });
});

router.delete('/profile', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token manquant' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'SECRET_KEY',
        ) as TokenPayload;
        const success = deleteUser(decoded.id);
        if (!success)
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json({ message: 'Votre compte a bien été supprimé.' });
    } catch {
        res.status(401).json({ error: 'Token invalide' });
    }
});

router.get('/users/:id', (req, res) => {
    const userId = Number(req.params.id);
    if (!Number.isFinite(userId)) {
        return res
            .status(400)
            .json({ error: 'Identifiant utilisateur invalide' });
    }
    const user = getUserByIdV2(userId);
    if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouve' });
    }
    return res.json(user);
});

export default router;
