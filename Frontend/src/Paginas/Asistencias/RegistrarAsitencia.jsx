import React, { useState } from 'react';
import logo from '../../assets/imagenes/logo.jpg';
import { useNavigate } from 'react-router-dom';

export const RegistrarAsistencia = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
    const empleadosFiltrados = empleados.filter(empleado =>
        empleado.nombre.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setResultados(empleadosFiltrados);
};

const handleRegistrar = (empleadoId) => {
  const fechaHora = new Date().toISOString(); // Obtiene la fecha y hora actual
  registrarAsistencia(empleadoId, fechaHora);
  alert(`Asistencia registrada para el empleado con ID ${empleadoId}`);
};


  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas abandonar la página?");
    if (confirmLogout === true) {
      navigate('/historial-asistencia');
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
      <h2 className=" text-red-600 text-3xl font-bold text-center mb-5 border-t-2 border-b-2 border-red-700 w-full py-2">
        REGISTRAR ASISTENCIA
      </h2>


      <div className="w-full max-w-md p-6 bg-black text-white">
        <form onSubmit={handleSave} className="border-2 border-red-600 p-6 rounded-lg mb-7">
          <div className="mb-4">
            <label className="block font-semibold mb-2">Fecha</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Hora de Ingreso</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Hora de Salida</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Observaciones</label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800"
            >
              GUARDAR
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={handleLogout}
          className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800"
        >
          VOLVER
        </button>

        {/* Mensaje de éxito */}
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

export default RegistrarAsistencia;
