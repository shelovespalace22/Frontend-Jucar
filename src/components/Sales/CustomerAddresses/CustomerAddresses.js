import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const CustomerAddresses = ({customerId}) => {
    const [addressCustomers, setAddressCustomers] = useState([]);
    const [newAddressCustomer, setNewAddressCustomer] = useState({
        Address: '',
        AddressType: '', 
        NeighborhoodId: '',
        NeighborhoodName: '',
    });
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [municipalities, setMunicipalities] = useState([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState('');
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedCustomerAddressId, setselectedCustomerAddressId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAddressCustomers = addressCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const history = useHistory();

    useEffect (() =>{
        const fetchAddressCustomers = async () => {
            try{
                const response = await axios.get(`https://localhost:7028/api/customers/${customerId}/addresses`);

                setAddressCustomers(response.data);

            }catch (error){
                console.error('error fetching Address Customer', error);
            }
        };
        fetchAddressCustomers();
    }, [customerId]);

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

    const handleCreateAddressCustomer = async () =>{

        
        console.log('Data to send:', newAddressCustomer);

        try{
            const response = await axios.post(`https://localhost:7028/api/customers/${customerId}/addresses`, JSON.stringify(newAddressCustomer), 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setAddressCustomers([response.data, ...addressCustomers]);

            setNewAddressCustomer({
                Address: '',
                AddressType: '',
                NeighborhoodId: '',
                NeighborhoodName: '',
            });

            handleCloseModal();

        } catch (error) {
            console.error('error creating address customer', error);
        }
    };

    const handleUpdateAddressCustomer = async () =>{
        try {
            await axios.put(
                `https://localhost:7028/api/customers/${customerId}/addresses/${selectedCustomerAddressId}`,
                newAddressCustomer
            );

            const response = await axios.get(`https://localhost:7028/api/customers/${customerId}/addresses`);

            const updatedAddressCustomers = response.data;

            setAddressCustomers(updatedAddressCustomers);

            setNewAddressCustomer({
                Address: '',
                AddressType: '',
                NeighborhoodId: '',
                NeighborhoodName: '',
            });

            handleCloseModal();

        } catch (error){
            console.error('Error updating customer address:', error);
        }
    };

    const handleDeleteAddressCustomer = async (customerAddressId) => {
        
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
              
              await axios.delete(`https://localhost:7028/api/customers/${customerId}/addresses/${customerAddressId}`);

              const updatedAddressCustomers = addressCustomers.filter((addressCustomer) => addressCustomer.customerAddressID !== customerAddressId);

              setAddressCustomers(updatedAddressCustomers);
              
              Swal.fire(
                '¡Eliminado!',
                '¡La dirección del cliente ha sido eliminada.',
                'success'
              );
            } catch (error) {
              console.error('Error deleting address customer:', error);
              
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar la dirección del cliente.',
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

    const handleShowEditModal = (customerAddressId) =>{
        setModalAction('edit')
        setselectedCustomerAddressId(customerAddressId);

        const selectedAddressCustomer = addressCustomers.find((addressCustomer)=> addressCustomer.customerAddressID === customerAddressId);

        if(selectedAddressCustomer){
            setNewAddressCustomer({
                Address: selectedAddressCustomer.address || '', 
                AddressType: selectedAddressCustomer.addressType || '',
                NeighborhoodId: selectedAddressCustomer.neighborhoodId || '',
                NeighborhoodName: selectedAddressCustomer.neighborhoodName || '',
            });
        }

        setShowModal(true);
    };

    const handleShowDetailModal = (customerAddressId) =>{
        setModalAction ('detail')
        setselectedCustomerAddressId(customerAddressId);

        const selectedAddressCustomer = addressCustomers.find((addressCustomer)=> addressCustomer.customerAddressID === customerAddressId);

        if(selectedAddressCustomer){
            setNewAddressCustomer({
                Address: selectedAddressCustomer.address || '', 
                AddressType: selectedAddressCustomer.addressType || '',
                NeighborhoodId: selectedAddressCustomer.neighborhoodId || '',
                NeighborhoodName: selectedAddressCustomer.neighborhoodName || '',

            });
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewAddressCustomer({
            Address: '',
            AddressType: '',
            NeighborhoodId: '',
        });


        setselectedCustomerAddressId('');
    };

    const handleDepartmentChange = async (e) => {
        const selectedDepartmentId = e.target.value;
        setSelectedDepartment(selectedDepartmentId);
        setMunicipalities([]);
        setNeighborhoods([]); 
    
        if (selectedDepartmentId) {
            try {
                const response = await axios.get(`https://localhost:7028/api/departments/${selectedDepartmentId}/municipalities`);
                setMunicipalities(response.data);
            } catch (error) {
                console.error('Error fetching municipalities:', error);
            }
        }
    };

    const handleMunicipalityChange = async (e) => {
        const selectedMunicipalityId = e.target.value;
        setSelectedMunicipality(selectedMunicipalityId);
        setNeighborhoods([]); 
    
        if (selectedMunicipalityId) {
            try {
                const response = await axios.get(`https://localhost:7028/api/municipalities/${selectedMunicipalityId}/neighborhoods`);
                setNeighborhoods(response.data);
            } catch (error) {
                console.error('Error fetching neighborhoods:', error);
            }
        }
    };
    

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
        history.goBack();
    };

    return(
        <div className='containerAddresCustomer'>
            <br/>
            <h2>Direcciones del Cliente</h2>
            <br/>

            <Button variant="primary" onClick={handleShowCreateModal}>
                <FontAwesomeIcon icon={faPlus} /> Nueva Dirección
            </Button>
            <Button variant="danger" onClick={handleGoBack}>
                Volver
            </Button>

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
                    {currentAddressCustomers.map((addressCustomer)=>(
                        <tr key={addressCustomer.customerAddressID}>
                            <td>{addressCustomer.address}</td>
                            <td>{addressCustomer.addressType}</td>
                            <td>{addressCustomer.neighborhoodName}</td>
                            <td>
                                <Button variant='info' onClick={()=> handleShowEditModal(addressCustomer.customerAddressID)}>
                                    <FontAwesomeIcon icon ={faEdit}/> Actualizar    
                                </Button>

                                <Button variant = "danger" onClick={()=>handleDeleteAddressCustomer(addressCustomer.customerAddressID)}>
                                    <FontAwesomeIcon icon={faTrash}/> Eliminar
                                </Button>

                                <Button variant='primary' onClick={()=> handleShowDetailModal(addressCustomer.customerAddressID)}>
                                    <FontAwesomeIcon icon={faEye}/> Ver detalle 
                                </Button>
                            </td>     
                        </tr>
                        
                    ))}
                </tbody>
            </Table>

            <Pagination>
                {Array.from({ length: Math.ceil(addressCustomers.length / itemsPerPage) }, (_, index) => (
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
                                    value={newAddressCustomer.Address}
                                    onChange={(e) => setNewAddressCustomer({ ...newAddressCustomer, Address: e.target.value })}
                                />
                            </Form.Group> 

                            <Form.Group controlId='formAddressType'>
                                <Form.Label>Tipo de direccion</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el tipo de dirección"
                                    value={newAddressCustomer.AddressType}
                                    onChange={(e) => setNewAddressCustomer({ ...newAddressCustomer, AddressType: e.target.value })}
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
                                <Form.Control as="select" value={newAddressCustomer.NeighborhoodId} onChange={(e) => setNewAddressCustomer({ ...newAddressCustomer, NeighborhoodId: e.target.value })}>
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
                            {selectedCustomerAddressId && (
                                <div>
                                    <p><b>ID:</b> {selectedCustomerAddressId}</p>
                                    <p><b>Dirección:</b> {newAddressCustomer.Address}</p>
                                    <p><b>Tipo de Dirección:</b> {newAddressCustomer.AddressType}</p>
                                    <p><b>Barrio:</b> {newAddressCustomer.NeighborhoodName}</p>
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
                        onClick={modalAction === 'create' ? handleCreateAddressCustomer: handleUpdateAddressCustomer}
                        >
                            {modalAction === 'create' ? 'Crear' : 'Actualizar'}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CustomerAddresses;