import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Losses = ({ autopartId }) => {
    
    const [losses, setLosses] = useState([]);

    // Obtén la fecha actual
    const currentDate = new Date();

    // Formatea la fecha según tus necesidades
    const formattedDate = currentDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const [newLoss, setNewLoss] = useState({
        AmountLoss: 0,
        Responsible: '',
        Reason: '',
        LossDate: formattedDate,
    });

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedLossId, setSelectedLossId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);


    useEffect(() => {
        const fetchLosses = async () => {
            try {
                const response = await axios.get(`https://localhost:7028/api/autoparts/${autopartId}/losses`);

                setLosses(response.data);

            } catch (error) {
                console.error('Error fetching losses:', error);
            }
        };

        fetchLosses();

    }, [autopartId]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLosses = losses.slice(indexOfFirstItem, indexOfLastItem);

    const handleCreateLoss = async () => {
        try {
            const response = await axios.post(`https://localhost:7028/api/autoparts/${autopartId}/losses`, newLoss);

            setLosses([response.data, ...losses]);

            setNewLoss({
                AmountLoss: 0,
                Responsible: '',
                Reason: '',
                LossDate: formattedDate,
            });

            handleCloseModal();
        } catch (error) {
            console.error('Error creating loss:', error);
        }
    };

    const handleUpdateLoss = async () => {
        try {
            await axios.put(
                `https://localhost:7028/api/autoparts/${autopartId}/losses/${selectedLossId}`,
                newLoss
            );

            const response = await axios.get(`https://localhost:7028/api/autoparts/${autopartId}/losses`);

            const updatedLosses = response.data;

            setLosses(updatedLosses);

            setNewLoss({
                AmountLoss: 0,
                Responsible: '',
                Reason: '',
                LossDate: formattedDate,
            });

            handleCloseModal();

        } catch (error) {
            console.error('Error updating loss:', error);
        }
    };

    const handleDeleteLoss = async (lossId) => {
        try {
            await axios.delete(`https://localhost:7028/api/autoparts/${autopartId}/losses/${lossId}`);

            const updatedLosses = losses.filter((loss) => loss.lossID !== lossId);

            setLosses(updatedLosses);
        } catch (error) {
            console.error('Error deleting loss:', error);
        }
    };

    const handleShowCreateModal = () => {
        setModalAction('create');
        setShowModal(true);
    };

    const handleShowEditModal = (lossId) => {

        console.log('Loss ID', lossId)

        setModalAction('edit');
        setSelectedLossId(lossId);

        const selectedLoss = losses.find((loss) => loss.lossID === lossId);

        if(selectedLoss){

            setNewLoss({
                AmountLoss: selectedLoss.amountLoss || 0,
                Responsible: selectedLoss.responsible || '',
                Reason: selectedLoss.reason || '',
                LossDate: selectedLoss.lossDate || formattedDate,
            });

        }

        setShowModal(true);
    };

    const handleShowDetailModal = (lossId) => {

        console.log('Loss ID:', lossId);

        setModalAction('detail');

        setSelectedLossId(lossId);

        const selectedLoss = losses.find((loss) => loss.lossID === lossId);

        if (selectedLoss){

            setNewLoss({
                AmountLoss: selectedLoss.amountLoss || 0,
                Responsible: selectedLoss.responsible || '',
                Reason: selectedLoss.reason || '',
                LossDate: selectedLoss.lossDate || formattedDate,
            });

        }

        setShowModal(true);
    };

    const handleCloseModal= () => {
        
        setShowModal(false);

        setNewLoss({
            AmountLoss: 0,
            Responsible: '',
            Reason: '',
            LossDate: formattedDate,
        });

        setSelectedLossId('');
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="losses-container">
            <br />
            <h2>Modulo Pérdidas</h2>
            <br />
            <Button variant="primary" onClick={handleShowCreateModal}>
                <FontAwesomeIcon icon={faPlus} /> Nueva Pérdida
            </Button>
            <hr />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Cantidad Perdida</th>
                        <th>Responsable</th>
                        <th>Razón</th>
                        <th>Fecha de Pérdida</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    
                {currentLosses.map((loss) => (
                    <tr key={loss.lossID}>
                        <td>{loss.amountLoss}</td>
                        <td>{loss.responsible}</td>
                        <td>{loss.reason}</td>
                        <td>{loss.lossDate}</td>
                        <td>
                            <Button variant="info" onClick={() => handleShowEditModal(loss.lossID)}>
                                <FontAwesomeIcon icon={faEdit} /> Actualizar
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteLoss(loss.lossID)}>
                                <FontAwesomeIcon icon={faTrash} /> Eliminar
                            </Button>
                            <Button variant="primary" onClick={() => handleShowDetailModal(loss.lossID)}>
                                <FontAwesomeIcon icon={faEye} /> Ver Detalle
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            
            {/* <Pagination>
                {Array.from({ length: Math.ceil(losses.length / itemsPerPage) }, (_, index) => (
                <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                    {index + 1}
                </Pagination.Item>
                ))}
            </Pagination> */}

            <Pagination>
                {Array.from({ length: Math.ceil(losses.length / itemsPerPage) }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
            
            <Modal show={showModal} onHide={handleCloseModal}>

                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalAction === 'create'
                            ? 'Nueva Pérdida'
                            : modalAction === 'edit'
                            ? 'Actualizar Pérdida'
                            : 'Detalle de Pérdida'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalAction !== 'detail' && (
                        <Form>

                            <Form.Group controlId="formLossAmountLoss">
                                <Form.Label>Cantidad Pérdida</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="Ingrese la cantidad pérdida..."
                                value={newLoss.AmountLoss}
                                onChange={(e) => setNewLoss({ ...newLoss, AmountLoss: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group controlId="formLossResponsible">
                                <Form.Label>Responsable</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="Ingrese el responsable..."
                                value={newLoss.Responsible}
                                onChange={(e) => setNewLoss({ ...newLoss, Responsible: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group controlId="formLossReason">
                                <Form.Label>Razón</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="Ingrese la razón..."
                                value={newLoss.Reason}
                                onChange={(e) => setNewLoss({ ...newLoss, Reason: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group controlId="formLossLossDate">
                                <Form.Label>Fecha Pérdida</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={newLoss.LossDate}
                                    onChange={(e) => setNewLoss({ ...newLoss, LossDate: e.target.value })}
                                />
                            </Form.Group>

                        </Form>
                    )}
                    
                    {modalAction === 'detail' && (
                        <div>
                            {/* Muestra la información detallada de la pérdida */}
                            {selectedLossId && (
                                <div>
                                    <h4>Detalles de la Pérdida</h4>
                                    <p>ID: {selectedLossId}</p>
                                    <p>Cantidad Pérdida: {newLoss.AmountLoss}</p>
                                    <p>Responsable: {newLoss.Responsible}</p>
                                    <p>Razón: {newLoss.Reason}</p>
                                    <p>Fecha Perdida: {newLoss.LossDate}</p>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    {modalAction !== 'detail' && (
                        <Button
                            variant="primary"
                            onClick={modalAction === 'create' ? handleCreateLoss : handleUpdateLoss}
                        >
                            {modalAction === 'create' ? 'Crear' : 'Actualizar'}
                        </Button>
                    )}
                </Modal.Footer>

            </Modal>
        </div>
    );
};

export default Losses;