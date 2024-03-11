import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye, faPhone, faLocationDot, faBoxArchive } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const Orders = () => {
    const [orders, setOrders] = useState ([]);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    const [newOrder, setNewOrder] = useState({
        OrderDate: formattedDate,
        Total: 0,
        PaymentStatus: '',
        ShippingAddress: '',
        ShippingStatus: '',
        Observation:'',
        OrderDetail:[{
            Quantity: 0,
            UnitValue: 0,
            SubtotalValue: 0
        }],
        Contribution:[{
            PaymentMethodId:'',
            AmountPaid: 0,
            ContributionDate: formattedDate,
        }]
    });
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem)
    const history = useHistory();

    useEffect(() => {
        const fetchOrders = async () => {
            try{
                const response = await axios.get (`https://localhost:7028/api/orders`);

                setOrders(response.data);
            }catch (error){
                console.error('error fetching orders', error);
            }
        };

        fetchOrders();
    },[]);

    const handleCreateOrder = async () => {
    try{
    const response = await axios.post(`https://localhost:7028/api/orders`, newOrder);

    setOrders([response.data, ...orders]);

    setNewOrder({
        OrderDate: formattedDate,
        Total: 0,
        PaymentStatus: '',
        ShippingAddress: '',
        ShippingStatus: '',
        Observation:'',
        OrderDetail:[{
            Quantity: 0,
            UnitValue: 0,
            SubtotalValue: 0
        }],
        Contribution:[{
            PaymentMethodId:'',
            AmountPaid: 0,
            ContributionDate: formattedDate,
        }]

       })

        handleCloseModal();
        }catch (error){
            console.error('error creating order', error);
        }

    };

    const handleUpdateOrder = async () => {
        try{
            await axios.put (`https://localhost:7028/api/orders/${selectedOrderId}`, newOrder);

            const response = await axios.get (`https://localhost:7028/api/orders`);

            const updatedOrders = response.data;

            setOrders(updatedOrders);

            setNewOrder({
                OrderDate: formattedDate,
                Total: 0,
                PaymentStatus: '',
                ShippingAddress: '',
                ShippingStatus: '',
                Observation:'',
                OrderDetail:[{
                    Quantity: 0,
                    UnitValue: 0,
                    SubtotalValue: 0
                }],
                Contribution:[{
                    PaymentMethodId:'',
                    AmountPaid: 0,
                    ContributionDate: formattedDate,
                }]
        
            });

            handleCloseModal();

        }catch (error) {
            console.error('error updating order', error);

        }
    };

    const handleDeleteOrder = async (orderId) => {
        try{
            await axios.delete(`https://localhost:7028/api/orders/${selectedOrderId}`);

            const updatedOrders = orders.filter((order) => order.orderID !== orderId);

            setOrders(updatedOrders);

        }catch (error){
            console.error('error deleting order', error);
        }
    };

    const handleShowCreateModal = () => {
        setModalAction('create');
        setShowModal(true);
    };

    const handleShowEditModal = (orderId) => {
        setModalAction ('edit');
        setSelectedOrderId(orderId);

        const selectedOrder = orders.find((order) => order.orderID === orderId);

        if(selectedOrder){
            setNewOrder({
                OrderDate: selectedOrder.orderDate || formattedDate,
                Total: selectedOrder.total || 0,
                PaymentStatus: selectedOrder.paymentStatus || '',
                ShippingAddress: selectedOrder.shippingAddress ||  '',
                ShippingStatus: selectedOrder.shippingStatus || '',
                Observation: selectedOrder.observation ||'',
                OrderDetail:[{
                    Quantity: selectedOrder.quantity || 0,
                    UnitValue: selectedOrder.unitValue || 0,
                    SubtotalValue: selectedOrder.subtotalValue || 0
                }],
                Contribution:[{
                    PaymentMethodId: selectedOrder.paymentMethodId ||'',
                    AmountPaid: selectedOrder.amountPaid || 0,
                    ContributionDate: selectedOrder.contributionDate || formattedDate,
                }]
        
            });

        }

        setShowModal(true);
    };

    const handleShowDetailModal = (orderId) => {
        setModalAction ('detail');
        setSelectedOrderId(orderId);

        const selectedOrder = orders.find((order) => order.orderID === orderId);

        if(selectedOrder){
            setNewOrder({
                OrderDate: selectedOrder.orderDate || formattedDate,
                Total: selectedOrder.total || 0,
                PaymentStatus: selectedOrder.paymentStatus || '',
                ShippingAddress: selectedOrder.shippingAddress ||  '',
                ShippingStatus: selectedOrder.shippingStatus || '',
                Observation: selectedOrder.observation ||'',
                OrderDetail:[{
                    Quantity: selectedOrder.quantity || 0,
                    UnitValue: selectedOrder.unitValue || 0,
                    SubtotalValue: selectedOrder.subtotalValue || 0
                }],
                Contribution:[{
                    PaymentMethodId: selectedOrder.paymentMethodId ||'',
                    AmountPaid: selectedOrder.amountPaid || 0,
                    ContributionDate: selectedOrder.contributionDate || formattedDate,
                }]
        
            });

        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);

        setNewOrder({
            OrderDate: formattedDate,
            Total: 0,
            PaymentStatus: '',
            ShippingAddress: '',
            ShippingStatus: '',
            Observation:'',
            OrderDetail:[{
                Quantity: 0,
                UnitValue: 0,
                SubtotalValue: 0
            }],
            Contribution:[{
                PaymentMethodId:'',
                AmountPaid: 0,
                ContributionDate: formattedDate,
            }]
    
        });

        setSelectedOrderId('');
    };

    const handleShowDetails = (orderId) => {
        history.push('/orders-orderDetails', {orderId});

    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
        history.goBack();
    };

    return(
        <div className='Orders-container'>

            <br/>
            <h2>Ordenes</h2>
            <br/>

            <Button variant="primary" onClick={handleShowCreateModal}>
                <FontAwesomeIcon icon={faPlus} /> Nueva Orden
            </Button>

            <Button variant="danger" onClick={handleGoBack}>
                Volver
            </Button>

            <hr/>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Fecha de Orden</th>
                        <th>Total</th>
                        <th>Estado metodo de Pago</th>
                        <th>Direccion de envio</th>
                        <th>Estado de envio</th>
                        <th>Observacion</th>
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
                               <Button variant="info" onClick={() => handleShowEditModal(order.orderID)}>
                                    <FontAwesomeIcon icon={faEdit} /> Actualizar
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteOrder(order.orderID)}>
                                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                                </Button>
                                <Button variant="primary" onClick={() => handleShowDetailModal(order.orderID)}>
                                    <FontAwesomeIcon icon={faEye} /> Ver Detalle
                                </Button>
                                <Button variant='primary' onClick={() => handleShowDetails (order.orderID) }>
                                    <FontAwesomeIcon icon={faEye} /> Ver detalle de orden
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

            <Modal show ={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalAction === 'create'
                        ? 'Nueva orden'
                        :modalAction === 'edit'
                        ?'Actualizar orden'
                        :'Detalle de orden'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {modalAction !== 'detail' &&(
                        <Form>
                            <Form.Group controlId='formOrderDate'>
                                <Form.Label>Fecha de la Orden</Form.Label>
                                <Form.Control
                                    type='date'
                                    placeholder='Ingrese la fecha de la orden'
                                    value={newOrder.OrderDate}
                                    onChange={(e) => setNewOrder({...newOrder, OrderDate: e.target.value})}
                                />
                            </Form.Group>

                            <Form.Group controlId='formTotal'>
                                <Form.Label>Total</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='ingrese el total por la orden'
                                    value={newOrder.Total}
                                    onChange={(e) => setNewOrder({...newOrder, Total: e.target.value})}
                                />
                            </Form.Group>

                            <Form.Group controlId='formPaymentStatus'>
                                <Form.Label>Estado del metodo de pago</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ingrese el estado del metodo de pago (Activo o Inactivo)'
                                    value={newOrder.PaymentStatus}
                                    onChange={(e) => setNewOrder({...newOrder, PaymentStatus: e.target.value})}
                                />
                            </Form.Group>

                            <Form.Group controlId='formShippingAddress'>
                                <Form.Label>Direccion de envio</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ingrese la direccion de envio'
                                    value={newOrder.ShippingAddress}
                                    onChange={(e) => setNewOrder({...newOrder, ShippingAddress: e.target.value})}
                                />
                            </Form.Group>

                            <Form.Group controlId='formShippingStatus'>
                                <Form.Label>Estado del envio</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ingrese el estado del envio (Activo o Inactivo)'
                                    value={newOrder.ShippingStatus}
                                    onChange={(e) => setNewOrder({...newOrder, ShippingStatus: e.target.value})}
                                />
                            </Form.Group>

                            <Form.Group controlId='formObservation'>
                                <Form.Label>Observaciones</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ingrese observaciones de la orden'
                                    value={newOrder.Observation}
                                    onChange={(e) => setNewOrder({...newOrder, Observation: e.target.value})}
                                />
                            </Form.Group>
                        </Form>
                    )}

                    {modalAction === 'detail' &&(
                        <div>
                            {selectedOrderId && (
                                <div>
                                    <h4>Detalles de Orden</h4>
                                    <p>ID: {selectedOrderId}</p>
                                    <p>Fecha de orden: {newOrder.OrderDate}</p>
                                    <p>Total: {newOrder.Total}</p>
                                    <p>Estado metodo de pago: {newOrder.PaymentStatus}</p>
                                    <p>Direccion de envio: {newOrder.ShippingAddress}</p>
                                    <p>Estado de envio: {newOrder.ShippingStatus}</p>
                                    <p>Observacion: {newOrder.Observation}</p>
                                </div>
                            )}
                        </div>
                    )}

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>

                    {modalAction !== 'detail' &&(
                        <Button
                            variant='primary'
                            onClick={modalAction === 'create' ? handleCreateOrder: handleUpdateOrder}
                        
                        >
                            {modalAction === 'create' ? 'Crear' : 'Actualizar'}
                        </Button>
                    )}

                </Modal.Footer>

            </Modal>

        </div>
    )

};

export default Orders;
   


