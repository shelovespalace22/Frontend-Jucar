import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const Login = () => {

  const [userData, setUserData] = useState({
    UserName: '',
    Password: '',
  });

  const [loginError, setLoginError] = useState('');
  const [redirectMenu, setRedirectMenu] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7028/api/authentication/login', userData);

      console.log('Acceso éxitoso:', response.data);

      setRedirectMenu(true);
      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);

    } catch (error) {
      console.error('Error durante el acceso:', error);

      if (error.response && error.response.status === 401) {
        setLoginError('Usuario o contraseña incorrectos');
      } else {
        setLoginError('Hubo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
      }
    }
  };

  // Funciones para establecer tokens en el estado local o localStorage
  const setAccessToken = (token) => {
    localStorage.setItem('accessToken', token);
  };

  const setRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
  };

  if (redirectMenu) {
    return <Redirect to="/menu" />;
  }

  return (
    <Container className="mt-5 container-box">
      <Card className="card" style={{ minHeight: '400px', marginLeft: '300px', marginTop: '70px', borderLeft: '2px' }}>
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formUserName">
            <Form.Label><strong>Nombre de Usuario</strong></Form.Label>
            <Form.Control
              type="text"
              name="UserName"
              value={userData.UserName}
              onChange={handleInputChange}
              required
              style={{ borderColor: 'rgba(255, 0, 0, 0.5)', backgroundColor: 'rgba(255, 0, 0, 0.1)' ,marginTop:20}}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label className='label-password'><strong>Contraseña</strong></Form.Label>
            <Form.Control
              type="password"
              name="Password"
              value={userData.Password}
              onChange={handleInputChange}
              required
              style={{ borderColor: 'rgba(255, 0, 0, 0.5)', backgroundColor: 'rgba(255, 0, 0, 0.1)', marginTop:20 }}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="card-button">
          <FontAwesomeIcon icon={faSignInAlt} className="card-icon" />
            Acceder
          </Button>

          {loginError && <Alert variant="danger" className="mt-3">{loginError}</Alert>}
        </Form>
      </Card>

      {/* Estilos en línea */}
      <style>
        {`
          .card {
            color:  #fff;
            background-color:  #d62121;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            width: 50%;
           
          }

          .card-button {
            margin-top:6%;
            margin-left:40%;
            background-color: #5eaf38
          }

          .label-password{
            margin-top: 2%
          }

          .mt-5 container-box{
            display: flex; justify-content: center;
          }

          .card-icon{
            margin-right: 4%

          }
        `}
      </style>
    </Container>
  );
};

export default Login;

