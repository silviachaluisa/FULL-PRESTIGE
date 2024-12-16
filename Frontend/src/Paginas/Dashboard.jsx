import logo from '../assets/imagenes/logo.jpg'; 
import bg from '../assets/imagenes/DashboardImage/Bg.png';
import users from '../assets/imagenes/DashboardImage/users.png';
import assistant from '../assets/imagenes/DashboardImage/assistant.png';
import clients from '../assets/imagenes/DashboardImage/clients.png';
import pay from '../assets/imagenes/DashboardImage/pay.png';
import tools from '../assets/imagenes/DashboardImage/tools.png';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaCog} from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import { useContext } from 'react';


export const Dashboard = () => {
    const navigate = useNavigate(); //Para inicializar useNavigate
    // Consumir el contexto
  const {auth} = useContext(AuthContext)
    
    //Función para manejar el clic en el botón "Cerrar Sesión"
    const handleLogout=() =>{
        //Confirmación de cierre de sesión
        const confirmLogout = window.confirm("¿Estas seguro de que deseas cerrar sesión? ");
        if (confirmLogout === true) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };
    return (
        <div className="bg-black min-h-screen flex flex-col justify-between">
            {/* Encabezado */}
            <header className="flex items-center justify-between bg-black py-4 px-6 border-b border-white-500">
                <div className="flex items-center">
                    <img src={logo} alt="Full Prestige" className="h-14" />
                    <p className="ml-4 text-white italic font-semibold text-sm">
                        &quot;Que tu auto refleje lo mejor de ti&quot;
                    </p>
                </div>

                <div className="flex flex-col space-y-4 text-white items-start">
                    <div className="flex items-center space-x-2">
                        <span className='w-3 h-3 bg-green-500 rounded-full inline-block'></span>
                        <span>Bienvenido/a: {auth.nombre}</span>
                    </div>

                    <div className="flex flex-row items-center space-x-2">
                        <FaUserAlt className='text-white'/>
                        <span>Modo: {auth.cargo}</span>  
                    </div>
                   <Link to="/dashboard/perfil" className='flex items-center justify-center'>
                        <FaCog data-tooltip-id="profile" data-tooltip-content="Edita tu perfil " className='text-white text-2xl ml-20'/>
                        <ReactTooltip id='profile' place='bottom'/>
                   </Link>
                </div>
            <div className="mt-auto">
                <button 
                    onClick={handleLogout} 
                    className="bg-green-600 text-white font-bold px-6 py-2 rounded-md hover:bg-green-700 transition mt-10">
                    Cerrar Sesión
                </button>
            </div>
            </header>
            <main
                className="bg-white flex-grow flex flex-col items-center justify-center space-y-8 py-8"
                style={{
                    backgroundImage: 'url(src/assets/imagenes/DashboardImage/Bg.png)', // Establece la imagen de fondo
                    backgroundSize: 'cover', // Ajusta la imagen para cubrir toda el área
                    backgroundPosition: 'center', // Centra la imagen
                    backgroundRepeat: 'no-repeat', // Evita que la imagen se repita
                }}
            > 
            <div>
                <h1 className="text-3xl font-bold text-white"> MENU PRINCIPAL</h1> 
               </div>
               <div className={`grid gap-8 ${auth?.cargo === 'Técnico' ? 'grid-cols-1 place-items-center' : 'grid-cols-1 sm:grid-cols-3'}`}>
                    {
                        // Los usuarios con roles distintos a Técnicos pueden ver todos los botones
                        auth?.cargo !== 'Técnico' && (
                            <>
                                <Link
                                    to="/dashboard/historial-usuarios"
                                    className="bg-black border-4 border-red-700 p-9 rounded-lg text-center hover:bg-gray-800 transition max-w-xs mx-auto ">
                                    <img src={users} alt="user" className="mx-auto w-40 h-30" />
                                    <p className="text-white font-semibold">Gestionar Usuarios</p>
                                </Link>

                                <Link 
                                    to="/dashboard/historial-asistencia" 
                                    className="bg-black border-4 border-red-700 p-9 rounded-lg text-center hover:bg-gray-800 transition max-w-xs mx-auto">
                                    <img src={assistant} alt="assitant" className='mx-auto w-40 h-30' />
                                    <p className="text-white font-semibold">Control de Asistencia</p>
                                </Link>
                                
                                <Link 
                                    to="/dashboard/historial-clientes" 
                                    className="bg-black border-4 border-red-700 p-9 rounded-lg text-center hover:bg-gray-800 transition max-w-xs mx-auto">
                                    <img src={clients} alt="clients" className='mx-auto w-40 h-30' />
                                    <p className="text-white font-semibold">Historial de Clientes</p>
                                </Link>
                            
                                <Link 
                                    to="/dashboard/historial-pagos" 
                                    className="bg-black border-4 border-red-700 p-9 rounded-lg text-center hover:bg-gray-800 transition max-w-xs mx-auto">
                                    <img src={pay} alt="pay" className='mx-auto w-40 h-30' />
                                    <p className="text-white font-semibold">Control de Pagos</p>
                                </Link>
                            </>
                        )
                    }
                    
                    <Link
                        to="/dashboard/historial-mantenimiento"
                        className="bg-black border-4 border-red-700 p-9 rounded-lg text-center hover:bg-gray-800 transition max-w-xs mx-auto">
                        <img src={tools} alt="tools" className='mx-auto w-40 h-30' />
                        <p className="text-white font-semibold">Registro de mantenimiento vehicular</p>
                    </Link>
                </div>

            </main>

            <footer className="bg-black py-4">
                <p className="text-center text-white text-sm">
                2024 Full Prestige. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
};

export default Dashboard;
