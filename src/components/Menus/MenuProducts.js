import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faScrewdriverWrench, faAtom, faList } from '@fortawesome/free-solid-svg-icons';
import './styles/MenusStyles.css';

const MenuProducts = () => {
    return(
        <Container>
            <Container>
                <h1>Menú Productos</h1>
            </Container>

            <Container className="card-container">
                <Card className="custom-card">
                    <Link to='/categories'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faLayerGroup} size="3x" />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Categorías</h2>
                            <br />
                            
                        </Card.Body>
                    </Link>
                </Card>

                <Card className="custom-card">
                    <Link to='/modulo-subcategories'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faList} size="3x" />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Subcategorías</h2>
                            <br />
                            
                        </Card.Body>
                    </Link>
                </Card>

                <Card className="custom-card">
                    <Link to='/modulo-autoparts'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faScrewdriverWrench} size="3x" />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Autopartes</h2>
                            <br />
                            
                        </Card.Body>
                    </Link>
                </Card>

                <Card className="custom-card">
                    <Link to='/rawMaterials'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faAtom} size="3x" />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Materias Prima</h2>
                            <br />
                            
                        </Card.Body>
                    </Link>
                </Card>
            </Container>
        </Container>
    );
};

export default MenuProducts;