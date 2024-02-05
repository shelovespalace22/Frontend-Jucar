// index.js
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap al principio
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import InicioSesion from './components/InicioSesion';
import Registro from './components/Registro'; 
import Login from './components/Login';
import RegistroExitoso from './components/registro/RegistroExitoso';
import ErrorAlRegistrar from './components/registro/ErrorAlRegistrar';
import reportWebVitals from './reportWebVitals';
import Menu from './components/Menu';
// import RefreshToken from './components/RefreshToken';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route exact path="/" component={InicioSesion} />
        <Route path="/registro" component={Registro} />
        <Route path="/login" component={Login} />
        <Route path="/registro-exitoso" component={RegistroExitoso} />
        <Route
          path="/error-al-registrar"
          render={(props) => <ErrorAlRegistrar {...props} errorMessages={[]} />}
        />
        <Route path="/menu" component={Menu} />
        {/* <Route path="/refresh-token" component={RefreshToken} /> */}
        {/* Otras rutas de tu aplicación */}
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
