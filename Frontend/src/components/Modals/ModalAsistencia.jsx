import { useState } from "react";
import PropTypes from 'prop-types';

export const ModalAsistencia = ({ isOpen, onClose, onSubmit, title }) => {
  const [fecha, setFecha] = useState("");
  const [horaIngreso, setHoraIngreso] = useState("");
  const [horaSalida, setHoraSalida] = useState("");

  const handleSubmit = () => {
    // Enviar los datos
    onSubmit({ fecha, horaIngreso, horaSalida });
    // Cerrar el modal después de enviar
  };
  
    if (!isOpen) return null;
    
  
  ModalAsistencia.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {/* Campo de Fecha */}
        <label className="block text-gray-700 font-semibold mb-2">
          Fecha:
        </label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />

        {/* Campos de Hora */}
        <div className="flex gap-4">
          {/* Hora de Ingreso */}
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">
              Hora de Ingreso:
            </label>
            <input
              type="time"
              value={horaIngreso}
              onChange={(e) => setHoraIngreso(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Hora de Salida */}
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">
              Hora de Salida:
            </label>
            <input
              type="time"
              value={horaSalida}
              onChange={(e) => setHoraSalida(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
