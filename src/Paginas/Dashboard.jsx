import logo from '../assets/imagenes/logo.jpg'; 
import bg from '../assets/imagenes/DashboardImage/Bg.png';
import users from '../assets/imagenes/DashboardImage/usersRBG.png';
import assistant from '../assets/imagenes/DashboardImage/assistantRBG.png';
import clients from '../assets/imagenes/DashboardImage/clientsRBG.png';
import pay from '../assets/imagenes/DashboardImage/payRBG.png';
import tools from '../assets/imagenes/DashboardImage/toolsRBG.png';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaCog } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import AuthContext from '../context/AuthProvider';
import { useContext } from 'react';

export const Dashboard = () => {
    const { auth, logout } = useContext(AuthContext); // Consumir el contexto

    // Función para manejar el clic en el botón "Cerrar Sesión"
    const handleLogout = () => {
        const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
        if (confirmLogout === true) {
            logout();
        }
    };

    return (
        <div className="bg-black min-h-screen flex flex-col justify-between">
            {/* Encabezado */}
            <header className="flex items-center justify-between bg-black py-4 px-6 border-b border-white-500">
                <div className="flex items-center">
                    <img src={logo} alt="Full Prestige" className="h-14 logo-header" />
                    <p className="ml-4 text-white italic font-semibold text-sm">
                        &quot;Que tu auto refleje lo mejor de ti&quot;
                    </p>
                </div>

                <div className="flex flex-col space-y-4 text-white items-start user-info">
                    <div className="flex items-center space-x-2">
                        <span className='w-3 h-3 bg-green-500 rounded-full inline-block'></span>
                        <span className='user-name'>Bienvenido/a: {auth.nombre}</span>
                    </div>

                    <div className="flex flex-row items-center space-x-2">
                        <FaUserAlt className='text-white'/>
                        <span className='user-role'>Modo: {auth.cargo}</span>  
                    </div>
                    <Link to="/dashboard/perfil" className='flex items-center justify-center'>
                        <FaCog data-tooltip-id="profile" data-tooltip-content="Edita tu perfil" className='text-white text-2xl ml-20'/>
                        <ReactTooltip id='profile' place='bottom'/>
                    </Link>
                </div>
                <div className="mt-auto dashboard-list">
                    <button 
                        onClick={handleLogout} 
                        className="bg-green-600 text-white font-bold px-6 py-2 rounded-md hover:bg-green-700 transition mt-10">
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main
                className="bg-white flex-grow flex flex-col items-center justify-center space-y-4 py-8"
                style={{
                    backgroundImage: `url(${bg})`, // Asegúrate de que la URL de la imagen sea correcta
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div>
                    <h1 className="text-3xl font-bold text-black">MENÚ PRINCIPAL</h1> 
                </div>
                <div className={`menu px-4 grid gap-8 ${auth?.cargo === 'Técnico' ? 'grid-cols-1 place-items-center' : 'grid-cols-3 sm:grid-cols-3'}`}>
                    {/* Mostrar opciones solo si el cargo no es 'Técnico' */}
                    {auth?.cargo !== 'Técnico' && (
                        <>
                            <Link
                                to="/dashboard/historial-usuarios"
                                className="bg-black border-4 border-red-700 p-9 rounded-lg text-center hover:bg-gray-500 transition max-w-xs">
                                <img src={users} alt="user" className="mx-auto w-40 h-30 invert" />
                                <p className="text-white font-semibold">Gestionar Usuarios</p>
                            </Link>

                            <Link 
                                to="/dashboard/historial-asistencia" 
                                className="bg-black border-4 border-red-700 p-9 rounded-lg text-center hover:bg-gray-500 transition max-w-xs">
                                <img src={assistant} alt="assistant" className='mx-auto w-40 h-30 invert' />
                                <p className="text-white font-semibold">Control de Asistencia</p>
                            </Link>
                            
                            <Link 
                                to="/dashboard/historial-clientes" 
                                className="bg-black border-4 border-red-700 p-9 rounded-lg text-center hover:bg-gray-500 transition max-w-xs">
                                <img src={clients} alt="clients" className='mx-auto w-40 h-30 invert' />
                                <p className="text-white font-semibold">Historial de Clientes</p>
                            </Link>

                            <Link 
                                to="/dashboard/historial-pagos" 
                                className="bg-black border-4 border-red-700 p-9 rounded-lg text-center hover:bg-gray-500 transition max-w-xs">
                                <img src={pay} alt="pay" className='mx-auto w-40 h-30 invert' />
                                <p className="text-white font-semibold">Control de Pagos</p>
                            </Link>
                        </>
                    )}
                    {/* Los técnicos siempre pueden ver este botón */}
                    <Link
                        to="/dashboard/historial-mantenimiento"
                        className="bg-black border-4 border-red-700 p-9 rounded-lg text-center hover:bg-gray-500 transition max-w-xs">
                        <img src={tools} alt="tools" className='mx-auto w-40 h-30 invert' />
                        <p className="text-white font-semibold">Registro de mantenimiento vehicular</p>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-black py-4">
                <p className="text-center text-white text-sm">
                    2024 Full Prestige. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
