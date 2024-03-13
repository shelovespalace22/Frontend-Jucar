import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProviderPhones = ({ providerId })  => {
    const [providerPhones, setProviderPhones] = useState ([]);
    const [newProviderPhone, setNewProviderPhone] = useState({
        PhoneType: '',
        PhoneNumber: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedProviderPhoneId, setSelectedProviderPhoneId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentproviderPhones = providerPhones.slice(indexOfFirstItem, indexOfLastItem);
    const history = useHistory();
  
    useEffect(() => {
        const fetchproviderPhones = async () => {
            try{
                const response = await axios.get(`https://localhost:7028/api/providers/${providerId}/phones`);

                setProviderPhones(response.data)

            } catch(error){
                console.error('Error fetching providerPhones', error);
            }
        };

        fetchproviderPhones();
    }, [providerId]);

    const handleCreateProviderPhone = async () => {
        try {
          const response = await axios.post(`https://localhost:7028/api/providers/${providerId}/phones`, newProviderPhone);
      
          setProviderPhones([response.data, ...providerPhones]);
      
          setNewProviderPhone({
            PhoneType: '',
            PhoneNumber: '',
          });
      
          handleCloseModal();
      
          
          Swal.fire(
            '¡Éxito!',
            '¡El teléfono del proveedor ha sido creado exitosamente.',
            'success'
          );
        } catch (error) {
          console.error('Error creating phone', error);
      
         
          Swal.fire(
            'Error',
            'Hubo un problema al crear el teléfono del proveedor.',
            'error'
          );
        }
      };
      

    const handleUpdateProviderPhone = async () => {
        try{
            await axios.put(`https://localhost:7028/api/providers/${providerId}/phones/${selectedProviderPhoneId}`, newProviderPhone);

            const response = await axios.get(`https://localhost:7028/api/providers/${providerId}/phones`);

            const updateproviderPhones = response.data;

            setProviderPhones(updateproviderPhones);

            setNewProviderPhone({
                PhoneType:'',
                PhoneNumber:'',
            })

            handleCloseModal();
        } catch (error){
            console.error ('Error updating phone', error);
        }
    };

    const handleDeleteProviderPhone = async (providerPhoneId) => {
        
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
              
              await axios.delete(`https://localhost:7028/api/providers/${providerId}/phones/${providerPhoneId}`);

              const updatedProviderPhones = providerPhones.filter((providerPhone) => providerPhone.providerPhoneID !== providerPhoneId);
              
              setProviderPhones(updatedProviderPhones);
              
              Swal.fire(
                '¡Eliminado!',
                '¡Tu teléfono del proveedor ha sido eliminado.',
                'success'
              );
            } catch (error) {
              console.error('Error deleting phone:', error);
              
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar el teléfono del proveedor.',
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

    const handleShowEditModal = (providerPhoneId) => {
        
        setModalAction ('edit')
        setSelectedProviderPhoneId(providerPhoneId);
    
        const selectedProviderPhone = providerPhones.find((providerPhone)=> providerPhone.providerPhoneID === providerPhoneId);

        if(selectedProviderPhone){
            setNewProviderPhone({
                PhoneType: selectedProviderPhone.phoneType || '',
                PhoneNumber: selectedProviderPhone.phoneNumber || '',
            });
        }

        setShowModal(true);
    };

    const handleShowDetailModal = (providerPhoneId) => {
        setModalAction('detail')
        setSelectedProviderPhoneId(providerPhoneId);

        const selectedProviderPhone = providerPhones.find((providerPhone) => providerPhone.providerPhoneID === providerPhoneId);

        if (selectedProviderPhone){
            setNewProviderPhone({
                PhoneType: selectedProviderPhone.phoneType || '',
                PhoneNumber: selectedProviderPhone.phoneNumber || ''
            });
        }
        setShowModal(true);
    }   

    const handleCloseModal = () => {
        setShowModal(false);
        setNewProviderPhone({
          PhoneType: '',
          PhoneNumber: '',
        });
        setSelectedProviderPhoneId('');
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
        history.goBack();
    };
    
    return(
        <div>
            <br />
            <h2>Teléfonos del Proveedor</h2>
            <br /> 

            <Button variant="primary" onClick={handleShowCreateModal}>
                <FontAwesomeIcon icon={faPlus} /> Nuevo Telefono
            </Button>

            <Button variant="danger" onClick={handleGoBack}>
                Volver
            </Button>
            <hr />

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tipo de Teléfono</th>
                        <th>Número de Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead> 
                <tbody>
                    {currentproviderPhones.map((providerPhone)=>(
                        <tr key ={providerPhone.providerPhoneID}>
                            <td>{providerPhone.phoneType}</td>
                            <td>{providerPhone.phoneNumber}</td>
                            <td>
                                <Button variant='info' onClick={()=> handleShowEditModal(providerPhone.providerPhoneID)}>
                                    <FontAwesomeIcon icon = {faEdit}/> Actualizar
                                </Button>
                                <Button variant='danger' onClick={()=> handleDeleteProviderPhone(providerPhone.providerPhoneID)}>
                                    <FontAwesomeIcon icon = {faTrash}/> Eliminar
                                </Button>
                                <Button variant='primary' onClick={()=> handleShowDetailModal(providerPhone.providerPhoneID)}>
                                    <FontAwesomeIcon icon={faEye}/> Ver Detalles
                                </Button>
                                    
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
            {Array.from({ length: Math.ceil(providerPhones.length / itemsPerPage) }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
                </Pagination.Item>
            ))}
            </Pagination>

            <Modal show={showModal} onHide={handleCloseModal}>

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
                                    placeholder="Ingrese el tipo de teléfono..."
                                    value={newProviderPhone.PhoneType}
                                    onChange={(e) => setNewProviderPhone({ ...newProviderPhone, PhoneType: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group controlId='formProvioderPhoneNumber'>
                                <Form.Label>Numero de Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el número de teléfono..."
                                    value={newProviderPhone.PhoneNumber}
                                    onChange={(e) => setNewProviderPhone({ ...newProviderPhone, PhoneNumber: e.target.value })}
                                />
                            </Form.Group>
                        </Form>
                    )}
                    {modalAction === 'detail' &&(
                        <div>
                            {selectedProviderPhoneId && (
                                <div>
                                    <h4>Detalles del Teléfono</h4>
                                    <p><b>ID:</b> {selectedProviderPhoneId}</p>
                                    <p><b>Tipo de teléfono:</b> {newProviderPhone.PhoneType}</p>
                                    <p><b>Numero de telefono:</b> {newProviderPhone.PhoneNumber} </p>
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
                            onClick={modalAction === 'create' ? handleCreateProviderPhone : handleUpdateProviderPhone}
                        >
                            
                            {modalAction === 'create' ? 'Crear':'Actualizar'}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProviderPhones;