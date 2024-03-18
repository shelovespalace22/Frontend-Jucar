import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Estilos CSS para el carrusel


import imagen1 from '../../assets/img/laina-react.jpg';
import imagen2 from '../../assets/img/autopartes-react.jpg';
import imagen3 from '../../assets/img/autopartes3_react.jpg';
import './styles/MenusStyles.css';


const InicioMenu = () => {

  const images = [imagen1, imagen2, imagen3];

  const [currentIndex, setCurrentIndex] = useState(0);
  

  const [intervalId, setIntervalId] = useState(null);


  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
  };


  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
   
    const id = setInterval(() => {
      nextSlide();
    }, 5000); 

    setIntervalId(id);

  
    return () => {
      clearInterval(id);
    };
  }, [currentIndex]); 

 
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90vh',
    },
    carouselContainer: {
      width: '50%', 
      marginRight: '2rem', 
      textAlign: 'center', 
      position: 'relative',
    },
    textoContainer: {
      width: '50%', 
    },
    texto: {
      textAlign: 'justify',
      fontSize: '17px',
      fontFamily: 'serif'
    },
    icon: {
      fontSize: '24px',
      cursor: 'pointer',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1, 
    },
    leftIcon: {
      left: 0,
    },
    rightIcon: {
      right: 0,
    },
  };

  return (
    <div style={styles.container} className="inicio-menu-container">
      <div style={styles.carouselContainer} className="carousel-container">
        <Carousel
          selectedItem={currentIndex}
          onChange={index => setCurrentIndex(index)}
          showThumbs={false}
          showArrows={false}
          showStatus={false}
        >
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Imagen ${index + 1}`} />
            </div>
          ))}
        </Carousel>
        
      </div>
      <div style={styles.textoContainer} className="texto-container">
        <div style={styles.texto}>
          <h2>Bienvenidos a JUCAR...</h2>
          <p>
           Bienvenidos a JUCAR Autopartes, especialistas en la fabricación de arandelas mediante el proceso de troquelado.
           Nos dedicamos a crear arandelas de alta calidad, adaptadas a las necesidades específicas de nuestros clientes.
           Nuestra atención meticulosa al detalle en la creación de troqueles garantiza la precisión y consistencia de cada arandela que producimos.
           En JUCAR Autopartes, nos enorgullece ofrecer soluciones de fijación confiables y de primera calidad para una amplia gama de aplicaciones industriales.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InicioMenu;