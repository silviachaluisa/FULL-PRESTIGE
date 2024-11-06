import React, { useState } from 'react';
import logo from '../../assets/imagenes/logo.jpg';
import { useNavigate } from 'react-router-dom';

export const RegistrarAsistencia = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Estado para mostrar el mensaje de éxito

  const handleSave = (event) => {
    event.preventDefault(); // Previene el envío del formulario
    const confirmSave = window.confirm("¿Deseas guardar la información?");
    
    if (confirmSave) {
      console.log("Datos guardados");
      setShowSuccessMessage(true); // Muestra el mensaje de éxito

      // Oculta el mensaje después de 3 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
        navigate('/registrar-asistencia'); // Navega a la página deseada después de guardar
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
    <div className="bg-black flex flex-col items-center text-white">
        <div className='w-full'>
        <div className="flex justify-center">
          <img src={logo} alt="Full Prestige" className="mb-5" style={{ width: '250px', height: 'auto' }} />
        </div>
          <h2 className="bg-black text-red-600 text-3xl font-bold text-center mb-5 border-t-2 border-b-2 border-red-700">
            REGISTRAR ASISTENCIA
          </h2>
        </div>
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
          onClick={handleLogout} // Función para regresar
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
