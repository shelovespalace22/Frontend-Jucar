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

            <Container>

                <Card>
                    <Link to='/customers'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faUsers} />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Ver Clientes</h2>
                            <br />
                        </Card.Body>
                    </Link>
                </Card>

                <Card>
                    <Link to='/modulo-customers'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faUsersGear} />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Clientes</h2>
                            <br />
                        </Card.Body>
                    </Link>
                </Card>

                <Card>
                    <Link to='/modulo-customers'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faBoxArchive} />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Ventas</h2>
                            <br />
                        </Card.Body>
                    </Link>
                </Card>
            </Container>
        </Container>
    );
};

export default MenuSales;