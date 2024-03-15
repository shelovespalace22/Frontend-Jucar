import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const Registro = () => {
  const rolesOptions = ['Administrator', 'Manager'];

  const [userData, setUserData] = useState({
    FirstName: '',
    LastName: '',
    UserName: '',
    Password: '',
    Email: '',
    PhoneNumber: '',
    Roles: [],
  });

  const [redirectToSuccess, setRedirectToSuccess] = useState(false);
  const [redirectToError, setRedirectToError] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevData) => {
      if (name === 'Roles') {
        const selectedRoles = Array.from(e.target.selectedOptions, (option) => option.value);
        return {
          ...prevData,
          [name]: selectedRoles,
        };
      }

      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7028/api/authentication', userData);

      console.log('Registro exitoso:', response);
      setRedirectToSuccess(true);
    } catch (error) {
      console.error('Error al registrar:', error.response);

      if (error.response && error.response.data && error.response.data.title) {
        setErrorMessages(error.response.data.title);
      } else {
        setErrorMessages(['Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo.']);
      }

      setRedirectToError(true);
    }
  };

  const styles = {
    container: {
      marginTop: '50px',
    },
    card: {
      backgroundColor: '#d62121',
      color: 'white',
      fontSize: '1.2rem',
      padding: '20px',
      maxWidth: '500px', 
      margin: '0 auto', 
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    inputField: {
      marginBottom: '15px',
    },
    cardButton: {
      display: 'block',
      margin: '0 auto',
    },
  };

  return (
    <Container style={styles.container}>
      <Card style={styles.card}>
        <Form onSubmit={handleRegister} style={styles.form}>
          <Form.Group controlId="formFirstName">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="FirstName"
              value={userData.FirstName}
              onChange={handleInputChange}
              required
              style={styles.inputField}
            />
          </Form.Group>

          <Form.Group controlId="formLastName">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="LastName"
              value={userData.LastName}
              onChange={handleInputChange}
              required
              style={styles.inputField}
            />
          </Form.Group>

          <Form.Group controlId="formUserName">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              name="UserName"
              value={userData.UserName}
              onChange={handleInputChange}
              required
              style={styles.inputField}
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
              style={styles.inputField}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={userData.Email}
              onChange={handleInputChange}
              required
              style={styles.inputField}
            />
          </Form.Group>

          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Número de Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="PhoneNumber"
              value={userData.PhoneNumber}
              onChange={handleInputChange}
              required
              style={styles.inputField}
            />
          </Form.Group>

          <Form.Group controlId="formRoles">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              name="Roles"
              value={userData.Roles}
              onChange={handleInputChange}
              required
              style={styles.inputField}
            >
              <option disabled value="">
                -- Selecciona un rol --
              </option>

              {rolesOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Button variant="primary" type="submit" style={styles.cardButton}>
            Registrarse
          </Button>
        </Form>
      </Card>

      {redirectToSuccess && <Redirect to="/registro-exitoso" />}
      {redirectToError && <Redirect to="/error-al-registrar" />}
    </Container>
  );
};

export default Registro;

