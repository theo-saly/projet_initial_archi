function HomePage({ navigate, message }) {
    return (
        <div className="app-shell min-vh-100 d-flex flex-column px-4 px-lg-5 py-4">
            <div className="d-flex justify-content-between align-items-center pb-3 mb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                    <div className="home-logo-mark">F</div>
                    <span className="fw-bold fs-5">Flowboard</span>
                </div>
                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/sign')}>
                        Inscription
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
                        Connexion
                    </button>
                </div>
            </div>

            <div className="d-flex gap-5 py-4 flex-grow-1">

                <div style={{ flex: 1 }} className="d-flex flex-column gap-3">
                    <div>
                        <div className="badge bg-success text-white fw-bold text-uppercase mb-2" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                            Par Saly Théo &amp; Inacio Rodrigues
                        </div>
                        <h1 className="fw-bold" style={{ fontSize: '3rem', color: '#0b2239' }}>
                            Pilotez vos tâches comme une vraie équipe produit
                        </h1>
                        <p className="lead text-secondary mt-3">
                            Centralisez vos projets, priorisez ce qui compte et suivez
                            l&apos;exécution en temps réel avec un tableau de bord clair.
                        </p>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                        <button
                            id="landing-cta"
                            type="button"
                            className="btn btn-primary btn-lg px-4"
                            onClick={() => navigate('/login')}
                        >
                            Commencer maintenant
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-lg px-4"
                            onClick={() => navigate('/sign')}
                        >
                            Créer un compte
                        </button>
                    </div>

                    {message && <div className="alert alert-success mb-0">{message}</div>}
                </div>

                <div style={{ flex: 1 }} className="card shadow-lg" style={{ borderRadius: '18px', background: 'linear-gradient(160deg,#fff,#f0f7ff)' }}>
                    <div className="card-body p-4">
                        <div className="mb-3">
                            <div className="badge bg-secondary text-uppercase fw-bold" style={{ letterSpacing: '0.08em', fontSize: '0.7rem' }}>
                                Aperçu du dashboard
                            </div>
                        </div>

                        <div className="progress mb-3" style={{ height: '8px' }}>
                            <div className="progress-bar bg-success" style={{ width: '66%' }} />
                        </div>

                        <div className="d-flex flex-column gap-2">
                            <div className="rounded border border-success bg-light text-success px-3 py-2" style={{ fontSize: '0.88rem' }}>
                                ✓ Page d&apos;accueil validée
                            </div>
                            <div className="rounded border px-3 py-2 bg-white" style={{ fontSize: '0.88rem', color: '#224363' }}>
                                Connexion sécurisée
                            </div>
                            <div className="rounded border px-3 py-2 bg-white" style={{ fontSize: '0.88rem', color: '#224363' }}>
                                Projets et tâches
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}