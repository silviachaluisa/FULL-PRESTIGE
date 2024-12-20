import logoCar from '../../assets/imagenes/logocar.png';
import Mensaje from '../../components/Alertas';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Restablecer = () => {
    const { token } = useParams();
    const [mensaje, setMensaje] = useState({});
    const [tokenValido, setTokenValido] = useState({});

    const navigate = useNavigate();

    const [form, setForm] = useState({
        password: '',
        confirmar: ''
    });

    // Verificación del token al cargar el componente
    const verifyToken = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/verify-token/${token}`;
            const respuesta = await axios.get(url);
            setTokenValido(true);
            setMensaje({ respuesta: respuesta.data.message, tipo: true });

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Token inválido o expirado.';
            setMensaje({ respuesta: errorMessage, tipo: false });
        }
        finally {
            setTimeout(() => {
                setMensaje({});
            }, 3000);
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmar) {
            setMensaje({ respuesta: 'Las contraseñas no coinciden', tipo: false });
            return;
        }

        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/change-password/${token}`;
            const respuesta = await axios.put(url, { contrasena: form.password, confirmarContrasena: form.confirmar });
            setMensaje({ respuesta: respuesta.data.message, tipo: true });

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || 'Error al restablecer la contraseña.';
            setMensaje({ respuesta: errorMessage, tipo: false });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4">
            {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo} mensaje={mensaje.respuesta}></Mensaje>}
            {/* {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>} */}
    
            <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">
                Bienvenido
            </h1>
            <small className="text-gray-400 block my-4 text-sm">
                Por favor ingresa los siguientes datos
            </small>
            <img
                className="object-cover h-40 w-40 rounded-full border-4 border-solid border-white-600"
                src={logoCar}
                alt="Logotipo"
            />

            {tokenValido ? (
                <form className="w-full max-w-md mt-5" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-300 mb-2 ">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="Ingresa tu nueva contraseña"
                            className="block w-full rounded-md border-2 border-red-600 py-2 px-3 text-gray-700"
                            value={form.password}
                            name="password"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-300 mb-2 ">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="Repite tu contraseña"
                            className="block w-full rounded-md border-2 border-red-600 py-2 px-3 text-gray-700"
                            value={form.confirmar}
                            name="confirmar"
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-xl mt-5 hover:scale-105 transition-transform duration-300 hover:bg-gray-500 hover:text-black"
                    >
                        Restablecer Contraseña
                    </button>
                </form>
            ) : (
                <p className="text-red-500 mt-5">Token inválido o expirado.</p>
            )}
        </div>
    );
};

export default Restablecer;
