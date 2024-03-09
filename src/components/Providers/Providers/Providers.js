import React, { useState, useEffect } from 'react';
import {  Button, Form, Modal, Pagination, ModalHeader, Table } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';




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
    const history = useHistory();

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
            console.error('Error updating autopart:', error);
        }
    };

    const handleDeleteProvider = async (providerId) => {
        try{
            await axios.delete(`https://localhost:7028/api/providers/${providerId}`);

            const updatedProviders = providers.filter((provider) => provider.providerID !== providerId);
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

        const selectedProvider = providers.find((provider)=> provider.providerID === providerId);

        if(selectedProvider){
            setNewProvider({
                IdentifierType: selectedProvider.identifierType || '',
                IdentifierNumber:selectedProvider.identifierNumber || '',
                Name: selectedProvider.name || '',
                EmailAddress: selectedProvider.emailAddress || '',
                ProductType: selectedProvider.productType || '',
                ProviderAddresses: [{
                    Address:selectedProvider.address ||'',
                    AddressType: selectedProvider.addressType || '',
                    NeighborhoodId: selectedProvider.neighborhoodId || ''
                }],
                ProviderPhone:[{
                    PhoneType:selectedProvider.phoneType ||'',
                    PhoneNumber:selectedProvider.phoneNumber ||''
                }]
            });

            setShowModal(true);
        }
    };

    const handleShowDetailModal = (providerId) => {
        setModalAction('detail');
        setSelectedProviderId(providerId);

        const selectedProvider = providers.find((provider)=> provider.providerID === providerId);

        if(selectedProvider){
            setNewProvider({
                IdentifierType: selectedProvider.identifierType || '',
                IdentifierNumber: selectedProvider.identifierNumber || '',
                Name: selectedProvider.name || '',
                EmailAddress: selectedProvider.emailAddress || '',
                ProductType: selectedProvider.productType || '',
                ProviderAddresses: [{
                    Address: selectedProvider.address ||'',
                    AddressType: selectedProvider.addressType || '',
                    NeighborhoodId: selectedProvider.neighborhoodId || ''
                }],
                ProviderPhone:[{
                    PhoneType: selectedProvider.phoneType ||'',
                    PhoneNumber: selectedProvider.phoneNumber ||''
                }]
            });

            setShowModal(true);
        }
    };

    const handleShowPhones = (providerId) => {
        history.push('/provider-phones', { providerId });
    };
    
    const handleShowAddresses = (providerId) => {
        history.push('/provider-addresses', { providerId });
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
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProviders.map((provider)=>(
                        <tr key={provider.providerID}>
                            <td>{provider.identifierType}</td>
                            <td>{provider.identifierNumber}</td>
                            <td>{provider.name}</td>
                            <td>{provider.emailAddress}</td>
                            <td>{provider.productType}</td>
                            <td>
                                <Button variant='info' onClick={()=> handleShowEditModal(provider.providerID)}>
                                    <FontAwesomeIcon icon = {faEdit}/> Actualizar
                                </Button>
                                <Button variant='danger' onClick={()=> handleDeleteProvider(provider.providerID)}>
                                    <FontAwesomeIcon icon = {faTrash}/> Eliminar 
                                </Button>
                                <Button variant='primary' onClick={()=>handleShowDetailModal(provider.providerID)}>
                                    <FontAwesomeIcon icon={faEye}/> Ver Detalle
                                </Button>
                                <Button variant='success' onClick={() => handleShowPhones(provider.providerID)}>
                                    <FontAwesomeIcon icon={faPhone} />
                                </Button>
                                <Button variant='danger' onClick={() => handleShowAddresses(provider.providerID)}>
                                    <FontAwesomeIcon icon={faLocationDot} />
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
                        ? 'Nuevo Proveedor'
                        : modalAction === 'edit'
                        ? 'Actualizar Proveedor'
                        : 'Detalle de Proveedor'}
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
                                    placeholder='Ingrese el Número de identificacion...'
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
                                    <p><b>ID:</b>{selectedProviderId}</p>
                                    <p><b>Tipo de Identificacion:</b> {newProvider.IdentifierType}</p>
                                    <p><b>Numero de identificacion: </b>{newProvider.IdentifierNumber}</p>
                                    <p><b>Nombre del Proveedor:</b> {newProvider.Name}</p>
                                    <p><b>Correo electronico del proveedor:</b> {newProvider.EmailAddress}</p>
                                    <p><b>Producto: </b>{newProvider.ProductType}</p>        
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