import React, { useState } from 'react';
import logo from '../../assets/imagenes/logo.jpg';
import { useNavigate } from 'react-router-dom';

export const RegistrarPagos = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Estado para los campos de entrada
  const [adelanto, setAdelanto] = useState(0);
  const [permisos, setPermisos] = useState(0);
  const [faltas, setFaltas] = useState(0);
  const [multas, setMultas] = useState(0);
  const [atrasos, setAtrasos] = useState(0);
  
  // Calcular subtotal
  const subtotal = parseFloat(adelanto) + parseFloat(permisos) + parseFloat(faltas) + parseFloat(multas) + parseFloat(atrasos);

  const handleSave = () => {
    const confirmSave = window.confirm("¿Deseas guardar la información?");
    if (confirmSave) {

      try {
        console.log("Datos guardados");
        setShowSuccessMessage(true);
  
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate('/historial-pagos');
        }, 3000);
        
      } catch (error) {
        setShowErrorMessage(true);
        
      }
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas abandonar la página?");
    if (confirmLogout) {
      navigate('/historial-pagos');
    }
  };

  // Validación para no permitir valores negativos y para convertir valores a decimales
  const handleInputChange = (setter) => (e) => {
    const value = parseFloat(e.target.value);
    setter(value < 0 ? 0 : value.toFixed(2)); // Evita negativos y mantiene decimales
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
        REGISTRAR PAGOS
      </h2>
      <div className='max-w-5xl px-8'>
      {showSuccessMessage && (
            <div className="mt-4 p-3 bg-green-600 text-white font-semibold rounded-lg text-center">
              ¡Información guardada con éxito!
            </div>
          )}

          {showErrorMessage &&(
          <div className='mb-4 p-3 bg-red-600 text-white font-semibold rounded-lg text-center' >
            Error al guardar la información, intentalo de nuevo
          </div>

          )}

      </div>

      <div className="w-full max-w-3xl px-12 ">
        <div className='font-bold text-xl'>
          <h3>Por favor ingresa los valores </h3>
        </div><br />
        <div>
        <form className="grid grid-cols-3 gap-6 border-2 border-red-600 p-6 rounded-lg bg-black mb-7  ">
          
          <div className="mb-3">
            <label className="block font-semibold mb-2">Fecha</label>
            <input
              type="date"
              required
              className="w-m px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-2">Adelanto</label>
            <input
              type="number"
              value={adelanto}
              onChange={handleInputChange(setAdelanto)}
              className="w-1/2 px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>

          <div className="mb-3">
            <label className="block font-semibold mb-2">Permisos</label>
            <input
              type="number"
              value={permisos}
              onChange={handleInputChange(setPermisos)}
              className="w-1/2 px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Faltas</label>
            <input
              type="number"
              value={faltas}
              onChange={handleInputChange(setFaltas)}
              className="w-1/2 px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Multas</label>
            <input
              type="number"
              value={multas}
              onChange={handleInputChange(setMultas)}
              className="w-1/2 px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Atrasos</label>
            <input
              type="number"
              value={atrasos}
              onChange={handleInputChange(setAtrasos)}
              className="w-1/2 px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            />
          </div>
          <div className='mb-4'>
            <label className='block font-semibold mb-2' >Estado</label>
            <select
                required
                className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            >
                <option value="">Selecciona una opción</option>
                <option value="activo">Cancelado</option>
                <option value="inactivo">Pendiente</option>
            </select>

          </div>

          <div className="mb-4 col-span-2">
            <label className="block font-semibold mb-2">Observaciones</label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 bg-white text-black border border-red-600 rounded focus:outline-none"
            ></textarea>
          </div>
        </form>

        </div>
        

        {/* Muestra del subtotal */}
        <div className="text-right text-lg font-bold text-white">
          Subtotal: ${subtotal.toFixed(2)}
        </div>
          

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800"
          >
            GUARDAR
          </button>
        </div>

      </div>

      <footer className="mt-8 w-full text-center text-white">
        <p className="py-4 border-t border-white text-sm">Empresa Dedicada al Cuidado y Mantenimiento de tu Vehículo</p>
      </footer>
    </div>
  );
};

export default RegistrarPagos;
