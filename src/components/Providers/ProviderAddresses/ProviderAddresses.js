import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const ProviderAddresses = ({ providerId }) => {
    const [providerAddresses, setProviderAddresses] = useState ([]);
    const [newProviderAddress, setNewProviderAddress] = useState({
        Address: '',
        AddressType: '', 
        NeighborhoodId: '',
        NeighborhoodName: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedProviderAddressId, setSelectedProviderAddressId] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [municipalities, setMunicipalities] = useState([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProviderAddresses = providerAddresses.slice(indexOfFirstItem, indexOfLastItem);
    const history = useHistory();

    useEffect(()=> {
        const fetchProviderAddresses = async () => {
            try{
                const response = await axios.get(`https://localhost:7028/api/providers/${providerId}/addresses`);

                setProviderAddresses(response.data);
            } catch (error){
                console.error('Error fetching Provider Addresses:', error);
            }
        };
        fetchProviderAddresses();

    }, [providerId]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://localhost:7028/api/departments');
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };
    
        fetchDepartments();
    }, []);

    const handleCreateProviderAddress = async () => {
        try {
            const response = await axios.post(
                `https://localhost:7028/api/providers/${providerId}/addresses`,
                JSON.stringify(newProviderAddress),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            setProviderAddresses([response.data, ...providerAddresses]);
    
            setNewProviderAddress({
                Address: '',
                AddressType: '',
                NeighborhoodId: '',
                NeighborhoodName: '',
            });
    
            handleCloseModal();
        } catch (error) {
            console.error('Error creating Address:', error);
        }
    };

    const handleUpdateProviderAddress = async () =>{
        try{
            await axios.put(
                `https://localhost:7028/api/providers/${providerId}/addresses/${selectedProviderAddressId}`,
                newProviderAddress
            );
            
            const response = await axios.get(`https://localhost:7028/api/providers/${providerId}/addresses`);

            const updatedproviderAddresses = response.data;

            setProviderAddresses(updatedproviderAddresses);

            setNewProviderAddress({
                Address: '',
                AddressType: '',
                NeighborhoodId: '',
                NeighborhoodName: '',
            });

            handleCloseModal();

        }catch (error) {
            console.error('Error updating Address:', error);
        }
    };

    const handleDeleteproviderAddress = async (providerAddressId) => {
        try{
            await axios.delete(`https://localhost:7028/api/providers/${providerId}/addresses/${providerAddressId}`);

            const updatedproviderAddresses = providerAddresses.filter((providerAddress)=> providerAddress.providerAddressID !== providerAddressId);

            setProviderAddresses(updatedproviderAddresses);

        }catch (error){
            console.error('Error deleting Address', error);
        }
    };

    const handleShowCreateModal = () => {
        setModalAction('create');
        setShowModal(true);
    };

    const handleShowEditModal = (providerAddressId) => {
        setModalAction ('edit');
        setSelectedProviderAddressId(providerAddressId);

        const selectedproviderAddress = providerAddresses.find((providerAddress)=> providerAddress.providerAddressID === providerAddressId);

        if(selectedproviderAddress){
            setNewProviderAddress({
                Address: selectedproviderAddress.address || '', 
                AddressType: selectedproviderAddress.addressType || '',
                NeighborhoodId: selectedproviderAddress.neighborhoodId || '',
                NeighborhoodName: selectedproviderAddress.neighborhoodName || '',
            });
        }

        setShowModal(true);
    };

    const handleShowDetailModal = (providerAddressId) => {
        setModalAction ('detail');
        setSelectedProviderAddressId(providerAddressId);

        const selectedproviderAddress = providerAddresses.find((providerAddress)=> providerAddress.providerAddressID === providerAddressId);

        if(selectedproviderAddress){
            setNewProviderAddress({
                Address: selectedproviderAddress.address || '', 
                AddressType: selectedproviderAddress.addressType || '',
                NeighborhoodId: selectedproviderAddress.neighborhoodId || '',
                NeighborhoodName: selectedproviderAddress.neighborhoodName || '',
            });
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewProviderAddress({
            Address: '',
            AddressType: '',
            NeighborhoodId: '',
            NeighborhoodName: '',
        });

        setSelectedProviderAddressId('');
    };

    const handleDepartmentChange = async (e) => {
        const departmentId = e.target.value;
        setSelectedDepartment(departmentId);
    
        if (departmentId) {
            try {
                const response = await axios.get(`https://localhost:7028/api/departments/${departmentId}/municipalities`);
                setMunicipalities(response.data);
            } catch (error) {
                console.error('Error fetching municipalities:', error);
            }
        } else {
            setMunicipalities([]);
        }
    };

    const handleMunicipalityChange = async (e) => {
        const municipalityId = e.target.value;
        setSelectedMunicipality(municipalityId);
        
        if(municipalityId){
            try {
                const response = await axios.get(`https://localhost:7028/api/municipalities/${municipalityId}/neighborhoods`);
                setNeighborhoods(response.data);
            } catch (error) {
                console.error('Error fetching neighborhoods:', error);
            }
        } else{
            setNeighborhoods([]);
        } 
    };
    
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
        history.goBack();
    };

    return(
        <div>

            <br/>
            <h2>Direcciones de Proveedor</h2>
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
                        <th>Dirección</th>
                        <th>Tipo de Dirección</th>
                        <th>Barrio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProviderAddresses.map((providerAddress)=>(
                        <tr key={providerAddress.providerAddressID}>
                            <td>{providerAddress.address}</td>
                            <td>{providerAddress.addressType}</td>
                            <td>{providerAddress.neighborhoodName}</td>
                            <td>
                                <Button variant='info' onClick={() => handleShowEditModal(providerAddress.providerAddressID)}>
                                    <FontAwesomeIcon icon ={faEdit}/> Actualizar    
                                </Button>

                                <Button variant = "danger" onClick={() => handleDeleteproviderAddress(providerAddress.providerAddressID)}>
                                    <FontAwesomeIcon icon={faTrash}/> Eliminar
                                </Button>

                                <Button variant='primary' onClick={() => handleShowDetailModal(providerAddress.providerAddressID)}>
                                    <FontAwesomeIcon icon={faEye}/> Ver Detalle 
                                </Button>
                            </td>     
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
            {Array.from({ length: Math.ceil(providerAddresses.length / itemsPerPage) }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                {index + 1}
                </Pagination.Item>
            ))}
            </Pagination>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                    {modalAction === 'create'
                        ? 'Nueva Dirección'
                        : modalAction === 'edit'
                        ? 'Actualizar Dirección'
                        : 'Detalle de Dirección'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                {modalAction !== 'detail' &&(
                    <Form>
                        <Form.Group controlId='formAddresP'>
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese la dirección"
                                value={newProviderAddress.Address}
                                onChange={(e) => setNewProviderAddress({ ...newProviderAddress, Address: e.target.value })}
                            />
                        </Form.Group> 

                        <Form.Group controlId='formAddressType'>
                            <Form.Label>Tipo de Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el tipo de dirección"
                                value={newProviderAddress.AddressType}
                                onChange={(e) => setNewProviderAddress({ ...newProviderAddress, AddressType: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId='formDepartmentId'>
                            <Form.Label>Departamento</Form.Label>
                            <Form.Control as="select" value={selectedDepartment} onChange={handleDepartmentChange}>
                                <option value="">Seleccione un departamento</option>
                                {departments.map((department) => (
                                    <option key={department.departmentID} value={department.departmentID}>
                                        {department.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='formMunicipalityId'>
                            <Form.Label>Municipio</Form.Label>
                            <Form.Control as="select" value={selectedMunicipality} onChange={handleMunicipalityChange}>
                                <option value="">Seleccione un municipio</option>
                                {municipalities.map((municipality) => (
                                    <option key={municipality.municipalityID} value={municipality.municipalityID}>
                                        {municipality.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='formNeighborhoodId'>
                            <Form.Label>Barrio</Form.Label>
                            <Form.Control as="select" value={newProviderAddress.NeighborhoodId} onChange={(e) => setNewProviderAddress({ ...newProviderAddress, NeighborhoodId: e.target.value })}>
                                <option value="">Seleccione un barrio</option>
                                {neighborhoods.map((neighborhood) => (
                                    <option key={neighborhood.neighborhoodID} value={neighborhood.neighborhoodID}>
                                        {neighborhood.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>   

                    </Form>
                    )}
                    {modalAction === 'detail' && (
                        <div>
                            {selectedProviderAddressId && (
                                <div>
                                    <p><b>ID:</b> {selectedProviderAddressId}</p>
                                    <p><b>Dirección:</b> {newProviderAddress.Address}</p>
                                    <p><b>Tipo de Dirección:</b> {newProviderAddress.AddressType}</p>
                                    <p><b>Barrio:</b> {newProviderAddress.NeighborhoodName}</p>
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
                        onClick={modalAction === 'create' ? handleCreateProviderAddress: handleUpdateProviderAddress}
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