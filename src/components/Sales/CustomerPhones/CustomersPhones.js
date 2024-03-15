import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const CustomersPhones = ( {customerId} )=>{
    const [customersPhone, setCustomersPhone] = useState ([]);
    const [newCustomerPhone, setNewCustomerPhone] =  useState({
        PhoneType:'',
        PhoneNumber:'',
    });
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedCustomerPhoneId, setSelectedCustomerPhoneId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCustomersPhone = customersPhone.slice(indexOfFirstItem, indexOfLastItem);
    const history = useHistory();

    useEffect (() => {
        const fetchCustomersPhone = async () => {
            try{
                const response = await axios.get(`https://localhost:7028/api/customers/${customerId}/phones`);

                setCustomersPhone (response.data);

            } catch(error){
                console.error('error fetching customers phone', error);
            }
        };

        fetchCustomersPhone();

    }, [customerId]);



    const handleCreateCustomerPhone = async () => {
        try {
          const response = await axios.post(`https://localhost:7028/api/customers/${customerId}/phones`, newCustomerPhone);
      
          setCustomersPhone([response.data, ...customersPhone]);
      
          setNewCustomerPhone({
            PhoneType: '',
            PhoneNumber: '',
          });
      
          handleCloseModal();
      
          
          Swal.fire(
            '¡Éxito!',
            '¡El teléfono del cliente ha sido creado exitosamente.',
            'success'
          );
        } catch (error) {
          console.error('Error creating customerPhone', error);
      
       
          Swal.fire(
            'Error',
            'Hubo un problema al crear el teléfono del cliente.',
            'error'
          );
        }
      };
      

      const handleUpdateCustomerPhone = async () => {
        try {
          await axios.put(
            `https://localhost:7028/api/customers/${customerId}/phones/${selectedCustomerPhoneId}`,
            newCustomerPhone
          );
      
          const response = await axios.get(`https://localhost:7028/api/customers/${customerId}/phones`);
      
          const updatedCustomerPhones = response.data;
      
          setCustomersPhone(updatedCustomerPhones);
      
          setNewCustomerPhone({
            PhoneType: '',
            PhoneNumber: '',
          });
      
          handleCloseModal();
     
          Swal.fire(
            '¡Éxito!',
            '¡El teléfono del cliente ha sido actualizado exitosamente.',
            'success'
          );
        } catch (error) {
          console.error('Error updating Phone:', error);
      
          Swal.fire(
            'Error',
            'Hubo un problema al actualizar el teléfono del cliente.',
            'error'
          );
        }
      };
      
    const handleDeleteCustomerPhone = async (customerPhoneId) => {
        
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminarlo!'

        }).then(async (result) => {
            
          if (result.isConfirmed) {
            try {
             
              await axios.delete(`https://localhost:7028/api/customers/${customerId}/phones/${customerPhoneId}`);

              const updatedCustomersPhone = customersPhone.filter((customerPhone) => customerPhone.customerPhoneID !== customerPhoneId);

              setCustomersPhone(updatedCustomersPhone);
             
              Swal.fire(
                '¡Eliminado!',
                '¡El teléfono del cliente ha sido eliminado.',
                'success'
              );
            } catch (error) {

              console.error('Error deleting phone:', error);
             
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar el teléfono del cliente.',
                'error'
              );
            }
          }
        });
      };
      
    const handleShowCreateModal = () => {
        setModalAction('create');
        setShowModal(true);
    };

    const handleShowEditModal = (customerPhoneId) => {

        setModalAction ('edit')
        setSelectedCustomerPhoneId(customerPhoneId);

        const selectedCustomerPhone = customersPhone.find((customerPhone)=> customerPhone.customerPhoneID === customerPhoneId);

        if(selectedCustomerPhone){
            setNewCustomerPhone({
                PhoneType: selectedCustomerPhone.phoneType || '',
                PhoneNumber: selectedCustomerPhone.phoneNumber || '',
            });
        }

        setShowModal(true);
    };

    const handleShowDetailModal = (customerPhoneId) => {

        setModalAction ('detail');
        setSelectedCustomerPhoneId(customerPhoneId);

        const selectedCustomerPhone = customersPhone.find((customerPhone)=> customerPhone.customerPhoneID === customerPhoneId);

        if(selectedCustomerPhone){
            setNewCustomerPhone({
                PhoneType: selectedCustomerPhone.phoneType || '',
                PhoneNumber: selectedCustomerPhone.phoneNumber || '',
            });
        }

        setShowModal(true);
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

    return (
        <div>
            
            <br/>
            <h2>Telefonos del Cliente</h2>
            <br/>

            <Button variant="primary" onClick={handleShowCreateModal}>
                <FontAwesomeIcon icon={faPlus} /> Nuevo Teléfono
            </Button>

            <Button variant="danger" onClick={handleGoBack}>
                Volver
            </Button>

            <hr/>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tipo de Teléfono</th>
                        <th>Número de Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {currentCustomersPhone.map((customerPhone)=>(
                        <tr key ={customerPhone.customerPhoneID}>
                            <td>{customerPhone.phoneType}</td>
                            <td>{customerPhone.phoneNumber}</td>
                            <td>
                                <Button variant='info' onClick={()=> handleShowEditModal(customerPhone.customerPhoneID)}>
                                    <FontAwesomeIcon icon={faEdit}/> Actualizar
                                </Button>
                                <Button variant='danger' onClick={()=>handleDeleteCustomerPhone(customerPhone.customerPhoneID)}>
                                    <FontAwesomeIcon icon={faTrash}/> Eliminar
                                </Button>
                                <Button variant='primary' onClick={()=> handleShowDetailModal (customerPhone.customerPhoneID)}>
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
                        ? 'Nuevo Teléfono'
                        : modalAction === 'edit'
                        ? 'Actualizar Teléfono'
                        : 'Detalle de Teléfono'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalAction !== 'detail' && (
                    <Form>
                        <Form.Group controlId='formProvioderPhoneType'>
                            <Form.Label>Tipo de Teléfono</Form.Label>
                            <Form.Control
                            type="text"
                            placeholder="Ingrese el tipo de teléfono"
                            value={newCustomerPhone.PhoneType}
                            onChange={(e) => setNewCustomerPhone({ ...newCustomerPhone, PhoneType: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId='formProvioderPhoneNumber'>
                            <Form.Label>Numero de Teléfono</Form.Label>
                            <Form.Control
                            type="number"
                            placeholder="Ingrese el número de telefono"
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
                                <h4>Detalles del Teléfono</h4>
                                <p>ID: {selectedCustomerPhoneId}</p>
                                <p>Tipo de Teléfono: {newCustomerPhone.PhoneType}</p>
                                <p>Numero de Teléfono: {newCustomerPhone.PhoneNumber} </p>
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
    );
};

export default CustomersPhones;