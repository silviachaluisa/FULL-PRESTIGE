import React, { useState } from "react";

const CambiarContraseña= () => {
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const toggleModal = () => setIsOpen(!isOpen);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            alert("Contraseña actualizada correctamente.");
            toggleModal();
        } else {
            alert("Las contraseñas no coinciden.");
        }
    };

    return (
        <>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                onClick={toggleModal}
            >
                Cambiar Contraseña
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            Cambiar Contraseña
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Nueva Contraseña
                                </label>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                                    onClick={toggleModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CambiarContraseña;
