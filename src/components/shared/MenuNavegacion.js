import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBox, faTag, faTruck } from '@fortawesome/free-solid-svg-icons';
import './styles/MenuNavegacion.css';

const MenuNavegacion = () => (
  <nav className='menu-nav'>
    <ul>
      <li>
        <Link to="/menu-inicial" className='menu-link'>
          <FontAwesomeIcon icon={faHome} /> <span className='menu-text'>Inicio</span>
        </Link>
      </li>

      <li>
        <Link to="/menu-productos" className='menu-link'>
          <FontAwesomeIcon icon={faBox} /> <span className='menu-text'>Productos</span>
        </Link>
      </li>

      <li>
        <Link to="/menu-ventas" className='menu-link'>
          <FontAwesomeIcon icon={faTag} /> <span className='menu-text'>Ventas</span>
        </Link>
      </li>

      <li>
        <Link to="/menu-proveedores" className='menu-link'>
          <FontAwesomeIcon icon={faTruck} /> <span className='menu-text'>Proveedores</span>
        </Link>
      </li>
    </ul>
  </nav>
);


export default MenuNavegacion;