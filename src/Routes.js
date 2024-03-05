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
import MenuAutoparts from './components/Menus/MenuAutoparts';
import Autoparts from './components/Products/Autoparts/Autoparts';
import RawMaterials from './components/Products/RawMaterials/RawMaterials';
import Losses from './components/Products/Losses/Losses';
import Movements from './components/Products/Movements/Movements';
import Stocks from './components/Products/Stocks/Stocks';
import Providers from './components/Provedores/Providers';


const Routes = () => {
    
    const location = useLocation();
    const { state } = location;
    
    return (
        <Switch>

            {/* Autenticación   */}

            <Route path="/inicio-sesion" component={InicioSesion} />
            <Route path="/registro" component={Registro} />
            <Route path="/login" component={Login} />
            <Route path="/registro-exitoso" component={RegistroExitoso} />
            <Route path="/error-registro" component={ErrorAlRegistrar} />

            {/* Menús */}

            <Route path="/menu-inicial" component={Menu} />
            <Route path="/menu-subcategories" component={MenuSubcategories} />
            <Route path="/menu-autoparts" component={MenuAutoparts} />


            {/* CRUDS */}
            <Route path="/categories" component={Categories} />
            <Route path="/providers" component={Providers} />

            <Route path="/category-subcategories" exact>
                <Subcategories categoryId={state?.categoryId} />
            </Route>

            <Route path="/subcategory-autoparts" exact>
                <Autoparts subcategoryId={state?.subcategoryId} />
            </Route>

            <Route path="/rawMaterials" component={RawMaterials} />

            <Route path="/autopart-losses" exact>
                <Losses autopartId={state?.autopartId} />
            </Route>

            <Route path="/rawMaterial-movements" exact>
                <Movements rawMaterialId={state?.rawMaterialId} />
            </Route>

            <Route path="/rawMaterial-stocks" exact>
                <Stocks rawMaterialId={state?.rawMaterialId} />
            </Route>
            
        </Switch>
)};

export default Routes;