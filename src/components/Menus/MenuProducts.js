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

            <Container>

                <Card>
                    <Link to='/categories'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faLayerGroup} />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Categorías</h2>
                            <br />
                            <Button>
                                Ver Categorías
                            </Button>
                        </Card.Body>
                    </Link>
                </Card>

                <Card>
                    <Link to='/modulo-subcategories'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faList} />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Subcategorías</h2>
                            <br />
                            <Button>
                                Ver Subcategorías
                            </Button>
                        </Card.Body>
                    </Link>
                </Card>

                <Card>
                    <Link to='/modulo-autoparts'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faScrewdriverWrench} />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Autopartes</h2>
                            <br />
                            <Button>
                                Ver Autopartes
                            </Button>
                        </Card.Body>
                    </Link>
                </Card>

                <Card>
                    <Link to='/rawMaterials'>
                        <Card.Body>
                            <FontAwesomeIcon icon={faAtom} />
                            <Card.Title>Dirigirse a:</Card.Title>
                            <h2>Modulo Materias Prima</h2>
                            <br />
                            <Button>
                                Ver Materias Primas
                            </Button>
                        </Card.Body>
                    </Link>
                </Card>
            </Container>
        </Container>
    );
};

export default MenuProducts;