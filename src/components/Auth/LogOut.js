// Auth/Logout.js
import React from 'react';
import { useHistory } from 'react-router-dom';

const Logout = () => {
  const history = useHistory();

  const handleLogout = () => {
    // Limpiar el token de acceso del almacenamiento local
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de inicio de sesión u otra página relevante
    history.push('/inicio-sesion');
  };

  

  return (
    <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
  );
};



export default Logout;
