import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination, FormGroup } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useHistory } from 'react-router-dom';

const RawMaterials = () => {
    const [rawMaterials, setRawMaterials] = useState([]);
    const [newRawMaterial, setNewRawMaterial] = useState({
        Name: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedRawMaterialId, setSelectedRawMaterialId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://localhost:7028/api/rawMaterials');
                setRawMaterials(response.data);
            } catch (error) {
                console.error('Error fetching rawMaterials:', error);
            }
        };

        fetchData();

    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRawMaterials = rawMaterials.slice(indexOfFirstItem, indexOfLastItem);

    const history = useHistory();

    const handleCreateRawMaterial = async () => {
        try {
            const response = await axios.post('https://localhost:7028/api/rawMaterials', newRawMaterial );

            setRawMaterials([response.data, ...rawMaterials]);

            setNewRawMaterial({
                Name: '',
            });

            handleCloseModal();

        } catch (error) {
            console.error('Error creating rawMaterial:', error);
        }
    };

    const handelUpdateRawMaterial = async () => {
        try {
            await axios.put(
                `https://localhost:7028/api/rawMaterials/${selectedRawMaterialId}`, 
                newRawMaterial
            );
    
            // Realiza una nueva solicitud para obtener la lista actualizada
            const response = await axios.get('https://localhost:7028/api/rawMaterials');

            const updatedRawMaterials = response.data;
    
            // Actualiza el estado con la nueva lista
            setRawMaterials(updatedRawMaterials);
    
            setNewRawMaterial({
                Name: '',
            });
    
            handleCloseModal();
    
        } catch (error) {
            console.error('Error updating rawMaterial:', error);
        }
    };

    const handleDeleteRawMaterial = async (rawMaterialId) => {
        try {
            await axios.delete(`https://localhost:7028/api/rawMaterials/${rawMaterialId}`);

            const updatedRawMaterials = rawMaterials.filter((rawMaterial) => rawMaterial.rawMaterialId  !== rawMaterialId);

            setRawMaterials(updatedRawMaterials);
        } catch (error) {
            console.error('Error deleting rawMaterial:', error);
        }
    };

    const handleShowCreateModal = () => {
        setModalAction('create');
        setShowModal(true);
    };

    const handleShowEditModal = (rawMaterialId) => {
        setModalAction('edit');
        setSelectedRawMaterialId(rawMaterialId);

        const selectedRawMaterial = rawMaterials.find((rawMaterial) => rawMaterial.rawMaterialId === rawMaterialId);

        if (selectedRawMaterial){
            setNewRawMaterial({
                Name: selectedRawMaterial.name || '',
            });
        }

        setShowModal(true);
    };

    const handleShowDetailModal = (rawMaterialId) => {
        setModalAction('detail');
        setSelectedRawMaterialId(rawMaterialId);

        const selectedRawMaterial = rawMaterials.find((rawMaterial) => rawMaterial.rawMaterialId === rawMaterialId);

        if (selectedRawMaterial){
            setNewRawMaterial({
                Name: selectedRawMaterial.name || '',
            });
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewRawMaterial({
            Name: '',
        });

        setSelectedRawMaterialId('');
    };

    const handleShowMovements = (rawMaterialId) => {
        history.push('/rawMaterial-movements', {rawMaterialId})
    };

    const handleShowStocks = (rawMaterialId) => {
        history.push('/rawMaterial-stocks', {rawMaterialId})
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='rawMaterials-container'>
            <br/>

            {/* Título */}
            <h2>Modulo Materias Primas</h2>

            <br/>

            {/* Botón para crear un nuevo registro */}
            <Button variant='primary' onClick={handleShowCreateModal}>
                <FontAwesomeIcon icon={faPlus} /> Nueva Materia Prima
            </Button>

            <hr/>

            {/* Tabla de registros */}
            <Table striped bordered hover>

                {/* Cabecera de Tabla */}
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                {/* Cuerpo de Tabla */}
                <tbody>
                    {currentRawMaterials.map((rawMaterial) => (
                        <tr key={rawMaterial.rawMaterialId}>
                            <td>{rawMaterial.name}</td>
                            <td>
                                <Button variant='info' onClick={() => handleShowEditModal(rawMaterial.rawMaterialId)}>
                                    <FontAwesomeIcon icon={faEdit} /> Actualizar
                                </Button>
                                <Button variant='danger' onClick={() => handleDeleteRawMaterial(rawMaterial.rawMaterialId)}>
                                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                                </Button>
                                <Button variant='primary' onClick={() => handleShowDetailModal(rawMaterial.rawMaterialId)}>
                                    <FontAwesomeIcon icon={faEye} /> Ver Detalle
                                </Button>

                                <Button variant='secondary' onClick={() => handleShowMovements(rawMaterial.rawMaterialId)}>
                                    Ver Movimientos
                                </Button>
                                <Button variant='secondary' onClick={() => handleShowStocks(rawMaterial.rawMaterialId)}>
                                    Ver Stocks
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Paginación de registros */}
            <Pagination>
                {Array.from({ length: Math.ceil(rawMaterials.length / itemsPerPage) }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            {/* Ventana(s) Modal(es) */}
            <Modal show={showModal} onHide={handleCloseModal}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalAction === 'create'
                            ? 'Nueva Materia Prima'
                            : modalAction === 'edit'
                            ? 'Actualizar Materia Prima'
                            : 'Detalle de Materia Prima'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalAction !== 'detail' && (
                        <Form>
                            <FormGroup controlId='formRawMaterialName'>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control 
                                    type='text'
                                    placeholder='Ingrese el nombre...'
                                    value={newRawMaterial.Name}
                                    onChange={(e) => setNewRawMaterial({ ...newRawMaterial, Name: e.target.value})}
                                />
                            </FormGroup>
                        </Form>
                    )}

                    {modalAction === 'detail' && (
                        <div>
                            {selectedRawMaterialId && (
                                <div>
                                    <h4>Detalles de la Materia Prima</h4>
                                    <p>ID: {selectedRawMaterialId}</p>
                                    <p>Nombre: {newRawMaterial.Name}</p>
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
                            onClick={modalAction === 'create' ? handleCreateRawMaterial : handelUpdateRawMaterial}
                        >
                            {modalAction === 'create' ? 'Crear' : 'Actualizar'}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RawMaterials;