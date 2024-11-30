import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { HistoryContext } from "../../context/HistoryContext";

export const ModalPago = ({ handleShow, usuario }) => {
  //Convertir la fecha ISO 8601 a formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return 'N/A';
    }

    return `${year}-${month}-${day}`;
  };

  const [fecha, setFecha] = useState("");
  const [adelantos, setAdelantos] = useState("");
  const [permisos, setPermisos] = useState("");
  const [multas, setMultas] = useState("");
  const [atrasos, setAtrasos] = useState("");
  const [justificacion, setJustificacion] = useState("");


  const {
    upDatePayment,
    fetchPayments,
    registerPayment,
    tipoModal,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage

  } = useContext(HistoryContext);

  useEffect(() => {
    const obtenerPago = async () => {
      console.log("Usuario =", usuario);
      const response = await fetchPayments(usuario.cedula);
      console.log("Respuesta =", response);
        if (response) {
          setFecha(response[0].fecha.split("T")[0]);
          setAdelantos(response[0].adelantos);
          setPermisos(response[0].permisos);
          setMultas(response[0].multas);
          setAtrasos(response[0].atrasos);
        }
      };

    console.log("Cargando info del modal");
    if (usuario && tipoModal === "actualizar") {
      obtenerPago();
    }else{
      // Cargar el campo fecha con los datos actuales
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setFecha(formattedDate);
    }
  }, [usuario]);

  const validarPago = () => {
    if (tipoModal === "actualizar") {
      if (!justificacion) {
        return "Debes proporcionar una justificación para actualizar la información.";
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
    if (fecha < fechaActual){
      return "La fecha no puede ser menor a la fecha actual.";
    }
    // Validar la hora de ingreso si la fecha es hoy
    if (fecha !== fechaActual) {
      return "La fecha no puede ser distinta a la fecha actual.";
    }
    return null; // Si todo es válido, no hay errores
  };

  const handleSubmit = () => {
    const error = validarPago();
    console.log(usuario, {fecha, adelantos, permisos, multas, atrasos,justificacion})
    if (error) {
      setErrorMessage(error);
      return;
    }

    // Limpiar los mensajes de error y éxito
    setErrorMessage("");
    setSuccessMessage("");

    const payload = { fecha, adelantos, permisos, multas, atrasos,justificacion};
    if (tipoModal === "actualizar") {
      // Determinar el estado de la asistencia
      
      upDatePayment(usuario?.pago._id, payload);
    } else {
      registerPayment(usuario.cedula, payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {tipoModal === "actualizar" ? "Actualizar Pago" : "Registrar Pago"}
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
        />

        {/* Campo Adelantos */}
        <div className="flex gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Adelantos:</label>
            <input
              type="number"
              value={adelantos}
              onChange={(e) => setAdelantos(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Ingresa la cantidad de adelantos"
            />
          </div>
          {/* Campo Permisos */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Permisos:</label>
            <input
              type="number"
              value={permisos}
              onChange={(e) => setPermisos(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Ingresa la cantidad de permisos"
            />
          </div>

          {/* Campo Multas */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Multas:</label>
            <input
              type="number"
              value={multas}
              onChange={(e) => setMultas(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Ingresa la cantidad de multas"
            />
          </div>
          {/* Campo Atrasos */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Atrasos:</label>
            <input
              type="number"
              value={atrasos}
              onChange={(e) => setAtrasos(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Ingresa la cantidad de atrasos"
            />
          </div>
                  
        </div>
        {tipoModal === "actualizar" && (
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2">Justificación:</label>
            <textarea
              value={justificacion}
              onChange={(e) => setJustificacion(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Escribe una justificación para la actualización."
            />
          </div>
        )}

        <div className="mt-6 flex flex-col items-center gap-4">
          {successMessage && <div className="text-green-600 font-semibold">{successMessage}</div>}

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

ModalPago.propTypes = {
  handleShow: PropTypes.func.isRequired,
  usuario: PropTypes.object,
};
