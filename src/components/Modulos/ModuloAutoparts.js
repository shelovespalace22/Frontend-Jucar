// MenuAutoparts.js

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Container } from 'react-bootstrap';
import axios from 'axios';

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

  const styles = {
    card: {
      border: '1px solid #ced4da', // Añade un borde a las cartas
      boxShadow: '2px 2px 5px #888888', // Añade sombra a las cartas
      marginBottom: '20px', // Añade espacio entre las cartas
    },
    cardTitle: {
      color: 'red', // Cambia el color del título de la carta a rojo
    },
    cardHover: {
      transition: 'transform 0.2s', // Agrega transición al hacer hover sobre la carta
    },
    button: {
      background: 'red', // Cambia el color del botón a rojo
      border: 'none',
    },
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
          <Card
            key={subcategory.subcategoryId}
            className="custom-card"
            style={{ ...styles.card, ...styles.cardHover }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')} // Hace la carta más grande al hacer hover
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} // Devuelve el tamaño original al dejar de hacer hover
          >
            <Card.Body>
              <Card.Title style={styles.cardTitle}>Ver Autopartes de: </Card.Title>
              <br />
              <Card.Text>
                <strong>{subcategory.name}</strong>
              </Card.Text>
              <br />
              <Button onClick={() => handleSubcategoryClick(subcategory.subcategoryId)} style={styles.button}>
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
