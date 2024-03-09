// Categories.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Button, Form, Pagination, Modal } from 'react-bootstrap';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit, faList } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateCategoryId, setUpdateCategoryId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(10);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://localhost:7028/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchData();
  }, []);

  const handleCreateCategory = async () => {
    try {
      const response = await axios.post('https://localhost:7028/api/categories', {
        name: newCategoryName,
      });

      setCategories([response.data, ...categories]);
      
      setNewCategoryName('');
      
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`https://localhost:7028/api/categories/${categoryId}`);
      
      const updatedCategories = categories.filter((category) => category.categoryId !== categoryId);
      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleUpdateCategory = async (categoryId, newName) => {
    try {
        await axios.put(
            `https://localhost:7028/api/categories/${categoryId}`, {name: newName });

        // Realiza una nueva solicitud para obtener la lista actualizada
        const response = await axios.get('https://localhost:7028/api/categories');

        const updatedCategories = response.data;

        // Actualiza el estado con la nueva lista
        setCategories(updatedCategories);

        setNewCategoryName({
            Name: '',
        });

        setShowUpdateModal(false);

    } catch (error) {
        console.error('Error updating rawMaterial:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowSubcategories = (categoryId) => {
    history.push('/category-subcategories', { categoryId });
  };

  const handleGoBack = () => {
    history.goBack();
  };


  return (
    <div className="categories-container">

      <br/>

      <h2>Modulo Categorías</h2>

      <br />

      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        <FontAwesomeIcon icon={faPlus} /> Nueva Categoría
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
          {currentCategories.map((category) => (
            <tr key={category.categoryId}>
              <td>{category.name}</td>
              <td>
                <Button variant="info" onClick={() => {
                  setUpdateCategoryId(category.categoryId);
                  setShowUpdateModal(true);
                }}>
                  <FontAwesomeIcon icon={faEdit} /> Actualizar
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteCategory(category.categoryId)}>
                  <FontAwesomeIcon icon={faTrash} /> Eliminar
                </Button>
                <Button variant="primary" onClick={() => handleShowSubcategories(category.categoryId)}>
                  <FontAwesomeIcon icon={faList} /> Ver Subcategorías
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Componente de paginación */}
      <Pagination>
        {Array.from({ length: Math.ceil(categories.length / categoriesPerPage) }).map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal para crear categoría */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre de la categoría"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateCategory}>
            Crear
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para actualizar categoría */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUpdatedCategoryName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nuevo nombre de la categoría"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => handleUpdateCategory(updateCategoryId, newCategoryName)}>
            Actualizar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categories;
