// MenuAutoparts.js

import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const MenuAutoparts = () => {
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

  return (
    <div>
      <h3>Subcategories</h3>
      <ul>
        {subcategories.map((subcategory) => (
          <li key={subcategory.subcategoryId}>
            <button onClick={() => handleSubcategoryClick(subcategory.subcategoryId)}>
              {subcategory.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuAutoparts;
