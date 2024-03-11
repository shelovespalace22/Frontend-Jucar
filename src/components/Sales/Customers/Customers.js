import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faPhone, faLocationDot, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const Customers = () => {
    const [customers, setCustomers] = useState ([]);
    const [newCustomer, setNewCustomer] = useState({
        IdentifierType: '',
        IdentifierNumber : '',
        Name: '',
        Email: '',
        CustomerAddresses: [{
            Address: '',
            AddressType:'',
            NeighborhoodId: '',
        }],
        CustomerPhone: [{
            PhoneType: '',
            PhoneNumber: '',
        }]
    });
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem)
    const history = useHistory();

    useEffect (() => {
        const fetchCustomers = async () => {
            try{
                const response = await axios.get(`https://localhost:7028/api/customers`);

                setCustomers(response.data);
            } catch (error){
                console.error('Error fetching customer', error);
            }
        };
        
        fetchCustomers();

    }, []);

    const handleCreateCustomer = async () => {
    try{
    const response = await axios.post(`https://localhost:7028/api/customers`, newCustomer);

    setCustomers ([response.data, ...customers]);

    setNewCustomer({
    IdentifierType: '',
    IdentifierNumber : '',
    Name: '',
    Email: '',
    CustomerAddresses: [{
    Address: '',
    AddressType:'',
    NeighborhoodId: '' 

    }],
    CustomerPhone: [{
    PhoneType: '',
    PhoneNumber: ''
    }]
    });

    handleCloseModal();
    }catch(error){
    console.error('error creating customer:', error);

    }
    };

    const handleUpdateCustomer = async () => {
        try {
            await axios.put(`https://localhost:7028/api/customers/${selectedCustomerId}`, newCustomer);

            const response = await axios.get(`https://localhost:7028/api/customers`);

            const updatedCustomers = response.data;

            setCustomers(updatedCustomers);

            setNewCustomer({
                IdentifierType: '',
                IdentifierNumber : '',
                Name: '',
                Email: '',
                CustomerAddresses: [{
                    Address: '',
                    AddressType:'',
                    NeighborhoodId: '' 

                }],
                CustomerPhone: [{
                    PhoneType: '',
                    PhoneNumber: ''
                }]
            });

            handleCloseModal();

        } catch (error) {
            console.error('Error updating customer', error);
        }
    };

    const handleDeleteCustomer = async (customerId) => {
        try{
            await axios.delete(`https://localhost:7028/api/customers/${customerId}`);

            const updatedCustomers = customers.filter((customer) => customer.customerID !== customerId);

            setCustomers(updatedCustomers);

        } catch (error) {
            console.error('Error deleting customer', error);
        }
    };

    const handleShowCreateModal = () => {
        setModalAction('create');
        setShowModal(true);
    };

    const handleShowEditModal = (customerId) => {
        setModalAction ('edit');
        setSelectedCustomerId(customerId);

        const selectedCustomer = customers.find((customer) => customer.customerID === customerId);

        if(selectedCustomer){
            setNewCustomer({
                IdentifierType: selectedCustomer.identifierType || '',
                IdentifierNumber : selectedCustomer.identifierNumber || '',
                Name: selectedCustomer.name || '',
                Email: selectedCustomer.email || '',
                CustomerAddresses: [{
                    Address: selectedCustomer.address || '',
                    AddressType: selectedCustomer.addressType ||'',
                    NeighborhoodId: selectedCustomer.neighborhoodId || '' 

                }],
                CustomerPhone: [{
                    PhoneType: selectedCustomer.phoneType || '',
                    PhoneNumber: selectedCustomer.phoneNumber ||''
                }]
            });
        }
        
        setShowModal(true);
    };

    const handleShowDetailModal = (customerId) => {
        
        setModalAction ('detail');
        setSelectedCustomerId(customerId);

        const selectedCustomer = customers.find((customer) => customer.customerID === customerId);

        if(selectedCustomer){
            setNewCustomer({
                IdentifierType: selectedCustomer.identifierType || '',
                IdentifierNumber : selectedCustomer.identifierNumber || '',
                Name: selectedCustomer.name || '',
                Email: selectedCustomer.email || '',
                CustomerAddresses: [{
                    Address: selectedCustomer.address || '',
                    AddressType: selectedCustomer.addressType ||'',
                    NeighborhoodId: selectedCustomer.neighborhoodId || '' 

                }],
                CustomerPhone: [{
                    PhoneType: selectedCustomer.phoneType || '',
                    PhoneNumber: selectedCustomer.phoneNumber ||''
                }]
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);

        setNewCustomer({
            IdentifierType: '',
            IdentifierNumber : '',
            Name: '',
            Email: '',
            CustomerAddresses: [{
                Address: '',
                AddressType:'',
                NeighborhoodId: '',
            }],
            CustomerPhone: [{
                PhoneType: '',
                PhoneNumber: '',
            }]
        });

        setSelectedCustomerId('');
    };

    const handleShowPhones = (customerId) => {
        history.push('/customer-phones', {customerId} );
    };

    const handleShowAddresses = (customerId) => {
        history.push('/customer-adresses', {customerId});
    };

    const handleShowOrders = (customerId) => {
        history.push('/customer-orders', {customerId});
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <div className='Customers-container'>

            <br/>
            <h2>Clientes</h2>
            <br/>

            <Button variant="primary" onClick={handleShowCreateModal}>
                <FontAwesomeIcon icon={faPlus} /> Nuevo Cliente
            </Button>

            <Button variant="danger" onClick={handleGoBack}>
                Volver
            </Button>

            <hr/>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tipo de Identificación</th>
                        <th>Número</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {currentCustomers.map((customer)=>(
                        <tr key={customer.customerID}>
                            <td>{customer.identifierType}</td>
                            <td>{customer.identifierNumber}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>
                                <Button variant="info" onClick={() => handleShowEditModal(customer.customerID)}>
                                    <FontAwesomeIcon icon={faEdit} /> Actualizar
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteCustomer(customer.customerID)}>
                                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                                </Button>
                                <Button variant="primary" onClick={() => handleShowDetailModal(customer.customerID)}>
                                    <FontAwesomeIcon icon={faEye} /> Ver Detalle
                                </Button>
                                <Button variant="success" onClick={() => handleShowPhones(customer.customerID)}>
                                    <FontAwesomeIcon icon={faPhone} />
                                </Button>
                                <Button variant="success" onClick={() => handleShowAddresses(customer.customerID)}>
                                    <FontAwesomeIcon icon={faLocationDot} />
                                </Button>
                                <Button variant="success" onClick={() => handleShowOrders(customer.customerID)}>
                                    <FontAwesomeIcon icon={faBoxArchive} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                {Array.from({ length: Math.ceil(customers.length / itemsPerPage) }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <Modal show ={showModal} onHide={handleCloseModal}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalAction === 'create'
                        ? 'Nuevo Cliente'
                        :modalAction === 'edit'
                        ? 'Actualizar Cliente'
                        : 'Detalle de Cliente'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalAction !== 'detail' &&(
                        <Form>
                            <Form.Group controlId='formCustomerIdentifyerT'>
                                <Form.Label>Tipo de Identificación</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ingrese el tipo de identificacion: CC, TI'
                                    value={newCustomer.IdentifierType}
                                    onChange={(e)=> setNewCustomer({...newCustomer, IdentifierType: e.target.value})}                                
                                />
                            </Form.Group>
                            <Form.Group controlId='formCustomerIdentifyerNumber'>
                                <Form.Label>Número de Identificación</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ingrese el numero de identificacion:(solo numeros)'
                                    value={newCustomer.IdentifierNumber}
                                    onChange={(e)=> setNewCustomer({...newCustomer, IdentifierNumber: e.target.value})}                                
                                />
                            </Form.Group>

                            <Form.Group controlId='formCustomerName'>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ingrese su nombre completo'
                                    value={newCustomer.Name}
                                    onChange={(e)=> setNewCustomer({...newCustomer, Name: e.target.value})}                                
                                />
                            </Form.Group>

                            <Form.Group controlId='formCustomerEmail'>
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ingrese su correo'
                                    value={newCustomer.Email}
                                    onChange={(e)=> setNewCustomer({...newCustomer, Email: e.target.value})}                                
                                />
                            </Form.Group>
                        </Form>
                    )}
                    {modalAction === 'detail' &&(
                        <div>
                            {selectedCustomerId &&(
                                <div>
                                    <h4>Detalles de cliente</h4>
                                    <p>ID: {selectedCustomerId}</p>
                                    <p>Tipo de Identificación: {newCustomer.IdentifierType}</p>
                                    <p>Número de Identificación: {newCustomer.IdentifierNumber}</p>
                                    <p>Nombre: {newCustomer.Name}</p>
                                    <p>Email: {newCustomer.Email}</p>
                                </div>                            
                            )}
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>

                    {modalAction !== 'detail' && (
                        <Button
                            variant="primary"
                            onClick={modalAction === 'create' ? handleCreateCustomer : handleUpdateCustomer}
                        >
                            {modalAction === 'create' ? 'Crear' : 'Actualizar'}
                        </Button>
                    )}
                </Modal.Footer>

            </Modal>
        </div>
    );
};

export default Customers;