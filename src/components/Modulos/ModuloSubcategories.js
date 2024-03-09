import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Container } from 'react-bootstrap';
import axios from 'axios';
import './styles/ModulosStyles.css';

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

  return (
    <div>
      <Container>
        <h1>Elige la Categoría</h1>
      </Container>

      <Container>
        {categories.map((category) => (
            <Card key={category.categoryId}>
              <Card.Body>
                <Card.Title>Ver Subcategorías de: </Card.Title>
                <br />
                <Card.Text>
                  <strong>{category.name}</strong>
                </Card.Text>
                <br />
                <Button onClick={() => handleCategoryClick(category.categoryId)}>
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