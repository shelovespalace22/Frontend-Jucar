// PrivateRoute.js

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../../Utils/auth'; // Importa la función de autenticación

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/inicio-sesion" /> // Redirige a la página de inicio de sesión si el usuario no está autenticado
        )
      }
    />
  );
};

export default PrivateRoute;
