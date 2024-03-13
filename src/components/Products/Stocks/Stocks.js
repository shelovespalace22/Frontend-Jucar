import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const Stocks = ({ rawMaterialId }) => {
    const [stocks, setStocks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newStock, setNewStock] = useState({
        QuantityAvailable: 0,
        InitialStock: 0,
        ReorderPoint: 0,
        MinimumInventory: 0,
        MaximumInventory: 0,
    });
    const [selectedStockId, setSelectedStockId] = useState('');
    const [modalAction, setModalAction] = useState('edit');
    const history = useHistory();

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await axios.get(`https://localhost:7028/api/rawMaterials/${rawMaterialId}/stocks`);
                setStocks(response.data);
            } catch (error) {
                console.error('Error fetching stock:', error);
            }
        };

        fetchStock();
    }, [rawMaterialId]);

    const handleShowEditModal = (stockId) => {

        setModalAction('edit');

        setSelectedStockId(stockId);

        const selectedStock = stocks.find((stock) => stock.stockID === stockId);

        if (selectedStock){
            setNewStock({
                QuantityAvailable: selectedStock.quantityAvailable || 0,
                InitialStock: selectedStock.initialStock || 0,
                ReorderPoint: selectedStock.reorderPoint || 0,
                MinimumInventory: selectedStock.minimumInventory || 0,
                MaximumInventory: selectedStock.maximumInventory || 0,
            })
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);

        setNewStock({
            QuantityAvailable: 0,
            InitialStock: 0,
            ReorderPoint: 0,
            MinimumInventory: 0,
            MaximumInventory: 0,
        });

        setSelectedStockId('');
    };

    const handleUpdateStock = async () => {
        try {
            await axios.put(`https://localhost:7028/api/rawMaterials/${rawMaterialId}/stocks/${selectedStockId}`, newStock);

            const response = await axios.get(`https://localhost:7028/api/rawMaterials/${rawMaterialId}/stocks`);

            const updatedStock = response.data;

            setStocks(updatedStock);

            setNewStock({
                QuantityAvailable: 0,
                InitialStock: 0,
                ReorderPoint: 0,
                MinimumInventory: 0,
                MaximumInventory: 0,
            });

            handleCloseModal();
            
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const handleGoBack = () => {
        history.goBack();
    };

    return (
        <div className="stocks-container">
            <h2>Información del Stock</h2>
            <div className="stock-card">
                {stocks.map((stock) => (
                    <Card key={stock.stockID}>
                        <Card.Body>
                            <Card.Title>Stock de Materia Prima</Card.Title>
                            <br />
                            <Card.Text>
                                <strong>Cantidad Disponible:</strong> {stock.quantityAvailable}
                            </Card.Text>
                            <Card.Text>
                                <strong>Stock Inicial:</strong> {stock.initialStock}
                            </Card.Text>
                            <Card.Text>
                                <strong>Punto Reorden:</strong> {stock.reorderPoint}
                            </Card.Text>
                            <Card.Text>
                                <strong>Inventario Mínimo:</strong> {stock.minimumInventory}
                            </Card.Text>
                            <Card.Text>
                                <strong>Inventario Máximo</strong> {stock.maximumInventory}
                            </Card.Text>
                            <br />
                            <Button variant="primary" onClick={() => handleShowEditModal(stock.stockID)}>
                                Editar Stock
                            </Button>
                            <Button variant="danger" onClick={handleGoBack}>
                                Volver a Materiales
                            </Button>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {/* Modal para actualizar */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalAction === 'edit' ? 'Actualizar Stock' : 'Nuevo Stock'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group controlId='formQuantityAvailable'>
                            <Form.Label>Cantidad Disponible</Form.Label>
                            <Form.Control 
                                type='number'
                                placeholder='Ingrese la cantidad disponible...'
                                value={newStock.QuantityAvailable}
                                onChange={(e) => setNewStock({ ...newStock, QuantityAvailable: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId='formInitialStock'>
                            <Form.Label>Stock Inicial</Form.Label>
                            <Form.Control 
                                type='number'
                                placeholder='Ingrese el stock inicial...'
                                value={newStock.InitialStock}
                                onChange={(e) => setNewStock({ ...newStock, InitialStock: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId='formReorderPoint'>
                            <Form.Label>Punto Reorden</Form.Label>
                            <Form.Control 
                                type='number'
                                placeholder='Ingrese el punto de reorden...'
                                value={newStock.ReorderPoint}
                                onChange={(e) => setNewStock({ ...newStock, ReorderPoint: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId='formMinimumInventory'>
                            <Form.Label>Inventario Mínimo</Form.Label>
                            <Form.Control 
                                type='number'
                                placeholder='Ingrese el inventario mínimo...'
                                value={newStock.MinimumInventory}
                                onChange={(e) => setNewStock({ ...newStock, MinimumInventory: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId='formMaximumInventory'>
                            <Form.Label>Inventario Máximo</Form.Label>
                            <Form.Control 
                                type='number'
                                placeholder='Ingrese el inventario máximo...'
                                value={newStock.MaximumInventory}
                                onChange={(e) => setNewStock({ ...newStock, MaximumInventory: e.target.value })}
                            />
                        </Form.Group>
                        
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button variant='primary' onClick={handleUpdateStock}>
                        {modalAction === 'edit' ? 'Actualizar' : ''}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Stocks;
