function ProjectPage({
    token,
    projectId,
    navigate,
    busy,
    setBusy,
    pushMessage,
}) {
    // etat
    const userId = getUserIdFromToken(token);
    const [project, setProject] = React.useState(null);
    const [tasks, setTasks] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [projectForm, setProjectForm] = React.useState({
        name: '',
        description: '',
    });

    // load le projet
    const loadProject = React.useCallback(async () => {
        const response = await fetch(`/api/projects/${projectId}`, {
            headers: buildHeaders(token, false),
        });
        const payload = await parseApiResponse(response);

        // check si l'utilisateur accède  à son propre projet
        const userIdStr = String(userId).trim();
        const ownerIdStr = String(payload.ownerId).trim();

        if (userIdStr !== ownerIdStr && userIdStr !== 'null') {
            console.error('ACCÈS REFUSÉ:', userIdStr, '!==', ownerIdStr);
            throw new Error('Acces refuse: ce projet ne vous appartient pas');
        }

        setProject(payload);
        setProjectForm({
            name: payload.name || '',
            description: payload.description || '',
        });
        return payload;
    }, [token, projectId, userId]);

    // load taches du projet
    const loadTasks = React.useCallback(async () => {
        const response = await fetch(
            `/api/tasks/by-project?projectId=${encodeURIComponent(projectId)}`,
            {
                headers: buildHeaders(token, false),
            },
        );
        const payload = await parseApiResponse(response);
        setTasks(Array.isArray(payload) ? payload : []);
        return Array.isArray(payload) ? payload : [];
    }, [token, projectId]);

    // load init
    React.useEffect(() => {
        let mounted = true;
        const init = async () => {
            setLoading(true);
            try {
                await Promise.all([loadProject(), loadTasks()]);
            } catch (err) {
                if (mounted) {
                    pushMessage('danger', err.message);
                    navigate('/');
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        init();
        return () => {
            mounted = false;
        };
    }, [loadProject, loadTasks, pushMessage, navigate]);

    // update project
    const saveProject = async (event) => {
        event.preventDefault();
        if (!project) return;

        setBusy(true);
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: buildHeaders(token, true),
                body: JSON.stringify({
                    name: projectForm.name.trim() || project.name,
                    description:
                        projectForm.description.trim() || project.description,
                    status: project.status,
                    echeance: project.echeance || new Date().toISOString(),
                }),
            });
            await parseApiResponse(response);
            await loadProject();
            pushMessage('success', 'Le projet a bien été mis à jour.');
        } catch (err) {
            pushMessage('danger', err.message);
        } finally {
            setBusy(false);
        }
    };

    // update status projet
    const updateProjectStatus = async (nextStatus) => {
        if (!project) return;

        setBusy(true);
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: buildHeaders(token, true),
                body: JSON.stringify({
                    name: project.name,
                    description: project.description,
                    status: nextStatus,
                    echeance: project.echeance || new Date().toISOString(),
                }),
            });
            await parseApiResponse(response);
            await loadProject();
            pushMessage('success', `Le projet a bien été ${nextStatus}.`);
        } catch (err) {
            pushMessage('danger', err.message);
        } finally {
            setBusy(false);
        }
    };

    // creer tache
    const createTask = async (taskPayload) => {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: buildHeaders(token, true),
            body: JSON.stringify({
                title: taskPayload.title,
                description: taskPayload.description,
                status: taskPayload.status,
                projectId,
                echeance: new Date().toISOString(),
            }),
        });
        await parseApiResponse(response);
        return loadTasks();
    };

    // update tache
    const updateTask = async (taskId, updates) => {
        const sourceTask = tasks.find((item) => item.id === taskId);
        if (!sourceTask) {
            throw new Error('Tache introuvable');
        }

        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: buildHeaders(token, true),
            body: JSON.stringify({
                title: updates.title || sourceTask.title,
                description: updates.description || sourceTask.description,
                status: updates.status || sourceTask.status,
                projectId: sourceTask.projectId,
                echeance: sourceTask.echeance || new Date().toISOString(),
            }),
        });
        await parseApiResponse(response);
        return loadTasks();
    };

    // suppr tache
    const deleteTask = async (taskId) => {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: buildHeaders(token, false),
        });
        await parseApiResponse(response);
        return loadTasks();
    };

    if (loading) {
        return <p className="text-muted">Chargement du projet...</p>;
    }

    if (!project) {
        return <div className="alert alert-danger">Projet introuvable.</div>;
    }

    return (
        <div className="page-project-focus d-grid gap-4">
            <section className="card">
                <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span>Focus projet</span>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigate('/projects')}
                    >
                        Retour a la liste
                    </button>
                </div>
                <div className="card-body">
                    <form
                        onSubmit={saveProject}
                        className="row g-3 align-items-end"
                    >
                        <div className="col-12 col-md-4">
                            <label className="form-label">Nom</label>
                            <input
                                className="form-control"
                                value={projectForm.name}
                                onChange={(e) =>
                                    setProjectForm({
                                        ...projectForm,
                                        name: e.target.value,
                                    })
                                }
                                required
                                disabled={busy}
                            />
                        </div>
                        <div className="col-12 col-md-5">
                            <label className="form-label">Description</label>
                            <input
                                className="form-control"
                                value={projectForm.description}
                                onChange={(e) =>
                                    setProjectForm({
                                        ...projectForm,
                                        description: e.target.value,
                                    })
                                }
                                required
                                disabled={busy}
                            />
                        </div>
                        <div className="col-12 col-md-3 d-grid">
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={busy}
                            >
                                Enregistrer
                            </button>
                        </div>
                    </form>

                    <div className="d-flex flex-wrap gap-2 mt-3">
                        <span
                            className={`badge ${project.status === 'cloturé' ? 'text-bg-success' : 'text-bg-secondary'} fs-6`}
                        >
                            {project.status}
                        </span>
                        <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            disabled={busy || project.status === 'cloturé'}
                            onClick={() => updateProjectStatus('cloturé')}
                        >
                            Cloturer le projet
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            disabled={busy || project.status === 'ouvert'}
                            onClick={() => updateProjectStatus('ouvert')}
                        >
                            Reouvrir le projet
                        </button>
                    </div>
                </div>
            </section>

            <TodoListCard
                tasks={tasks}
                busy={busy}
                setBusy={setBusy}
                isProjectClosed={project.status === 'cloturé'}
                createTask={createTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
                pushMessage={pushMessage}
            />
        </div>
    );
}
