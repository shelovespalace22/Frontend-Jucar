import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import { Container, Row, Col } from 'react-bootstrap';
import MenuNavegacion from './components/shared/MenuNavegacion';
import { faHome, faBox, faTag, faTruck, faCircleUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logout from './components/Auth/LogOut';

// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="page">
        <div className="sidebar">
          <MenuNavegacion />
        </div>

        <main>
          <div className="top-row">
            {/* Botones de Registro y Acceso */}
          
            <NavLink to="/inicio-sesion" className='menu-link' activeClassName='active'>
              <FontAwesomeIcon icon={faCircleUser} /> <span className='menu-text'>Inicio Sesión</span>
            </NavLink>

            <Logout className='menu-link'/>


         
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