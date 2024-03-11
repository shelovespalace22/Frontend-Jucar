import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBox, faTag, faTruck, faCircleUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './styles/MenuNavegacion.css';

const MenuNavegacion = () => (
  <nav className='menu-nav'>
    <ul>
      <li>
        <NavLink to="/perfil" className='menu-link icon-only'>
          <FontAwesomeIcon icon={faCircleUser} className="icon" />
        </NavLink>
      </li>
      <li>
        <NavLink to="/menu-inicial" className='menu-link' activeClassName='active'>
          <FontAwesomeIcon icon={faHome} /> <span className='menu-text'>Inicio</span>
        </NavLink>
      </li>

      <li>
        <NavLink to="/menu-productos" className='menu-link' activeClassName='active'>
          <FontAwesomeIcon icon={faBox} /> <span className='menu-text'>Productos</span>
        </NavLink>
      </li>

      <li>
        <NavLink to="/menu-ventas" className='menu-link' activeClassName='active'>
          <FontAwesomeIcon icon={faTag} /> <span className='menu-text'>Ventas</span>
        </NavLink>
      </li>

      <li>
        <NavLink to="/menu-proveedores" className='menu-link' activeClassName='active'>
          <FontAwesomeIcon icon={faTruck} /> <span className='menu-text'>Proveedores</span>
        </NavLink>
      </li>

      {/* <li>
        <NavLink to="/log-out" className="menu-link bottom-link" activeClassName="active" id="log-out">
          <FontAwesomeIcon icon={faRightFromBracket} /> <span className='menu-text'>Cerrar Sesión</span>
        </NavLink>
      </li> */}
    </ul>
  </nav>
);


export default MenuNavegacion;