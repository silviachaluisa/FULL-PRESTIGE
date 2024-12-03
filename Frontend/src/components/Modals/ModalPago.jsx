import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { HistoryContext } from "../../context/HistoryContext";

export const ModalPago = ({ handleShow, usuario }) => {
  const [fecha, setFecha] = useState("");
  const [adelanto, setAdelanto] = useState("");
  const [permisos, setPermisos] = useState("");
  const [multas, setMultas] = useState("");
  const [atrasos, setAtrasos] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [justificacion, setJustificacion] = useState("");

  const {
    upDatePayment,
    registerPayment,
    tipoModal,
    errorMessage,
    setErrorMessage,
    successMessage,
    setSuccessMessage
  } = useContext(HistoryContext);

  useEffect(() => {
    const obtenerPago = async () => {
        if (usuario) {
          setFecha(usuario?.pago.fecha.split("T")[0] || "N/A");
          setAdelanto(usuario?.pago.adelanto || "0");
          setPermisos(usuario?.pago.permisos || "0");
          setMultas(usuario?.pago.multas || "0");
          setAtrasos(usuario?.pago.atrasos || "0");
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

  useEffect(() => {
    const calcularSubtotal = () => {
      const suma=
      parseFloat(adelanto || 0) +
      parseFloat(permisos || 0) +
      parseFloat(multas || 0) +
      parseFloat(atrasos || 0);
      setSubtotal(suma. toFixed(2));
    };
    calcularSubtotal();
  }, [adelanto, permisos, multas, atrasos]);

  const validarPago = () => {
    if (tipoModal === "actualizar" && !justificacion) {
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

  const handleNumericInput = (value) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    return regex.test(value) ? value : "";
  };

  const handleSubmit = () => {
    const error = validarPago();
    console.log("Datos del usuario: ", usuario);
    console.log("Datos enviados", {fecha, adelanto, permisos, multas, atrasos,justificacion})
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

    const payload = { fecha, adelanto, permisos, multas, atrasos, justificacion};
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
              value={adelanto}
              onChange={(e) => setAdelanto(handleNumericInput(e.target.value))}
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
              onChange={(e) => setPermisos(handleNumericInput(e.target.value))}
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
              onChange={(e) => setMultas(handleNumericInput(e.target.value))}
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
              onChange={(e) => setAtrasos(handleNumericInput(e.target.value))}
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
        {/* Campo Subtotal */}
        <div className="mt-4">
            <label className="block text-red-700 font-semibold mb-2">Subtotal:</label>
            <input
              type="number"
              value={subtotal}
              readOnly
              className="w-full border  rounded-lg p-2  bg-gray-400"
              
            />
          </div>
                  

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
