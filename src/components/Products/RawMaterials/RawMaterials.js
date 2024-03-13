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
        Stock: {
            QuantityAvailable: 0,
            InitialStock: 0,
            ReorderPoint: 0,
            MinimumInventory: 0,
            MaximumInventory: 0,
        }
    });
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedRawMaterialId, setSelectedRawMaterialId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRawMaterials = rawMaterials.slice(indexOfFirstItem, indexOfLastItem);
    const history = useHistory();

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

    const handleCreateRawMaterial = async () => {
        try {
            const response = await axios.post('https://localhost:7028/api/rawMaterials', newRawMaterial );

            setRawMaterials([response.data, ...rawMaterials]);

            setNewRawMaterial({
                Name: '',
                Stock: {
                    QuantityAvailable: 0,
                    InitialStock: 0,
                    ReorderPoint: 0,
                    MinimumInventory: 0,
                    MaximumInventory: 0,
                }
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
    
            const response = await axios.get('https://localhost:7028/api/rawMaterials');

            const updatedRawMaterials = response.data;
    
            setRawMaterials(updatedRawMaterials);
    
            setNewRawMaterial({
                Name: '',
                Stock: {
                    QuantityAvailable: 0,
                    InitialStock: 0,
                    ReorderPoint: 0,
                    MinimumInventory: 0,
                    MaximumInventory: 0,
                }
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
                Name: selectedRawMaterial.name || ''
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
            Stock: {
                QuantityAvailable: 0,
                InitialStock: 0,
                ReorderPoint: 0,
                MinimumInventory: 0,
                MaximumInventory: 0,
            }
        });

        setSelectedRawMaterialId('');
    };

    const handleShowMovements = (rawMaterialId) => {
        history.push('/rawMaterial-movements', {rawMaterialId})
    };

    const handleShowStocks = (rawMaterialId) => {
        history.push('/rawMaterial-stocks', {rawMaterialId})
    };

    const handleGoBack = () => {
        history.goBack();
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='rawMaterials-container'>
            <br/>

            <h2>Modulo Materias Primas</h2>

            <br/>

            <Button variant='primary' onClick={handleShowCreateModal}>
                <FontAwesomeIcon icon={faPlus} /> Nueva Materia Prima
            </Button>

            <Button variant="danger" onClick={handleGoBack}>
                Volver
            </Button>

            <hr/>

            <Table striped bordered hover>

                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

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

            <Pagination>
                {Array.from({ length: Math.ceil(rawMaterials.length / itemsPerPage) }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            <Modal show={showModal} onHide={handleCloseModal}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalAction === 'create'
                            ? 'Nueva Materia Prima'
                            : modalAction === 'edit'
                            ? 'Actualizar Materia Prima'
                            : 'Detalles de Materia Prima'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalAction === 'create' && (
                        <Form>
                            <FormGroup controlId='formRawMaterialName'>
                                <Form.Label><b>Nombre</b></Form.Label>
                                <Form.Control 
                                    type='text'
                                    placeholder='Ingrese el nombre...'
                                    value={newRawMaterial.Name}
                                    onChange={(e) => setNewRawMaterial({ ...newRawMaterial, Name: e.target.value})}
                                />
                            </FormGroup>

                            <br />

                            <h3>Stock</h3>

                            <hr/>

                            <FormGroup controlId='formQuantityAvailable'>
                                <Form.Label><b>Cantidad Disponible</b></Form.Label>
                                <Form.Control 
                                    type='text'
                                    placeholder='Ingrese la cantidad disponible...'
                                    value={newRawMaterial.Stock.QuantityAvailable}
                                    onChange={(e) => setNewRawMaterial({ ...newRawMaterial, Stock: { ...newRawMaterial.Stock, QuantityAvailable: e.target.value}})}
                                />
                            </FormGroup>

                            <FormGroup controlId='formInitialStock'>
                                <Form.Label><b>Stock Inicial</b></Form.Label>
                                <Form.Control 
                                    type='text'
                                    placeholder='Ingrese el stock inicial...'
                                    value={newRawMaterial.Stock.InitialStock}
                                    onChange={(e) => setNewRawMaterial({ ...newRawMaterial, Stock: { ...newRawMaterial.Stock, InitialStock: e.target.value}})}
                                />
                            </FormGroup>

                            <FormGroup controlId='formReorderPoint'>
                                <Form.Label><b>Punto de Reorden</b></Form.Label>
                                <Form.Control 
                                    type='text'
                                    placeholder='Ingrese el punto de reorden...'
                                    value={newRawMaterial.Stock.ReorderPoint}
                                    onChange={(e) => setNewRawMaterial({ ...newRawMaterial, Stock: { ...newRawMaterial.Stock, ReorderPoint: e.target.value}})}
                                />
                            </FormGroup>

                            <FormGroup controlId='formMinimumInventory'>
                                <Form.Label><b>Inventario Mínimo</b></Form.Label>
                                <Form.Control 
                                    type='text'
                                    placeholder='Ingrese el inventario minimo...'
                                    value={newRawMaterial.Stock.MinimumInventory}
                                    onChange={(e) => setNewRawMaterial({ ...newRawMaterial, Stock: { ...newRawMaterial.Stock, MinimumInventory: e.target.value}})}
                                />
                            </FormGroup>

                            <FormGroup controlId='formMaximumInventory'>
                                <Form.Label><b>Inventario Máximo</b></Form.Label>
                                <Form.Control 
                                    type='text'
                                    placeholder='Ingrese el inventario máximo...'
                                    value={newRawMaterial.Stock.MaximumInventory}
                                    onChange={(e) => setNewRawMaterial({ ...newRawMaterial, Stock: { ...newRawMaterial.Stock, MaximumInventory: e.target.value}})}
                                />
                            </FormGroup>
                        </Form>
                    )}

                    {modalAction === 'edit' && (
                        <Form>
                            <FormGroup controlId='formRawMaterialName'>
                                <Form.Label><b>Nombre</b></Form.Label>
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
                                    <p><b>ID:</b> {selectedRawMaterialId}</p>
                                    <p><b>Nombre:</b> {newRawMaterial.Name}</p>
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