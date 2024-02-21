// RegistroExitoso.js
import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RegistroExitoso = () => {
  return (
    <Container className="mt-5">
      <Alert variant="success">
        Registro exitoso. Puedes <Link to="/">Iniciar Sesión</Link> ahora.
      </Alert>
    </Container>
  );
};

export default RegistroExitoso;
