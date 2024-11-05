import React from 'react';
import logo from '../assets/imagenes/logo.jpg'; // Asegúrate de que la ruta sea correcta
import { Link } from 'react-router-dom';
import { FaUserAlt, FaCog, FaCalendarAlt, FaCar, FaWallet } from 'react-icons/fa';

const Dashboard = () => {
    return (
        <div className="bg-black min-h-screen flex flex-col justify-between">
            {/* Encabezado */}
            <header className="flex items-center justify-between bg-black py-4 px-6 border-b border-blue-500">
                <div className="flex items-center">
                    <img src={logo} alt="Full Prestige" className="h-14" />
                    <p className="ml-4 text-white italic font-semibold text-sm">
                        "Que tu auto refleje lo mejor de ti"
                    </p>
                </div>
                <div className="flex items-center space-x-4 text-white">
                    <div className="flex items-center">
                        <FaUserAlt className="mr-2" />
                        <span>Modo-Administrador</span>
                    </div>
                    <div className="flex items-center">
                        <span>Hola-Administrador</span>
                        <FaCog className="ml-2" />
                    </div>
                </div>
            </header>

            {/* Opciones principales */}
            <main className="flex-grow flex flex-col items-center justify-center space-y-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {/* Opción 1: Control de Asistencia */}
                    <Link to="/control-asistencia" className="bg-black border border-blue-500 p-8 rounded-lg text-center hover:bg-gray-800 transition">
                        <FaCalendarAlt className="text-red-600 mx-auto text-5xl mb-4" />
                        <p className="text-white font-semibold">Control de Asistencia</p>
                    </Link>
                    {/* Opción 2: Historial de Clientes y Vehículos */}
                    <Link to="/historial-clientes" className="bg-black border border-blue-500 p-8 rounded-lg text-center hover:bg-gray-800 transition">
                        <FaCar className="text-red-600 mx-auto text-5xl mb-4" />
                        <p className="text-white font-semibold">Historial de Clientes y vehículos</p>
                    </Link>
                    {/* Opción 3: Control de Pagos */}
                    <Link to="/control-pagos" className="bg-black border border-blue-500 p-8 rounded-lg text-center hover:bg-gray-800 transition">
                        <FaWallet className="text-red-600 mx-auto text-5xl mb-4" />
                        <p className="text-white font-semibold">Control de Pagos</p>
                    </Link>
                </div>

                {/* Botón de Salir */}
                <button className="bg-green-500 text-black font-bold px-6 py-2 rounded-full hover:bg-green-700 transition">
                    SALIR
                </button>
            </main>

            {/* Pie de página */}
            <footer className="bg-black py-4">
                <p className="text-center text-white text-sm">
                    Empresa dedicada al cuidado y mantenimiento de tu vehículo
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
