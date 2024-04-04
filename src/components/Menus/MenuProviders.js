import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import './styles/MenusStyles.css';

const MenuProviders = () => {
    return (
        <Container>
            <Container>
                <h1>Menú Proveedores</h1>
            </Container>

            <Container className="card-container">
                <Link to='/providers' className="custom-card-link">
                    <Card className="custom-card">
                        <Card.Body>
                            <FontAwesomeIcon icon={faTruck} size="3x" style={styles.icon} />
                            <Card.Title style={styles.cardText}>Dirigirse a:</Card.Title>
                            <h2 style={styles.cardText}>Ver Proveedores</h2>
                        </Card.Body>
                    </Card>
                </Link>

                <Link to='/modulo-providers' className="custom-card-link">
                    <Card className="custom-card">
                        <Card.Body>
                            <FontAwesomeIcon icon={faTruckFast} size="3x" style={styles.icon} />
                            <Card.Title style={styles.cardText}>Dirigirse a:</Card.Title>
                            <h2 style={styles.cardText}>Modulo Proveedores</h2>
                        </Card.Body>
                    </Card>
                </Link>
            </Container>
        </Container>
    );
};

const styles = {
    cardText: {
        color: 'red', // Cambia el color del texto a rojo
        textDecoration: 'none', // Quita la línea de abajo del texto
    },
    icon: {
        color: 'red', // Cambia el color del icono a rojo
    },
};

export default MenuProviders;
