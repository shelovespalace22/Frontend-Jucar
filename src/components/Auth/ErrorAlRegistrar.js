// ErrorAlRegistrar.js
import React from 'react';
import { Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ErrorAlRegistrar = ({ errorMessages }) => {
  return (
    <Container className="mt-5">
      <Alert variant="danger">
        Hubo un error al registrar. Por favor, inténtalo de nuevo o contacta al soporte.{' '}
        <Link to="/">Volver a la página de inicio de sesión</Link>
      </Alert>
      {errorMessages && errorMessages.length > 0 && (
        <ul>
          {errorMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default ErrorAlRegistrar;
