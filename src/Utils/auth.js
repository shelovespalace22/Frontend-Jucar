// auth.js

export const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    // Realiza cualquier verificación adicional del token si es necesario
    return token !== null;
  };
  