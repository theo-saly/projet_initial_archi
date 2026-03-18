function AuthPage({ authTab, setToken, navigate }) {
    return (
        <div className="app-shell page-auth px-0" style={{ minHeight: '100vh' }}>
            <section className="fullscreen-page auth-page d-flex align-items-center justify-content-center">
                <div style={{ maxWidth: '500px', width: '100%' }} className="px-4">
                    <AuthCard
                        initialTab={authTab}
                        setToken={setToken}
                        onAuthenticated={() => navigate('/dashboard')}
                        onBack={() => navigate('/')}
                    />
                </div>
            </section>
        </div>
    );
}
