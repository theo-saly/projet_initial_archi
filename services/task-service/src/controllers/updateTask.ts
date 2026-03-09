import db from '../persistence';

const VALID_STATUSES = ['à faire', 'en cours', 'terminé'];

export default async (req, res) => {
    const task = await db.getTask(req.params.id);
    if (!task) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    if (req.body.status && !VALID_STATUSES.includes(req.body.status)) {
        return res.status(400).json({
            error: `Status invalide. Valeurs autorisées : ${VALID_STATUSES.join(', ')}`,
        });
    }

    await db.updateTask(req.params.id, {
        title: req.body.title || task.title,
        description: req.body.description || task.description,
        status: req.body.status || task.status,
        echeance: req.body.echeance || task.echeance,
        projectId: req.body.projectId || task.projectId,
        updatedAt: new Date(),
    });

    const updated = await db.getTask(req.params.id);
    res.send(updated);
};
