import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const OrderDetails = ({ orderId }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const history = useHistory();

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

  const handleGoBack = () => {
    history.goBack();
};

  return (
    <div>

      <h2>Detalles del Pedido</h2>
      <hr/>

      <div>
        {orderDetails.map((orderDetail, index) => (
          <Card key={orderDetail.orderDetailID}>
            <Card.Body>
              <Card.Title>Detalle {index + 1}</Card.Title>
              <hr/>
              <Card.Text>
                <strong>- Autoparte:</strong> {orderDetail.autopartName}
              </Card.Text>

              <Card.Text>
                <strong>- Valor:</strong> ${orderDetail.unitValue}
              </Card.Text>

              <Card.Text>
                <strong>- Cantidad:</strong> {orderDetail.quantity}
              </Card.Text>

              <Card.Text>
                <strong>- Subtotal:</strong> ${orderDetail.subtotalValue}
              </Card.Text>
            </Card.Body>
            <br/>
          </Card>
        ))}
      </div>

      <br/>

      <Button variant="danger" onClick={handleGoBack}>
        Volver
      </Button>

    </div>
  );
};

export default OrderDetails;


