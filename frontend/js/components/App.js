function App() {
    const [token, setToken] = React.useState(() => localStorage.getItem('authToken') || '');
    const [path, setPath] = React.useState(() => normalizePath(window.location.pathname));
    const [message, setMessage] = React.useState('');

    // Nav
    const navigate = (newPath) => {
        const normalized = normalizePath(newPath);
        if (normalized === path) return;
        window.history.pushState({}, '', normalized);
        setPath(normalized);
    };

    //changements d'URL
    React.useEffect(() => {
        window.addEventListener('popstate', () => {
            setPath(normalizePath(window.location.pathname));
        });
    }, []);

    //localStorage
    React.useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }, [token]);

    // Redirection
    React.useEffect(() => {
        if (!token && path === '/dashboard') navigate('/login');
        if (token && (path === '/login' || path === '/sign')) navigate('/dashboard');
        if (!['/', '/login', '/sign', '/dashboard'].includes(path)) navigate('/');
    }, [token, path]);

    // Déco
    const logout = () => {
        setToken('');
        setMessage('Vous etes deconnecte.');
        navigate('/');
    };

    // Supprde compte
    const deleteAccount = async () => {
        setMessage('');
        try {
            const res = await fetch('/auth/profile', {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Erreur suppression compte');
            }
            setToken('');
            setMessage(data.message || 'Compte supprime.');
            navigate('/');
        } catch (err) {
            setMessage(err.message);
        }
    };

    //chemin
    const authTab = path === '/sign' ? 'register' : 'login';

    if (path === '/') {
        return <HomePage navigate={navigate} message={message} />;
    }

    if (path === '/login' || path === '/sign') {
        return <AuthPage authTab={authTab} setToken={setToken} navigate={navigate} />;
    }

    return (
        <DashboardPage
            token={token}
            message={message}
            logout={logout}
            deleteAccount={deleteAccount}
        />
    );
}
