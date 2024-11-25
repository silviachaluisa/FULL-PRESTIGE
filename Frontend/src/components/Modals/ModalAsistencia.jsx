import { useState } from "react";
import PropTypes from "prop-types";

export const ModalAsistencia = ({ isOpen, onClose, onSubmit, title }) => {
  const [fecha, setFecha] = useState("");
  const [horaIngreso, setHoraIngreso] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

  const handleSubmit = () => {
    // Validar que todos los campos estén completos
    if (!fecha || !horaIngreso || !horaSalida) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Enviar los datos
    onSubmit({ fecha, horaIngreso, horaSalida });

    // Mostrar mensaje de éxito
    setSuccessMessage("Asistencia registrada/actualizada con éxito.");
    
    // Limpiar el formulario
    setFecha("");
    setHoraIngreso("");
    setHoraSalida("");

    // Cerrar el modal automáticamente después de un breve tiempo
    setTimeout(() => {
      setSuccessMessage("");
      onClose();
    }, 2000); // Cierra el modal después de 2 segundos
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {/* Campo de Fecha */}
        <label className="block text-gray-700 font-semibold mb-2">Fecha:</label>
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
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="text-green-600 font-semibold">{successMessage}</div>
          )}

          <div className="flex justify-end gap-4 w-full">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800"
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
    </div>
  );
};

ModalAsistencia.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
