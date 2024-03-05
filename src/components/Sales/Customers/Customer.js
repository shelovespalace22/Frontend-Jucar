import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
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
            NeighborhoodId: '' 

        }],
        CustomerPhone: [{
            PhoneType: '',
            PhoneNumber: ''
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
        }catch (error){
            console.error('eror fetching Customer', error);
        }
    };
    fetchCustomers();
   })

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
    try{
        await axios.put(
            `https://localhost:7028/api/customers${selectedCustomerId}`,
            newCustomer
        );

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

    }catch(error){
        console.error('error updating customer', error)
    }
   };

   const handleDeleteCustomer = async (customerId) => {
    try{
        await axios.delete (`https://localhost:7028/api/customers${customerId}`);

        const updatedCustomers = customers.filter ((customer)=> customer.customerId !== customerId);
        setCustomers(updatedCustomers);
    }catch(error){
        console.error('error deleting customer', error);
    }
   };

   const handleShowCreateModal = () => {
    setModalAction('create');
    setShowModal(true);
  };

  const handleShowEditModal = (customerId) => {
    setModalAction ('edit');
    setSelectedCustomerId(customerId);

    const selectedCustomer = customers.find((customer) => customer.customerId === customerId);

    if(selectedCustomer){
        setNewCustomer({
            IdentifierType: selectedCustomer.IdentifierType || '',
            IdentifierNumber : selectedCustomer.IdentifierNumber || '',
            Name: selectedCustomer.Name || '',
            Email: selectedCustomer.Email || '',
            CustomerAddresses: [{
                Address: selectedCustomer.Address || '',
                AddressType: selectedCustomer.AddressType ||'',
                NeighborhoodId: selectedCustomer.NeighborhoodId || '' 
    
            }],
            CustomerPhone: [{
                PhoneType: selectedCustomer.PhoneType || '',
                PhoneNumber: selectedCustomer.PhoneNumber ||''
            }]
        });
    }
    setShowModal(true);
  };

  const handleShowDetailModal = (customerId) => {
    setModalAction ('detail');
    setSelectedCustomerId(customerId);

    const selectedCustomer = customers.find((customer) => customer.customerId === customerId);

    if(selectedCustomer){
        setNewCustomer({
            IdentifierType: selectedCustomer.IdentifierType || '',
            IdentifierNumber : selectedCustomer.IdentifierNumber || '',
            Name: selectedCustomer.Name || '',
            Email: selectedCustomer.Email || '',
            CustomerAddresses: [{
                Address: selectedCustomer.Address || '',
                AddressType: selectedCustomer.AddressType ||'',
                NeighborhoodId: selectedCustomer.NeighborhoodId || '' 
    
            }],
            CustomerPhone: [{
                PhoneType: selectedCustomer.PhoneType || '',
                PhoneNumber: selectedCustomer.PhoneNumber ||''
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
            NeighborhoodId: '' 

        }],
        CustomerPhone: [{
            PhoneType: '',
            PhoneNumber: ''
        }]
    });
    
    setSelectedCustomerId('');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleGoBack = () => {
    history.goBack();
   };

   return(
    <div className='Customers-container'>
        <header>
            <div>
                <img src= "" alt="logo"/>
                <h1>Autopartes JUCAR</h1>
            </div>
        </header>
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
                    <th>IdentifierType</th>
                    <th>IdentifierNumber</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {currentCustomers.map((customer)=>(
                    <tr key={customer.customerId}>
                        <td>{customer.IdentifierType}</td>
                        <td>{customer.IdentifierNumber}</td>
                        <td>{customer.Name}</td>
                        <td>{customer.Email}</td>
                        <td>
                        <Button variant="info" onClick={() => handleShowEditModal(customer.customerId)}>
                        <FontAwesomeIcon icon={faEdit} /> Actualizar
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteCustomer(customer.customerId)}>
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                        </Button>
                        <Button variant="primary" onClick={() => handleShowDetailModal(customer.customerId)}>
                        <FontAwesomeIcon icon={faEye} /> Ver Detalle
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
                    ? 'Actualizar cliente'
                    : 'Detalle de cliente'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {modalAction !== 'detail' &&(
                    <Form>
                        <Form.Group controlId='formCustomerIdentifyerT'>
                            <Form.Label>Tipo de identificacion</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Ingrese el tipo de identificacion: CC, TI'
                                value={newCustomer.IdentifierType}
                                onChange={(e)=> setNewCustomer({...newCustomer, IdentifierType: e.target.value})}                                
                            />
                        </Form.Group>
                        <Form.Group controlId='formCustomerIdentifyerNumber'>
                            <Form.Label>Numero de identificacion</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Ingrese el numero de identificacion:(solo numeros)'
                                value={newCustomer.IdentifierNumber}
                                onChange={(e)=> setNewCustomer({...newCustomer, IdentifierNumber: e.target.value})}                                
                            />
                        </Form.Group>

                        <Form.Group controlId='formCustomerName'>
                            <Form.Label>Nombre completo</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Ingrese su nombre completo'
                                value={newCustomer.Name}
                                onChange={(e)=> setNewCustomer({...newCustomer, Name: e.target.value})}                                
                            />
                        </Form.Group>

                        <Form.Group controlId='formCustomerEmail'>
                            <Form.Label>Correo Electronico</Form.Label>
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
                                <p>Tipo de identificacion: {newCustomer.IdentifierType}</p>
                                <p>Numero de identificacion: {newCustomer.IdentifierNumber}</p>
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