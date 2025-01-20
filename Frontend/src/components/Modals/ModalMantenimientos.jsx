import { useState,useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { HistoryContext } from "../../context/HistoryContext";

export const ModalMantenimiento = ({handleShow, cliente}) => {
  // Convertir la fecha ISO 8601 a formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return 'N/A';
    }

    return `${year}-${month}-${day}`;
  };
  const [fecha, setFecha] = useState("");
  const [detalle, setDetalle] = useState("");
  const [justificacion, setJustificacion] = useState(""); // Variable para la justificacion
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const {
    upDateMaintance,
    registerMaintance,
    tipoModal,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage
  }=useContext(HistoryContext);

  useEffect(() => {
    const obtenerMantenimientos = async () => {
      if (cliente) {
        setFecha(cliente?.cliente.fecha.split("T")[0]);
        setDetalle(cliente?.cliente.hora_ingreso);
        
      }
    };

    if (cliente && tipoModal === "actualizar") {
      obtenerMantenimientos();
    } else {
      // Cargar el campo fecha con los datos actuales
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setFecha(formattedDate);
    }
  }, [cliente]);

  const validarMantenimiento = () => {
    if (tipoModal === "actualizar") {
      if (!justificacion) {
        return "Debes proporcionar una justifiación para actualizar la informacion 😉";
      }
      return null;
    }
    const now = new Date();
    // Formatear manualmente la fecha local
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
    const day = String(now.getDate()).padStart(2, '0'); // Día en formato 2 dígitos
    const fechaActual = `${year}-${month}-${day}`; // Fecha en formato YYYY-MM-DD
    // Validar que la fecha no sea menor a la actual
    if (fecha < fechaActual) {
      return "La fecha no puede ser menor a la fecha actual.";
    }
    // Validar la hora de ingreso si la fecha es hoy
    if (fecha !== fechaActual) {
      return "La fecha no puede ser distinta a la fecha actual.";
    }
    return null; // Si todo es válido, no hay errores
  };

  const handleSubmit = () => {
    const error = validarMantenimiento();
    
    if (error) {
      setErrorMessage(error);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);

      return;
    }

    // Limpiar los mensajes de error y éxito
    setErrorMessage("");
    setSuccessMessage("");

    if (tipoModal === "actualizar") {
      // Determinar el estado de la asistencia
      const estado = !horaIngreso && !horaSalida ? "Ausente" : "Presente";
      upDateMaintance(cliente?.cliente._id, {fecha,detalle,estado, justificacion});
    } else {
      // Enviar los datos
      registerMaintance(cliente.cedula,{fecha,detalle});
    }
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false); //Cierra el modal de confirmación
    handleSubmit(); //Ejecuta la logica de guardar
  }

  const handleSave = () => {
    //Muestra el modal de confirmación
    setShowConfirmModal(true);
  };  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {(tipoModal === "actualizar")? "Solicitar Actualización de Mantenimiento" : "Registrar Mantenimento"}
        </h2>

        {/* Mensaje de error */}
        {errorMessage && (
          <div className="text-red-600 font-semibold mb-4">{errorMessage}</div>
        )}

        {/* Campo de Fecha */}
        <label className="block text-gray-700 font-semibold mb-2">Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
          required
        />

        {/* Campos de Mantenimiento*/}
        <div className="flex gap-4">
          {/* Detalle de mantenimiento */}
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">
              Detalle de mantenimiento: 🪛⚙️
            </label>
            <input
              type="text"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

         
        </div>

        {/* Campo Justificación solo para Actualizar */}
        {tipoModal === "actualizar" && (
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2">Motivo de actualización:</label>
            <textarea
              value={justificacion}
              onChange={(e) => setJustificacion(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Escribe una justificación para la actualización."
              required
            />
          </div>
        )}

        {/* Botones */}
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* Mensaje de éxito */}
          {successMessage && (
            <div className="text-green-600 font-semibold">{successMessage}</div>
          )}

          <div className="flex justify-end gap-4 w-full">
            <button
              onClick={handleShow}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-800"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800"
            >
              Guardar
            </button>
          </div>
        </div>
        {/* Modal de confirmación */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Confirmar Acción</h2>
              <p>¿Estás segur@ que deseas guardar esta información?</p>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)} // Cerrar el sub-modal
                  className="px-4 py-2 bg-gray-300 text-black font-semibold rounded-lg hover:bg-gray-600"
                >
                  No
                </button>
                <button
                  onClick={handleConfirmSave} // Confirmar y ejecutar guardar
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800"
                >
                  Sí
                </button>
              </div>
            </div>
          </div>
        )}     
      </div>
    </div>
  );
};

ModalMantenimiento.propTypes = {
  handleShow: PropTypes.func.isRequired, // Se asegura que la función handleShow esté pasada como prop
  usuario: PropTypes.object, // Se asegura que el objeto usuario esté pasado como prop
};