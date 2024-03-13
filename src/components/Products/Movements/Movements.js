import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const Movements = ({ rawMaterialId }) => {

    const [movements, setMovements] = useState([]);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const [newMovement, setNewMovement] = useState({
        Quantity: 0,
        MovementType: '',
        MovementDate: formattedDate,
    });
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedMovementId, setSelectedMovementId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMovements = movements.slice(indexOfFirstItem, indexOfLastItem);
    const history = useHistory();

    useEffect(() => {

        const fetchMovements = async () => {
            try {
                const response = await axios.get(`https://localhost:7028/api/rawMaterials/${rawMaterialId}/movements`);

                setMovements(response.data);
            } catch (error) {
                console.error('Error fetching movements:', error);
            }
        };

        fetchMovements();

    }, [rawMaterialId]);

    const handleCreateMovement = async () => {
        
        try {
            const response = await axios.post(`https://localhost:7028/api/rawMaterials/${rawMaterialId}/movements`, newMovement);

            setMovements([response.data, ...movements]);

            setNewMovement({
                Quantity: 0,
                MovementType: '',
                MovementDate: formattedDate,
            });

            handleCloseModal();

        } catch (error) {

            console.error('Error creating movement:', error);

        }

    };

    const handleUpdateMovement = async () => {

      try {
        
        await axios.put(`https://localhost:7028/api/rawMaterials/${rawMaterialId}/movements/${selectedMovementId}`, newMovement);

        const response = await axios.get(`https://localhost:7028/api/rawMaterials/${rawMaterialId}/movements`);

        const updatedMovements = response.data;

        setMovements(updatedMovements);

        setNewMovement({
            Quantity: 0,
            MovementType: '',
            MovementDate: formattedDate,
        });

        handleCloseModal();

      } catch (error) {
        
        console.error('Error updating movements:', error);

      } 

    };

    const handleDeleteMovement = async (movementId) => {
        // Muestra una alerta de confirmación
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
              // Elimina el movimiento si el usuario confirma
              await axios.delete(`https://localhost:7028/api/rawMaterials/${rawMaterialId}/movements/${movementId}`);
              const updatedMovements = movements.filter((movement) => movement.movementID !== movementId);
              setMovements(updatedMovements);
              // Muestra una alerta de éxito
              Swal.fire(
                '¡Eliminado!',
                '¡Tu movimiento ha sido eliminado.',
                'success'
              );
            } catch (error) {
              console.error('Error deleting movements:', error);
              // Muestra una alerta de error si ocurre un problema
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar el movimiento.',
                'error'
              );
            }
          }
        });
      };
      

    const handleShowCreateModal = () => {
        
        setModalAction('create')

        setShowModal(true);

    };

    const handleShowEditModal = (movementId) => {
        
        setModalAction('edit');

        setSelectedMovementId(movementId);

        const selectedMovement = movements.find((movement) => movement.movementID === movementId);

        if (selectedMovement){
            setNewMovement({
                Quantity: selectedMovement.quantity || 0,
                MovementType: selectedMovement.movementType || '',
                MovementDate: selectedMovement.movementDate || formattedDate,
            });
        }

        setShowModal(true);

    };

    const handleShowDetailModal = (movementId) => {

        setModalAction('detail');

        setSelectedMovementId(movementId);

        const selectedMovement = movements.find((movement) =>  movement.movementID === movementId);

        if (selectedMovement){
            setNewMovement({
                Quantity: selectedMovement.quantity || 0,
                MovementType: selectedMovement.movementType || '',
                MovementDate: selectedMovement.movementDate || formattedDate, 
            });
        }

        setShowModal(true);

    };

    const handleCloseModal = () => {

        setShowModal(false);

        setNewMovement({
            Quantity: 0,
            MovementType: '',
            MovementDate: formattedDate,
        });

        setSelectedMovementId('');

    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <div className='movements-container'>
            
            <br />
            <h2>Modulo Movimientos</h2>
            <br />

            <Button variant='primary' onClick={handleShowCreateModal}>
                <FontAwesomeIcon icon={faPlus} /> Nuevo Movimiento
            </Button>

            <Button variant="danger" onClick={handleGoBack}>
                Volver a Materiales
            </Button>
            <hr />

            <Table striped bordered hover>

                <thead>
                    <tr>
                        <th>Cantidad</th>
                        <th>Tipo Movimiento</th>
                        <th>Fecha Movimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {currentMovements.map((movement) => (
                        <tr key={movement.movementID}>
                            <td>{movement.quantity}</td>
                            <td>{movement.movementType}</td>
                            <td>{movement.movementDate}</td>
                            <td>
                                <Button variant='info' onClick={() => handleShowEditModal(movement.movementID)}>
                                    <FontAwesomeIcon icon={faEdit} /> Actualizar
                                </Button>

                                <Button variant='danger' onClick={() => handleDeleteMovement(movement.movementID)}>
                                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                                </Button>

                                <Button variant='primary' onClick={() => handleShowDetailModal(movement.movementID)}>
                                    <FontAwesomeIcon icon={faEye} /> Ver Detalle
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </Table>

            <Pagination>
                {Array.from({ length: Math.ceil(movements.length / itemsPerPage) }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <Modal show={showModal} onHide={handleCloseModal}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalAction === 'create'
                            ? 'Nuevo Movimiento'
                            : modalAction === 'edit'
                            ? 'Actualizar Movimiento'
                            : 'Detalles de Movimiento'
                        }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalAction !== 'detail' && (
                        
                        <Form>

                            <Form.Group controlId='formMovementQuantity'>
                                <Form.Label><b>Cantidad</b></Form.Label>
                                <Form.Control 
                                    type='text'
                                    placeholder='Ingrese la cantidad...'
                                    value={newMovement.Quantity}
                                    onChange={(e) => setNewMovement({ ...newMovement, Quantity: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label><b>Tipo Movimiento</b></Form.Label>
                                <Form.Control 
                                    type='text'
                                    placeholder='Ingrese el tipo de movimiento...'
                                    value={newMovement.MovementType}
                                    onChange={(e) => setNewMovement({ ...newMovement, MovementType: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label><b>Fecha Movimiento</b></Form.Label>
                                <Form.Control 
                                    type='date'
                                    value={newMovement.MovementDate}
                                    onChange={(e) => setNewMovement({ ...newMovement, MovementDate: e.target.value})}
                                />
                            </Form.Group>

                        </Form>

                    )}

                    {modalAction === 'detail' && (
                        <div>
                            {selectedMovementId && (
                                <div>
                                    <p><b>Id:</b> {selectedMovementId}</p>
                                    <p><b>Cantidad:</b> {newMovement.Quantity}</p>
                                    <p><b>Tipo Movimiento:</b> {newMovement.MovementType}</p>
                                    <p><b>Fecha Movimiento:</b> {newMovement.MovementDate}</p>
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

                        <Button variant='primary' onClick={modalAction === 'create' ? handleCreateMovement : handleUpdateMovement}>
                            {modalAction === 'create' ? 'Crear' : 'Actualizar'}
                        </Button>

                    )}
                </Modal.Footer>

            </Modal>

        </div>
    );
};

export default Movements;