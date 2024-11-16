    export const TablaUsuarios = ({usuarios}) => {
        return (
            <div className="overflow-x-auto ">
                {/* Tabla de Historial */}
                <table className="w-full text-center border-collapse border border-black ">
                <thead className="bg-black text-white font-mono  ">
                    <tr>
                    {[
                        'Cédula','Nombre y Apellido','Telefono', 'Email', 'Dirección', 
                        'Cargo','Estado', 'Opciones'
                    ].map((header) => (
                        <th key={header} className="border border-black px-4 py-2">{header}</th>
                    ))}
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((item, index) => (
                        <tr key={index}>
                        <td className="border border-black px-4 py-2">{item.cedula}</td>
                        <td className="border border-black px-4 py-2">{item.nombre}</td>
                        <td className="border border-black px-4 py-2">{item.telefono}</td>
                        <td className="border border-black px-4 py-2">{item.correo}</td>
                        <td className="border border-black px-4 py-2">{item.direccion}</td>
                        <td className="border border-black px-4 py-2">{item.cargo}</td>
                        <td className="border border-black px-4 py-2">{item.estado ?"Activo":"Inactivo"}</td>
                        <td className="border border-black px-4 py-2">
                        <button 
                        className="text-black hover:text-blue-700"
                        onClick={()=> window.open(`/actualizar-usuarios/${item.cedula}`)}
                        >
                            ✏️
                        </button>
                        </td>
                        </tr>
                    ))}
                </tbody>
               </table>
            </div>
        )
    }
    