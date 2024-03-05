import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderDetailsComponent = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7028/api/orders/${orderId}/details`);
        setOrderDetails(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div>
      <h2>Detalle de ordenes: {orderId}</h2>
      <table>
        <thead>
          <tr>
            <th>Autopart ID</th>
            <th>Quantity</th>
            <th>Unit Value</th>
            <th>Subtotal Value</th>
          </tr>
        </thead>
        <tbody>
          {orderDetails.map((detail, index) => (
            <tr key={index}>
              <td>{detail.autopartID}</td>
              <td>{detail.quantity}</td>
              <td>{detail.unitvalue}</td>
              <td>{detail.subtotalvalue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetailsComponent;


