import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const AddressCustomer = ({customerId}) => {
    const [addressCustomers, setAddressCustomers] = useState([]);
    const [newAddressCustomer, setNewAddressCustomer] = useState({
        Address: '',
        AddressType: '', 
        NeighborhoodId: ''
    });

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('create');
  const [selectedAddressCustomerId, setSelectedAddressCustomerId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAddressCustomers = addressCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const history = useHistory();

  useEffect (()=>{
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

  const handleCreateAddressCustomer = async () =>{
    try{
        const response = await axios.post (`https://localhost:7028/api/customers/${customerId}/addresses`);
        setAddressCustomers([response.data, ...addressCustomers]);

        setNewAddressCustomer({
            Address: '',
            AddressType: '',
            NeighborhoodId: ''
        });
        handleCloseModal();

    }catch (error){
        console.error('error creating address customer', error);
    }
  };

  const handleUpdateAddressCustomer = async () =>{
    try{
        await axios.put(
            `https://localhost:7028/api/customers/${customerId}/addresses${selectedAddressCustomerId}`,
            newAddressCustomer
        );
        const response = await axios.get (`https://localhost:7028/api/customers/${customerId}/addresses`);

        const updatedAddressCustomers = response.data;

        setAddressCustomers(updatedAddressCustomers);

        setNewAddressCustomer({
            Address: '',
            AddressType: '',
            NeighborhoodId: ''
        });
        handleCloseModal();
    }catch (error){
        console.error('error updating address customer');
    }
  };

  const handleDeleteAddressCustomer = async (addressCustomersId) =>{
    try{
        await axios.delete (`https://localhost:7028/api/customers/${customerId}/addresses${addressCustomersId}`);

        const updatedAddressCustomers = addressCustomers.filter((addressCustomer)=> addressCustomer.addressCustomersId !== addressCustomersId);
        setAddressCustomers(updatedAddressCustomers);
    }catch(error){
        console.error('error deleting address customer', error);
    }
  };

  const handleShowCreateModal = () => {
    setModalAction('create');
    setShowModal(true);
  };

  const handleShowEditModal = (addressCustomerId) =>{
    setModalAction ('edit')
    setSelectedAddressCustomerId('');

    const selectedAddressCustomer = addressCustomers.find((addressCustomer)=> addressCustomer.addressCustomerId === addressCustomerId);

    if(selectedAddressCustomer){
        setNewAddressCustomer({
            Address: selectedAddressCustomer.Address || '', 
            AddressType: selectedAddressCustomer.AddressType || '',
            NeighborhoodId: selectedAddressCustomer.NeighborhoodId || ''

        })
    }

    setShowModal(true);
  };

  const handleShowDetailModal = (addressCustomerId) =>{
        setModalAction ('detail')
        setSelectedAddressCustomerId('');

        const selectedAddressCustomer = addressCustomers.find((addressCustomer)=> addressCustomer.addressCustomerId === addressCustomerId);

        if(selectedAddressCustomer){
            setNewAddressCustomer({
                Address: selectedAddressCustomer.Address || '', 
                AddressType: selectedAddressCustomer.AddressType || '',
                NeighborhoodId: selectedAddressCustomer.NeighborhoodId || ''

            })
        }

     setShowModal(true);
    };

  const handleCloseModal = () => {
        setShowModal(false);
        setNewAddressCustomer({
            Address: '',
            AddressType: '',
            NeighborhoodId: ''

        });


        setSelectedAddressCustomerId('');
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
        history.goBack();
    };

    return(
        <div className='containerAddresCustomer'>
            <header>
                <div>
                    <img src = '' alt='logo'/>
                    <h1>Autopartes JUCAR</h1>
                </div>
            </header>
            <br>
            <h2>Direcciones de cliente</h2>
            </br>

            <Button variant="primary" onClick={handleShowCreateModal}>
            <FontAwesomeIcon icon={faPlus} /> Nueva Direccion
            </Button>
            <Button variant="danger" onClick={handleGoBack}>
             Volver
            </Button>
            <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Direccion</th>
                    <th>Tipo de direccion</th>
                    <th>ID del Barrio</th>
                </tr>
            </thead>
            <tbody>
                {currentAddressCustomers.map((addressCustomer)=>(
                    <tr key={addressCustomer.addressProviderId}>
                      <td>{addressCustomer.Address}</td>
                      <td>{addressCustomer.AddressType}</td>
                      <td>{addressCustomer.NeighborhoodId}</td>
                      <td>
                        <Button variant='info' onClick={()=> handleShowEditModal(addressCustomer.addressCustomerId)}>
                          <FontAwesomeIcon icon ={faEdit}/> Actualizar    
                        </Button>

                        <Button variant = "danger" onClick={()=>handleDeleteAddressCustomer(addressCustomer.addressCustomerId)}>
                            <FontAwesomeIcon icon={faTrash}/> Eliminar
                        </Button>

                        <Button variant='primary' onClick={()=> handleShowDetailModal(addressCustomer.addressCustomerId)}>
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
                     value={newAddressCustomer.Address}
                     onChange={(e) => setNewAddressCustomer({ ...newAddressCustomer, Address: e.target.value })}
                   />
                </Form.Group> 
   
                <Form.Group controlId='formAddressType'>
                  <Form.Label>Tipo de direccion</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="Ingrese el tipo de direccion"
                     value={newAddressCustomer.AddressType}
                     onChange={(e) => setNewAddressCustomer({ ...newAddressCustomer, AddressType: e.target.value })}
                   />
                </Form.Group>
   
                <Form.Group controlId='formNeighborhoodId'>
                  <Form.Label>Tipo de Telefono</Form.Label>
                  <Form.Control
                     type="text"
                     placeholder="Ingrese el Id de barrio"
                     value={newAddressCustomer.NeighborhoodId}
                     onChange={(e) => setNewAddressCustomer({ ...newAddressCustomer, NeighborhoodId: e.target.value })}
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
                    onClick={modalAction === 'create' ? handleCreateAddressCustomer: handleUpdateAddressCustomer}
                    >
                    {modalAction === 'create' ? 'Crear' : 'Actualizar'}
                    </Button>
                )}
            </Modal.Footer>
           </Modal>
        </div>
    )
};

export default AddressCustomer;