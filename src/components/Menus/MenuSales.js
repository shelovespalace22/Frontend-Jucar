import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUsersGear, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import './styles/MenusStyles.css';

const MenuSales = () => {
    return (
        <Container>
            <Container>
                <h1>Menú Clientes</h1>
            </Container>

            <Container className="card-container">
                <Link to='/customers' className="custom-card-link">
                    <Card className="custom-card">
                        <Card.Body>
                            <FontAwesomeIcon icon={faUsers} size="3x" style={styles.icon} />
                            <Card.Title style={styles.cardText}>Dirigirse a:</Card.Title>
                            <h2 style={styles.cardText}>Ver Clientes</h2>
                        </Card.Body>
                    </Card>
                </Link>

                <Link to='/modulo-customers' className="custom-card-link">
                    <Card className="custom-card">
                        <Card.Body>
                            <FontAwesomeIcon icon={faUsersGear} size="3x" style={styles.icon} />
                            <Card.Title style={styles.cardText}>Dirigirse a:</Card.Title>
                            <h2 style={styles.cardText}>Modulo Clientes</h2>
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

export default MenuSales;

