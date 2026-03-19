function TodoListCard({ tasks, busy, setBusy, isProjectClosed, createTask, updateTask, deleteTask, pushMessage }) {
    // Status
    const STATUS_VALUES = ['à faire', 'en cours', 'terminé'];

    // ÉTAT
    const [taskForm, setTaskForm] = React.useState({
        title: '',
        description: '',
        status: 'à faire',
    });

    // Bar
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const completeCount = safeTasks.filter((task) => task.status === 'terminé').length;
    const progress = safeTasks.length ? Math.round((completeCount / safeTasks.length) * 100) : 0;

    // Creer une tache
    const onCreateTask = async (event) => {
        event.preventDefault();
        if (isProjectClosed) {
            pushMessage('danger', 'Projet clôturé: impossible d\'ajouter une nouvelle tache.');
            return;
        }

        if (!taskForm.title.trim() || !taskForm.description.trim()) {
            pushMessage('danger', 'Titre et description de la tache sont requis.');
            return;
        }

        setBusy(true);
        try {
            await createTask({
                title: taskForm.title.trim(),
                description: taskForm.description.trim(),
                status: taskForm.status,
            });
            setTaskForm({ title: '', description: '', status: 'à faire' });
            pushMessage('success', 'Tache creee.');
        } catch (err) {
            pushMessage('danger', err.message);
        } finally {
            setBusy(false);
        }
    };

    // tache terminer / reouvrir
    const onToggleStatus = async (task) => {
        const nextStatus = task.status === 'terminé' ? 'en cours' : 'terminé';
        setBusy(true);
        try {
            await updateTask(task.id, { status: nextStatus });
            pushMessage('success', `Tache mise a jour: ${nextStatus}.`);
        } catch (err) {
            pushMessage('danger', err.message);
        } finally {
            setBusy(false);
        }
    };

    // suppr tache
    const onDeleteTask = async (taskId) => {
        setBusy(true);
        try {
            await deleteTask(taskId);
            pushMessage('success', 'Tache supprimee.');
        } catch (err) {
            pushMessage('danger', err.message);
        } finally {
            setBusy(false);
        }
    };

    // change status via select
    const onStatusSelect = async (task, nextStatus) => {
        setBusy(true);
        try {
            await updateTask(task.id, { status: nextStatus });
            pushMessage('success', 'Statut de la tache mis a jour.');
        } catch (err) {
            pushMessage('danger', err.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <section className="card">
            <div className="card-header">Taches du projet</div>
            <div className="card-body">
                <div className="progress mb-4" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
                    <div className="progress-bar bg-success" style={{ width: `${progress}%` }}>
                        {progress}%
                    </div>
                </div>

                {isProjectClosed && (
                    <div className="alert alert-warning" role="alert">
                        Ce projet est clôturé: vous ne pouvez plus ajouter de nouvelles taches.
                    </div>
                )}

                <form onSubmit={onCreateTask} className="row g-3 mb-4" id="task-form">
                    <div className="col-12 col-md-4">
                        <label className="form-label">Titre</label>
                        <input
                            className="form-control"
                            value={taskForm.title}
                            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                            disabled={isProjectClosed || busy}
                            required
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <label className="form-label">Description</label>
                        <input
                            className="form-control"
                            value={taskForm.description}
                            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                            disabled={isProjectClosed || busy}
                            required
                        />
                    </div>
                    <div className="col-12 col-md-2">
                        <label className="form-label">Statut</label>
                        <select
                            className="form-select"
                            value={taskForm.status}
                            onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                            disabled={isProjectClosed || busy}
                        >
                            {STATUS_VALUES.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-2 d-grid">
                        <label className="form-label d-none d-md-block">&nbsp;</label>
                        <button className="btn btn-primary" type="submit" disabled={busy || isProjectClosed}>
                            Ajouter
                        </button>
                    </div>
                </form>

                {safeTasks.length === 0 && <p className="text-muted mb-0">Aucune tache pour ce projet.</p>}

                {safeTasks.length > 0 && (
                    <div className="d-grid gap-3">
                        {safeTasks.map((task) => (
                            <article key={task.id} className="task-item p-3 p-md-4">
                                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                                    <div>
                                        <h3 className="h6 mb-1">{task.title}</h3>
                                        <p className="text-muted mb-2">{task.description || 'Sans description'}</p>
                                        <span className={`badge ${task.status === 'terminé' ? 'text-bg-success' : task.status === 'en cours' ? 'text-bg-warning' : 'text-bg-secondary'}`}>
                                            {task.status}
                                        </span>
                                    </div>

                                    <div className="d-flex gap-2 flex-wrap">
                                        <select
                                            className="form-select form-select-sm"
                                            value={task.status}
                                            onChange={(e) => onStatusSelect(task, e.target.value)}
                                            disabled={busy}
                                            title="Changer le statut"
                                        >
                                            {STATUS_VALUES.map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() => onToggleStatus(task)}
                                            disabled={busy}
                                        >
                                            {task.status === 'terminé' ? 'Reouvrir' : 'Terminer'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => onDeleteTask(task.id)}
                                            disabled={busy}
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
