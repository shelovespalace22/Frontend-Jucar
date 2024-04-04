import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Modal, Pagination, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faMinus, faLink, faDollarSign } from '@fortawesome/free-solid-svg-icons';
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
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('edit');
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);
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

    const handleCloseModal = () => {
        setShowModal(false);
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

        setSelectedOrderId('');
    };

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

    const handleShowEditModal = (orderId) => {
        setModalAction('edit');
        setSelectedOrderId(orderId);

        const selectedOrder = orders.filter((order) => order.orderID === orderId);

        if(selectedOrder.length > 0) {
            const order = selectedOrder[0];

            const orderDetails = order.orderDetails.map(detail => ({
                AutopartId: detail.autopartId || '',
                Quantity: detail.quantity || 0,
            }));

            const contributions = order.contributions.map(contribution => ({
                PaymentMethodId: contribution.paymentMethodId || '',
                AmountPaid: contribution.amountPaid || 0,
                ContributionDate: contribution.contributionDate || formattedDate,
            }));

            console.log(order);
            console.log(orderDetails);
            console.log(contributions);

            setNewOrder({
                OrderDate: order.orderDate || formattedDate,
                PaymentStatus: order.paymentStatus || '',
                ShippingAddress: order.shippingAddress || '',
                ShippingStatus: order.shippingStatus || '',
                Observation: order.observation || '',
                OrderDetails: orderDetails,
                Contributions: contributions,
            });
        }

        setShowModal(true);
    };

    const handleUpdateOrder = async () => {
        try {
            await axios.put(`https://localhost:7028/api/customers/${customerId}/orders/${selectedOrderId}`, newOrder);

            const response = await axios.get(`https://localhost:7028/api/customers/${customerId}/orders`);

            const updatedOrders = response.data;

            setOrders(updatedOrders);

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

            handleCloseModal();

            Swal.fire(
                '¡Éxito!',
                '¡El pedido ha sido actualizado exitosamente.',
                'success'
            );

        } catch (error) {
            console.error('Error updating order:', error);

            Swal.fire(
                'Error',
                'Hubo un problema al actualizar el pedido.',
                'error'
            );
        }
    };

    const handleShowDetailModal = (orderId) => {
        setModalAction('detail');
        setSelectedOrderId(orderId);

        const selectedOrder = orders.filter((order) => order.orderID === orderId);

        if(selectedOrder.length > 0) {
            const order = selectedOrder[0];

            const orderDetails = order.orderDetails.map(detail => ({
                AutopartId: detail.autopartId || '',
                Quantity: detail.quantity || 0,
            }));

            const contributions = order.contributions.map(contribution => ({
                PaymentMethodId: contribution.paymentMethodId || '',
                AmountPaid: contribution.amountPaid || 0,
                ContributionDate: contribution.contributionDate || formattedDate,
            }));

            console.log(order);
            console.log(orderDetails);
            console.log(contributions);

            setNewOrder({
                OrderDate: order.orderDate || formattedDate,
                PaymentStatus: order.paymentStatus || '',
                ShippingAddress: order.shippingAddress || '',
                ShippingStatus: order.shippingStatus || '',
                Observation: order.observation || '',
                OrderDetails: orderDetails,
                Contributions: contributions,
            });
        }

        setShowModal(true);
    };

    const handleDeleteOrder = (orderId) => {
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
                    await axios.delete(`https://localhost:7028/api/customers/${customerId}/orders/${orderId}`);

                    const updatedOrders = orders.filter((order) => order.orderID !== orderId);

                    setOrders(updatedOrders);

                    Swal.fire(
                        '¡Eliminado!',
                        '¡El pedido ha sido eliminada.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting order:', error);

                    Swal.fire(
                        'Error',
                        'Hubo un problema al eliminar el pedido.',
                        'error'
                    );
                }
            }
          })
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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
        history.goBack();
    };

    const handleShowDetails = (orderId) => {
        history.push('/order-details', { orderId });
    };

    const handleShowContributions = (orderId) => {
        history.push('/order-contributions', { orderId });
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
                                    <Button variant="danger" onClick={() => removeOrderDetail(index)} style={{ marginRight: '10px' }}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="primary" onClick={addOrderDetail} style={{ marginRight: '10px' }}>
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
                        <br/>
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
                            {currentOrders.map((order) => (
                                <tr key={order.orderID}>
                                    <td>{order.orderDate}</td>
                                    <td>{order.total}</td>
                                    <td>{order.paymentStatus}</td>
                                    <td>{order.shippingAddress}</td>
                                    <td>{order.shippingStatus}</td>
                                    <td>{order.observation}</td>
                                    <td>
                                        <Button variant="info" onClick={() => handleShowDetailModal(order.orderID)} style={{ marginRight: '10px' }}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                        <Button variant="warning" onClick={() => handleShowEditModal(order.orderID)} style={{ marginRight: '10px' }}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDeleteOrder(order.orderID)}style={{ marginRight: '10px' }}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>

                                        <Button variant="success" onClick={() => handleShowDetails(order.orderID)} className="me-2">
                                            <FontAwesomeIcon icon={faLink} />
                                        </Button>

                                        <Button variant="success" onClick={() => handleShowContributions(order.orderID)} className="me-2">
                                            <FontAwesomeIcon icon={faDollarSign} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Pagination>
                        {Array.from({ length: Math.ceil(orders.length / itemsPerPage) }, (_, index) => (
                        <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </Pagination.Item>
                        ))}
                    </Pagination>

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {modalAction === 'edit'
                                ? 'Actualizar Pedido'
                                : 'Detalles del Pedido'}
                            </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            {modalAction !== 'detail' && (
                                <Form>
                                    
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
                                    <br/>
                                </Form>
                            )}
                            {modalAction === 'detail' && (
                                <div>
                                    {selectedOrderId && (
                                        <div>
                                            <p><b>ID:</b> {selectedOrderId}</p>
                                            <p><b>Fecha del Pedido:</b> {newOrder.OrderDate}</p>
                                            <p><b>Estado de Pago:</b> {newOrder.PaymentStatus}</p>
                                            <p><b>Dirección de Envío:</b> {newOrder.ShippingAddress}</p>
                                            <p><b>Estado de Envío:</b> {newOrder.ShippingStatus}</p>
                                            <p><b>Observaciones:</b> {newOrder.Observation}</p>
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
                                    onClick={handleUpdateOrder}
                                >
                                    Actualizar
                                </Button>
                            )}
                        </Modal.Footer>
                    </Modal>
                </Col>
                
            </Row>
        </Container>
    );
};

export default Orders;
