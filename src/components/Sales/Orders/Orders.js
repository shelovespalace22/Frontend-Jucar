import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Modal, Pagination, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faMinus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const Orders = ({ customerId }) => {
    const [orders, setOrders] = useState([]);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const [newOrder, setNewOrder] = useState({
        OrderDate: formattedDate,
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
            ContributionDate: formattedDate,
        }]
    });
    const [autoparts, setAutoparts] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
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

    useEffect(() => {
        const fetchAutoparts = async () => {
            try {
                const response = await axios.get('https://localhost:7028/api/autoparts');

                setAutoparts(response.data);

                console.log(autoparts);
            } catch (error) {
                console.error('Error fetching autoparts:', error);
            }
        };

        fetchAutoparts();
    }, []);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get('https://localhost:7028/api/paymentMethods');

                setPaymentMethods(response.data);

                console.log(paymentMethods);
            } catch (error) {
                console.error('Error fetching payment methods:', error);
            }
        };

        fetchPaymentMethods();
    }, []);

    const handleCreateOrder = async () => {
        try {
            console.log('Creating order with the next data:', newOrder);

            const response = await axios.post(`https://localhost:7028/api/customers/${customerId}/orders`, newOrder);

            setOrders([response.data, ...orders]);

            setNewOrder({
                OrderDate: formattedDate,
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
                    ContributionDate: formattedDate,
                }]
            });

            Swal.fire(
                '¡Éxito!',
                '¡La autoparte ha sido creada exitosamente.',
                'success'
            );

        } catch (error) {
            console.error('Error creating a order:', error);

            Swal.fire(
                'Error',
                'Hubo un problema al crear la autoparte.',
                'error'
            );
        }
    };

    const handleDetailChange = (index, field, value) => {
        const updatedDetails = newOrder.OrderDetails.map((detail, i) =>
            i === index ? { ...detail, [field]: value } : detail
        );
        setNewOrder({ ...newOrder, OrderDetails: updatedDetails });
    };
    
    const handleContributionChange = (index, field, value) => {
        const updatedContributions = newOrder.Contributions.map((contribution, i) =>
            i === index ? { ...contribution, [field]: value } : contribution
        );
        setNewOrder({ ...newOrder, Contributions: updatedContributions });
    };

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

    const handleGoBack = () => {
        history.goBack();
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
                                value={newOrder.OrderDate}
                                onChange={(e) => setNewOrder({
                                    ...newOrder, OrderDate: e.target.value
                                })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><b>Estado de Pago</b></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Ej: (Pendiente, Pagado)...'
                                value={newOrder.PaymentStatus}
                                onChange={(e) => setNewOrder({ ...newOrder, PaymentStatus: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><b>Dirección de Envío</b></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Ej: (Cra. 19 Este #32-17)'
                                value={newOrder.ShippingAddress}
                                onChange={(e) => setNewOrder({ ...newOrder, ShippingAddress: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><b>Estado de Envío</b></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Ej: (Entregado, En camino, En fabrica)'
                                value={newOrder.ShippingStatus}
                                onChange={(e) => setNewOrder({ ...newOrder, ShippingStatus: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label><b>Observación</b></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder='Agregue una observación si lo desea...'
                                value={newOrder.Observation}
                                onChange={(e) => setNewOrder({ ...newOrder, Observation: e.target.value})}
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
                                            as="select"
                                            value={detail.AutopartId}
                                            onChange={(e) => handleDetailChange(index, 'AutopartId', e.target.value)}
                                        >
                                            <option value="">- Seleccione -</option>

                                            {autoparts.map((autopart) => (
                                                <option key={autopart.autopartID} value={autopart.autopartID}>{autopart.name}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label><b>Cantidad</b></Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={detail.Quantity}
                                            onChange={(e) => handleDetailChange(index, 'Quantity', e.target.value)}
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
                        <h4>Contribuciones <i>(Opcional)</i></h4>
                        <hr/>
                        {newOrder.Contributions.map((contribution, index) => (
                            <Row key={index} className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Label><b>Método de Pago</b></Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={contribution.PaymentMethodId}
                                            onChange={(e) => handleContributionChange(index, 'PaymentMethodId', e.target.value)}
                                        >
                                            <option value="">-  Selecccione -</option>

                                            {paymentMethods.map((paymentMethod) => (
                                                <option key={paymentMethod.paymentMethodID} value={paymentMethod.paymentMethodID}>{paymentMethod.paymentMethodName}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label><b>Monto Aportado</b></Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={contribution.AmountPaid}
                                            onChange={(e) => handleContributionChange(index, 'AmountPaid', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label><b>Fecha de Contribución</b></Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={contribution.ContributionDate}
                                            onChange={(e) => handleContributionChange(index, 'ContributionDate', e.target.value)}
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
                        <br/>
                        <Button variant="success" onClick={handleCreateOrder}>
                            Guardar Pedido
                        </Button>
                    </Form>
                </Col>

                <Col md={8}>
                    {/* Tabla para mostrar los pedidos existentes */}
                    <h4>Tabla de Registros</h4>
                    <Button variant="danger" onClick={handleGoBack}>
                        Volver
                    </Button>
                    <hr/>
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
                                <tr key={order.orderID}>
                                    <td>{order.orderDate}</td>
                                    <td>{order.total}</td>
                                    <td>{order.paymentStatus}</td>
                                    <td>{order.shippingAddress}</td>
                                    <td>{order.shippingStatus}</td>
                                    <td>{order.observation}</td>
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
