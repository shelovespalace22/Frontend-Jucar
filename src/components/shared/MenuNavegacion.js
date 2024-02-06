// MenuNavegacion.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAddressCard, faCog } from '@fortawesome/free-solid-svg-icons';

const MenuNavegacion = () => (
  <nav>
    <ul>
      <li>
        <Link to="/menu">
          <FontAwesomeIcon icon={faHome} /> Inicio
        </Link>
      </li>
      <li>
        <Link to="/login">
          <FontAwesomeIcon icon={faAddressCard} /> Log In
        </Link>
      </li>
      <li>
        <Link to="/registro">
          <FontAwesomeIcon icon={faCog} /> Registrarse
        </Link>
      </li>
      <li>
        <Link to="/inicio-sesion">
          <FontAwesomeIcon icon={faCog} /> Inicio Sesión
        </Link>
      </li>
      <li>
        <Link to="/categories">
          <FontAwesomeIcon icon={faCog} /> Categorias
        </Link>
      </li>
    </ul>
  </nav>
);

export default MenuNavegacion;