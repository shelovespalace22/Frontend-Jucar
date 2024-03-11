import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Container } from 'react-bootstrap';
import axios from 'axios';
import './styles/ModulosStyles.css';

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

    return (
        <div>
            <Container>
                <h1>Clientes</h1>
            </Container>

            <Container className="card-container">
                {customers.map((customer) => (
                    <Card key={customer.customerID} className="custom-card">
                        <Card.Body>
                            <Card.Text>
                                <strong>{customer.name}</strong>
                            </Card.Text>
                            <br />
                            <Card.Title>¿Qué deseas ver?</Card.Title>
                            <br />
                            <Button onClick={() => handleShowCustomerAddresses(customer.customerID)} className="custom-button">
                                Ver Direcciones
                            </Button>
                            <Button onClick={() => handleShowCustomerPhones(customer.customerID)} className="custom-button">
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
