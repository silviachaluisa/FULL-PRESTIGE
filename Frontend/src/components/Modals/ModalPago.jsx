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
  const [showConfirmModal, setShowConfirmModal] = useState(false); //En este estado Controla si el sub-modal de confirmación se muestra o no

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
    if (usuario && tipoModal === "actualizar" || "registrar") {
      obtenerPago();
    }else{
      // Cargar el campo fecha con los datos actuales
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setFecha(formattedDate);
      setAdelanto("0");
      setPermisos("0");
      setMultas("0");
      setAtrasos("0");
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

  const handleNumericInput = (value) => {
    const regex = /^[0-9]*\.?[0-9]*$/;
    return regex.test(value) ? value : "";
  };

  const handleSubmit = () => {
    const error = validarPago();
    console.log("Datos del usuario: ", usuario);
    console.log("Datos enviados", {fecha, adelanto, permisos, multas, atrasos,justificacion, subtotal})
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

    const payload = { fecha, adelanto, permisos, multas, atrasos, subtotal: parseFloat(subtotal), justificacion: justificacion };
    if (tipoModal === "actualizar") {
      // Determinar el estado de la asistencia
      upDatePayment(usuario?.pago._id, payload);
    } else {
      const paymentInfo = { ...payload }
      delete paymentInfo.justificacion;
      registerPayment(usuario.cedula, { ...paymentInfo});
    }
  };
  //Se llama al confirmar en el sub-modal, ejecuta la función ""handleSubmit" y cierra el modal de confirmación
  const handleConfirmSave = () => {
    setShowConfirmModal(false); //Cierra el modal de confirmación
    handleSubmit(); //Ejecuta la lógica de guardar
  };
  // Muestra el sub-modal al presionar "Guardar"
  const handleSave = () => {
    //Mostrar el modal de confirmación
    setShowConfirmModal(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {tipoModal === "actualizar" ? "Actualizar Pago" : "Registrar Pago"}
        </h2>

        {/* Mensaje de error y exito */}
        {errorMessage && (
          <div className="text-red-600 font-semibold mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-600 font-semibold mb-4">{successMessage}</div>
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

ModalPago.propTypes = {
  handleShow: PropTypes.func.isRequired,
  usuario: PropTypes.object,
};
