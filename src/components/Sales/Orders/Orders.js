import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Modal, Pagination, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faMinus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const Orders = ({ customerId }) => {
    const [orders, setOrders] = useState([]);
    const [newOrder, setNewOrder] = useState({
        OrderDate: new Date().toISOString().split('T')[0],
        PaymentStatus: '',
        ShippingAddress: '',
        ShippingStatus: '',
        Observation: '',
        OrderDetails: [{
            AutopartId: '',
            Quantity: 0,
        }],
        Contributions: [{
            PaymentMethodId: '',
            AmountPaid: 0,
            ContributionDate: new Date().toISOString().split('T')[0],
        }]
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const history = useHistory();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`https://localhost:7028/api/customers/${customerId}/orders`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, [customerId]);

    const addOrderDetail = () => {
        setNewOrder({
            ...newOrder,
            OrderDetails: [...newOrder.OrderDetails, { AutopartId: '', Quantity: 0 }]
        });
    };

    const removeOrderDetail = (index) => {
        const updatedOrderDetails = [...newOrder.OrderDetails];
        updatedOrderDetails.splice(index, 1);
        setNewOrder({ ...newOrder, OrderDetails: updatedOrderDetails });
    };

    const addContribution = () => {
        setNewOrder({
            ...newOrder,
            Contributions: [...newOrder.Contributions, { PaymentMethodId: '', AmountPaid: 0, ContributionDate: new Date().toISOString().split('T')[0] }]
        });
    };

    const removeContribution = (index) => {
        const updatedContributions = [...newOrder.Contributions];
        updatedContributions.splice(index, 1);
        setNewOrder({ ...newOrder, Contributions: updatedContributions });
    };

    return (
        <Container fluid>
            <Row>
                <Col md={4} style={{ overflowY: 'auto', maxHeight: '90vh' }}>
                    <Form>
                        {/* Datos generales del pedido */}
                        <h4>Datos Generales</h4>
                        <hr/>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Fecha del Pedido</b></Form.Label>
                            <Form.Control
                                type="date"
                                name="OrderDate"
                                value={newOrder.OrderDate}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Estado de Pago</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="PaymentStatus"
                                value={newOrder.PaymentStatus}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Dirección de Envío</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="ShippingAddress"
                                value={newOrder.ShippingAddress}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Estado de Envío</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="ShippingStatus"
                                value={newOrder.ShippingStatus}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><b>Observación</b></Form.Label>
                            <Form.Control
                                type="text"
                                name="Observation"
                                value={newOrder.Observation}
                            />
                        </Form.Group>

                        
                        <h4>Detalles del Pedido</h4>
                        <hr/>
                        {newOrder.OrderDetails.map((detail, index) => (
                            <Row key={index} className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label><b>Autoparte</b></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="AutopartId"
                                            value={detail.AutopartId}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label><b>Cantidad</b></Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="Quantity"
                                            value={detail.Quantity}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Button variant="danger" onClick={() => removeOrderDetail(index)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="primary" onClick={addOrderDetail} className="mb-3">
                            <FontAwesomeIcon icon={faPlus} /> Agregar Detalle
                        </Button>

                        {/* Contribuciones */}
                        <h4>Contribuciones</h4>
                        <hr/>
                        {newOrder.Contributions.map((contribution, index) => (
                            <Row key={index} className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label><b>Método de Pago</b></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="PaymentMethodId"
                                            value={contribution.PaymentMethodId}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label><b>Monto Aportado</b></Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="AmountPaid"
                                            value={contribution.AmountPaid}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Button variant="danger" onClick={() => removeContribution(index)}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="primary" onClick={addContribution} className="mb-3">
                            <FontAwesomeIcon icon={faPlus} /> Agregar Contribución
                        </Button>

                        <Button type="submit" variant="success">Guardar Pedido</Button>
                    </Form>
                </Col>

                <Col md={8}>
                    {/* Tabla para mostrar los pedidos existentes */}
                    <h4>Tabla de Registros</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Fecha de Pedido</th>
                                <th>Total</th>
                                <th>Estado de Pago</th>
                                <th>Dirección de Envío</th>
                                <th>Estado de Envío</th>
                                <th>Observaciones</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.OrderID}>
                                    <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                                    <td>{order.Total}</td>
                                    <td>{order.PaymentStatus}</td>
                                    <td>{order.ShippingAddress}</td>
                                    <td>{order.ShippingStatus}</td>
                                    <td>{order.Observation}</td>
                                    <td>
                                        <Button variant="info" className="me-2">
                                            <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                        <Button variant="warning" className="me-2">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="danger">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
                
            </Row>
        </Container>
    );
};

export default Orders;
