import React, { useState } from 'react';
import logo from '../../assets/imagenes/logo.jpg';
import { useNavigate } from 'react-router-dom';

export const RegistrarClientes= () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSave = (event) => {
    event.preventDefault();
    const confirmSave = window.confirm("¿Deseas guardar la información?");
    
    if (confirmSave) {
      console.log("Datos guardados");
      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/registrar-asistencia');
      }, 3000);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas abandonar la página?");
    if (confirmLogout === true) {
      navigate('/control-asistencia');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      {/* Contenedor de la cabecera */}
      <div className="w-full flex justify-between items-center p-4">
        <img src={logo} alt="Full Prestige" style={{ width: '150px', height: 'auto' }} />
        
        <button 
          onClick={handleLogout}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          VOLVER
        </button>
      </div>

      <h2 className="text-red-600 text-3xl font-bold text-center mb-5 border-t-2 border-b-2 border-red-700 w-full py-4">
        REGISTRAR CLIENTE
      </h2>

      <div className="w-full max-w-7xl px-10">
        <form onSubmit={handleSave} className="grid grid-cols-3 gap-6 border-2 border-red-600 p-6 rounded-lg bg-black mb-7">
          
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Cédula</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Contacto</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Dirección</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">N° Orden</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Marca</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Modelo</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Placa</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Fecha de Ingreso</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Fecha de Salida</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Descripción del trabajo</label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            ></textarea>
          </div>
          
         
          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Tecnico Responsable</label>
            <select
                required
                className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            >
                <option value="">Selecciona una opción</option>
                <option value="activo">Tecnico A</option>
                <option value="inactivo">Tecnico B</option>
                <option value="inactivo">Tecnico C</option>
            </select>
            </div>

          {/* --------------------------------------------------------------------------------------- */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Estado</label>
            <select
                required
                className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            >
                <option value="">Selecciona una opción</option>
                <option value="activo">Pendiente</option>
                <option value="inactivo">Finalizado</option>
                <option value="inactivo">Entregado</option>
            </select>
            </div>
             {/* --------------------------------------------------------------------------------------- */}

          <div className="mb-4 col-span-2">
            <label className="block font-semibold mb-2">Observaciones</label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            ></textarea>
          </div>
        </form>


        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800"
          >
            GUARDAR
          </button>
        </div>

        {showSuccessMessage && (
          <div className="mt-4 p-3 bg-green-600 text-white font-semibold rounded-lg text-center">
            ¡Información guardada con éxito!
          </div>
        )}
      </div>

      <footer className="mt-8 w-full text-center text-white">
        <p className="py-4 border-t border-white text-sm">Empresa Dedicada al Cuidado y Mantenimiento de tu Vehículo</p>
      </footer>
    </div>
  );
};

export default RegistrarClientes;
