import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const Autoparts = ({ subcategoryId }) => {

  /* VARIABLES */
  const [autoparts, setAutoparts] = useState([]);
  const [newAutopart, setNewAutopart] = useState({
    Name: '',
    Description: '',
    Inventory: 0,
    Value: 0,
    RawMaterialId: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('create');
  const [selectedAutopartId, setSelectedAutopartId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAutoparts = autoparts.slice(indexOfFirstItem, indexOfLastItem);
  const history = useHistory();

  useEffect(() => {
    const fetchAutoparts = async () => {
      try {
        const response = await axios.get(`https://localhost:7028/api/subcategories/${subcategoryId}/autoparts`);
        setAutoparts(response.data);
      } catch (error) {
        console.error('Error fetching autoparts:', error);
      }
    };

    fetchAutoparts();
  }, [subcategoryId]);

  const handleCreateAutopart = async () => {
    try {
      const response = await axios.post(`https://localhost:7028/api/subcategories/${subcategoryId}/autoparts`, newAutopart);

      setAutoparts([response.data, ...autoparts]);

      setNewAutopart({
        Name: '',
        Description: '',
        Inventory: 0,
        Value: 0,
        RawMaterialId: '',
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error creating autopart:', error);
    }
  };

  const handleUpdateAutopart = async () => {
    try {
      await axios.put(
        `https://localhost:7028/api/subcategories/${subcategoryId}/autoparts/${selectedAutopartId}`,
        newAutopart
      );

      const response = await axios.get(`https://localhost:7028/api/subcategories/${subcategoryId}/autoparts`);
        
      const updatedAutoparts = response.data;

      setAutoparts(updatedAutoparts);

      setNewAutopart({
        Name: '',
        Description: '',
        Inventory: 0,
        Value: 0,
        RawMaterialId: '',
      });

      handleCloseModal();
      
    } catch (error) {
      console.error('Error updating autopart:', error);
    }
  };

  const handleDeleteAutopart = async (autopartId) => {
    try {
      await axios.delete(`https://localhost:7028/api/subcategories/${subcategoryId}/autoparts/${autopartId}`);

      const updatedAutoparts = autoparts.filter((autopart) => autopart.autopartID !== autopartId);

      setAutoparts(updatedAutoparts);

    } catch (error) {
      console.error('Error deleting autopart:', error);
    }
  };

  const handleShowCreateModal = () => {
    setModalAction('create');
    setShowModal(true);
  };

  const handleShowEditModal = (autopartId) => {
    setModalAction('edit');
    setSelectedAutopartId(autopartId);

    // Find the selected autopart to pre-fill the modal input
    const selectedAutopart = autoparts.find((autopart) => autopart.autopartID === autopartId);

    // If selected autopart is found, pre-fill the modal input fields
    if (selectedAutopart) {
      setNewAutopart({
        Name: selectedAutopart.name || '',
        Description: selectedAutopart.description || '',
        Inventory: selectedAutopart.inventory || 0,
        Value: selectedAutopart.value || 0,
        RawMaterialId: selectedAutopart.rawMaterialId || '',
      });
    }

    setShowModal(true);
  };

  const handleShowDetailModal = (autopartId) => {
    setModalAction('detail');
    setSelectedAutopartId(autopartId);

    // Find the selected autopart to pre-fill the modal input
    const selectedAutopart = autoparts.find((autopart) => autopart.autopartID === autopartId);

    // If selected autopart is found, pre-fill the modal input fields
    if (selectedAutopart) {
      setNewAutopart({
        Name: selectedAutopart.name || '',
        Description: selectedAutopart.description || '',
        Inventory: selectedAutopart.inventory || 0,
        Value: selectedAutopart.value || 0,
        RawMaterialId: selectedAutopart.rawMaterialId || '',
      });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewAutopart({
      Name: '',
      Description: '',
      Inventory: 0,
      Value: 0,
      RawMaterialId: '',
    });
    setSelectedAutopartId('');
  };

  const handleShowLosses = (autopartId) => {
    // Redirige a la ruta "/autopart-losses" con el parámetro "autopartId"
    history.push('/autopart-losses', { autopartId });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div className="autoparts-container">

      <br />
      <h2>Modulo Autopartes</h2>
      <br />

      <Button variant="primary" onClick={handleShowCreateModal}>
        <FontAwesomeIcon icon={faPlus} /> Nueva Autoparte
      </Button>
      
      <Button variant="danger" onClick={handleGoBack}>
        Volver
      </Button>

      <hr />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Inventario</th>
            <th>Valor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentAutoparts.map((autopart) => (
            <tr key={autopart.autopartID}>
              <td>{autopart.name}</td>
              <td>{autopart.description}</td>
              <td>{autopart.inventory}</td>
              <td>{autopart.value}</td>
              <td>
                <Button variant="info" onClick={() => handleShowEditModal(autopart.autopartID)}>
                  <FontAwesomeIcon icon={faEdit} /> Actualizar
                </Button>
                <Button variant="danger" onClick={() => handleDeleteAutopart(autopart.autopartID)}>
                  <FontAwesomeIcon icon={faTrash} /> Eliminar
                </Button>
                <Button variant="primary" onClick={() => handleShowDetailModal(autopart.autopartID)}>
                  <FontAwesomeIcon icon={faEye} /> Ver Detalle
                </Button>

                {/* Agrega el botón debajo de este comentario */}
                <Button variant="secondary" onClick={() => handleShowLosses(autopart.autopartID)}>
                  Ver Pérdidas
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Pagination>
        {Array.from({ length: Math.ceil(autoparts.length / itemsPerPage) }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      
      <Modal show={showModal} onHide={handleCloseModal}>
      
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === 'create'
              ? 'Nueva Autoparte'
              : modalAction === 'edit'
              ? 'Actualizar Autoparte'
              : 'Detalle de Autoparte'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {modalAction !== 'detail' && (
            <Form>
              <Form.Group controlId="formAutopartName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el nombre..."
                  value={newAutopart.Name}
                  onChange={(e) => setNewAutopart({ ...newAutopart, Name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formAutopartDescription">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese la descripción..."
                  value={newAutopart.Description}
                  onChange={(e) => setNewAutopart({ ...newAutopart, Description: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formAutopartInventory">
                <Form.Label>Inventario</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese el inventario..."
                  value={newAutopart.Inventory}
                  onChange={(e) => setNewAutopart({ ...newAutopart, Inventory: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formAutopartValue">
                <Form.Label>Valor</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese el valor..."
                  value={newAutopart.Value}
                  onChange={(e) => setNewAutopart({ ...newAutopart, Value: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formAutopartRawMaterialId">
                <Form.Label>ID de Materia Prima</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el ID de materia prima..."
                  value={newAutopart.RawMaterialId}
                  onChange={(e) => setNewAutopart({ ...newAutopart, RawMaterialId: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
          {modalAction === 'detail' && (
            <div>
              {/* Muestra la información detallada de la autoparte */}
              {selectedAutopartId && (
                <div>
                  <h4>Detalles de la Autoparte</h4>
                  <p>ID: {selectedAutopartId}</p>
                  <p>Nombre: {newAutopart.Name}</p>
                  <p>Descripción: {newAutopart.Description}</p>
                  <p>Inventario: {newAutopart.Inventory}</p>
                  <p>Valor: {newAutopart.Value}</p>
                  <p>ID de Materia Prima: {newAutopart.RawMaterialId}</p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          {modalAction !== 'detail' && (
            <Button
              variant="primary"
              onClick={modalAction === 'create' ? handleCreateAutopart : handleUpdateAutopart}
            >
              {modalAction === 'create' ? 'Crear' : 'Actualizar'}
            </Button>
          )}
        </Modal.Footer>

      </Modal>
    </div>
  );
};

export default Autoparts;
