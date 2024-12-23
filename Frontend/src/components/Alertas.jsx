import React from "react";

const Mensaje = ({ mensaje, tipo, errores = {} }) => {
    return (
        <div
            className={`p-4 border-l-4 shadow-md rounded-xl flex flex-col gap-2 mt-2 transition-all 
            ${tipo ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
        >
            {/* Encabezado con ícono y mensaje */}
            <div className="flex items-center">
                <svg
                    className={`w-6 h-6 ${tipo ? 'text-green-500' : 'text-red-500'} flex-shrink-0`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    {tipo ? (
                        // Icono de éxito
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    ) : (
                        // Icono de error
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9h2v2h-2V9zm0 4h2v2h-2v-2z"
                            clipRule="evenodd"
                        />
                    )}
                </svg>
                <div className="ml-3">
                    <p className={`font-medium ${tipo ? 'text-green-600' : 'text-red-600'}`}>
                        {mensaje}
                    </p>
                </div>
            </div>

            {/* Lista de errores */}
            {!tipo && Object.keys(errores).length > 0 && (
                <ul className="ml-9 list-disc space-y-1 text-sm text-red-500">
                    {Object.entries(errores).map(([campo, error]) => (
                        <li key={campo}>
                            <span className="font-bold">{campo}:</span> {error}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Mensaje;
