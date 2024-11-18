export const TablaClientes = ({clientes}) => {
  // Convertir la fecha ISO 8601 a formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
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
                <td className="border border-black px-4 py-2">{item.propietario.cedula} </td>
                <td className="border border-black px-4 py-2">{item.propietario.nombre} </td>
                <td className="border border-black px-4 py-2">{item.propietario.telefono} </td>
                <td className="border border-black px-4 py-2">{item.propietario.correo} </td>
                <td className="border border-black px-4 py-2">{item.propietario.direccion} </td>
                <td className="border border-black px-4 py-2">{item.n_orden} </td>
                <td className="border border-black px-4 py-2">{item.marca} </td>
                <td className="border border-black px-4 py-2">{item.modelo} </td>
                <td className="border border-black px-4 py-2">{item.placa} </td>
                <td className="border border-black px-4 py-2">{formatDate(item.fecha_ingreso) } </td>
                <td className="border border-black px-4 py-2">{formatDate(item.fecha_salida)} </td>
                <td className="border border-black px-4 py-2">{item.detalles} </td>
                <td className="border border-black px-4 py-2">{item.encargado.nombre} </td>
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
  