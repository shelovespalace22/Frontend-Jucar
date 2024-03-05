// MenuNavegacion.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faAddressCard, faCog } from '@fortawesome/free-solid-svg-icons';

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
          <FontAwesomeIcon icon={faHome} /> Productos
        </Link>
      </li>
      <hr/>

      <li>
        <Link to="/menu-ventas">
          <FontAwesomeIcon icon={faHome} /> Ventas
        </Link>
      </li>
      <hr/>

      <li>
        <Link to="/menu-proveedores">
          <FontAwesomeIcon icon={faHome} /> Proveedores
        </Link>
      </li>
      <hr/>

      <br/>

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
      <li>
        <Link to="/menu-subcategories">
          <FontAwesomeIcon icon={faCog} /> Menu Subcategorías
        </Link>
      </li>
      <li>
        <Link to="/menu-autoparts">
          <FontAwesomeIcon icon={faCog} /> Menu Autopartes
        </Link>
      </li>
      <li>
        <Link to="/rawMaterials">
          <FontAwesomeIcon icon={faCog} /> Materias Primas
        </Link>
      </li>
      <li>
        <Link to="/providers">
          <FontAwesomeIcon icon={faCog} /> Proveedores
        </Link>
      </li>
    </ul>
  </nav>
);

export default MenuNavegacion;