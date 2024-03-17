// Auth/Logout.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Logout = () => {
  const history = useHistory();

  const handleLogout = () => {
    // Limpiar el token de acceso del almacenamiento local
    localStorage.removeItem('accessToken');
    // Redirigir al usuario a la página de inicio de sesión u otra página relevante
    history.push('/inicio-sesion');
  };

  

  return (
    <button className="btn btn-danger" onClick={handleLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} /> Cerrar Sesión
    </button>
  );
};



export default Logout;
