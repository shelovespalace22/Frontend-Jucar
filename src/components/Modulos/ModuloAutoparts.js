// MenuAutoparts.js

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Container } from 'react-bootstrap';
import axios from 'axios';
import './styles/ModulosStyles.css';

const ModuloAutoparts = () => {
  const [subcategories, setSubcategories] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7028/api/subcategories');
        setSubcategories(response.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubcategoryClick = (subcategoryId) => {
    history.push('/subcategory-autoparts', { subcategoryId });
  };

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div>
      <Container>
        <h1>Elige la Subcategoría</h1>

        <Button variant="danger" onClick={handleGoBack}>
          Volver
        </Button>
      </Container>

      <Container className="card-container">
        {subcategories.map((subcategory) => (
          <Card key={subcategory.subcategoryId} className="custom-card">
            <Card.Body>
              <Card.Title>Ver Autopartes de: </Card.Title>
              <br />
              <Card.Text>
                <strong>{subcategory.name}</strong>
              </Card.Text>
              <br />
              <Button onClick={() => handleSubcategoryClick(subcategory.subcategoryId)} className="custom-button">
                Ver
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  );
};

export default ModuloAutoparts;
