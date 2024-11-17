const Mensaje = ({ mensaje, tipo, errores = {} }) => {
    return (
        <div className={`p-6 border-l-4 ${tipo ? 'border-green-500' : 'border-red-500'} rounded-r-xl 
                    ${tipo ? 'bg-green-50' : 'bg-red-50'} flex flex-col mt-2`}>
            {/* Ícono */}
            <div className="flex items-center">
                <svg
                    className={`w-5 h-5 ${tipo ? 'text-green-500' : 'text-red-500'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    ></path>
                </svg>
                <div className={`ml-3 text-sm ${tipo ? 'text-green-500' : 'text-red-500'}`}>
                    <p>{mensaje}</p>
                </div>
            </div>

            {/* Lista de errores */}
            {!tipo && Object.keys(errores).length > 0 && (
                <ul className="mt-2 ml-8 list-disc text-red-500 text-sm">
                    {Object.entries(errores).map(([campo, error]) => (
                        <li key={campo}>{`${campo}: ${error}`}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Mensaje;
