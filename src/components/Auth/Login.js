import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

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
      <Card className="card">
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="formUserName">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              name="UserName"
              value={userData.UserName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="Password"
              value={userData.Password}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="card-button">
            Acceder
          </Button>

          {/* <Link to="/refresh-token" className="ml-2">Refrescar Token</Link> */}

          {loginError && <Alert variant="danger" className="mt-3">{loginError}</Alert>}
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
