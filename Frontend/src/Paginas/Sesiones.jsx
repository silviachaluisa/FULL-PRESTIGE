import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthProvider';
import Mensaje from '../components/Alertas';
import TablaSesiones from '../components/Sesiones/TablaSesiones';
import bg from '../assets/imagenes/DashboardImage/Bg.png';
import logo from '../assets/imagenes/logo.jpg';
import { MdDelete } from "react-icons/md";
import { MdDevices } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Sesiones = () => {
    const navigate = useNavigate();
    const { auth, getActiveSessions, closeSession, closeAllSessions } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});

    const handleResponse = (response) => {
        if (response?.success) {
            setMessage({ tipo: true, mensaje: response.message });
        } else {
            setMessage({ tipo: false, mensaje: response?.message || 'Error desconocido' });
        }
        setTimeout(() => setMessage({}), 5000);
    };

    const fetchSessions = async () => {
        setLoading(true);
        const sesiones = await getActiveSessions();
        setSessions(sesiones || []);
        setLoading(false);
    };

    const handleCloseAll = async () => {
        const confirm = window.confirm('¿Está seguro de cerrar todas las sesiones?');
        if (!confirm) return;
        setLoading(true);
        const response = await closeAllSessions();
        handleResponse(response);
        await fetchSessions();
    };

    const encabezadoTabla = [
        'ID', "Dispositivo en que que ingreso", 'Fecha de creación de la sesión', 'Hora de creación de la sesión', 'Acciones'
    ];

    useEffect(() => {
        if (auth) fetchSessions();
    }, [auth]);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <header className="w-full bg-black shadow p-4 flex justify-between items-center">
                <div className='flex items-center'>
                    <img src={logo} alt="Full Prestige" className='h-14' />
                    <p className='ml-4 text-white italic font-semibold text-sm' >&quot;Que tu auto refleje lo mejor de ti&quot;</p> {/*&quot; es el código para comillas dobles en HTML*/}
        
                </div>
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    VOLVER
                </button>
            </header>
            <div>
                <h2
                    className="bg-black px-4 py-2  border-2 border-white text-red-600 text-center text-2xl font-semibold mb-4">
                        SESIONES ACTIVAS
                        <MdDevices className="text-red-600 mx-auto text-5xl mb-4" />
                    </h2>
            </div>
            <main
                className="flex-grow w-full p-6 bg-white shadow mt-6 rounded-lg mx-auto border border-black"
            >
                {message.mensaje && <Mensaje mensaje={message.mensaje} tipo={message.tipo} />}
                <div className="bg-white p-4 rounded-lg mt-4 w-full">
                    {Array.isArray(sessions) && sessions.length > 0 ? (
                        <TablaSesiones
                            sesiones={sessions}
                        />
                    ) : (
                        <div className='overflow-x-auto'>
                            <table className="w-full text-center border-collapse border border-black">
                                <thead className="bg-black text-white font-mono">
                                    <tr>
                                    {encabezadoTabla.map((header) => (
                                        <th key={header} className="border border-black px-4 py-2">{header}</th>
                                    ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <td colSpan={encabezadoTabla.length} className="text-center py-4 text-red-700">
                                        { loading ? 'Cargando...' : 'No existen sesiones activas.' }
                                    </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <div
                    className="flex justify-center items-center flex-col mt-4"
                >
                    <button
                        onClick={handleCloseAll}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 items-center flex space-x-2"
                    >
                        <MdDelete className=" text-2xl" />
                        <span className="text-lg text-white">Cerrar todas las sesiones</span>
                    </button>
                </div>
            </main>
            <footer className="bg-black py-4 mt-3">
                <p className="text-center text-white text-sm">
                    2024 Full Prestige. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
};

export default Sesiones;
