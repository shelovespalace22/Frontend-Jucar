import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const ProviderAddresses = ({providerId}) => {
    const [addressProviders, setAddressProviders] = useState ([]);
    const [newAddressProvider, setNewAddressProvider] = useState({
        Address: '',
        AddressType: '', 
        NeighborhoodId: '' 
    });

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedAddressProviderId, setSelectedAddressProviderId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAddressProviders = addressProviders.slice(indexOfFirstItem, indexOfLastItem);
    const history = useHistory();

    useEffect(()=> {
    const fetchAddressProviders = async () => {
        try{
            const response = await axios.get (`https://localhost:7028/api/providers/${providerId}/addresses`);
            setAddressProviders(response.data);
        } catch (error){
            console.error('error fetching AddressProvider', error);

        }
    };
    fetchAddressProviders();

    }, [providerId]);

    const handleCreateAddressProvider = async () =>{
    try{
        const response = await axios.post (`https://localhost:7028/api/providers/${providerId}/addresses`);
        setAddressProviders([response.data, ...addressProviders]);

        setNewAddressProvider({
            Address: '',
            AddressType: '',
            NeighborhoodId: ''

        });

        handleCloseModal();
    }catch(error){
        console.error('Error creating Address')
    }
    };

    const handleUpdateAddressProvider = async () =>{
    try{
        await axios.put(
            `https://localhost:7028/api/providers/${providerId}/addresses/${selectedAddressProviderId}`,
            newAddressProvider
        );
        
        const response = await axios.get (`https://localhost:7028/api/providers/${providerId}/addresses`);

        const updatedAddressProviders = response.data;

        setAddressProviders(updatedAddressProviders);

        setNewAddressProvider({
            Address: '',
            AddressType: '',
            NeighborhoodId: ''

        });

        handleCloseModal();

    }catch (error) {
        console.error('Error updating Address')
    }
    };

    const handleDeleteAddressProvider = async (addressProviderId) => {
    try{
        await axios.delete (`https://localhost:7028/api/providers/${providerId}/addresses/${addressProviderId}`);

        const updatedAddressProviders = addressProviders.filter((addressProvider)=> addressProvider.addressProviderId !== addressProviderId);
        setAddressProviders(updatedAddressProviders);
    }catch (error){
        console.error('Error deleting Address', error);
    }
    };

    const handleShowCreateModal = () => {
    setModalAction('create');
    setShowModal(true);
    };

    const handleShowEditModal = (addressProviderId) => {
    setModalAction ('edit')
    setSelectedAddressProviderId(addressProviderId);

    const selectedAddressProvider = addressProviders.find((addressProvider)=> addressProvider.addressProviderId === addressProviderId);

    if(selectedAddressProvider){
        setNewAddressProvider({
            Address: selectedAddressProvider.Address || '', 
            AddressType: selectedAddressProvider.AddressType || '',
            NeighborhoodId: selectedAddressProvider.NeighborhoodId || ''

        });
        }

        setShowModal(true);
    };

    const handleShowDetailModal = (addressProviderId) => {
        setModalAction ('detail')
        setSelectedAddressProviderId(addressProviderId);

        const selectedAddressProvider = addressProviders.find((addressProvider)=> addressProvider.addressProviderId === addressProviderId);

        if(selectedAddressProvider){
            setNewAddressProvider({
                Address: selectedAddressProvider.Address || '', 
                AddressType: selectedAddressProvider.AddressType || '',
                NeighborhoodId: selectedAddressProvider.NeighborhoodId || ''

            });
            }

            setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewAddressProvider({
            Address: '',
            AddressType: '',
            NeighborhoodId: ''

        });


        setSelectedAddressProviderId('');
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
    history.goBack();
    };

    return(
    <div className='ContainerAddressP'>
        <header>
            <div>
                <img src="" alt="logo"/>
                <h1>Autupartes JUCAR</h1>
            </div>
        </header>
        <br/>
        <h2>Direcciones Provedores</h2>
        <br/> 

        <Button variant="primary" onClick={handleShowCreateModal}>
        <FontAwesomeIcon icon={faPlus} /> Nueva Direccion
        </Button>
        <Button variant="danger" onClick={handleGoBack}>
            Volver
        </Button>

        <hr/>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Direccion</th>
                    <th>Tipo de direccion</th>
                    <th>ID del Barrio</th>
                </tr>
            </thead>

            <tbody>
                {currentAddressProviders.map((addressProvider)=>(
                    <tr key={addressProvider.addressProviderId}>
                        <td>{addressProvider.Address}</td>
                        <td>{addressProvider.AddressType}</td>
                        <td>{addressProvider.NeighborhoodId}</td>
                        <td>
                        <Button variant='info' onClick={()=> handleShowEditModal(addressProvider.addressProviderId)}>
                            <FontAwesomeIcon icon ={faEdit}/> Actualizar    
                        </Button>

                        <Button variant = "danger" onClick={()=>handleDeleteAddressProvider(addressProvider.addressProviderId)}>
                            <FontAwesomeIcon icon={faTrash}/> Eliminar
                        </Button>

                        <Button variant='primary' onClick={()=> handleShowDetailModal(addressProvider.addressProviderId)}>
                            <FontAwesomeIcon icon={faEye}/> Ver detalle 
                        </Button>

                        </td>     
                    </tr>
                    
                ))}
            </tbody>
        </Table>

        <Pagination>
        {Array.from({ length: Math.ceil(addressProviders.length / itemsPerPage) }, (_, index) => (
            <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
            </Pagination.Item>
        ))}
        </Pagination>

    <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>
            {modalAction === 'create'
                ? 'Nueva direccion'
                : modalAction === 'edit'
                ? 'Actualizar direccion'
                : 'Detalle de direccion'}
            </Modal.Title>
        </Modal.Header>

            <Modal.Body>
            {modalAction !== 'detail' &&(
                <Form>
                <Form.Group controlId='formAddresP'>
                    <Form.Label>Direccion</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese la direccion"
                        value={newAddressProvider.Address}
                        onChange={(e) => setNewAddressProvider({ ...newAddressProvider, Address: e.target.value })}
                    />
                </Form.Group> 

                <Form.Group controlId='formAddressType'>
                    <Form.Label>Tipo de direccion</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese el tipo de direccion"
                        value={newAddressProvider.AddressType}
                        onChange={(e) => setNewAddressProvider({ ...newAddressProvider, AddressType: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId='formNeighborhoodId'>
                    <Form.Label>Tipo de Telefono</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingrese el Id de barrio"
                        value={newAddressProvider.NeighborhoodId}
                        onChange={(e) => setNewAddressProvider({ ...newAddressProvider, NeighborhoodId: e.target.value })}
                    />
                </Form.Group>
                </Form>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant='secondary' onClick={handleCloseModal}>
                    Cancelar
                </Button>
                {modalAction !== 'detail' && (
                    <Button
                    variant='primary'
                    onClick={modalAction === 'create' ? handleCreateAddressProvider: handleUpdateAddressProvider}
                    >
                    {modalAction === 'create' ? 'Crear' : 'Actualizar'}
                    </Button>
                )}
            </Modal.Footer>
    </Modal>
    </div>
    );
};

export default ProviderAddresses;