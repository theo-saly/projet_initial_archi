function UserProfile() {
    const [token, setToken] = React.useState('');

    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');
    const [registerConsent, setRegisterConsent] = React.useState(false);
    const [registerMessage, setRegisterMessage] = React.useState('');

    const [loginEmail, setLoginEmail] = React.useState('');
    const [loginPassword, setLoginPassword] = React.useState('');
    const [loginMessage, setLoginMessage] = React.useState('');
    const login = async (e) => {
        e.preventDefault();
        setLoginMessage('');
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
        const data = await res.json();
        if (data.token) {
            setToken(data.token);
            setLoginMessage('Connexion réussie !');
        } else {
            setLoginMessage(data.error || 'Erreur de connexion');
        }
    };

    const deleteAccount = async () => {
        const res = await fetch('/auth/profile', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        alert(data.message);
        setToken('');
    };

    const register = async (e) => {
        e.preventDefault();
        setRegisterMessage('');
        const res = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: registerEmail, password: registerPassword, consent: registerConsent }),
        });
        const data = await res.json();
        if (data.error) {
            setRegisterMessage(data.error);
        } else {
            setRegisterMessage('Compte créé !');
        }
    };

    return (
        <div className="card mt-3">
            <div className="card-header">Profil utilisateur</div>
            <div className="card-body">
                <form onSubmit={register} className="mb-3">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input type="password" className="form-control" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} required />
                    </div>
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="consentCheck" checked={registerConsent} onChange={e => setRegisterConsent(e.target.checked)} />
                        <label className="form-check-label" htmlFor="consentCheck">J’accepte le traitement de mes données</label>
                    </div>
                    <button type="submit" className="btn btn-primary">Créer mon compte</button>
                    {registerMessage && <div className="mt-2 text-info">{registerMessage}</div>}
                </form>

                <form onSubmit={login} className="mb-3">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input type="password" className="form-control" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-success">Se connecter</button>
                    {loginMessage && <div className="mt-2 text-info">{loginMessage}</div>}
                </form>

                <input
                    type="text"
                    placeholder="Token JWT"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    className="form-control mb-2"
                />
                    {token && (
                        <div>
                            <button className="btn btn-danger" onClick={deleteAccount}>Supprimer mon compte</button>
                        </div>
                    )}
            </div>
        </div>
    );
}

function App() {
        const { Container, Row, Col } = ReactBootstrap;
        return (
                <Container>
                        <Row>
                                <Col md={{ offset: 3, span: 6 }}>
                                        <TodoListCard />
                                        <UserProfile />
                                </Col>
                        </Row>
                </Container>
        );
}
