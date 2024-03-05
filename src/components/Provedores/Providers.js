import React, { useState, useEffect } from 'react';
import {  Button, Form, Modal, Pagination, ModalHeader, Table } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { useHistory } from 'react-router-dom';




const Providers = () => {
   const [providers, setProviders] = useState ([]);
   const [newProvider, setNewProvider] = useState({
    IdentifierType: '',
    IdentifierNumber: '',
    Name: '',
    EmailAddress: '',
    ProductType: '',
    ProviderAddresses: [{
        Address:'',
        AddressType: '',
        NeighborhoodId: ''
    }],
    ProviderPhone:[{
        PhoneType:'',
        PhoneNumber:''
    }]

   });

   const [showModal, setShowModal] = useState(false);
   const [modalAction, setModalAction] = useState('create');
   const [selectedProviderId, setSelectedProviderId] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [itemsPerPage] = useState(10);
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentProviders = providers.slice(indexOfFirstItem, indexOfLastItem);

   useEffect (()=>{
    const fetchProviders = async () =>{
        try{
            const response = await axios.get(`https://localhost:7028/api/providers`);
            setProviders(response.data);
        } catch (error){
            console.error('Error fetching providers')
        }
    };
    fetchProviders();
   }, [])

   const handleCreateProvider = async () => {
        try{
            const response = await axios.post ('https://localhost:7028/api/providers', newProvider);
            
            setProviders ([response.data, ...providers]);

            setNewProvider({
                IdentifierType: '',
                IdentifierNumber: '',
                Name: '',
                EmailAddress: '',
                ProductType: '',
                ProviderAddresses: [{
                    Address:'',
                    AddressType: '',
                    NeighborhoodId: ''
                }],
                ProviderPhone:[{
                    PhoneType:'',
                    PhoneNumber:''
                }]
            });
            handleCloseModal();

        }catch (error){
            console.error('Error creating a provider')
        }
   };

   const handleUpdateProvider = async () => {
        try{
            await axios.put(
            `https://localhost:7028/api/providers/${selectedProviderId}`,
            newProvider
            );

            const response = await axios.get(`https://localhost:7028/api/providers`);

            const updatedProviders = response.data;

            setProviders(updatedProviders);

            setNewProvider({
                IdentifierType: '',
                IdentifierNumber: '',
                Name: '',
                EmailAddress: '',
                ProductType: '',
                ProviderAddresses: [{
                    Address:'',
                    AddressType: '',
                    NeighborhoodId: ''
                }],
                ProviderPhone:[{
                    PhoneType:'',
                    PhoneNumber:''
                }]
            });

            handleCloseModal();
        
        }catch (error){
            console.error('error updating provider')
        }
   }

   const handleDeleteProvider = async(providerId) =>{
        try{
          await axios.delete(`https://localhost:7028/api/providers/${providerId}`);

          const updatedProviders = providers.filter((provider) => provider.providerId !== providerId);
          setProviders(updatedProviders);
        }catch(error){
         console.error ('error deleting provider')
        }
   };

   const handleShowCreateModal = () => {
    setModalAction('create');
    setShowModal(true);
  };

  const handleShowEditModal = (providerId) => {
        setModalAction('edit');
        setSelectedProviderId(providerId);

        const selectedProvider = providers.find((provider)=> provider.providerId === providerId);

        if(selectedProvider){
          setNewProvider({
                IdentifierType: selectedProvider.IdentifierType || '',
                IdentifierNumber:selectedProvider.IdentifierNumber || '',
                EmailAddress: selectedProvider.EmailAddress || '',
                ProductType: selectedProvider.ProductType || '',
                ProviderAddresses: [{
                    Address:selectedProvider.Address ||'',
                    AddressType: selectedProvider.AddressType || '',
                    NeighborhoodId: selectedProvider.NeighborhoodId || ''
                }],
                ProviderPhone:[{
                    PhoneType:selectedProvider.PhoneType ||'',
                    PhoneNumber:selectedProvider.PhoneNumber ||''
                }]
            });

            setShowModal(true);
        }
    };

  const handleShowDetailModal = (providerId) => {
        setModalAction('detail');
        setSelectedProviderId(providerId);

        const selectedProvider = providers.find((provider)=> provider.providerId === providerId);

        if(selectedProvider){
            setNewProvider({
                IdentifierType: selectedProvider.IdentifierType || '',
                IdentifierNumber:selectedProvider.IdentifierNumber || '',
                EmailAddress: selectedProvider.EmailAddress || '',
                ProductType: selectedProvider.ProductType || '',
                ProviderAddresses: [{
                    Address:selectedProvider.Address ||'',
                    AddressType: selectedProvider.AddressType || '',
                    NeighborhoodId: selectedProvider.NeighborhoodId || ''
                }],
                ProviderPhone:[{
                    PhoneType:selectedProvider.PhoneType ||'',
                    PhoneNumber:selectedProvider.PhoneNumber ||''
                }]
            });

            setShowModal(true);
        }
    };

   const handleCloseModal = () => {
        setShowModal(false);
        setNewProvider({
            IdentifierType: '',
            IdentifierNumber: '',
            Name: '',
            EmailAddress: '',
            ProductType: '',
            ProviderAddresses: [{
                Address:'',
                AddressType: '',
                NeighborhoodId: ''
            }],
            ProviderPhone:[{
                PhoneType:'',
                PhoneNumber:''
            }]
        });
        setSelectedProviderId('');
    };
    const handleGoBack = () => {
        // eslint-disable-next-line no-restricted-globals, no-unused-expressions
        history.back
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    
    return(
        <div>
            <header>
                <div>
                    <img src="" alt="logo"/>
                    <h1>Autupartes JUCAR</h1>
                </div>
            </header>
            <br/>
            <h2>Modulo Provedores</h2>
            <br/>
            <Button variant="primary" onClick={handleShowCreateModal}>
            <FontAwesomeIcon icon={faPlus} /> Nueva Autoparte
            </Button>
            <Button variant="danger" onClick={handleGoBack}>
                Volver
            </Button>

            <hr />

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tipo de identificacion</th>
                        <th>Numero de identificacion</th>
                        <th>Nombre</th>
                        <th>Correo Electronico</th>
                        <th>Tipo de producto</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProviders.map((provider)=>(
                        <tr key={provider.providerId}>
                            <td>{provider.IdentifierType}</td>
                            <td>{provider.IdentifierNumber}</td>
                            <td>{provider.Name}</td>
                            <td>{provider.EmailAddress}</td>
                            <td>{provider.ProductType}</td>
                            <td>
                                <Button variant='info' onClick={()=> handleShowEditModal(provider.providerId)}>
                                    <FontAwesomeIcon icon = {faEdit}/> Actualizar
                                </Button>
                                <Button variant='danger' onClick={()=> handleDeleteProvider(provider.providerId)}>
                                    <FontAwesomeIcon icon = {faTrash}/> Eliminar 
                                </Button>
                                <Button variant='primary' onClick={()=>handleShowDetailModal(provider.providerId)}>
                                    <FontAwesomeIcon icon={faEye}/> Ver detalle
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            
            <Pagination>
             {Array.from({ length: Math.ceil(providers.length / itemsPerPage) }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                 {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>

            <Modal show={showModal} onHide={handleCloseModal}>
                <ModalHeader>
                    <Modal.Title>
                        {modalAction === 'create'
                        ?'Nuevo proverdor'
                        : modalAction === 'edit'
                        ?'Actualizar proveedor'
                        :'Detalle proveedor'}
                    </Modal.Title>
                </ModalHeader>
                <Modal.Body>
                    {modalAction !== 'detail' &&(
                        <Form>
                            <Form.Group controlId='formProviderIdentifierType'>
                                <Form.Label>Tipo de Identificacion</Form.Label>
                                <Form.Control 
                                 type = "text" 
                                 placeholder='Ingrese el Tipo de identificacion (CC, TI, ETC)..'
                                 value={newProvider.IdentifierType}
                                 onChange={(e)=>setNewProvider({...newProvider, IdentifierType: e.target.value})}
                                 />
                            </Form.Group>
                            <Form.Group controlId='formProviderIdentifierNumber'>
                                <Form.Label>Numero de Identificacion</Form.Label>
                                <Form.Control 
                                 type = "text" 
                                 placeholder='Ingrese el Numero de identificacion (CC, TI, ETC)..'
                                 value={newProvider.IdentifierNumber}
                                 onChange={(e)=>setNewProvider({...newProvider, IdentifierNumber: e.target.value})}
                                 />
                            </Form.Group>
                            <Form.Group controlId='formProviderName'>
                                <Form.Label>Nombre completo</Form.Label>
                                <Form.Control 
                                 type = "text" 
                                 placeholder='Ingrese su Nombre y Apellidos'
                                 value={newProvider.Name}
                                 onChange={(e)=>setNewProvider({...newProvider, Name: e.target.value})}
                                 />
                            </Form.Group>
                            <Form.Group controlId='formProviderEmailAddress'>
                                <Form.Label>Correo Electronico</Form.Label>
                                <Form.Control 
                                 type = "text" 
                                 placeholder='Ingrese su correo electronico'
                                 value={newProvider.EmailAddress}
                                 onChange={(e)=>setNewProvider({...newProvider, EmailAddress: e.target.value})}
                                 />
                            </Form.Group>
                            <Form.Group controlId='formProviderProductType'>
                                <Form.Label>Tipo de producto que provee</Form.Label>
                                <Form.Control 
                                 type = "text" 
                                 placeholder='Ingrese su producto'
                                 value={newProvider.ProductType}
                                 onChange={(e)=>setNewProvider({...newProvider, ProductType: e.target.value})}
                                 />
                            </Form.Group>



                        </Form>
                    )}
                    {modalAction === 'detail' && (
                        <div>
                            {selectedProviderId && (
                                <div>
                                    <h4>Detalles del Proveedor</h4>
                                    <p>ID: {selectedProviderId}</p>
                                    <p>Tipo de Identificacion: {newProvider.IdentifierType}</p>
                                    <p>Numero de identificacion: {newProvider.IdentifierNumber}</p>
                                    <p>Nombre del Proveedor: {newProvider.Name}</p>
                                    <p>Correo electronico del proveedor: {newProvider.EmailAddress}</p>
                                    <p>Producto: {newProvider.ProductType}</p>          
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                 <Button variant='secondary'onClick={handleCloseModal}>
                    Cancelar
                 </Button>
                 {modalAction !== 'detail' && (
                    <Button variant='primary' onClick={modalAction === 'create' ? handleCreateProvider: handleUpdateProvider }>
                        {modalAction === 'create' ? 'Crear': 'Actualizar'}
                    </Button>
                 )}
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default Providers;