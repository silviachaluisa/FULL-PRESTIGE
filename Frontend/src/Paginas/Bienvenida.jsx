import logo from '../assets/imagenes/logo.jpg';
import facebookIcon from '../assets/imagenes/Redes/facebookIcon.png';
import instagramIcon from '../assets/imagenes/Redes/instagramIcon.png';
import tiktokIcon from '../assets/imagenes/Redes/tiktokIcon.png'
import location from '../assets/imagenes/Redes/location.png'
import fondo from '../assets/imagenes/bg.jpg'


import { Link } from 'react-router-dom';

export const Bienvenida = () => {
  return (
    <div>
      <main
        className="bg-black flex flex-col items-center justify-center h-screen px-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondo})` }}
        >
       <div className='bg-black border border-red-500 rounded'>
         {/* Contenido principal */}
         <div className="text-center p-8 rounded-lg shadow-lg bg-black">
          <h1 className="text-4xl text-white mb-5">BIENVENIDO</h1>
          <p className="text-m text-white mt-6 italic">
            Empresa dedicada al cuidado y mantenimiento de tu vehículo
          </p>
          <img src={logo} alt="Full Prestige" className="logo px-20 mt-5 mb-1 w-30 h-32" />
          <Link to="/login">
            <button className="mt-5 bg-black border border-white text-red-600 px-8 py-2 rounded-full hover:bg-gray-900 transition-colors">
              INGRESAR AL SISTEMA
            </button>
          </Link>
        {/* Redes sociales */}
        <div className="mt-3 flex justify-center gap-5 bg-black mt-9">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={facebookIcon} alt="Facebook" className="w-13 h-12 hover:scale-110 transition-transform" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={instagramIcon} alt="Instagram" className="w-13 h-12 hover:scale-110 transition-transform" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={tiktokIcon} alt="Twitter" className="w-13 h-12 hover:scale-110 transition-transform" />
          </a>
        </div>
        {/* Dirección */}
        <p className="text-white mt-6 flex flex-col items-center ">
        <a
            href="https://maps.app.goo.gl/zaGGwSpdKYQ2JwZo9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
        >
            <img
            src={location}
            alt="location"
            className="w-12 h-14 mb-2 hover:scale-110 transition-transform mt-7"
            />
            <span className="underline text-center">
            Sangolquí, España 686 Detrás de la Novaclínica del Valle
            </span>
        </a>
        </p>
        </div>


       </div>

      </main>

      {/* Footer------------------------------------------------------------------- */}
      <footer className="w-full py-1 text-center text-white bg-black border-t border-white">
      2024 Full Prestige. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Bienvenida;
