import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

export const TablaClientes = ({clientes}) => {
  const navigate = useNavigate();
  console.log(clientes);
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
        <table className="w-full text-center border-collapse borde">
          <thead className="bg-black text-white">
            <tr>
              {[
                'Cédula','Nombre/Apellido', 'Contacto', 'Email', 'Dirección', 'N° Orden',
                'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
                'Descripción del trabajo', 'Técnico Responsable', 'Estado', 'Opciones'
              ].map((header) => (
                <th key={header} className="border border-white px-4 py-2">{header}</th>
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
                    onClick={() => navigate(`/actualizar-clientes/${item.propietario.cedula}`)}
                    >
                    ✏️
                    </button>
                </td>
                </tr>
            ))}     
          </tbody>
        </table>
      </div>
    );
  };
  
  TablaClientes.propTypes = {
    clientes: PropTypes.arrayOf(PropTypes.shape({
      propietario: PropTypes.shape({
        cedula: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        correo: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
      }).isRequired,
      n_orden: PropTypes.string.isRequired,
      marca: PropTypes.string.isRequired,
      modelo: PropTypes.string.isRequired,
      placa: PropTypes.string.isRequired,
      fecha_ingreso: PropTypes.string.isRequired,
      fecha_salida: PropTypes.string.isRequired,
      detalles: PropTypes.string.isRequired,
      encargado: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
      }).isRequired,
      estado: PropTypes.string.isRequired,
    
    })).isRequired,
  };
  