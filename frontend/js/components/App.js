function App() {
    const [token, setToken] = React.useState(() => localStorage.getItem('authToken') || '');
    const [currentPath, setCurrentPath] = React.useState(() => normalizePath(window.location.pathname));
    const [accountMessage, setAccountMessage] = React.useState('');

    const navigate = React.useCallback((path) => {
        const normalized = normalizePath(path);
        if (normalized === currentPath) return;
        window.history.pushState({}, '', normalized);
        setCurrentPath(normalized);
    }, [currentPath]);

    React.useEffect(() => {
        const onPopState = () => setCurrentPath(normalizePath(window.location.pathname));
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    React.useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
            return;
        }
        localStorage.removeItem('authToken');
    }, [token]);

    React.useEffect(() => {
        if (!token && currentPath === '/dashboard') {
            navigate('/login');
            return;
        }
        if (token && (currentPath === '/login' || currentPath === '/sign')) {
            navigate('/dashboard');
            return;
        }
        if (!['/', '/login', '/sign', '/dashboard'].includes(currentPath)) {
            navigate('/');
        }
    }, [token, currentPath, navigate]);

    const logout = () => {
        setToken('');
        setAccountMessage('Vous etes deconnecte.');
        navigate('/');
    };

    const deleteAccount = async () => {
        setAccountMessage('');
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
            setAccountMessage(data.message || 'Compte supprime.');
            navigate('/');
        } catch (err) {
            setAccountMessage(err.message);
        }
    };

    const authTab = currentPath === '/sign' ? 'register' : 'login';

    if (currentPath === '/') {
        return <HomePage navigate={navigate} accountMessage={accountMessage} />;
    }

    if (currentPath === '/login' || currentPath === '/sign') {
        return <AuthPage authTab={authTab} setToken={setToken} navigate={navigate} />;
    }

    return (
        <DashboardPage
            token={token}
            accountMessage={accountMessage}
            logout={logout}
            deleteAccount={deleteAccount}
        />
    );
}
