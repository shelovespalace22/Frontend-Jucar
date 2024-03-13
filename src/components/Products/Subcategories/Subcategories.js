import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const Subcategories = ({ categoryId }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('create');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSubcategories = subcategories.slice(indexOfFirstItem, indexOfLastItem);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7028/api/categories/${categoryId}/subcategories`);
        setSubcategories(response.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleCreateSubcategory = async () => {
    try {
      const response = await axios.post(`https://localhost:7028/api/categories/${categoryId}/subcategories`, {
        name: newSubcategoryName,
      });

      setSubcategories([ response.data, ...subcategories]);
      setNewSubcategoryName('');
      handleCloseModal();
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  const handleUpdateSubcategory = async () => {
    try {
      await axios.put(`https://localhost:7028/api/categories/${categoryId}/subcategories/${selectedSubcategoryId}`, {
        name: newSubcategoryName,
      });

      const updatedSubcategories = subcategories.map((subcategory) =>
        subcategory.subcategoryId === selectedSubcategoryId ? { ...subcategory, name: newSubcategoryName } : subcategory
      );

      setSubcategories(updatedSubcategories);
      setNewSubcategoryName('');
      handleCloseModal();
    } catch (error) {
      console.error('Error updating subcategory:', error);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {  
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {

          await axios.delete(`https://localhost:7028/api/categories/${categoryId}/subcategories/${subcategoryId}`);

          const updatedSubcategories = subcategories.filter((subcategory) => subcategory.subcategoryId !== subcategoryId);
          
          setSubcategories(updatedSubcategories);
          
          Swal.fire(
            '¡Eliminado!',
            '¡Tu subcategoría ha sido eliminada.',
            'success'
          );

        } catch (error) {
          console.error('Error deleting subcategory:', error);
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar la subcategoría.',
            'error'
          );
        }
      }
    });
  };
  

  const handleShowCreateModal = () => {
    setModalAction('create');
    setShowModal(true);
  };

  const handleShowEditModal = (subcategoryId) => {
    setModalAction('edit');
    setSelectedSubcategoryId(subcategoryId);

    // Find the selected subcategory to pre-fill the modal input
    const selectedSubcategory = subcategories.find((subcategory) => subcategory.subcategoryId === subcategoryId);
    setNewSubcategoryName(selectedSubcategory ? selectedSubcategory.name : '');

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewSubcategoryName('');
    setSelectedSubcategoryId('');
  };

  const handleShowAutoparts = (subcategoryId) => {
    history.push('/subcategory-autoparts', { subcategoryId })
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div className="subcategories-container">

      <br/>

      <h2>Modulo Subcategorías</h2>

      <br/>

      <Button variant="primary" onClick={handleShowCreateModal}>
        <FontAwesomeIcon icon={faPlus} /> Nueva Subcategoría
      </Button>

      <Button variant="danger" onClick={handleGoBack}>
        Volver
      </Button>

      <hr/>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentSubcategories.map((subcategory) => (
            <tr key={subcategory.subcategoryId}>
              <td>{subcategory.name}</td>
              <td>
                <Button variant="info" onClick={() => handleShowEditModal(subcategory.subcategoryId)}>
                  <FontAwesomeIcon icon={faEdit} /> Actualizar
                </Button>
                <Button variant="danger" onClick={() => handleDeleteSubcategory(subcategory.subcategoryId)}>
                  <FontAwesomeIcon icon={faTrash} /> Eliminar
                </Button>
                <Button variant="success" onClick={() => handleShowAutoparts(subcategory.subcategoryId)}>
                  <FontAwesomeIcon icon={faScrewdriverWrench} /> Ver Autopartes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({ length: Math.ceil(subcategories.length / itemsPerPage) }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalAction === 'create' ? 'Nueva Subcategoría' : 'Actualizar Subcategoría'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formSubcategoryName">
            <Form.Label><b>Nombre</b></Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese el nombre..."
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={modalAction === 'create' ? handleCreateSubcategory : handleUpdateSubcategory}>
            {modalAction === 'create' ? 'Crear' : 'Actualizar'}
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
};

export default Subcategories;