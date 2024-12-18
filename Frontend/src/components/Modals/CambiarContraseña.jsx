import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { HistoryContext } from "../../context/HistoryContext";

const CambiarContraseña = ({ onClose, userId }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePassword } = useContext(HistoryContext);

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const result = await changePassword(userId, currentPassword, newPassword, confirmPassword);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Error al cambiar la contraseña. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-black">Cambiar Contraseña 🔏</h2>
        <form onSubmit={handleSubmit}>
          {/* Contraseña Actual */}
          <div className="relative mb-4">
            <label className="block text-black mb-2" htmlFor="currentPassword">
              Contraseña Actual
            </label>
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Escribe tu contraseña actual"
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showCurrentPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Nueva Contraseña */}
          <div className="relative mb-4">
            <label className="block text-black mb-2" htmlFor="newPassword">
              Nueva Contraseña
            </label>
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Escribe tu nueva contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Confirmar Contraseña */}
          <div className="relative mb-4">
            <label className="block text-black mb-2" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirma tu contraseña"
              className="w-full px-3 py-2 border border-gray-300 rounded text-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-9 text-gray-500"
            >
              {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

          {/* Botones */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
              onClick={onClose}
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CambiarContraseña;
