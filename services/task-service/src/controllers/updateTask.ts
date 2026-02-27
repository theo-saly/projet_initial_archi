import db from '../persistence';

export default async (req, res) => {
    await db.updateTask(req.params.id, {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        echeance: req.body.echeance,
        projectId: req.body.projectId,
        updatedAt: new Date(),
    });
    const task = await db.getTask(req.params.id);
    res.send(task);
};
