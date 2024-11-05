import React from 'react';
import logo from '../assets/imagenes/logo.jpg'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';
import { FaUserAlt, FaCog, FaCalendarAlt, FaCar, FaWallet } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const Administrador = () => {
    const navigate = useNavigate(); //Para inicializar useNavigate
    
    //Función para manejar el clic en el botón "Cerrar Sesión"
    const handleLogout=() =>{
        //Confirmación de cierre de sesión
        const confirmLogout = window.confirm ("¿Estas seguro de que deseas cerrar sesión? ");
        
        if (confirmLogout === true) {
        navigate('/');
        }

    };


    return (
        <div className="bg-black min-h-screen flex flex-col justify-between">
            {/* Encabezado */}
            <header className="flex items-center justify-between bg-black py-4 px-6 border-b border-white-500">
                <div className="flex items-center">
                    <img src={logo} alt="Full Prestige" className="h-14" />
                    <p className="ml-4 text-white italic font-semibold text-sm">
                        "Que tu auto refleje lo mejor de ti"
                    </p>
                </div>

                <div className="flex flex-col space-y-4 text-white items-start">

                    <div className="flex items-center space-x-2">
                        <span className='w-3 h-3 bg-green-500 rounded-full inline-block'></span>
                        <span>Modo-Administrador</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <FaUserAlt className='text-white'/>
                        <span>Hola-Administrador</span>  
                    </div>

                    <div className='flex items-center'>
                        <FaCog className='text-white text-2xl ml-20'/>
                    </div>
                </div>
            </header>

            
            <main className="bg-white flex-grow flex flex-col items-center justify-center space-y-8 py-8" style={{
                background: '#bdc3c7',  /* Fallback for old browsers */
                background: '-webkit-linear-gradient(to right, #2c3e50, #bdc3c7)',  /* Chrome 10-25, Safari 5.1-6 */
                background: 'linear-gradient(to right, #2c3e50, #bdc3c7)'  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
            }}
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  
                    <Link to="/control-asistencia" className="bg-black border border-white-500 p-9 rounded-lg text-center hover:bg-gray-800 transition">
                        <FaCalendarAlt className="text-red-600 mx-auto text-5xl mb-4" />
                        <p className="text-white font-semibold">Control de Asistencia</p>
                    </Link>
                    
                    <Link to="/historial-clientes" className="bg-black border border-white-600 p-9 rounded-lg text-center hover:bg-gray-800 transition">
                        <FaCar className="text-red-600 mx-auto text-5xl mb-4" />
                        <p className="text-white font-semibold">Historial de Clientes y vehículos</p>
                    </Link>
                 
                    <Link to="/control-pagos" className="bg-black border border-white-600 p-9 rounded-lg text-center hover:bg-gray-800 transition">
                        <FaWallet className="text-red-600 mx-auto text-5xl mb-4" />
                        <p className="text-white font-semibold">Control de Pagos</p>
                    </Link>
                </div>

                
                
                <div className="mt-auto">
                    <button 
                        onClick={handleLogout} 
                        className="bg-green-500 text-black font-bold px-6 py-2 rounded-md hover:bg-green-700 transition mt-10">
                        Cerrar Sesión
                    </button>
                </div>
            </main>

        
            <footer className="bg-black py-4">
                <p className="text-center text-white text-sm">
                    Empresa dedicada al cuidado y mantenimiento de tu vehículo
                </p>
            </footer>
        </div>
    );
};

export default Administrador;
