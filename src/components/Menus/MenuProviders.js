import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Container } from 'react-bootstrap';
import './styles/MenusStyles.css';

const MenuProviders = () => {
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
            <Container className='mt-5 container-box'>
                <h1 className='text-center'>Proveedores</h1>
            </Container>

            <Container className='mt-5 container-box'>
                {providers.map((provider) => (
                    <Card key={provider.providerID}>
                        <Card.Body>
                            <Card.Text>
                                <strong>{provider.name}</strong>
                            </Card.Text>
                            <br />
                            <Card.Title>¿Que deseas ver?</Card.Title>
                            <br />
                            <Button variant='success' onClick={() => handleShowProviderAdresses(provider.providerID)}>
                                Ver Direcciones
                            </Button>
                            <Button variant='success' onClick={() => handleShowProviderPhones(provider.providerID)}>
                                Ver Teléfonos
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
        </div>
    );

};

export default MenuProviders;