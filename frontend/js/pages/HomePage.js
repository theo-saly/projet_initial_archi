function HomePage({ navigate, accountMessage }) {
    const { Container, Row, Col, Card, Badge, ProgressBar } = ReactBootstrap;

    return (
        <Container fluid className="app-shell min-vh-100 d-flex flex-column px-4 px-lg-5 py-4" style={{ position: 'relative', zIndex: 1 }}>

            {/* ── Navbar ── */}
            <Row className="align-items-center pb-3 mb-2 border-bottom">
                <Col className="d-flex align-items-center gap-2">
                    <div className="home-logo-mark">F</div>
                    <span className="fw-bold fs-5" style={{ color: '#0f2c4d', letterSpacing: '0.02em' }}>Flowboard</span>
                </Col>
                <Col xs="auto" className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/sign')}>
                        Inscription
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
                        Connexion
                    </button>
                </Col>
            </Row>

            {/* ── Hero ── */}
            <Row className="align-items-center gx-5 gy-4 py-4 flex-grow-1">

                {/* Colonne texte */}
                <Col lg={7} className="d-flex flex-column gap-3">
                    <div>
                        <span className="badge bg-success-subtle text-success fw-semibold text-uppercase ls-wide mb-2 d-inline-block">
                            Par Saly Théo &amp; Inacio Rodrigues
                        </span>
                        <h1 className="display-5 fw-bold lh-sm mt-2" style={{ color: '#0b2239', maxWidth: '22ch' }}>
                            Pilotez vos tâches comme une vraie équipe produit
                        </h1>
                        <p className="lead text-secondary mt-3 mb-0" style={{ maxWidth: '52ch' }}>
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
                            className="btn btn-outline-secondary btn-lg"
                            onClick={() => navigate('/sign')}
                        >
                            Créer un compte
                        </button>
                    </div>

                    {/* Stats */}
                    <Row className="g-2 pt-2 border-top">
                        {[
                            { value: '+48%', label: 'de tâches bouclées plus vite' },
                            { value: '3 vues',  label: 'home · auth · dashboard' },
                            { value: '100%',   label: 'workflow en plein écran' },
                        ].map(({ value, label }) => (
                            <Col key={value} xs={4}>
                                <Card className="h-100 border text-center py-2 px-1 bg-white bg-opacity-75">
                                    <Card.Body className="p-1">
                                        <div className="fw-bold fs-6" style={{ color: '#0f766e' }}>{value}</div>
                                        <div className="text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.3 }}>{label}</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {accountMessage && (
                        <div className="alert alert-success mb-0">{accountMessage}</div>
                    )}
                </Col>

                {/* Colonne preview */}
                <Col lg={5}>
                    <Card className="border shadow-lg" style={{ borderRadius: '18px', background: 'linear-gradient(160deg,#fff,#f0f7ff)' }}>
                        <Card.Body className="p-4 d-flex flex-column gap-3">
                            <div>
                                <Badge bg="secondary" className="text-uppercase fw-bold mb-2" style={{ letterSpacing: '0.08em', fontSize: '0.7rem' }}>
                                    Aperçu du dashboard
                                </Badge>
                                <div className="fw-bold" style={{ color: '#12375c', fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Sprint Lancement
                                </div>
                            </div>

                            <div>
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="text-secondary">8 tâches terminées sur 12</small>
                                    <small className="fw-bold text-success">66%</small>
                                </div>
                                <ProgressBar now={66} variant="success" style={{ height: '8px', borderRadius: '999px' }} />
                            </div>

                            <div className="d-flex flex-column gap-2">
                                <div className="rounded border border-success-subtle bg-success-subtle text-success px-3 py-2" style={{ fontSize: '0.88rem' }}>
                                    ✓ Landing redesign validé
                                </div>
                                <div className="rounded border px-3 py-2 bg-white" style={{ fontSize: '0.88rem', color: '#224363' }}>
                                    Connexion sécurisée active
                                </div>
                                <div className="rounded border px-3 py-2 bg-white" style={{ fontSize: '0.88rem', color: '#224363' }}>
                                    Dashboard synchronisé
                                </div>
                            </div>

                            <Card className="border-0 bg-light">
                                <Card.Body className="py-2 px-3">
                                    <div className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
                                        Focus du jour
                                    </div>
                                    <div className="fw-semibold small" style={{ color: '#153d63' }}>
                                        Finaliser l&apos;onboarding utilisateur
                                    </div>
                                </Card.Body>
                            </Card>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* ── Features ── */}
            <Row className="g-3 pt-4 mt-2 border-top">
                {[
                    {
                        icon: '👁',
                        title: 'Vision instantanée',
                        text: 'Gardez en vue les priorités actives, les blocages et la progression globale.',
                    },
                    {
                        icon: '⚡',
                        title: 'Exécution rapide',
                        text: 'Ajoutez et mettez à jour vos tâches en quelques secondes depuis le dashboard.',
                    },
                    {
                        icon: '🗺',
                        title: 'Parcours guidé',
                        text: 'Un flux simple : home, authentification, puis tableau de bord productif.',
                    },
                ].map(({ icon, title, text }) => (
                    <Col key={title} md={4}>
                        <Card className="h-100 border bg-white bg-opacity-75 shadow-sm">
                            <Card.Body className="p-3">
                                <div className="fs-4 mb-2">{icon}</div>
                                <h6 className="fw-bold mb-1" style={{ color: '#123a61' }}>{title}</h6>
                                <p className="text-secondary small mb-0" style={{ lineHeight: 1.5 }}>{text}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

        </Container>
    );
}
