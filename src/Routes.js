// Routes.js
import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import InicioSesion from './components/InicioSesion';
import Registro from './components/Registro';
import Login from './components/Login';
import RegistroExitoso from './components/registro/RegistroExitoso';
import ErrorAlRegistrar from './components/registro/ErrorAlRegistrar';
import Menu from './components/Menu';
import Categories from './components/Products/Categories/Categories';
import Subcategories from './components/Products/Subcategories/Subcategories';
import MenuSubcategories from './components/Menus/MenuSubcategories';


const Routes = () => {
    
    const location = useLocation();
    const { state } = location;
    
    return (
        <Switch>
            <Route path="/inicio-sesion" component={InicioSesion} />
            <Route path="/registro" component={Registro} />
            <Route path="/login" component={Login} />
            <Route path="/registro-exitoso" component={RegistroExitoso} />
            <Route path="/error-registro" component={ErrorAlRegistrar} />
            <Route path="/menu" component={Menu} />
            <Route path="/categories" component={Categories} />
            <Route path="/category-subcategories" exact>
                <Subcategories categoryId={state?.categoryId} />
            </Route>
            <Route path="/menu-subcategories" component={MenuSubcategories} />
            <Route path="/subcategories/:categoryId" exact component={Subcategories} />
        </Switch>
)};

export default Routes;