// // Importa los módulos necesarios
// import React, { useState, useEffect } from 'react';
// import { Container, Card, Button } from 'react-bootstrap';
// import axios from 'axios';

// const RefreshToken = () => {
//   const [newTokens, setNewTokens] = useState(null);

//   // Función para manejar el refresco del token
//   const handleRefreshToken = async () => {
//     try {
//       // Obtenemos el token de actualización almacenado en localStorage
//       const refreshToken = localStorage.getItem('refreshToken');

//       // Realizamos la solicitud al endpoint de refresco de token
//       const response = await axios.post('https://localhost:7028/api/token/refresh', {
//         accessToken: localStorage.getItem('accessToken'),
//         refreshToken: refreshToken,
//       });

//       // Almacenamos los nuevos tokens en el estado local
//       setNewTokens(response.data);

//       // Almacenar los nuevos tokens en localStorage
//       localStorage.setItem('accessToken', response.data.accessToken);
//       localStorage.setItem('refreshToken', response.data.refreshToken);

//     } catch (error) {
//       console.error('Error durante el refresco del token:', error);
//     }
//   };

//   useEffect(() => {
//     // Llama a la función de manejo del refresco del token al montar el componente
//     handleRefreshToken();
//   }, []);

//   return (
//     <Container className="mt-5 container-box">
//       <Card className="card">
//         <Card.Body>
//           <Card.Title>Refresco de Token</Card.Title>
//           <Card.Text>
//             {newTokens ? (
//               <>
//                 <p>Nuevos Tokens:</p>
//                 <p>Token de Acceso: {newTokens.accessToken}</p>
//                 <p>Token de Refresco: {newTokens.refreshToken}</p>
//               </>
//             ) : (
//               <p>Refrescando tokens...</p>
//             )}
//           </Card.Text>
//           <Button variant="primary" onClick={handleRefreshToken}>
//             Refrescar Token
//           </Button>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// };

// export default RefreshToken;