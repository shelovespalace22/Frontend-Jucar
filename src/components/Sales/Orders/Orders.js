import React, { useState, useEffect } from 'react';
import {  Button, Form, Modal, Pagination, ModalHeader } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const Orders = ({customerId}) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const [orders, setOrders] = useState ([]);
    const history = useHistory();

    const [newOrder, setNewOrder] = useState ({
    OrderDate: formattedDate,
    Total: '',
    PaymentStatus: '',
    ShippingStatus: '',
    Observation: '',
    OrderDetails: [{
    AutopartId: '',
    Quantity: '',
    UnitValue: '', 
    SubtotalValue: ''
    }],
    Contributions: [{
    PaymentMethodId:'',
    AmountPaid: '',
    ContributionDate: ''

    }]
    });

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState('create');
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(()=>{
    const fetchOrders = async () => {
    try{
    const response = await axios.get(`https://localhost:7028/api/customers/${customerId}/orders`);
    setOrders(response.data);

    }catch (error){
    console.error('error fetching Order', error);
    }
    };
    fetchOrders();

    },[customerId]);

    const handleCreateOrder = async () => {
    try{
    const response = await axios.post(`https://localhost:7028/api/customers/${customerId}/orders`, newOrder);

    setOrders([response.data, ...orders]);

    setNewOrder({
    OrderDate: formattedDate,
    Total: '',
    PaymentStatus: '',
    ShippingStatus: '',
    Observation: '',
    OrderDetails: [{
    AutopartId: '',
    Quantity: '',
    UnitValue: '', 
    SubtotalValue: ''
    }],
    Contributions: [{
    PaymentMethodId:'',
    AmountPaid: '',
    ContributionDate: ''

    }]

    });
    handleCloseModal();

    }catch(error){
    console.error('error creating order', error)
    }
    };


    const handleUpdateOrder = async () => {
    try{
    await axios.put(
    `https://localhost:7028/api/customers/${customerId}/orders/${selectedOrderId}`,
    newOrder
    );

    const response = await axios.get (`https://localhost:7028/api/customers/${customerId}/orders`);
    const updateOrders = response.data; 

    setNewOrder({
    OrderDate: formattedDate,
    Total: '',
    PaymentStatus: '',
    ShippingStatus: '',
    Observation: '',
    OrderDetails: [{
    AutopartId: '',
    Quantity: '',
    UnitValue: '', 
    SubtotalValue: ''
    }],
    Contributions: [{
    PaymentMethodId:'',
    AmountPaid: '',
    ContributionDate: ''

    }]

    });
    handleCloseModal();

    }catch(error){
    console.error('error updating  order', error)
    }
    };

    const handleDeleteOrder = async (orderId) => {
    try{
    await axios.delete (`https://localhost:7028/api/customers/${customerId}/orders/${orderId}`);

    const updateOrders = orders.filter((order)=> order.orderId !== orderId);
    setOrders(updateOrders);

    }catch (error){
    console.error('error deleting order', error);

    }
    };

    const handleShowCreateModal = () => {
    setModalAction('create');
    setShowModal(true);
    };

    const handleShowEditModal = (orderId) => {
    setModalAction('edit');
    setSelectedOrderId(orderId);

    const selectedOrder = orders.find((order)=>order.orderId===orderId);

    if(selectedOrder){
    setNewOrder({
    OrderDate: selectedOrder.OrderDate || formattedDate,
    Total:selectedOrder.Total || '',
    PaymentStatus:selectedOrder.PaymentStatus || '',
    ShippingStatus: selectedOrder.ShippingStatus || '',
    Observation: selectedOrder.Observation ||'',
    OrderDetails: [{
    AutopartId: selectedOrder.AutopartId || '',
    Quantity: selectedOrder.Quantity ||0,
    UnitValue: selectedOrder.UnitValue ||0, 
    SubtotalValue:selectedOrder.SubtotalValue || 0
    }],
    Contributions: [{
    PaymentMethodId: selectedOrder.PaymentMethodId ||'',
    AmountPaid: selectedOrder.AmountPaid || 0,
    ContributionDate: selectedOrder.ContributionDate || formattedDate

    }]

    });
    }
    setShowModal(true);
    }; 

    const handleShowDetailModal = (orderId) => {
    setModalAction('detail');
    setSelectedOrderId(orderId);

    const selectedOrder = orders.find((order)=>order.orderId===orderId);

    if(selectedOrder){
    setNewOrder({
    OrderDate: selectedOrder.OrderDate || formattedDate,
    Total:selectedOrder.Total || '',
    PaymentStatus:selectedOrder.PaymentStatus || '',
    ShippingStatus: selectedOrder.ShippingStatus || '',
    Observation: selectedOrder.Observation ||'',
    OrderDetails: [{
    AutopartId: selectedOrder.AutopartId || '',
    Quantity: selectedOrder.Quantity ||0,
    UnitValue: selectedOrder.UnitValue ||0, 
    SubtotalValue:selectedOrder.SubtotalValue || 0
    }],
    Contributions: [{
    PaymentMethodId: selectedOrder.PaymentMethodId ||'',
    AmountPaid: selectedOrder.AmountPaid || 0,
    ContributionDate: selectedOrder.ContributionDate || formattedDate

    }]

    });
    }
    setShowModal(true);
    }; 

    const handleCloseModal = () =>{
    setShowModal(false);
    setNewOrder({
    OrderDate: formattedDate,
    Total: '',
    PaymentStatus: '',
    ShippingStatus: '',
    Observation: '',
    OrderDetails: [{
    AutopartId: '',
    Quantity: '',
    UnitValue: '', 
    SubtotalValue: ''
    }],
    Contributions: [{
    PaymentMethodId:'',
    AmountPaid: '',
    ContributionDate: ''

    }]
    });
    selectedOrderId('');
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleGoBack = () => {
    history.goBack();
    };

    return(
    <div></div>
    )


};

export default Orders;
   


