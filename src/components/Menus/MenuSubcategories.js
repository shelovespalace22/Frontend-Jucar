// MenuSubcategories.js

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Container } from 'react-bootstrap';

import './styles/MenuSubcategories.css';

const MenuSubcategories = () => {
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
      <Container className='mt-5 container-box'>
        <h1 className='text-center'>Categorías</h1>
      </Container>

      <Container className='mt-5 container-box'>
        {categories.map((category) => (
            <Card key={category.categoryId} style={{ width: '250px'}}>
              <Card.Body>
                <Card.Title>Ver Subcategorías de: </Card.Title>
                <br />
                <Card.Text>
                  <strong>{category.name}</strong>
                </Card.Text>
                <br />
                <Button variant='success' onClick={() => handleCategoryClick(category.categoryId)}>
                  Ver
                </Button>
              </Card.Body>
            </Card>
          ))}
      </Container>
    </div>
  );
};

export default MenuSubcategories;