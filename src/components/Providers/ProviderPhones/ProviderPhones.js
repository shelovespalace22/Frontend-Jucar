import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const ProviderPhones = ({providerId})  => {
    const [ProvidersPhone, setProvidersPhone] = useState ([]);
    const [newProviderPhone, setNewProviderPhone] =  useState({
        PhoneType:'',
        PhoneNumber:''
    })

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('create');
  const [selectedProviderPhoneId, setSelectedProviderPhoneId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProvidersPhone = ProvidersPhone.slice(indexOfFirstItem, indexOfLastItem);
  const history = useHistory();
  
  useEffect (() => {
    const fetchProvidersPhone = async () => {
        try{
            const response = await axios.get (`https://localhost:7028/api/providers/${providerId}/phones`)
            setProvidersPhone (response.data)
        }catch (error){
            console.error('Error fetching ProvidersPhone')
        }
    };

    fetchProvidersPhone();
    },[providerId]);

    const handleCreateProviderPhone = async () => {
        try { 
            const response = await axios.post (`https://localhost:7028/api/providers/${providerId}/phones`, newProviderPhone);

            setProvidersPhone([response.data, ...ProvidersPhone]);

            setNewProviderPhone({
                PhoneType:'',
                PhoneNumber:''
            });
            handleCloseModal();
        }catch (error){
            console.error('Error creating Phone')
        }
    };

    const handleUpdateProviderPhone = async () => {
        try{
            await axios.put (`https://localhost:7028/api/providers/${providerId}/phones/${selectedProviderPhoneId}`, newProviderPhone);

            const response = await axios.get(`https://localhost:7028/api/providers/${providerId}/phones`);

            const updateProvidersPhone = response.data;

            setProvidersPhone(updateProvidersPhone);

            setNewProviderPhone({
                PhoneType:'',
                PhoneNumber:''
            })

            handleCloseModal();
        }catch (error){
            console.error ('error updating Phone')
        }
    };

    const handleDeleteProviderPhone = async (providerPhoneId) => {
        try{
            await axios.delete(`https://localhost:7028/api/providers/${providerId}/phones/${providerPhoneId}`);

            const updateProvidersPhone = ProvidersPhone.filter((providerPhone)=> providerPhone.providerPhoneId !== providerPhoneId);
            setProvidersPhone(updateProvidersPhone);
        }catch(error){
            console.error('error deleting Phone')
        }
    };

    const handleShowCreateModal = () => {
        setModalAction('create');
        setShowModal(true);
    };

    const handleShowEditModal = (providerPhoneId) => {
        
        setModalAction ('edit')
        setSelectedProviderPhoneId(providerPhoneId);
    
        const selectedProviderPhone = ProvidersPhone.find((providerPhone)=> providerPhone.providerPhoneId !== providerPhoneId);

        if(selectedProviderPhone){
            setNewProviderPhone({
                PhoneType: selectedProviderPhone.PhoneType || '',
                PhoneNumber: selectedProviderPhone.PhoneNumber || ''
            })
        }

        setShowModal(true)
    };

    const handleShowDetailModal = (providerPhoneId) => {
        setModalAction('detail')
        setSelectedProviderPhoneId(providerPhoneId);

        const selectedProviderPhone = ProvidersPhone.find((providerPhone) => providerPhone.providerPhoneId === providerPhoneId);

        if (selectedProviderPhone){
            setNewProviderPhone({
                PhoneType: selectedProviderPhone.phoneType || '',
                PhoneNumber: selectedProviderPhone.PhoneNumber || ''
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
        <header>
                <div>
                    <img src="" alt="logo"/>
                    <h1>Autupartes JUCAR</h1>
                </div>
        </header>
        <br>
        <h2>Telefono Provedores</h2>
        </br> 

        <Button variant="primary" onClick={handleShowCreateModal}>
        <FontAwesomeIcon icon={faPlus} /> Nuevo Telefono
        </Button>
        <Button variant="danger" onClick={handleGoBack}>
            Volver
        </Button>

        <hr />
      <Table>
        <thead>
            <tr>
                <th>Tipo de Telefono</th>
                <th>Numero de telefono</th>
            </tr>
         </thead> 
          <tbody>
            {currentProvidersPhone.map((providerPhone)=>(
                <tr key ={providerPhone.providerPhoneId}>
                    <td>{providerPhone.PhoneType}</td>
                    <td>{providerPhone.PhoneNumber}</td>
                    <td>
                        <Button variant='info' onClick={()=> handleShowEditModal(providerPhone.providerPhoneId)}>
                            <FontAwesomeIcon icon = {faEdit}/> Actualizar
                        </Button>
                        <Button variant='danger' onClick={()=>handleDeleteProviderPhone(providerPhone.providerPhoneId)}>
                            <FontAwesomeIcon icon = {faTrash}/> Eliminar
                        </Button>
                        <Button variant='primary' onClick={()=> handleShowDetailModal (providerPhone.providerPhoneId)}>
                            <FontAwesomeIcon icon={faEye}/> Ver Detalles
                        </Button>
                            
                    </td>
                </tr>
            ))}
          </tbody>
       </Table>

       <Pagination>
        {Array.from({ length: Math.ceil(ProvidersPhone.length / itemsPerPage) }, (_, index) => (
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
                  value={newProviderPhone.PhoneType}
                  onChange={(e) => setNewProviderPhone({ ...newProviderPhone, phoneType: e.target.value })}
                />
             </Form.Group>

              <Form.Group controlId='formProvioderPhoneNumber'>
              <Form.Label>Numero de Telefono</Form.Label>
              <Form.Control
                  type="number"
                  placeholder="Ingrese el numeor de telefono"
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
                            <h4>Detalles del telefono</h4>
                            <p>ID: {selectedProviderPhoneId}</p>
                            <p>Tipo de telefono: {newProviderPhone.PhoneType}</p>
                            <p>Numero de telefono: {newProviderPhone.PhoneNumber} </p>
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
                 onClick={modalAction === 'create' ? handleCreateProviderPhone: handleUpdateProviderPhone}
                >
                 
                 {modalAction === 'create' ? 'Crear':'Actualizar'}
                 </Button>
            )}
        </Modal.Footer>
     </Modal>
    </div>
  )
};

export default ProviderPhones;