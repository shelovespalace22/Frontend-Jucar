// Routes.js
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import InicioSesion from './components/InicioSesion';
import Registro from './components/Registro';
import Login from './components/Login';
import RegistroExitoso from './components/registro/RegistroExitoso';
import ErrorAlRegistrar from './components/registro/ErrorAlRegistrar';
import Menu from './components/Menu';
import Categories from './components/Products/Categories/Categories';


const Routes = () => (
    <Switch>
        <Route path="/inicio-sesion" component={InicioSesion} />
        <Route path="/registro" component={Registro} />
        <Route path="/login" component={Login} />
        <Route path="/registro-exitoso" component={RegistroExitoso} />
        <Route path="/error-registro" component={ErrorAlRegistrar} />
        <Route path="/menu" component={Menu} />
        <Route path="/categories" component={Categories} />
    </Switch>
);

export default Routes;