import React from 'react';
import logo from '../assets/imagenes/logo.jpg';
import user from '../assets/imagenes/user.jpg';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';


export const Login = () => {
  const [username, setUsername]= useState('');
  const [password, setPassword]= useState('');
  const [rememberMe, setRememberMe]= useState(false);


  //Al montar el componente, verificar si hay datos guardados
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const storedRememberMe = localStorage.getItem('rememberMe');

    if(storedUsername && storedPassword && storedRememberMe ){
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(storedRememberMe);
    }
  },[]);

  const navigate=useNavigate();

  const handleLogin=(event)  =>{
    event.preventDefault();
    console.log("Iniciar sesión");

    //Validacion simple (Para reemplazar con la API real)
    if(username=='admin' && password=='123'){
      navigate('/administrador');
    }else{
      alert('Credenciales incorrectas');
    }

    // Logica de autenticación
    console.log("Iniciar sesión con", username, password);

    //Si la opción de recordar esta activida se guarda en el localstorage
    if(rememberMe){
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      localStorage.setItem('rememberMe', rememberMe);
    } else {
      //Si no se eliminan los datos
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('rememberMe');
    }
  };




  
 


 
  return (
    <div className="bg-black flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <img src={logo} alt="Full Prestige" className="logo mb-5" style={{ width: '300px', height: 'auto' }} />

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
            <label htmlFor="username" className="block text-sm font-semibold mb-2 text-white">Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border-2 border-red-600 bg-gray-200 rounded-lg py-2 px-4 w-full focus:outline-none focus:border-red-700"
              style={{ minWidth: '300px' }}
            />
          </div>


          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-white">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 border-red-600 bg-gray-200 rounded-lg py-2 px-4 w-full focus:outline-none focus:border-red-600"
              style={{ minWidth: '300px' }}
            />
          </div>


          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2 border-red-600 focus:ring-red-500"
            />
            <label htmlFor="rememberMe" className="text-sm text-white">Recordar Contraseña</label>
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
