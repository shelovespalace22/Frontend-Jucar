// Categories.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Button, Form, Pagination, Modal } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit, faList } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '.././styles/Crud.css'

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
  
      Swal.fire(
        '¡Éxito!',
        '¡La categoría ha sido creada exitosamente.',
        'success'
      );
    } catch (error) {
      console.error('Error creating category:', error);
  
      Swal.fire(
        'Error',
        'Hubo un problema al crear la categoría.',
        'error'
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
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
          await axios.delete(`https://localhost:7028/api/categories/${categoryId}`);

          const updatedCategories = categories.filter((category) => category.categoryId !== categoryId);
          
          setCategories(updatedCategories);
          
          Swal.fire(
            '¡Eliminado!',
            '¡Tu categoría ha sido eliminada.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting category:', error);
        
          Swal.fire(
            'Error',
            'Hubo un problema al eliminar la categoría.',
            'error'
          );
        }
      }
    });
  };

  const handleUpdateCategory = async (categoryId, newName) => {
    try {
      await axios.put(
        `https://localhost:7028/api/categories/${categoryId}`, 
        { name: newName }
      );
  
      const response = await axios.get('https://localhost:7028/api/categories');
      const updatedCategories = response.data;
  
      setCategories(updatedCategories);
      setNewCategoryName({ Name: '' });
      setShowUpdateModal(false);
  
      Swal.fire(
        '¡Éxito!',
        '¡La categoría ha sido actualizada exitosamente.',
        'success'
      );
    } catch (error) {
      console.error('Error updating category:', error);
  
      Swal.fire(
        'Error',
        'Hubo un problema al actualizar la categoría.',
        'error'
      );
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
                <Button
                  variant="info"
                  onClick={() => {
                    setUpdateCategoryId(category.categoryId);
                    setShowUpdateModal(true);
                  }}
                  className="action-button"
                >
                  <FontAwesomeIcon icon={faEdit} /> Actualizar
                </Button>{' '}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteCategory(category.categoryId)}
                  className="action-button"
                >
                  <FontAwesomeIcon icon={faTrash} /> Eliminar
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleShowSubcategories(category.categoryId)}
                  className="action-button"
                >
                  <FontAwesomeIcon icon={faList} /> Ver Subcategorías
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCategoryName">
              <Form.Label><b>Nombre</b></Form.Label>
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
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Actualizar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUpdatedCategoryName">
              <Form.Label><b>Nombre</b></Form.Label>
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
