import logo from '../assets/imagenes/logo.jpg';
import user from '../assets/imagenes/user.jpg';
import { useNavigate } from 'react-router-dom';
import { useState, useContext} from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthProvider';
import Mensaje from '../components/Alertas';


export const Login = () => {
  const navigate=useNavigate()
  // Consumir el contexto
  const {auth, setAuth} = useContext(AuthContext)
  const [mensaje, setMensaje]=useState({})



  const [loginForm, setloginForm] = useState({
    correo: '',
    contrasena: '',
  });


  const handleLogin = async(e) => { 
    e.preventDefault()
    try {
        const URLogin = `${import.meta.env.VITE_BACKEND_URL}/login `
        const respuesta= await axios.post(URLogin,loginForm)
        // Obtener un token y guardarlo en el localStorage
        localStorage.setItem('token',respuesta.data.token)
        console.log(respuesta.data)
        setAuth(respuesta.data.empleado)
        navigate('/dashboard')
    } catch (error) {
        console.log(error)
        setMensaje({respuesta:error.response.data.message,tipo:false})
        
        setloginForm({})
        setTimeout(() => {
           setMensaje({})
        }, 3000);
}
}

  // Funcion para manejar el cambio de los valores del estado
  const handleChange = (e) => {
    setloginForm({...loginForm,
        [e.target.name]:e.target.value
})
}

  return (
    <div className="bg-black flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <img src={logo} alt="Full Prestige" className="logo mb-5" style={{ width: '300px', height: 'auto' }} />
        {Object.keys(mensaje).length>0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

        <form
          onSubmit={handleLogin}
          className="bg-black border-4 border-red-600 p-16 rounded-lg shadow-lg w-full max-w-md "
        >
          <div className="flex justify-center mb-5">
            <img
              src={user}
              alt="user"
              className="user rounded-full w-28 h-29 border border-red-600"
              style={{ borderWidth: '2px' }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="correo" className="block text-sm font-semibold mb-2 text-white">Correo</label>
            <input
              type="email"
              name='correo'
              id="correo"
              value={loginForm.correo || ""}
              onChange={handleChange}
              required
              placeholder='Ingresa tu correo'
              className="border-2 border-red-600 bg-gray-200 rounded-lg py-2 px-4 w-full focus:outline-none focus:border-red-700"
              style={{ minWidth: '300px' }}
            />
          </div>


          <div className="mb-4">
            <label htmlFor="contrasena" className="block text-sm font-semibold mb-2 text-white">Contraseña</label>
            <input
              type="password"
              name='contrasena'
              id="contrasena"
              value={loginForm.contrasena || ""}
              onChange={handleChange}
              required
              placeholder='Ingresa tu contraseña'
              className="border-2 border-red-600 bg-gray-200 rounded-lg py-2 px-4 w-full focus:outline-none focus:border-red-600"
              style={{ minWidth: '300px' }}
            />
          </div>


          

          <div className="flex justify-center">
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
