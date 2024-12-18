import LogCar from '../../assets/imagenes/logocar.png';

import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Mensaje from '../../components/Alertas';
import axios from 'axios';

export const Confirmar = () => {
    const { token } = useParams();
    const [mensaje, setMensaje] = useState({});
    const [errores, setErrores] = useState({});

    const verifyToken = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/verify-token/${token}`;
            const respuesta = await axios.get(url);
            setMensaje({ respuesta: respuesta.data.message, tipo: true });
        } catch (error) {
            setMensaje({
                respuesta: error.response?.data?.message || "Ocurrió un error inesperado",
                tipo: false
            });
            setErrores(error.response?.data || {});
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
            style={{ background: 'linear-gradient(to right, #2c3e50, #bdc3c7)' }}
        >
            <div className="mb-4">
                {mensaje && (
                    <Mensaje
                        mensaje={mensaje.respuesta}
                        tipo={mensaje.tipo}
                        errores={!mensaje.tipo ? errores : {}}
                    />
                )}
            </div>

            <img
                className="object-cover h-80 w-80 rounded-full border-4 border-solid border-slate-600"
                src={LogCar}
                alt="image description"
            />

            <div className="flex flex-col items-center justify-center bg-black  p-10 rounded-xl shadow-lg mt-4 border-4 border-red-800 ">
                <p className="text-3xl md:text-4xl lg:text-5xl text-red-700 mt-4">Muchas Gracias</p>
                <p className="md:text-lg lg:text-xl text-gray-200 mt-4">Ya puedes iniciar sesión</p>
                <Link
                    to="/login"
                    className="p-3 m-5 w-full text-center bg-red-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-400 hover:text-black"
                >
                    Login
                </Link>
            </div>
        </div>
    );
};
