import { useState,useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { HistoryContext } from "../../context/HistoryContext";

export const ModalAsistencia = ({handleShow, usuario }) => {
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
  const [horaIngreso, setHoraIngreso] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [justificacion, setJustificacion] = useState(""); // Variable para la justificacion
  
  const {
    upDateAssistance,
    fetchAsistencias,
    registerAssistance,
    tipoModal,
    fetchUsuarios,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage
  }=useContext(HistoryContext);

  useEffect(() => {
    const obtenerAsistencia = async () => {
      console.log("Usuario =",usuario);
      const response = await fetchAsistencias(usuario.cedula);
      console.log("Respuesta =",response);
      if (response) {
        setFecha(response[0].fecha.split("T")[0]);
        setHoraIngreso(response[0].hora_ingreso);
        setHoraSalida(response[0].hora_salida);
      }
    };

    console.log("Cargando info del modal")
    if (usuario && tipoModal === "actualizar") {
      obtenerAsistencia();
    } else {
      // Cargar el campo fecha con los datos actuales
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setFecha(formattedDate);
    }
  }, [usuario]);

  const validarAsistencia = () => {
    if (tipoModal === "actualizar") {
      if (!justificacion) {
        return "Debes proporcionar una justifiacion para actualizar la informacion";
      }
      return null;
    }
    const now = new Date();
    // Formatear manualmente la fecha local
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
    const day = String(now.getDate()).padStart(2, '0'); // Día en formato 2 dígitos
    const fechaActual = `${year}-${month}-${day}`; // Fecha en formato YYYY-MM-DD
    const horaActual = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") // Hora en formato HH:MM
    // Validar que la fecha no sea menor a la actual
    if (fecha < fechaActual) {
      return "La fecha no puede ser menor a la fecha actual.";
    }
    // Validar la hora de ingreso si la fecha es hoy
    if (fecha !== fechaActual) {
      return "La fecha no puede ser distinta a la fecha actual.";
    }
    if (!horaIngreso && !horaSalida) {
      return null; // Si no hay hora de ingreso ni salida, no hay errores
    }
    if (horaIngreso && horaIngreso < horaActual) {
      return "La hora de ingreso no puede ser menor a la hora actual.";
    }
    // Validar que la hora de salida sea mayor a la hora de ingreso
    if (horaSalida && horaIngreso && horaSalida <= horaIngreso) {
      return "La hora de salida debe ser mayor a la hora de ingreso.";
    }
    return null; // Si todo es válido, no hay errores
  };

  const handleSubmit = () => {
    const error = validarAsistencia();
    console.log(usuario, { fecha, horaIngreso, horaSalida,justificacion });
    
    if (error) {
      setErrorMessage(error);
      return;
    }

    // Limpiar los mensajes de error y éxito
    setErrorMessage("");
    setSuccessMessage("");

    if (tipoModal === "actualizar") {
      // Determinar el estado de la asistencia
      const estado = !horaIngreso && !horaSalida ? "Ausente" : "Presente";
      upDateAssistance(usuario?.asistencia._id, {fecha,hora_ingreso:horaIngreso ,hora_salida:horaSalida, estado, justificacion});
    } else {
      // Enviar los datos
      registerAssistance(usuario.cedula,{fecha,hora_ingreso:horaIngreso ,hora_salida:horaSalida});
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {(tipoModal === "actualizar")? "Actualizar Asistencia" : "Registrar Asistencia"}
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

        {/* Campo Justificación solo para Actualizar */}
        {tipoModal === "actualizar" && (
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2">Justificación:</label>
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
  handleShow: PropTypes.func.isRequired, // Se asegura que la función handleShow esté pasada como prop
  usuario: PropTypes.object, // Se asegura que el objeto usuario esté pasado como prop
};
