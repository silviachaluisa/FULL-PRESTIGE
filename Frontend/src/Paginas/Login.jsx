import logo from '../assets/imagenes/logo.jpg';
import user from '../assets/imagenes/user.jpg';
import React from 'react';

export const Login = () => {
  const handleLogin = (event) => {
    event.preventDefault();
    console.log("Iniciar sesión");
  };

  return (
    <div className="bg-black flex justify-center items-center h-screen">
      <div className="flex flex-col items-center">
        <img src={logo} alt="Full Prestige" className="logo mb-5" style={{ width: '300px', height: 'auto' }} />

        <form
          onSubmit={handleLogin}
          className="bg-black border-2 border-red-600 p-14 rounded-lg shadow-lg w-full max-w-md"
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
              required
              className="border border-red-600 bg-gray-200 rounded-lg py-2 px-4 w-full focus:outline-none focus:border-red-700"
              style={{ minWidth: '300px' }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold mb-2 text-white">Contraseña</label>
            <input
              type="password"
              id="password"
              required
              className="border border-red-600 bg-gray-200 rounded-lg py-2 px-4 w-full focus:outline-none focus:border-red-600"
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
