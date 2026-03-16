function TodoListCard({ token }) {
    const API_PROJECT = '';
    const API_TASK = '';
    const OWNER_ID = 'default';

    const [projects, setProjects] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const [selectedProjectId, setSelectedProjectId] = React.useState('');
    const [projectName, setProjectName] = React.useState('');
    const [projectDescription, setProjectDescription] = React.useState('');
    const [taskTitle, setTaskTitle] = React.useState('');
    const [taskDescription, setTaskDescription] = React.useState('');
    const [taskSearch, setTaskSearch] = React.useState('');
    const [taskFilter, setTaskFilter] = React.useState('all');
    const [feedback, setFeedback] = React.useState('');
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    const authHeaders = React.useCallback(
        (base = {}) =>
            token
                ? {
                    ...base,
                    Authorization: `Bearer ${token}`,
                }
                : base,
        [token],
    );

    const selectedProject = projects.find((project) => project.id === selectedProjectId);
    const completedTasks = tasks.filter((task) => task.status === 'terminé').length;
    const todoTasks = tasks.length - completedTasks;
    const progress = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

    const filteredTasks = tasks.filter((task) => {
        const searchMatch = task.title.toLowerCase().includes(taskSearch.toLowerCase());
        if (!searchMatch) return false;
        if (taskFilter === 'done') return task.status === 'terminé';
        if (taskFilter === 'todo') return task.status !== 'terminé';
        return true;
    });

    const parseResponse = async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || 'Erreur API');
        }
        return data;
    };

    const loadProjects = React.useCallback(async () => {
        const response = await fetch(`${API_PROJECT}/projects?ownerId=${OWNER_ID}`, {
            headers: authHeaders(),
        });
        const data = await parseResponse(response);
        setProjects(Array.isArray(data) ? data : []);
        return Array.isArray(data) ? data : [];
    }, [authHeaders]);

    const loadTasks = React.useCallback(async (projectId) => {
        if (!projectId) {
            setTasks([]);
            return;
        }
        const response = await fetch(`${API_TASK}/tasks/by-project?projectId=${projectId}`, {
            headers: authHeaders(),
        });
        const data = await parseResponse(response);
        setTasks(Array.isArray(data) ? data : []);
    }, [authHeaders]);

    React.useEffect(() => {
        const bootstrap = async () => {
            if (!token) {
                setProjects([]);
                setTasks([]);
                setSelectedProjectId('');
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const loadedProjects = await loadProjects();
                if (loadedProjects.length > 0) {
                    setSelectedProjectId(loadedProjects[0].id);
                    await loadTasks(loadedProjects[0].id);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
    }, [token, loadProjects, loadTasks]);

    const createProject = async (e) => {
        e.preventDefault();
        setError('');
        setFeedback('');
        try {
            const response = await fetch(`${API_PROJECT}/projects`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    name: projectName,
                    description: projectDescription,
                    status: 'à faire',
                    ownerId: OWNER_ID,
                    echeance: new Date().toISOString(),
                }),
            });
            const project = await parseResponse(response);

            const refreshed = await loadProjects();
            setSelectedProjectId(project.id);
            await loadTasks(project.id);
            if (refreshed.some((p) => p.id === project.id)) {
                setFeedback('Projet créé avec succès.');
            }

            setProjectName('');
            setProjectDescription('');
        } catch (err) {
            setError(err.message);
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        if (!selectedProjectId) return;
        setError('');
        setFeedback('');
        try {
            const response = await fetch(`${API_TASK}/tasks`, {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    title: taskTitle,
                    description: taskDescription,
                    status: 'à faire',
                    projectId: selectedProjectId,
                    echeance: new Date().toISOString(),
                }),
            });
            await parseResponse(response);
            await loadTasks(selectedProjectId);
            setTaskTitle('');
            setTaskDescription('');
            setFeedback('Tâche créée et associée au projet.');
        } catch (err) {
            setError(err.message);
        }
    };

    const markTaskDone = async (task) => {
        setError('');
        setFeedback('');
        try {
            const nextStatus = task.status === 'terminé' ? 'à faire' : 'terminé';
            const response = await fetch(`${API_TASK}/tasks/${task.id}`, {
                method: 'PUT',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    status: nextStatus,
                    projectId: task.projectId,
                    echeance: task.echeance,
                }),
            });
            await parseResponse(response);
            await loadTasks(selectedProjectId);
            setFeedback(nextStatus === 'terminé' ? 'Tâche marquée comme terminée.' : 'Tâche réouverte.');
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteTask = async (taskId) => {
        setError('');
        setFeedback('');
        try {
            const response = await fetch(`${API_TASK}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: authHeaders(),
            });
            await parseResponse(response);
            await loadTasks(selectedProjectId);
            setFeedback('Tâche supprimée.');
        } catch (err) {
            setError(err.message);
        }
    };

    const closeProject = async () => {
        if (!selectedProject) return;
        setError('');
        setFeedback('');
        try {
            const response = await fetch(`${API_PROJECT}/projects/${selectedProject.id}`, {
                method: 'PUT',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    name: selectedProject.name,
                    description: selectedProject.description,
                    status: 'terminé',
                    echeance: selectedProject.echeance,
                }),
            });
            await parseResponse(response);
            await loadProjects();
            setFeedback('Projet clôturé. Vérifiez les logs de notification.');
        } catch (err) {
            setError(err.message);
        }
    };

    const onProjectChange = async (event) => {
        const nextProjectId = event.target.value;
        setSelectedProjectId(nextProjectId);
        setError('');
        setFeedback('');
        try {
            await loadTasks(nextProjectId);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!token) {
        return (
            <div className="card mt-4" id="workflow-auth-required">
                <div className="card-header">Todo workspace</div>
                <div className="card-body">
                    <div className="alert alert-warning mb-0">
                        Connectez-vous pour gerer vos projets et vos taches.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card mt-4 todo-workspace-card">
            <div className="card-header">Todo workspace</div>
            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {feedback && <div className="alert alert-success">{feedback}</div>}

                <div className="todo-workspace-layout">
                    <aside className="project-panel">
                        <h5 className="mb-3">Projets</h5>
                        <form onSubmit={createProject} className="mb-3" id="project-form">
                            <div className="form-group mb-2">
                                <label>Nom du projet</label>
                                <input
                                    className="form-control"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    placeholder="Ex: Refonte portail client"
                                    required
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label>Description</label>
                                <input
                                    className="form-control"
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    placeholder="Objectif du projet"
                                    required
                                />
                            </div>
                            <button className="btn btn-primary btn-block" type="submit">Nouveau projet</button>
                        </form>

                        <div className="mb-2" id="project-selector">
                            <select
                                className="form-control"
                                value={selectedProjectId}
                                onChange={onProjectChange}
                            >
                                <option value="">Selectionner un projet</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name} ({project.status})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="project-list">
                            {projects.length === 0 && (
                                <p className="text-muted mb-0">Aucun projet pour le moment.</p>
                            )}
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    type="button"
                                    className={`project-list-item ${project.id === selectedProjectId ? 'active' : ''}`}
                                    onClick={() => onProjectChange({ target: { value: project.id } })}
                                >
                                    <span className="project-list-item-title">{project.name}</span>
                                    <span className="project-list-item-status">{project.status}</span>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <section className="task-panel">
                        <div className="task-panel-header">
                            <div>
                                <h5 className="mb-1">{selectedProject ? selectedProject.name : 'Selectionnez un projet'}</h5>
                                <p className="text-muted mb-0">
                                    {selectedProject
                                        ? selectedProject.description || 'Aucune description'
                                        : 'Ajoutez un projet pour commencer.'}
                                </p>
                            </div>
                            <div id="close-project">
                                <button
                                    className="btn btn-dark"
                                    onClick={closeProject}
                                    disabled={!selectedProjectId || tasks.length === 0}
                                >
                                    Cloturer le projet
                                </button>
                            </div>
                        </div>

                        <div className="progress-strip mb-3">
                            <div className="progress-strip-labels">
                                <span>{todoTasks} a faire</span>
                                <span>{completedTasks} terminees</span>
                            </div>
                            <div className="progress-strip-track">
                                <div className="progress-strip-fill" style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        <form onSubmit={createTask} className="mb-3" id="task-form">
                            <div className="task-form-grid">
                                <div className="form-group mb-0">
                                    <label>Titre de la tache</label>
                                    <input
                                        className="form-control"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        placeholder="Ex: Designer la page d'accueil"
                                        required
                                        disabled={!selectedProjectId}
                                    />
                                </div>
                                <div className="form-group mb-0">
                                    <label>Description</label>
                                    <input
                                        className="form-control"
                                        value={taskDescription}
                                        onChange={(e) => setTaskDescription(e.target.value)}
                                        placeholder="Details de la tache"
                                        required
                                        disabled={!selectedProjectId}
                                    />
                                </div>
                                <button className="btn btn-success task-submit" type="submit" disabled={!selectedProjectId}>
                                    Ajouter
                                </button>
                            </div>
                        </form>

                        <div className="task-toolbar mb-3">
                            <input
                                className="form-control"
                                value={taskSearch}
                                onChange={(e) => setTaskSearch(e.target.value)}
                                placeholder="Rechercher une tache"
                            />
                            <div className="task-filters">
                                <button
                                    type="button"
                                    className={`filter-chip ${taskFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setTaskFilter('all')}
                                >
                                    Toutes
                                </button>
                                <button
                                    type="button"
                                    className={`filter-chip ${taskFilter === 'todo' ? 'active' : ''}`}
                                    onClick={() => setTaskFilter('todo')}
                                >
                                    A faire
                                </button>
                                <button
                                    type="button"
                                    className={`filter-chip ${taskFilter === 'done' ? 'active' : ''}`}
                                    onClick={() => setTaskFilter('done')}
                                >
                                    Terminees
                                </button>
                            </div>
                        </div>

                        <div id="task-list">
                            {tasks.length === 0 && (
                                <div className="empty-state">
                                    <p className="mb-1">Aucune tache pour ce projet.</p>
                                    <p className="text-muted mb-0">Ajoutez votre premiere tache pour lancer le sprint.</p>
                                </div>
                            )}

                            {tasks.length > 0 && filteredTasks.length === 0 && (
                                <div className="empty-state">
                                    <p className="mb-0">Aucune tache ne correspond aux filtres actifs.</p>
                                </div>
                            )}

                            {filteredTasks.map((task) => (
                                <div key={task.id} className="item">
                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                        <div>
                                            <strong>{task.title}</strong>
                                            <div className="text-muted">Statut: {task.status}</div>
                                        </div>
                                        <div className="task-actions">
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => markTaskDone(task)}
                                            >
                                                {task.status === 'terminé' ? 'Reouvrir' : 'Terminer'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteTask(task.id)}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
