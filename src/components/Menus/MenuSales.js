import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUsersGear, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import './styles/MenusStyles.css';

const MenuSales = () => {
    return(
        <Container>
            <Container>
                <h1>Menú Clientes</h1>
            </Container>

            <Container className="card-container">
                <Card className="custom-card">
                    <Link to='/customers'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faUsers} size="3x" />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Ver Clientes</h2>
                        </Card.Body>
                    </Link>
                </Card>

                <Card className="custom-card">
                    <Link to='/modulo-customers'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faUsersGear} size="3x" />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Clientes</h2>
                        </Card.Body>
                    </Link>
                </Card>

                <Card className="custom-card">
                    <Link to='/modulo-customers'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faBoxArchive} size="3x" />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Ventas</h2>
                        </Card.Body>
                    </Link>
                </Card>
            </Container>
        </Container>
    );
};

export default MenuSales;
