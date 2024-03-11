import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';


const PaymentMethods = () => {

    const [methods, setMethods] = useState ([]);
    const [newMethod, setNewMethod] = useState({
        PaymentMethodName: ''
    });

    const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('create');
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMethods = methods.slice(indexOfFirstItem, indexOfLastItem);
  const history = useHistory();

  useEffect(()=>{
    const fetchMethods = async () => {
        try{
            const response = await axios.get(`https://localhost:7028/api/paymentMethods`);
            setMethods(response.data);

        }catch(error){
            console.error('error fetching Methods', error)
        }
        
    };
    fetchMethods();
  });


  const handleCreateMethod = async () => {
    try{
        const response = await axios.post (`https://localhost:7028/api/paymentMethods`);

        setMethods([response.data, ...methods]);

        setNewMethod({
            PaymentMethodName:''
        });
        handleCloseModal();
    }catch(error){
        console.error('error creating method', error)
    }
  };


  const handleUpdateMethod = async () =>{
    try{
        await axios.put(
            `https://localhost:7028/api/paymentMethods/${selectedMethodId}`, newMethod

        );

        const response = await axios.get (`https://localhost:7028/api/paymentMethods`);

        const updateMethods = response.data;
        setMethods(updateMethods);
        setNewMethod({
            PaymentMethodName:''
        });

        handleCloseModal();
    }catch(error){
        console.error('error updating method', error);
    }
  };

  const handleDeleteMethod = async (methodId) =>{
    try{
        await axios.delete (`https://localhost:7028/api/paymentMethod${methodId}`);

        const updatedMethods = methods.filter((method)=> method.methodID !== methodId);
        
        setMethods(updatedMethods);

    }catch(error){
        console.error('Error deleting method', error);
    }
  };

  const handleShowCreateModal = () => {
    setModalAction('create');
    setShowModal(true);
  };

  const handleShowEditModal = (methodId) => {
    setModalAction('edit');
    setSelectedMethodId(methodId);

    const selectedMethod = methods.find((method)=> method.methodID === methodId);

    if(selectedMethod){
        setNewMethod({
            PaymentMethodName: selectedMethod.paymentMethodName || ''
        });
        
    }
    setShowModal(true);
  };

  const handleShowDetailModal = (methodId) => {
    setModalAction('detail');
    setSelectedMethodId(methodId);

    const selectedMethod = methods.find((method)=> method.methodID === methodId);

    if(selectedMethod){
        setNewMethod({
            PaymentMethodName: selectedMethod.paymentMethodName || ''
        });
        
    }
    setShowModal(true);
  };

  const handleCloseModal = () =>{
    setShowModal(false);
    setNewMethod({
        PaymentMethodName:''
    });

    setSelectedMethodId('');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleGoBack = () => {
    history.goBack();
};

  return(
    <div className='MethodsP-container'>
        <header>
            <div>
                <img src = '' alt = 'logo' />
                <h1>AutopartesJucar</h1>
            </div>
        </header>
        <br>
        <h2>Metodos de pago</h2>
        </br>
        <Button variant="primary" onClick={handleShowCreateModal}>
          <FontAwesomeIcon icon={faPlus} /> Nuevo metodo de pago
        </Button>
        <Button variant="danger" onClick={handleGoBack}>
          Volver
        </Button>
        <hr/>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Nombre de metodo de pago</th>
                </tr>
            </thead>
            <tbody>
                {currentMethods.map((method)=>(
                    <tr key ={method.methodID}>
                        <td>{method.PaymentMethodName}</td>
                        <td>
                         <Button variant="info" onClick={() => handleShowEditModal(method.methodID)}>
                            <FontAwesomeIcon icon={faEdit} /> Actualizar
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteMethod(method.methodID)}>
                            <FontAwesomeIcon icon={faTrash} /> Eliminar
                        </Button>
                        <Button variant="primary" onClick={() => handleShowDetailModal(method.methodID)}>
                            <FontAwesomeIcon icon={faEye} /> Ver Detalle
                        </Button>
                        </td>

                    </tr>
                ))}
            </tbody>

        </Table>

        <Pagination>
        {Array.from({ length: Math.ceil(methods.length / itemsPerPage) }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
       </Pagination>

       <Modal show ={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>
                {modalAction === 'create'
                ? 'Nuevo metodo de pago'
                :modalAction === 'edit'
                ? 'Actualizar metodo de pago'
                : 'Detalle de metodo de pago'
                }
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {modalAction !== 'detail' && (
                <Form>
                    <Form.Group controlId='formMethodP'>
                        <Form.Label>Nombre metodo de pago</Form.Label>
                        <Form.Control
                        type='text'
                        placeholder='ingrese el nombre del metodo de pago'
                        value={newMethod.PaymentMethodName}
                        onChange={(e)=> setNewMethod({...newMethod, PaymentMethodName: e.target.value})}
                        />
                        
                    </Form.Group>


                </Form>
            )}
            {modalAction === 'detail' && (
                <div>
                    {selectedMethodId &&(
                        <div>
                            <h4>Detalle de metodo de pago</h4>
                            <p>ID: {selectedMethodId}</p>
                            <p>Nombre metodo de pago: {newMethod.PaymentMethodName}</p>
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
              variant="primary"
              onClick={modalAction === 'create' ? handleCreateMethod : handleUpdateMethod}
            >
              {modalAction === 'create' ? 'Crear' : 'Actualizar'}
            </Button>
          )}
        </Modal.Footer>

       </Modal>

    </div>

  );
};

export default PaymentMethods;