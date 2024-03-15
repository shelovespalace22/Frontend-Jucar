import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Container, Card, Button } from 'react-bootstrap';

const InicioSesion = () => {
  return (
    <Container className="mt-5 container-box">
      <Card className="card">
        {/* Registro */}
        <Link to="/registro" className="card-link">
          <FontAwesomeIcon icon={faUserPlus} className="card-icon" />
          <Card.Title className="card-heading">Registrarse</Card.Title>
          <Card.Text className="card-description">
            ¡Crea una cuenta para comenzar!
          </Card.Text>
          <Button variant="primary" size="lg" className="card-button">
            Registrarse
          </Button>
        </Link>
      </Card>

      <div className="my-4" />

      <Card className="card">
        {/* Acceder */}
        <Link to="/login" className="card-link">
          <FontAwesomeIcon icon={faSignInAlt} className="card-icon" />
          <Card.Title className="card-heading">Acceder</Card.Title>
          <Card.Text className="card-description">
            ¡Inicia sesión con tu cuenta existente!
          </Card.Text>
          <Button variant="success" size="lg" className="card-button">
            Acceder
          </Button>
        </Link>
      </Card>

      {/* Estilos en línea */}
      <style>
        {`
          .card {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }

          .card-link {
            text-decoration: none;
            color: inherit;
          }

          .card-icon {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .card-heading {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .card-description {
            font-size: 16px;
            margin-bottom: 10px;
          }

          .card-button {
            width: 100%;
          }
        `}
      </style>
    </Container>
  );
};

export default InicioSesion;
