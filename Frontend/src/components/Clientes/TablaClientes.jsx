export const TablaClientes = ({clientes}) => {
    return (
      <div className="overflow-x-auto">
        {/* Tabla de Historial */}
        <table className="w-full text-center border-collapse border border-black">
          <thead className="bg-black text-white font-mono">
            <tr>
              {[
                'Cédula','Nombre y Apellido', 'Contacto', 'Email', 'Dirección', 'N° Orden',
                'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
                'Descripción del trabajo', 'Técnico Responsable', 'Estado', 'Opciones'
              ].map((header) => (
                <th key={header} className="border border-black px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map ((item, index)=> (
                <tr key={index}>
                <td className="border border-black px-4 py-2">{item.cedula} </td>
                <td className="border border-black px-4 py-2">{item.nombre} </td>
                <td className="border border-black px-4 py-2">{item.telefono} </td>
                <td className="border border-black px-4 py-2">{item.correo} </td>
                <td className="border border-black px-4 py-2">{item.direccion} </td>
                <td className="border border-black px-4 py-2">{item.orden} </td>
                <td className="border border-black px-4 py-2">{item.marca} </td>
                <td className="border border-black px-4 py-2">{item.modelo} </td>
                <td className="border border-black px-4 py-2">{item.placa} </td>
                <td className="border border-black px-4 py-2">{item.fechaIngreso} </td>
                <td className="border border-black px-4 py-2">{item.fechaSalida} </td>
                <td className="border border-black px-4 py-2">{item.descripcion} </td>
                <td className="border border-black px-4 py-2">{item.tecnico} </td>
                <td className="border border-black px-4 py-2">{item.estado} </td>
                <td className="border border-black px-4 py-2">
                    <button 
                    className="text-black hover:text-blue-700"
                    onClick={()=> window.open(`/actualizar-clientes/${item.cedula}`)}
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
  