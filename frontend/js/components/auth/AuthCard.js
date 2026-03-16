function AuthCard({ initialTab, setToken, onAuthenticated, onBack }) {
    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');
    const [registerConsent, setRegisterConsent] = React.useState(false);
    const [registerMessage, setRegisterMessage] = React.useState('');

    const [loginEmail, setLoginEmail] = React.useState('');
    const [loginPassword, setLoginPassword] = React.useState('');
    const [loginMessage, setLoginMessage] = React.useState('');
    const [activeTab, setActiveTab] = React.useState(initialTab || 'login');

    React.useEffect(() => {
        setActiveTab(initialTab || 'login');
    }, [initialTab]);

    const register = async (e) => {
        e.preventDefault();
        setRegisterMessage('');
        try {
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: registerEmail,
                    password: registerPassword,
                    consent: registerConsent,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Erreur inscription');
            }
            setRegisterMessage('Compte cree avec succes.');
        } catch (err) {
            setRegisterMessage(err.message);
        }
    };

    const login = async (e) => {
        e.preventDefault();
        setLoginMessage('');
        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });
            const data = await res.json();
            if (!res.ok || !data.token) {
                throw new Error(data.error || 'Erreur connexion');
            }
            setToken(data.token);
            setLoginMessage('Connexion reussie.');
            if (onAuthenticated) onAuthenticated();
        } catch (err) {
            setLoginMessage(err.message);
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
                        className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Connexion
                    </button>
                    <button
                        type="button"
                        className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        Inscription
                    </button>
                </div>

                {activeTab === 'login' && (
                    <form id="login-form" onSubmit={login} className="mb-0">
                        <h5>Connexion</h5>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                className="form-control"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success btn-block">Se connecter</button>
                        {loginMessage && <div className="mt-2 text-info">{loginMessage}</div>}
                    </form>
                )}

                {activeTab === 'register' && (
                    <form id="register-form" onSubmit={register} className="mb-0">
                        <h5>Inscription</h5>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                className="form-control"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="consentCheck"
                                checked={registerConsent}
                                onChange={(e) => setRegisterConsent(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="consentCheck">
                                J&apos;accepte le traitement de mes donnees
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Creer mon compte</button>
                        {registerMessage && <div className="mt-2 text-info">{registerMessage}</div>}
                    </form>
                )}
            </div>
        </div>
    );
}
