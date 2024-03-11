import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBox, faTag, faTruck } from '@fortawesome/free-solid-svg-icons';
import './styles/MenuNavegacion.css';

const MenuNavegacion = () => (
  <nav>
    <ul>
      <li>
        <Link to="/menu-inicial">
          <FontAwesomeIcon icon={faHome} /> Inicio
        </Link>
      </li>
      <hr/>

      <li>
        <Link to="/menu-productos">
          <FontAwesomeIcon icon={faBox} /> Productos
        </Link>
      </li>
      <hr/>

      <li>
        <Link to="/menu-ventas">
          <FontAwesomeIcon icon={faTag} /> Ventas
        </Link>
      </li>
      <hr/>

      <li>
        <Link to="/menu-proveedores">
          <FontAwesomeIcon icon={faTruck} /> Proveedores
        </Link>
      </li>
      <hr/>
    </ul>
  </nav>
);

export default MenuNavegacion;