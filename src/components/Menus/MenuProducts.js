import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faScrewdriverWrench, faAtom, faList } from '@fortawesome/free-solid-svg-icons';
import './styles/MenusStyles.css';

const MenuProducts = () => {
    return (
        <Container>
            <Container>
                <h1>Menú Productos</h1>
            </Container>

            <Container className="card-container">
                <Link to='/categories' className="custom-card-link">
                    <Card className="custom-card" style={styles.card}>
                        <Card.Body>
                            <FontAwesomeIcon icon={faLayerGroup} size="3x" style={styles.icon} />
                            <Card.Title style={styles.cardText}>Dirigirse a:</Card.Title>
                            <h2 style={styles.cardText}>Modulo Categorías</h2>
                            <br />
                        </Card.Body>
                    </Card>
                </Link>

                <Link to='/modulo-subcategories' className="custom-card-link">
                    <Card className="custom-card" style={styles.card}>
                        <Card.Body>
                            <FontAwesomeIcon icon={faList} size="3x" style={styles.icon} />
                            <Card.Title style={styles.cardText}>Dirigirse a:</Card.Title>
                            <h2 style={styles.cardText}>Modulo Subcategorías</h2>
                            <br />
                        </Card.Body>
                    </Card>
                </Link>

                <Link to='/modulo-autoparts' className="custom-card-link">
                    <Card className="custom-card" style={styles.card}>
                        <Card.Body>
                            <FontAwesomeIcon icon={faScrewdriverWrench} size="3x" style={styles.icon} />
                            <Card.Title style={styles.cardText}>Dirigirse a:</Card.Title>
                            <h2 style={styles.cardText}>Modulo Autopartes</h2>
                            <br />
                        </Card.Body>
                    </Card>
                </Link>

                <Link to='/rawMaterials' className="custom-card-link">
                    <Card className="custom-card" style={styles.card}>
                        <Card.Body>
                            <FontAwesomeIcon icon={faAtom} size="3x" style={styles.icon} />
                            <Card.Title style={styles.cardText}>Dirigirse a:</Card.Title>
                            <h2 style={styles.cardText}>Modulo Materias Prima</h2>
                            <br />
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
        textDecoration: 'none', // Quita la línea debajo del texto
        borderBottom: 'none',
    },
    icon: {
        color: 'red', // Cambia el color del icono a rojo
    },
    card: {
        border: 'none', // Quita el borde inferior de las cartas
        boxShadow: '2px 2px 5px #888888', // Añade sombra a los bordes de las cartas
        marginBottom: '20px', // Añade espacio entre las cartas
        transition: 'transform 0.2s', // Agrega transición al hacer hover sobre las cartas
    },
};

export default MenuProducts;



