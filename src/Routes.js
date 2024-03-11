import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import InicioSesion from './components/Auth/InicioSesion';
import Registro from './components/Auth/Registro';
import Login from './components/Auth/Login';
import RegistroExitoso from './components/Auth/RegistroExitoso';
import ErrorAlRegistrar from './components/Auth/ErrorAlRegistrar';

import MenuInicio from './components/Menus/MenuInicio';
import MenuProducts from './components/Menus/MenuProducts';
import MenuProviders from './components/Menus/MenuProviders';
import MenuSales from './components/Menus/MenuSales';

import ModuloSubcategories from './components/Modulos/ModuloSubcategories';
import ModuloAutoparts from './components/Modulos/ModuloAutoparts';
import ModuloProveedores from './components/Modulos/ModuloProveedores';
import ModuloCustomers from './components/Modulos/ModuloCustomers';
import ModuloOrders from './components/Modulos/ModuloOrders';

import Categories from './components/Products/Categories/Categories';
import Subcategories from './components/Products/Subcategories/Subcategories';
import Autoparts from './components/Products/Autoparts/Autoparts';
import RawMaterials from './components/Products/RawMaterials/RawMaterials';
import Losses from './components/Products/Losses/Losses';
import Movements from './components/Products/Movements/Movements';
import Stocks from './components/Products/Stocks/Stocks';

import Providers from './components/Providers/Providers/Providers';
import ProviderAddresses from './components/Providers/ProviderAddresses/ProviderAddresses';
import ProviderPhones from './components/Providers/ProviderPhones/ProviderPhones';

import Customers from './components/Sales/Customers/Customers';
import CustomersPhones from './components/Sales/CustomerPhones/CustomersPhones';
import CustomerAddresses from './components/Sales/CustomerAddresses/CustomerAddresses';
import Orders from './components/Sales/Orders/Orders';
import OrderDetails from './components/Sales/OrderDetails/OrderDetails';
import PaymentMethods from './components/Sales/PaymentMethods/PaymentMethods';
import Contributions from './components/Sales/Contributions/Contributions';



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

            <Route path="/menu-inicial" component={MenuInicio} />
            <Route path="/menu-productos" component={MenuProducts} />
            <Route path="/menu-proveedores" component={MenuProviders} />
            <Route path="/menu-ventas" component={MenuSales} />

            {/* Modulos */}

            <Route path="/modulo-subcategories" component={ModuloSubcategories} />
            <Route path="/modulo-autoparts" component={ModuloAutoparts} />
            <Route path="/modulo-providers" component={ModuloProveedores} />
            <Route path="/modulo-customers" component={ModuloCustomers} />
            <Route path="/modulo-orders" component={ModuloOrders} />


            {/* CRUDS: Products */}

            <Route path="/categories" component={Categories} />

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


            {/* CRUDS: Providers */}

            <Route path="/providers" component={Providers} />

            <Route path="/provider-addresses" exact>
                <ProviderAddresses providerId={state?.providerId} />
            </Route>

            <Route path="/provider-phones" exact>
                <ProviderPhones providerId={state?.providerId}/>
            </Route>

            {/* CRUDS: Sales */}
            
            <Route path="/customers" component={Customers} />

            <Route path="/customer-phones" exact>
                <CustomersPhones customerId={state?.customerId} />
            </Route>

            <Route path="/customer-adresses" exact>
                <CustomerAddresses customerId={state?.customerId} />
            </Route>
            
            <Route path="/customer-orders" exact>
                <Orders customerId={state?.customerId} />
            </Route>

            <Route path="/order-details" exact>
                <OrderDetails orderId={state?.orderId} />
            </Route>
            
            <Route path="/paymentMethods" component={PaymentMethods} />

            <Route path="/order-contributions" exact>
                <Contributions orderId={state?.orderId} />
            </Route>
            
        </Switch>
)};

export default Routes;