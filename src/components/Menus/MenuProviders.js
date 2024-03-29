import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import './styles/MenusStyles.css';

const MenuProviders = () => {
    return(
        <Container>
            <Container>
                <h1>Menú Proveedores</h1>
            </Container>

            <Container className="card-container">
                <Card className="custom-card">
                    <Link to='/providers'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faTruck} size="3x" />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Ver Proveedores</h2>
                        </Card.Body>
                    </Link>
                </Card>

                <Card className="custom-card">
                    <Link to='/modulo-providers'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faTruckFast} size="3x" />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Proveedores</h2>
                        </Card.Body>
                    </Link>
                </Card>
            </Container>
        </Container>
    );
};

export default MenuProviders;
