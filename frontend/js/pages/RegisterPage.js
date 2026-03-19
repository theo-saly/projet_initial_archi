function RegisterPage({ busy, message, onRegister, goToLogin }) {
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        consent: false,
    });

    // submit register
    const handleSubmit = async (event) => {
        event.preventDefault();
        await onRegister({
            email: formData.email.trim(),
            password: formData.password,
            consent: formData.consent,
        });
    };

    return (
        <section className="auth-screen">
            <div className="auth-visual">
                <img
                    src="images/auth-side.svg"
                    alt="Kanban"
                    className="auth-visual-image"
                />
                <div className="auth-visual-overlay">
                    <span className="badge text-bg-light border mb-3">
                        Kanban Workspace
                    </span>
                    <h1 className="display-6 fw-bold mb-3">
                        Creez votre espace projet
                    </h1>
                    <p className="mb-0">
                        Inscrivez-vous pour gerer vos projets, vos equipes et
                        vos taches au meme endroit.
                    </p>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-form-wrap">
                    {message && message.text && (
                        <div
                            className={`alert alert-${message.type === 'danger' ? 'danger' : 'success'} mb-3`}
                            role="alert"
                        >
                            {message.text}
                        </div>
                    )}

                    <div
                        className="card auth-page-card auth-form-card"
                        id="auth-card"
                    >
                        <div className="card-header">Creer un compte</div>
                        <div className="card-body">
                            <form
                                id="register-form"
                                onSubmit={handleSubmit}
                                className="mb-0"
                            >
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                        required
                                        disabled={busy}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password: e.target.value,
                                            })
                                        }
                                        required
                                        disabled={busy}
                                    />
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="consentCheck"
                                        checked={formData.consent}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                consent: e.target.checked,
                                            })
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="consentCheck"
                                    >
                                        J'accepte le traitement de mes donnees
                                    </label>
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={busy}
                                    >
                                        Creer mon compte
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={goToLogin}
                                        disabled={busy}
                                    >
                                        J'ai deja un compte
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
