import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Container } from 'react-bootstrap';

const ModuloCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://localhost:7028/api/customers');
                setCustomers(response.data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        fetchData();
    }, []);

    const handleShowCustomerPhones = (customerId) => {
        history.push('/customer-phones', { customerId });
    };

    const handleShowCustomerAddresses = (customerId) => {
        history.push('/customer-addresses', { customerId });
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
            marginRight: '10px', // Añade espacio entre los botones
        },
    };

    return (
        <div>
            <Container>
                <h1>Clientes</h1>
            </Container>

            <Container className="card-container">
                {customers.map((customer) => (
                    <Card
                        key={customer.customerID}
                        className="custom-card"
                        style={styles.card}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')} // Hace la carta más grande al hacer hover
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} // Devuelve el tamaño original al dejar de hacer hover
                    >
                        <Card.Body>
                            <Card.Text style={styles.cardText}>
                                <strong>{customer.name}</strong>
                            </Card.Text>
                            <br />
                            <Card.Title>¿Qué deseas ver?</Card.Title>
                            <br />
                            <Button
                                onClick={() => handleShowCustomerAddresses(customer.customerID)}
                                style={styles.cardButton}
                            >
                                Ver Direcciones
                            </Button>
                            <Button
                                onClick={() => handleShowCustomerPhones(customer.customerID)}
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

export default ModuloCustomers;
