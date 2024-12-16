import logo from '../../assets/imagenes/logo.jpg';
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Asegúrate de tener Link y useNavigate importados
import Mensaje from '../../components/Alertas.jsx';

const RecuperarContraseña = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRecuperar = async (e) => {
    e.preventDefault();
  
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/recover-password`;
      const respuesta = await axios.post(url, { correo: email }); // Enviar con clave "correo"
      setMensaje({ respuesta: respuesta.data.message, tipo: true });
  
      setTimeout(() => {
        setMensaje(null);
        navigate('/login');
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Hubo un error en el servidor. Por favor, intenta nuevamente.';
      setMensaje({ respuesta: errorMessage, tipo: false });
  
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    }
  };
  

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(to right, #2c3e50, #bdc3c7)',
      }}
    >
      <header className="w-full bg-White shadow p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Full Prestige" className="h-14" />
          <p className="ml-4 text-white italic font-semibold text-sm">
            Que tu auto refleje lo mejor de ti
          </p>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-md rounded px-10 py-8 max-w-md w-full">
          <h2 className="text-2xl text-center font-semibold text-black mb-6">
            Recuperar Contraseña
          </h2>

          {mensaje && (
            <div className="mb-4 w-full">
              <Mensaje
                mensaje={mensaje.respuesta}
                tipo={mensaje.tipo}
                className="w-full"
              />
            </div>
          )}

          <form onSubmit={handleRecuperar}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Ingresa tu correo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Enviar
              </button>
            </div>
          </form>

          <div className="mt-3 text-sm flex justify-between items-center">
            <p>
              Recuerdo mi contraseña{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-800">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="w-full py-2 text-center text-white bg-black border-t border-white">
        2024 Full Prestige. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default RecuperarContraseña;
