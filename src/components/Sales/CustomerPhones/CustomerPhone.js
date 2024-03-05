import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const CustomersPhone = ({customerId})=>{
    const [customersPhone, setCustomersPhone] = useState ([]);
    const [newCustomerPhone, setNewCustomerPhone] =  useState({
        PhoneType:'',
        PhoneNumber:''
    })

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('create');
  const [selectedCustomerPhoneId, setSelectedCustomerPhoneId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomersPhone = customersPhone.slice(indexOfFirstItem, indexOfLastItem);
  const history = useHistory();

  useEffect (()=>{
    const fetchCustomersPhone = async () => {
        try{
            const response = await axios.get (`https://localhost:7028/api/customers/${customerId}/phones`);
            setCustomersPhone (response.data)

        }catch(error){
            console.error('error fetching customers phone', error)

        }

    };
    fetchCustomersPhone();
  }, [customerId]);



  const handleCreateCustomerPhone = async ()=>{
    try{
        const response = await axios.post (`https://localhost:7028/api/customers/${customerId}/phones`, newCustomerPhone);
        setCustomersPhone([response.data, ...customersPhone]);
        setNewCustomerPhone({
            PhoneType:'',
            PhoneNumber:''
        });
        handleCloseModal();
    }catch (error){
        console.error('error creating customerPhone', error);
    }
  };

  const handleUpdateCustomerPhone = async () =>{
    try{
        await axios.put (`https://localhost:7028/api/customers/${customerId}/phones/${selectedCustomerPhoneId}`, newCustomerPhone);

        const response = await axios.get(`https://localhost:7028/api/customers/${customerId}/phones`);

        const updateCustomersPhone = response.data;

        setCustomersPhone(updateCustomersPhone);

        setNewCustomerPhone({
            PhoneType:'',
            PhoneNumber:''
        })

        handleCloseModal();
    }catch(error){
        console.error('error updating Phone', error)
    }
  };

  const handleDeleteCustomerPhone = async (customerPhoneId)=>{
    try{
        await axios.delete (`https://localhost:7028/api/customers/${customerId}/phones/${customerPhoneId}`);

        const updateCustomersPhone = customersPhone.filter((customerPhone)=>customerPhone.customerPhoneId !== customerPhoneId);
        setCustomersPhone(updateCustomersPhone);
    }catch(error){
        console.error('error deleting phone');
    }
  };

  const handleShowCreateModal = () => {
    setModalAction('create');
    setShowModal(true);
    };

  const handleShowEditModal = (customerPhoneId) => {
        
    setModalAction ('edit')
    setSelectedCustomerPhoneId(customerPhoneId);

    const selectedCustomerPhone = customersPhone.find((customerPhone)=> customerPhone.customerPhoneId !== customerPhoneId);

    if(selectedCustomerPhone){
        setNewCustomerPhone({
            PhoneType: selectedCustomerPhone.PhoneType || '',
            PhoneNumber: selectedCustomerPhone.PhoneNumber || ''
        })
    }

    setShowModal(true)
    };

    const handleShowDetailModal = (customerPhoneId) => {
        
        setModalAction ('detail')
        setSelectedCustomerPhoneId(customerPhoneId);
    
        const selectedCustomerPhone = customersPhone.find((customerPhone)=> customerPhone.customerPhoneId !== customerPhoneId);
    
        if(selectedCustomerPhone){
            setNewCustomerPhone({
                PhoneType: selectedCustomerPhone.PhoneType || '',
                PhoneNumber: selectedCustomerPhone.PhoneNumber || ''
            })
        }
    
        setShowModal(true)
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewCustomerPhone({
          PhoneType: '',
          PhoneNumber: '',
         
        });
        setSelectedCustomerPhoneId('');
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
        history.goBack();
    };

    return(
        <div>
            <header>
                <div>
                    <img src = "" alt='logo'/>
                    <h1>Autopartes JUCAR</h1>
                </div>
            </header>
            <br>
            <h2>Telefono Clientes</h2>
            </br>

            <Button variant="primary" onClick={handleShowCreateModal}>
            <FontAwesomeIcon icon={faPlus} /> Nuevo Telefono
            </Button>
            <Button variant="danger" onClick={handleGoBack}>
              Volver
            </Button>

            <hr/>

            <Table>
                <thead>
                <tr>
                    <th>Tipo de Telefono</th>
                    <th>Numero de telefono</th>
                </tr>
                </thead> 
                <tbody>
                {currentCustomersPhone.map((customerPhone)=>(
                    <tr key ={customerPhone.providerPhoneId}>
                        <td>{customerPhone.PhoneType}</td>
                        <td>{customerPhone.PhoneNumber}</td>
                        <td>
                            <Button variant='info' onClick={()=> handleShowEditModal(customerPhone.customerPhoneId)}>
                                <FontAwesomeIcon icon = {faEdit}/> Actualizar
                            </Button>
                            <Button variant='danger' onClick={()=>handleDeleteCustomerPhone(customerPhone.customerPhoneId)}>
                                <FontAwesomeIcon icon = {faTrash}/> Eliminar
                            </Button>
                            <Button variant='primary' onClick={()=> handleShowDetailModal (customerPhone.customerPhoneId)}>
                                <FontAwesomeIcon icon={faEye}/> Ver Detalles
                            </Button>
                                
                        </td>
                    </tr>
                ))}
                </tbody>

            </Table>

            <Pagination>
            {Array.from({ length: Math.ceil(customersPhone.length / itemsPerPage) }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
                </Pagination.Item>
             ))}
            </Pagination>

            <Modal show ={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                {modalAction === 'create'
                    ? 'Nuevo Telefono'
                    : modalAction === 'edit'
                    ? 'Actualizar Telefono'
                    : 'Detalle de Telefono'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
            {modalAction !== 'detail' && (
            <Form>
             <Form.Group controlId='formProvioderPhoneType'>
              <Form.Label>Tipo de Telefono</Form.Label>
              <Form.Control
                  type="text"
                  placeholder="Ingrese el tipo de telefono"
                  value={newCustomerPhone.PhoneType}
                  onChange={(e) => setNewCustomerPhone({ ...newCustomerPhone, phoneType: e.target.value })}
                />
             </Form.Group>

              <Form.Group controlId='formProvioderPhoneNumber'>
              <Form.Label>Numero de Telefono</Form.Label>
              <Form.Control
                  type="number"
                  placeholder="Ingrese el numeor de telefono"
                  value={newCustomerPhone.PhoneNumber}
                  onChange={(e) => setNewCustomerPhone({ ...newCustomerPhone, PhoneNumber: e.target.value })}
                />
             </Form.Group>
            </Form>
            )}


            {modalAction === 'detail' &&(
                <div>
                    {selectedCustomerPhoneId && (
                        <div>
                            <h4>Detalles del telefono</h4>
                            <p>ID: {selectedCustomerPhoneId}</p>
                            <p>Tipo de telefono: {newCustomerPhone.PhoneType}</p>
                            <p>Numero de telefono: {newCustomerPhone.PhoneNumber} </p>
                        </div>
                    )}
                </div>
            )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant='secondary' onClick={handleCloseModal}>
                    Cancelar
                </Button>
                {modalAction !== 'detail' && (
                    <Button
                    variant='primary'
                    onClick={modalAction === 'create' ? handleCreateCustomerPhone: handleUpdateCustomerPhone}
                    >
                 
                    {modalAction === 'create' ? 'Crear':'Actualizar'}
                    </Button>
                )}
            </Modal.Footer>
            </Modal>
        </div>
    )
};

export default CustomersPhone