import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Container } from 'react-bootstrap';
import axios from 'axios';

const ModuloSubcategories = () => {
  const [categories, setCategories] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7028/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    history.push('/category-subcategories', { categoryId });
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const styles = {
    card: {
      border: 'none', // Quita el borde de las cartas
      boxShadow: '2px 2px 5px #888888', // Añade sombra a las cartas
      marginBottom: '20px', // Añade espacio entre las cartas
      transition: 'transform 0.2s', // Agrega transición al hacer hover sobre las cartas
    },
    cardTitle: {
      color: 'red', // Cambia el color del título de la carta a rojo
    },
    cardButton: {
      background: 'red', // Cambia el color del botón a rojo
      border: 'none',
      marginBottom: '10px', // Añade espacio entre los botones
    },
  };

  return (
    <div>
      <Container>
        <h1>Elige la Categoría</h1>

        <Button variant="danger" onClick={handleGoBack}>
          Volver
        </Button>
      </Container>

      <Container className="card-container">
        {categories.map((category) => (
          <Card
            key={category.categoryId}
            className="custom-card"
            style={styles.card}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')} // Hace la carta más grande al hacer hover
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')} // Devuelve el tamaño original al dejar de hacer hover
          >
            <Card.Body>
              <Card.Title style={styles.cardTitle}>Ver Subcategorías de: </Card.Title>
              <br />
              <Card.Text>
                <strong>{category.name}</strong>
              </Card.Text>
              <br />
              <Button
                onClick={() => handleCategoryClick(category.categoryId)}
                style={styles.cardButton}
              >
                Ver
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  );
};

export default ModuloSubcategories;
