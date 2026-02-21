import { Router } from 'express';
import { createUser, authenticateUser, getUserProfile, deleteUser } from '../persistence/user';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', (req, res) => {
  const { email, password, consent } = req.body;
  if (!email || !password || consent === undefined) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  const consentBool = consent === true || consent === 'true' || consent === 1 || consent === '1';
  const user = createUser(email, password, consentBool);
  res.status(201).json({ id: user.id, email: user.email, consent: user.consent });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const token = authenticateUser(email, password);
  if (!token) {
    return res.status(401).json({ error: 'Identifiants invalides ou consentement manquant' });
  }
  res.json({ token });
});

router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, 'SECRET_KEY');
    const profile = getUserProfile(decoded.id);
    if (!profile) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(profile);
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
});

router.delete('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, 'SECRET_KEY');
    const success = deleteUser(decoded.id);
    if (!success) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Compte supprimé (droit à l’oubli)' });
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
});

export default router;
