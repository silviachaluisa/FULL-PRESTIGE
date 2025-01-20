import { useContext } from 'react'
import { MdDeleteForever } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import AuthContext from '../../context/AuthProvider'

const TablaSesiones = ({ sesiones }) => {
    const { closeSession } = useContext(AuthContext);
    const formatDate = (isoDate) => {
        if (!isoDate) return 'N/A';
        const date = new Date(isoDate);
        return isNaN(date) ? 'Fecha inválida' : date.toISOString().split('T')[0];
    };

    const formatHour = (isoDate) => {
        if (!isoDate) return 'N/A';
        const date = new Date(isoDate);
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    };

    const handleCloseOne = async (sessionID, token) => {
        const confirm = window.confirm(`¿Está seguro de cerrar ${localStorage.getItem('token') === token ? 'su' : 'esa'} sesión?`);
        if (!confirm) return;
        await closeSession(sessionID, token);
    };

    return (
        <div className="overflow-x-auto">
            {
                Array.isArray(sesiones) && sesiones.length === 0 ? (
                    <div className="text-center text-red-500 font-bold">No existen sesiones activas.</div>
                ) : (
                    <table className="w-full text-center border-collapse border border-black" role="table">
                        <thead className="bg-black text-white font-mono">
                            <tr>
                                <th className="border border-white px-4 py-2">ID</th>
                                <th className="border border-white px-4 py-2">Dispositivo en que que ingreso</th>
                                <th className="border border-white px-4 py-2">Fecha de creación de la sesión</th>
                                <th className="border border-white px-4 py-2">Hora de creación de la sesión</th>
                                <th className="border border-white px-4 py-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(sesiones) && sesiones.map((sesion, index) => (
                                <tr
                                    key={`${sesion._id}_${index}`}
                                    className={`cursor-pointer ${localStorage.getItem('token') === sesion.token ? 'bg-gray-300' : ''}`}
                                >
                                    <td className="border border-black px-4 py-2">{sesion._id}</td>
                                    <td className="border border-black px-4 py-2">{sesion.dispositivo}</td>
                                    <td className="border border-black px-4 py-2">{formatDate(sesion.fecha)}</td>
                                    <td className="border border-black px-4 py-2">{formatHour(sesion.fecha)}</td>
                                    <td className="border border-black px-4 py-2">
                                    <div className="flex justify-around">
                                        <MdDeleteForever
                                            className="text-red-500 cursor-pointer text-2xl"
                                            onClick={() => handleCloseOne(sesion._id, sesion.token)}
                                            data-tooltip-id='close'
                                            data-tooltip-content={`Cerrar sesión en ${sesion.dispositivo.trim()}`}
                                        /> {/* Icono de borrar sesión */}

                                    </div>
                                        <ReactTooltip id='close' />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    )
}

export default TablaSesiones
