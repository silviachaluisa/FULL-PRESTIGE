import { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/AuthProvider'
import Mensaje from '../components/Alertas'

const Sesiones = () => {
    const { auth, getActiveSessions, closeSession, closeAllSessions } = useContext(AuthContext)
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({
        tipo: false,
        mensaje: ''
    })

    const handleCloseOne = async (sessionID) => {
        const response = await closeSession(sessionID)
        if (!response.contain('Error')) {
            setMessage({
                tipo: true,
                mensaje: response.message
            })
        } else {
            setMessage({
                tipo: false,
                mensaje: response.message
            })
        }

        const sesiones = getActiveSessions()
        setSessions(sesiones)

        setTimeout(() => {
            setMessage({})
        }, 5000)
    }

    const handleCloseAll = async () => {
        const response = await closeAllSessions()
        if (!response.contain('Error')) {
            setMessage({
                tipo: true,
                mensaje: response.message
            })
        } else {
            setMessage({
                tipo: false,
                mensaje: response.message
            })
        }

        const sesiones = getActiveSessions()
        setSessions(sesiones)

        setTimeout(() => {
            setMessage({})
        }, 5000)
    }


    useEffect(() => {
        if(auth)
        {
            const sesiones = getActiveSessions();
            setSessions(sesiones);
        }
    }, [])

    return (
        <div
            className="bg-black min-h-screen flex flex-col justify-between"
        >
            <div
                className="flex flex-col items-center justify-center"
            >
                {
                    message.mensaje && (
                        <Mensaje mensaje={message.mensaje} tipo={message.tipo}/>
                    )
                }
                <h1
                    className="text-4xl text-white"
                >
                    Sesiones activas
                </h1>
                <div
                    className="bg-white w-1/2 p-4 rounded-lg mt-4"
                >
                    {
                        sessions.map((sesion) => (
                            <div
                                key={sesion._id}
                                className="flex flex-col justify-between items-center border-b-2 border-gray-300 py-2"
                            >
                                <p
                                    className="text-lg"
                                >
                                    Sesion iniciada en: {sesion.dispositivo}
                                </p>
                                <p
                                    className="text-lg"
                                >
                                    Sesion creada en: {sesion.fecha}
                                </p>
                                <button
                                    onClick={() => handleCloseOne(sesion._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Cerrar
                                </button>
                            </div>
                        ))
                    }
                </div>
                <button
                    onClick={closeAllSessions}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
                >
                    Cerrar todas las sesiones
                </button>
            </div>
        </div>
    )
}

export default Sesiones
