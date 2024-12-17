import React, { useState } from "react";

const CambiarContraseña = ({ onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Estado para mensajes de error

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      alert("Contraseña actualizada correctamente.");
      onClose(); // Cierra el modal
    } else {
      setError("Las contraseñas no coinciden.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-black">Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-black mb-2">Nueva Contraseña</label>
          <input
            type="password"
            placeholder="Escribe tu nueva contraseña"
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="block text-black mb-2">Confirmar Contraseña</label>
          <input
            type="password"
            placeholder="Confirma tu contraseña"
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
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
