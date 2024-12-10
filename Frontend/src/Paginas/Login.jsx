import logo from '../assets/imagenes/logo.jpg';
import user from '../assets/imagenes/user.jpg';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';
import Mensaje from '../components/Alertas';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import fondo2 from '../assets/imagenes/bg2.png'

export const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidad

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [loginForm, setLoginForm] = useState({
    correo: '',
    contrasena: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const URLogin = `${import.meta.env.VITE_BACKEND_URL}/login`;
      const respuesta = await axios.post(URLogin, loginForm);
      console.log(respuesta)

      // Guardar token en localStorage y establecer contexto
      localStorage.setItem('token', respuesta.data.empleado.token);
      setAuth(respuesta.data.empleado);
      //Mensaje de exito
      setMensaje({ respuesta: 'Inicio de sesión exitoso', tipo: true });
      setTimeout(() => {
        setMensaje({});
        navigate('/dashboard');
      }, 3000); 
    } catch (error) {
      //Mensaje de error
      setMensaje({ respuesta: error.response.data.message, tipo: false });

      // Limpiar el formulario después del error
      //setLoginForm({ correo: '', contrasena: '' });
      setTimeout(() => {
        setMensaje("");
      }, 3000);
    }
  };

  // Manejador de cambio de valores del formulario
  const handleChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div  className="bg-black flex flex-col items-center justify-center h-screen px-5 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${fondo2})` }}
    >
      <div className="flex flex-col items-center">
        <img src={logo} alt="Full Prestige" className="logo mb-5" style={{ width: '300px', height: 'auto' }} />
        <div className='mb-4'>
          {mensaje && (<Mensaje mensaje={mensaje.respuesta} tipo={mensaje.tipo} errores={!mensaje.tipo ? errores : {}} 
                />
                )}
        </div>
         
      
        <form
          onSubmit={handleLogin}
          className="bg-black border-4 border-red-600 p-16 rounded-lg shadow-lg w-full max-w-md"
        >
          <div className="flex justify-center mb-5">
            <img
              src={user}
              alt="user"
              className="user rounded-full w-28 h-28 border border-red-600"
              style={{ borderWidth: '2px' }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="correo" className="block text-sm font-semibold mb-2 text-white">Correo</label>
            <input
              type="email"
              name="correo"
              id="correo"
              value={loginForm.correo}
              onChange={handleChange}
              required
              placeholder="Ingresa tu correo"
              className="border-2 border-red-600 bg-gray-200 rounded-lg py-2 px-4 w-full focus:outline-none focus:border-red-700"
              style={{ minWidth: '300px' }}
            />
          </div>

          <div className="mb-4 relative">
            <label htmlFor="contrasena" className="block text-sm font-semibold mb-2 text-white">Contraseña</label>
            <input
              type={showPassword ? 'text' : 'password'} // Cambia el tipo según el estado
              name="contrasena"
              id="contrasena"
              value={loginForm.contrasena}
              onChange={handleChange}
              required
              placeholder="Ingresa tu contraseña"
              className="border-2 border-red-600 bg-gray-200 rounded-lg py-2 px-4 w-full focus:outline-none focus:border-red-600"
              style={{ minWidth: '300px' }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 mt-4"
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />} {/* Cambia el ícono */}
            </button>
          </div>
          <a href="/recuperar-contrasena" className=' no-underline hover:underline flex text-blue-50 justify-center  mb-2'>
            ¿Olvidaste tu contraseña?

          </a>
         
        

          <div className="flex justify-center ">
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800 transition duration-300"
              style={{ maxWidth: '200px' }}
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
