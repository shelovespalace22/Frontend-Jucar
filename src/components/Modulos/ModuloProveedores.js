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

    const handleShowProviderAdresses = (providerId) => {
        history.push('/provider-addresses', { providerId });
    };

    return (
        <div>
            <Container>
                <h1>Proveedores</h1>
            </Container>

            <Container>
                {providers.map((provider) => (
                    <Card key={provider.providerID}>
                        <Card.Body>
                            <Card.Text>
                                <strong>{provider.name}</strong>
                            </Card.Text>
                            <br />
                            <Card.Title>¿Que deseas ver?</Card.Title>
                            <br />
                            <Button onClick={() => handleShowProviderAdresses(provider.providerID)}>
                                Ver Direcciones
                            </Button>
                            <Button onClick={() => handleShowProviderPhones(provider.providerID)}>
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