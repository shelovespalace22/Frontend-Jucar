import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import { Container, Row, Col } from 'react-bootstrap';
import MenuNavegacion from './components/shared/MenuNavegacion';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Router>
      <div className="page">
        <div className="sidebar">
          <MenuNavegacion />
        </div>

        <main>
          <div className="top-row px-4 navbar">
            <button>Perfil</button>
            <button>Cerrar Sesión</button>
          </div>

          <article className="content px-4">
            <Container fluid>
              <Row>
                <Col>
                  <Routes />
                </Col>
              </Row>
            </Container>
          </article>
        </main>
      </div>
    </Router>
  );
}

export default App;