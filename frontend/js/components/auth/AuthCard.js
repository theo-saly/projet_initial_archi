function AuthCard({ initialTab, setToken, onAuthenticated, onBack }) {
    const [tab, setTab] = React.useState(initialTab || 'login');
    
    const [login, setLogin] = React.useState({ email: '', password: '', message: '' });
    const [register, setRegister] = React.useState({ 
        email: '', 
        password: '', 
        consent: false, 
        message: '' 
    });

    const updateLogin = (field, value) => {
        setLogin(prev => ({ ...prev, [field]: value }));
    };

    const updateRegister = (field, value) => {
        setRegister(prev => ({ ...prev, [field]: value }));
    };

    // Soumission
    const handleLogin = async (e) => {
        e.preventDefault();
        setLogin(prev => ({ ...prev, message: '' }));
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: login.email, password: login.password }),
            });
            const data = await res.json();
            if (!res.ok || !data.token) {
                throw new Error(data.error || 'Erreur connexion');
            }
            setToken(data.token);
            setLogin(prev => ({ ...prev, message: 'Connexion reussie.' }));
            if (onAuthenticated) onAuthenticated();
        } catch (err) {
            setLogin(prev => ({ ...prev, message: err.message }));
        }
    };

    // Soumission 
    const handleRegister = async (e) => {
        e.preventDefault();
        setRegister(prev => ({ ...prev, message: '' }));
        try {
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: register.email,
                    password: register.password,
                    consent: register.consent,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Erreur inscription');
            }
            setRegister(prev => ({ ...prev, message: 'Compte cree avec succes.' }));
        } catch (err) {
            setRegister(prev => ({ ...prev, message: err.message }));
        }
    };

    return (
        <div className="card auth-page-card mt-3" id="auth-card">
            <div className="card-header">Connexion / Inscription</div>
            <div className="card-body">
                {onBack && (
                    <button type="button" className="btn btn-outline-secondary mb-3" onClick={onBack}>
                        Retour a l'accueil
                    </button>
                )}
                
                <div className="auth-tabs mb-3">
                    <button
                        type="button"
                        className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                        onClick={() => setTab('login')}
                    >
                        Connexion
                    </button>
                    <button
                        type="button"
                        className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
                        onClick={() => setTab('register')}
                    >
                        Inscription
                    </button>
                </div>

                {tab === 'login' && (
                    <form id="login-form" onSubmit={handleLogin} className="mb-0">
                        <h5>Connexion</h5>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={login.email}
                                onChange={(e) => updateLogin('email', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                className="form-control"
                                value={login.password}
                                onChange={(e) => updateLogin('password', e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success btn-block">Se connecter</button>
                        {login.message && <div className="mt-2 text-info">{login.message}</div>}
                    </form>
                )}

                {tab === 'register' && (
                    <form id="register-form" onSubmit={handleRegister} className="mb-0">
                        <h5>Inscription</h5>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={register.email}
                                onChange={(e) => updateRegister('email', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                className="form-control"
                                value={register.password}
                                onChange={(e) => updateRegister('password', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="consentCheck"
                                checked={register.consent}
                                onChange={(e) => updateRegister('consent', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="consentCheck">
                                J&apos;accepte le traitement de mes donnees
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Creer mon compte</button>
                        {register.message && <div className="mt-2 text-info">{register.message}</div>}
                    </form>
                )}
            </div>
        </div>
    );
}
