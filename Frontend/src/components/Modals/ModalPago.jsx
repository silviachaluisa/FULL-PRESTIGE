import { useState } from "react";
import ModalPago from "./ModalPago"; // Adjust the path if necessary

export const Pago = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState("");

  const handleNewClick = (tipo) => {
    setTipoModal(tipo);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Botones */}
      <div className="flex justify-center items-center bg-gray-300 p-4 rounded-lg mb-6">
        <button
          onClick={() => handleNewClick("registrar")}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          Registrar Pagos
        </button>
        <button
          onClick={() => handleNewClick("actualizar")}
          className="ml-4 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600"
        >
          Actualizar Pagos
        </button>
      </div>

      {/* Modal */}
      <ModalPago
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tipo={tipoModal}
      />
    </div>
  );
};

export default Pago;
