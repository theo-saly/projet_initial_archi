function AuthCard({ mode, busy, onLogin, onRegister, goToRegister, goToLogin }) {
    const [formData, setFormData] = React.useState(
        mode === 'register'
            ? { email: '', password: '', consent: false }
            : { email: '', password: '' }
    );

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // login
    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        await onLogin({
            email: formData.email.trim(),
            password: formData.password
        });
    };

    // register
    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        await onRegister({
            email: formData.email.trim(),
            password: formData.password,
            consent: formData.consent,
        });
    };

    return (
        <div className="card auth-page-card auth-form-card" id="auth-card">
            <div className="card-header">
                {mode === 'register' ? 'Creer un compte' : 'Connexion'}
            </div>
            <div className="card-body">
                {mode === 'login' && (
                    <form id="login-form" onSubmit={handleLoginSubmit} className="mb-0">
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mot de passe</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                required
                            />
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary" disabled={busy}>
                                Se connecter
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={goToRegister}
                                disabled={busy}
                            >
                                Creer un compte
                            </button>
                        </div>
                    </form>
                )}

                {mode === 'register' && (
                    <form id="register-form" onSubmit={handleRegisterSubmit} className="mb-0">
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mot de passe</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="consentCheck"
                                checked={formData.consent}
                                onChange={(e) => handleChange('consent', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="consentCheck">
                                J'accepte le traitement de mes donnees
                            </label>
                        </div>

                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary" disabled={busy}>
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
                )}
            </div>
        </div>
    );
}
