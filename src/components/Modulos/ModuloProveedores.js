import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Container } from 'react-bootstrap';
import './styles/ModulosStyles.css';

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

    return (
        <div>
            <Container>
                <h1>Proveedores</h1>
            </Container>

            <Container className="card-container">
                {providers.map((provider) => (
                    <Card key={provider.providerID} className="custom-card">
                        <Card.Body>
                            <Card.Text>
                                <strong>{provider.name}</strong>
                            </Card.Text>
                            <br />
                            <Card.Title>¿Qué deseas ver?</Card.Title>
                            <br />
                            <Button onClick={() => handleShowProviderAddresses(provider.providerID)} className="custom-button">
                                Ver Direcciones
                            </Button>
                            <Button onClick={() => handleShowProviderPhones(provider.providerID)} className="custom-button">
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
