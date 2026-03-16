function AuthPage({ authTab, setToken, navigate }) {
    const { Container, Row, Col } = ReactBootstrap;

    return (
        <Container fluid className="app-shell page-auth px-0">
            <section className="fullscreen-page auth-page">
                <Row>
                    <Col lg={{ offset: 2, span: 8 }}>
                        <AuthCard
                            initialTab={authTab}
                            setToken={setToken}
                            onAuthenticated={() => navigate('/dashboard')}
                            onBack={() => navigate('/')}
                        />
                    </Col>
                </Row>
            </section>
        </Container>
    );
}
