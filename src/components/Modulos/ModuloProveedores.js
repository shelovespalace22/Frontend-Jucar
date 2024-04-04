import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Container } from 'react-bootstrap';

const ModuloProveedores = () => {
    const [providers, setProviders] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://localhost:7028/api/providers');
                setProviders(response.data);
            } catch (error) {
                console.error('Error fetching providers:', error);
            }
        };

        fetchData();
    }, []);

    const handleShowProviderPhones = (providerId) => {
        history.push('/provider-phones', { providerId });
    };

    const handleShowProviderAddresses = (providerId) => {
        history.push('/provider-addresses', { providerId });
    };

    const styles = {
        card: {
            border: 'none', // Quita el borde de las cartas
            boxShadow: '2px 2px 5px #888888', // Añade sombra a las cartas
            marginBottom: '20px', // Añade espacio entre las cartas
            transition: 'transform 0.2s', // Agrega transición al hacer hover sobre las cartas
        },
        cardText: {
            color: 'red', // Cambia el color del texto a rojo
        },
        cardButton: {
            background: 'red', // Cambia el color del botón a rojo
            border: 'none',
            marginBottom: '10px', // Añade espacio entre los botones
            marginRight: '10px', // Añade espacio entre los botones y el borde derecho
        },
    };

    return (
        <div>
            <Container>
                <h1>Proveedores</h1>
            </Container>

            <Container className="card-container">
                {providers.map((provider) => (
                    <Card
                        key={provider.providerID}
                        className="custom-card"
                        style={styles.card}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')} // Hace la carta más grande al hacer hover
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} // Devuelve el tamaño original al dejar de hacer hover
                    >
                        <Card.Body>
                            <Card.Text style={styles.cardText}>
                                <strong>{provider.name}</strong>
                            </Card.Text>
                            <br />
                            <Card.Title>¿Qué deseas ver?</Card.Title>
                            <br />
                            <Button
                                onClick={() => handleShowProviderAddresses(provider.providerID)}
                                style={styles.cardButton}
                            >
                                Ver Direcciones
                            </Button>
                            <Button
                                onClick={() => handleShowProviderPhones(provider.providerID)}
                                style={styles.cardButton}
                            >
                                Ver Teléfonos
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
        </div>
    );

};

export default ModuloProveedores;
