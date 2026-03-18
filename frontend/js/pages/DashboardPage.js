function DashboardPage({ token, message, logout, deleteAccount }) {
    return (
        <div className="app-shell page-dashboard" id="dashboard-shell" style={{ minHeight: '100vh' }}>
            <div className="dashboard-page-inner">
                <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '4rem', paddingRight: '4rem' }}>
                    <section className="dashboard-topbar mt-4 d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex align-items-center gap-2">
                            <div className="home-logo-mark">F</div>
                            <span className="fw-bold fs-5">Flowboard</span>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-outline-secondary" onClick={logout}>
                                Se deconnecter
                            </button>
                            <button type="button" className="btn btn-danger" onClick={deleteAccount}>
                                Supprimer mon compte
                            </button>
                        </div>
                    </section>

                    {message && <div className="alert alert-success">{message}</div>}

                    <TodoListCard token={token} />
                </div>
            </div>
        </div>
    );
}
