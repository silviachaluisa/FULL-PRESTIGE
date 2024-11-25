import { useState,useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { HistoryContext } from "../../context/HistoryContext";

export const ModalAsistencia = ({ isOpen, onClose, onSubmit, title, usuario }) => {
  const [fecha, setFecha] = useState("");
  const [horaIngreso, setHoraIngreso] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  

  const {upDateAssistance, seleccionado, fetchAsistencias}=useContext(HistoryContext);
  
  const handleInputChange = (e) => {
    setErrorMessage("");
    setSuccessMessage("");
    
  }

  useEffect(() => {
    const obtenerAsistencia = async () => {
      console.log("Usuario =",usuario);
      const response = await fetchAsistencias(usuario.cedula);
      console.log("Respuesta =",response);
      if (response) {
        const fecha = response.fecha.split("T")[0];
        console.log(fecha);


        setFecha(response.fecha.split("T")[0].replace("-","/"));
        setHoraIngreso(response.hora_ingreso);
        setHoraSalida(response.hora_ialida);
      }
    }
    console.log("Cargando info del modal")
    if (usuario) {
      obtenerAsistencia();
    }
  }, []);


  const validarAsistencia = () => {
    const now = new Date();
    const fechaActual = now.toISOString().split("T")[0]; // Fecha actual en formato 'YYYY-MM-DD'
    const horaActual = now.toTimeString().slice(0, 5); // Hora actual en formato 'HH:MM:SS'

    // Validar que la fecha no sea menor a la actual
    if (fecha < fechaActual) {
      return "La fecha no puede ser menor a la fecha actual.";
    }

    // Validar la hora de ingreso si la fecha es hoy
    if (fecha === fechaActual && horaIngreso && horaIngreso < horaActual) {
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
    console.log(usuario, { fecha, horaIngreso, horaSalida });
    
    if (error) {
      setErrorMessage(error);
      return;
    }
    return
    upDateAssistance(usuario.cedula,{fecha,hora_ingreso:horaIngreso ,hora_salida:horaSalida})
    // Determinar el estado de la asistencia
    const estado = !horaIngreso && !horaSalida ? "Ausente" : "Presente";

    // Enviar los datos con el estado calculado
    onSubmit({ usuario, fecha, horaIngreso, horaSalida, estado });

    // Mostrar mensaje de éxito
    setErrorMessage("");
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
  usuario: PropTypes.object, // Se asegura que el objeto usuario esté pasado como prop
};
