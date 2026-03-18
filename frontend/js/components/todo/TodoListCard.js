function TodoListCard({ token }) {
    const OWNER_ID = 'default';

    const [projects, setProjects] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const [selectedProjectId, setSelectedProjectId] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [messages, setMessages] = React.useState({ error: '', feedback: '' });

    const [projectForm, setProjectForm] = React.useState({ name: '', description: '' });
    const [taskForm, setTaskForm] = React.useState({ title: '', description: '' });

    const getHeaders = (includeJson = false) => {
        const headers = includeJson ? { 'Content-Type': 'application/json' } : {};
        if (token) headers.Authorization = `Bearer ${token}`;
        return headers;
    };

    const selectedProject = projects.find(p => p.id === selectedProjectId);
    const completedCount = tasks.filter(t => t.status === 'terminé').length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    const parseResponse = async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Erreur API');
        return data;
    };

    const loadProjects = async () => {
        try {
            const res = await fetch(`/projects?ownerId=${OWNER_ID}`, { headers: getHeaders() });
            const data = await parseResponse(res);
            setProjects(Array.isArray(data) ? data : []);
            return Array.isArray(data) ? data : [];
        } catch (err) {
            setMessages({ error: err.message, feedback: '' });
            return [];
        }
    };

    const loadTasks = async (projectId) => {
        if (!projectId) {
            setTasks([]);
            return;
        }
        try {
            const res = await fetch(`/tasks/by-project?projectId=${projectId}`, { headers: getHeaders() });
            const data = await parseResponse(res);
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            setMessages({ error: err.message, feedback: '' });
        }
    };

    React.useEffect(() => {
        const init = async () => {
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
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [token]);

    // Créer un projet
    const handleCreateProject = async (e) => {
        e.preventDefault();
        setMessages({ error: '', feedback: '' });

        try {
            const res = await fetch('/projects', {
                method: 'POST',
                headers: getHeaders(true),
                body: JSON.stringify({
                    name: projectForm.name,
                    description: projectForm.description,
                    status: 'à faire',
                    ownerId: OWNER_ID,
                    echeance: new Date().toISOString(),
                }),
            });

            const newProject = await parseResponse(res);
            await loadProjects();
            setSelectedProjectId(newProject.id);
            await loadTasks(newProject.id);
            setProjectForm({ name: '', description: '' });
            setMessages({ error: '', feedback: 'Projet créé avec succès.' });
        } catch (err) {
            setMessages({ error: err.message, feedback: '' });
        }
    };

    // Créer une tâche
    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!selectedProjectId) return;
        
        setMessages({ error: '', feedback: '' });

        try {
            const res = await fetch('/tasks', {
                method: 'POST',
                headers: getHeaders(true),
                body: JSON.stringify({
                    title: taskForm.title,
                    description: taskForm.description,
                    status: 'à faire',
                    projectId: selectedProjectId,
                    echeance: new Date().toISOString(),
                }),
            });

            await parseResponse(res);
            await loadTasks(selectedProjectId);
            setTaskForm({ title: '', description: '' });
            setMessages({ error: '', feedback: 'Tâche créée avec succès.' });
        } catch (err) {
            setMessages({ error: err.message, feedback: '' });
        }
    };

    // Marquer comme terminée/à faire
    const handleToggleTaskStatus = async (task) => {
        setMessages({ error: '', feedback: '' });

        try {
            const nextStatus = task.status === 'terminé' ? 'à faire' : 'terminé';
            const res = await fetch(`/tasks/${task.id}`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    status: nextStatus,
                    projectId: task.projectId,
                    echeance: task.echeance,
                }),
            });

            await parseResponse(res);
            await loadTasks(selectedProjectId);
            const msg = nextStatus === 'terminé' ? 'Tâche terminée.' : 'Tâche réouverte.';
            setMessages({ error: '', feedback: msg });
        } catch (err) {
            setMessages({ error: err.message, feedback: '' });
        }
    };

    // Suppr une tâche
    const handleDeleteTask = async (taskId) => {
        setMessages({ error: '', feedback: '' });

        try {
            const res = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });

            await parseResponse(res);
            await loadTasks(selectedProjectId);
            setMessages({ error: '', feedback: 'Tâche supprimée.' });
        } catch (err) {
            setMessages({ error: err.message, feedback: '' });
        }
    };

    // Cloture un projet
    const handleCloseProject = async () => {
        if (!selectedProject) return;
        setMessages({ error: '', feedback: '' });

        try {
            const res = await fetch(`/projects/${selectedProject.id}`, {
                method: 'PUT',
                headers: getHeaders(true),
                body: JSON.stringify({
                    name: selectedProject.name,
                    description: selectedProject.description,
                    status: 'terminé',
                    echeance: selectedProject.echeance,
                }),
            });

            await parseResponse(res);
            await loadProjects();
            setMessages({ error: '', feedback: 'Projet clôturé.' });
        } catch (err) {
            setMessages({ error: err.message, feedback: '' });
        }
    };

    // Changer de projet
    const handleSelectProject = async (projectId) => {
        setSelectedProjectId(projectId);
        setMessages({ error: '', feedback: '' });
        await loadTasks(projectId);
    };

    // chargement
    if (loading) return <p>Chargement...</p>;

    // si non authentifié
    if (!token) {
        return (
            <div className="card mt-4" id="workflow-auth-required">
                <div className="card-header">Tableau de bord</div>
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
            <div className="card-header">Tableau de bord</div>
            <div className="card-body">
                {messages.error && <div className="alert alert-danger">{messages.error}</div>}
                {messages.feedback && <div className="alert alert-success">{messages.feedback}</div>}

                <div className="todo-workspace-layout">
                    <aside className="project-panel">
                        <h5 className="mb-3">Projets</h5>

                        <form onSubmit={handleCreateProject} className="mb-3" id="project-form">
                            <div className="form-group mb-2">
                                <label>Nom du projet</label>
                                <input
                                    className="form-control"
                                    value={projectForm.name}
                                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group mb-2">
                                <label>Description</label>
                                <input
                                    className="form-control"
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <button className="btn btn-primary btn-block" type="submit">Nouveau projet</button>
                        </form>

                        <div className="project-list">
                            {projects.length === 0 && (
                                <p className="text-muted mb-0">Aucun projet pour le moment.</p>
                            )}
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    type="button"
                                    className={`project-list-item ${project.id === selectedProjectId ? 'active' : ''}`}
                                    onClick={() => handleSelectProject(project.id)}
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
                                    onClick={handleCloseProject}
                                    disabled={!selectedProjectId || tasks.length === 0}
                                >
                                    Cloturer le projet
                                </button>
                            </div>
                        </div>

                        <div className="progress-strip mb-3">
                            <div className="progress-strip-track">
                                <div className="progress-strip-fill" style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        <form onSubmit={handleCreateTask} className="mb-3" id="task-form">
                            <div className="task-form-grid">
                                <div className="form-group mb-0">
                                    <label>Titre de la tache</label>
                                    <input
                                        className="form-control"
                                        value={taskForm.title}
                                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                        required
                                        disabled={!selectedProjectId}
                                    />
                                </div>
                                <div className="form-group mb-0">
                                    <label>Description</label>
                                    <input
                                        className="form-control"
                                        value={taskForm.description}
                                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                        required
                                        disabled={!selectedProjectId}
                                    />
                                </div>
                                <button className="btn btn-success task-submit" type="submit" disabled={!selectedProjectId}>
                                    Ajouter
                                </button>
                            </div>
                        </form>

                        <div id="task-list">
                            {tasks.length === 0 && (
                                <div className="empty-state">
                                    <p className="mb-1">Aucune tache pour ce projet.</p>
                                    <p className="text-muted mb-0">Ajoutez votre premiere tache pour lancer le sprint.</p>
                                </div>
                            )}

                            {tasks.map((task) => (
                                <div key={task.id} className="item">
                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                        <div>
                                            <strong>{task.title}</strong>
                                            <div className="text-muted">Statut: {task.status}</div>
                                        </div>
                                        <div className="task-actions">
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => handleToggleTaskStatus(task)}
                                            >
                                                {task.status === 'terminé' ? 'Reouvrir' : 'Terminer'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDeleteTask(task.id)}
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
