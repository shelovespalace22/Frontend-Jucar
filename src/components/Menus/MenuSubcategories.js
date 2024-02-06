// MenuSubcategories.js

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

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
      <h3>Categories</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.categoryId}>
            <button onClick={() => handleCategoryClick(category.categoryId)}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuSubcategories;




