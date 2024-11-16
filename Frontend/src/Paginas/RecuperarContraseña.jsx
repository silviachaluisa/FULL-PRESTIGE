import React, { useState } from 'react';
import logo from '../assets/imagenes/logo.jpg'; // Reemplaza con la ruta del logo de Full Prestige
import { useNavigate } from 'react-router-dom';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleRecuperar = (e) => {
    e.preventDefault();

    // Validar el correo electrónico
    if (!email.trim()) {
      setMensaje('Por favor, ingresa tu correo electrónico.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensaje('Por favor, ingresa un correo válido.');
      return;
    }

    // Lógica para enviar el correo de recuperación (placeholder)
    console.log('Correo enviado a:', email);
    setMensaje('Se ha enviado un enlace de recuperación a tu correo.');
  };

  return (
    <div className="min-h-screen flex flex-col"
      style={{
        background: '#bdc3c7',
        background: '-webkit-linear-gradient(to right, #2c3e50, #bdc3c7)',
        background: 'linear-gradient(to right, #2c3e50, #bdc3c7)'
      }}
    >
      {/* Encabezado */}
      <header className="w-full bg-black shadow p-4 flex justify-between items-center">
        <div className='flex items-center'>
          <img src={logo} alt="Full Prestige" className='h-14' />
          <p className='ml-4 text-white italic font-semibold text-sm'>Que tu auto refleje lo mejor de ti</p>
        </div>
      </header>

      {/* Contenedor principal */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-md rounded px-10 py-8 max-w-md w-full">
          <h2 className="text-2xl text-center font-semibold text-black mb-6">
            Recuperar Contraseña
          </h2>

          <form onSubmit={handleRecuperar}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="Ingresa tu correo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {mensaje && <p className="text-red-500 text-xs italic mb-4">{mensaje}</p>}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Enviar
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="  inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-2 text-center text-white bg-black border-t border-white">
        2024 Full Prestige. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default RecuperarContrasena;
