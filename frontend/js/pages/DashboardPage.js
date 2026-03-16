function DashboardPage({ token, accountMessage, logout, deleteAccount }) {
    const { Container, Row, Col } = ReactBootstrap;

    return (
        <Container fluid className="app-shell page-dashboard" id="dashboard-shell">
            <div className="dashboard-page-inner">
                <Row>
                    <Col lg={{ offset: 1, span: 10 }}>
                        <section className="dashboard-topbar mt-4 mb-3">
                            <div>
                                <p className="hero-kicker mb-2">Dashboard</p>
                                <h1 className="hero-title mb-1">Tableau de bord</h1>
                                <p className="hero-subtitle mb-0">Vue complete de vos projets et taches.</p>
                            </div>
                            <div className="d-flex gap-2 flex-wrap">
                                <button type="button" className="btn btn-outline-secondary" onClick={logout}>
                                    Se deconnecter
                                </button>
                                <button type="button" className="btn btn-danger" onClick={deleteAccount}>
                                    Supprimer mon compte
                                </button>
                            </div>
                        </section>

                        <div className="card mb-3" id="account-bar">
                            <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <div>
                                    <strong>Session active</strong>
                                    <div className="text-muted">Vous etes connecte.</div>
                                </div>
                                <div className="session-pill">Etat: en ligne</div>
                            </div>
                        </div>

                        {accountMessage && <div className="alert alert-success">{accountMessage}</div>}
                        <TodoListCard token={token} />
                    </Col>
                </Row>
            </div>
        </Container>
    );
}
