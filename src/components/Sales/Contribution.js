import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';

const Contributions = (orderId) => {
    
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    const [contributions, setContributions] = useState([]);
    const [newContribution, setNewContribution] = useState ({
        PaymentMethodId: '',
        AmountPaid: 0,
        ContributionDate: formattedDate
    })
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('create');
  const [selectedContributionId, setSelectedContributionId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContributions = contributions.slice(indexOfFirstItem, indexOfLastItem);
  const history = useHistory();

  useEffect(()=>{
    const fetchContributions = async () =>{
        try{
            const response = axios.get(`https://localhost:7028/api/orders/${orderId}/contributions`);
            setContributions(response.data);

        }catch (error){
            console.error ('error fetching contribution', error);

        }
    };
    fetchContributions();
  },[orderId]);

  const handleCreateContribution = async ()=> {
    try{
        const response = await axios.post(`https://localhost:7028/api/orders/${orderId}/contributions`, newContribution );

        setContributions([response.data, ...contributions]);

        setNewContribution({
            PaymentMethodId: '',
            AmountPaid: 0,
            ContributionDate: formattedDate
        });

        handleCloseModal();
        
    }catch (error){
        console.error('error creating contribution', error)

    }
  };

  const handleUpdateContribution = async () =>{
    try{
        await axios.put(
            `https://localhost:7028/api/orders/${orderId}/contributions/${selectedContributionId}`, newContribution
        );

        const response = await axios.get (`https://localhost:7028/api/orders/${orderId}/contributions`);

        const updateContributions = response.data;

        setContributions(updateContributions);

        setNewContribution({
            PaymentMethodId: '',
            AmountPaid: 0,
            ContributionDate: formattedDate
        });

        handleCloseModal();
    }catch (error){
        console.error('error updating contribution', error);

    }
  };

  const handleDeleteContribution = async (contributionId) => {
    try{
        await axios.delete (`https://localhost:7028/api/orders/${orderId}/contributions/${contributionId}`);

        const updatedContributions = contributions.filter((contribution)=> contribution.contributionId !== contributionId);
        setContributions(updatedContributions);
    }catch (error){
        console.error ('error deleting contribution', error);

    }
  };

  const handleShowCreateModal = () => {
    setModalAction('create');
    setShowModal(true);
  };

  const handleShowEditModal = (contributionId) => {
    setModalAction ('edit');
    setSelectedContributionId(contributionId);

    const selectedContribution = contributions.find ((contribution)=> contribution.contributionId === contributionId);

    if (selectedContribution){
        setNewContribution({
            PaymentMethodId: selectedContribution.PaymentMethodId ||  '',
            AmountPaid:selectedContribution.AmountPaid || 0,
            ContributionDate:selectedContribution.ContributionDate|| formattedDate
        })
    }

    setShowModal(true);
  };


  const handleShowDetailModal = (contributionId) => {
    setModalAction ('Detail');
    setSelectedContributionId(contributionId);

    const selectedContribution = contributions.find ((contribution)=> contribution.contributionId === contributionId);

    if (selectedContribution){
        setNewContribution({
            PaymentMethodId: selectedContribution.PaymentMethodId ||  '',
            AmountPaid:selectedContribution.AmountPaid || 0,
            ContributionDate:selectedContribution.ContributionDate|| formattedDate
        })
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewContribution({
        PaymentMethodId: '',
        AmountPaid: 0,
        ContributionDate: formattedDate
    });
    setSelectedContributionId('');
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleGoBack = () => {
    history.goBack();
};

return(
    <div className='contributions-container'>
        <header>
            <div>
                <img src = '' alt='logo'/>
                <h1>AutopartesJUCAR</h1>
            </div>
        </header>
        <br>
        <h2>Contribuciones</h2>
        </br>
        <Button variant="primary" onClick={handleShowCreateModal}>
        <FontAwesomeIcon icon={faPlus} /> Nueva Contribucion
        </Button>
        <Button variant="danger" onClick={handleGoBack}>
            Volver
        </Button>

        <hr/>
        <Table>
            <thead>
                <tr>
                    <th>Metodo de pago</th>
                    <th>Cantidad pagada</th>
                    <th>Fecha de la contribucion</th>
                </tr>
            </thead>
            <tbody>
                {currentContributions.map ((contribution) => (
                    <tr key={contribution.contributionId}>
                        <td>{contribution.PaymentMethodId}</td>
                        <td>{contribution.AmountPaid}</td>
                        <td>{contribution.ContributionDate}</td>
                        <td>
                        <Button variant="info" onClick={() => handleShowEditModal(contribution.contributionId)}>
                        <FontAwesomeIcon icon={faEdit} /> Actualizar
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteContribution(contribution.contributionId)}>
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                        </Button>
                        <Button variant="primary" onClick={() => handleShowDetailModal(contribution.contributionId)}>
                        <FontAwesomeIcon icon={faEye} /> Ver Detalle
                        </Button>
                        </td>

                    </tr>
                ))}
            </tbody>
        </Table>

        <Pagination>
        {Array.from({ length: Math.ceil(contributions.length / itemsPerPage) }, (_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Modal show ={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>
                {modalAction === 'create'
                ? 'nueva contribucion'
                :modalAction === 'edit'
                ? 'Actualizar contribucion'
                : 'Detalle de la contribucion'}
            </Modal.Title>

        </Modal.Header>

        <Modal.Body>
            {modalAction !== 'detail' &&(
                <Form>
                    <Form.Group controlId='formMethodId'>
                        <Form.Label>Id de metodo de pago</Form.Label>
                        <Form.Control
                         type= "text"
                         placeholder='Ingrese el id del metodo de pago que se uso'
                         value={newContribution.PaymentMethodId}
                         onChange={(e)=> setNewContribution({...newContribution, PaymentMethodId: e.target.value})}
                        
                        />
                         
                    </Form.Group>
                    <Form.Group controlId='formAmountPaid'>
                        <Form.Label>Cantidad pagada</Form.Label>
                        <Form.Control
                         type= "number"
                         placeholder='Ingrese la cantidad pagada'
                         value={newContribution.AmountPaid}
                         onChange={(e)=> setNewContribution({...newContribution, AmountPaid: e.target.value})}
                        
                        />
                         
                    </Form.Group>
                    <Form.Group contrilId="formContrubutionDate">
                        <Form.Label>Fecha de contribucion</Form.Label>
                        <Form.Control
                         type= "date"
                         placeholder='Ingrese fecha de la contribucion'
                         value={newContribution.ContributionDate}
                         onChange={(e)=> setNewContribution({...newContribution, ContributionDate: e.target.value})}
                        
                        />
                         
                    </Form.Group>
                </Form>
            )}
            {modalAction === 'detail' && (
                <div>
                    {selectedContributionId && (
                        <div>
                            <h4>Detalles de la contribucion</h4>
                            <p>ID metodo de pago: {selectedContributionId}</p>
                            <p>Cantidad pagada: {newContribution.AmountPaid}</p>
                            <p>Fecha de contribucion: {newContribution.ContributionDate}</p>
                        </div>
                    )}
                </div>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseModal}>
                Cancelar
            </Button>
            {modalAction !== 'detail' && (
                <Button
                variant='primary'
                onClick={modalAction === 'create' ? handleCreateContribution : handleUpdateContribution}
                >
                 {modalAction === 'create' ? 'Crear' : 'Actualizar'}    
                </Button>


            )}
        </Modal.Footer>


      </Modal>
        

    

    </div>
);

};

export default Contributions;