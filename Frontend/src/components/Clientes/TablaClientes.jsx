import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FaPencilAlt } from "react-icons/fa";
import AuthContext from '../../context/AuthProvider';
import { useContext } from 'react';
import { HistoryContext } from '../../context/HistoryContext';

export const TablaClientes = ({clientes}) => {
  const navigate = useNavigate();
  const {seleccionado, setSeleccionado} = useContext(HistoryContext);
  const { auth } = useContext(AuthContext);
  console.log(clientes);

  // Convertir la fecha ISO 8601 a formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    try {
      if (!isoDate) {
        return 'N/A'; // Si no hay fecha, retornar 'N/A'
      }

      const date = new Date(isoDate);
      if (isNaN(date)) {
        throw new Error('Fecha inválida');
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error(`Error formateando fecha: ${error.message}`);
      return 'Fecha inválida';
    }
  };

   //Función para manejar el click en una fila
   const handleRowClick = (cliente) => {
    //Al seleccionar el cliente, se completan los campos automáticamente
    setSeleccionado(cliente); //Actualizar el cliente seleccionado en el contexto
    console.log("Cliente seleccionado:", cliente);
}

  const encabezadoTabla = [
    'Cédula','Nombre/Apellido', 'Contacto', 'Email', 'Dirección', 'N° Orden',
    'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
    'Técnico Responsable', 'Estado'
  ];

  if (auth?.cargo === 'Administrador') {
    encabezadoTabla.push('Opciones');
  }

  return (
    <div className="overflow-x-auto">
      {/* Tabla de Historial */}
      <table className="w-full text-center border-collapse borde">
        <thead className="bg-black text-white">
          <tr>
            {encabezadoTabla.map((header) => (
              <th key={header} className="border border-white px-4 py-2">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientes.map ((item)=> (
              <tr 
              key={`${item.propietario.cedula}-${item.n_orden}`}
              onClick={() => handleRowClick(item)}
              className={`cursor-pointer ${seleccionado && seleccionado?.propietario?.cedula === item?.propietario?.cedula ? 'bg-gray-300' : ''}`}

              >
                
              <td className="border border-black px-4 py-2">{item?.propietario.cedula} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.nombre} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.telefono} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.correo} </td>
              <td className="border border-black px-4 py-2">{item?.propietario.direccion} </td>
              <td className="border border-black px-4 py-2">{item?.n_orden} </td>
              <td className="border border-black px-4 py-2">{item?.marca} </td>
              <td className="border border-black px-4 py-2">{item?.modelo} </td>
              <td className="border border-black px-4 py-2">{item?.placa} </td>
              <td className="border border-black px-4 py-2">{formatDate(item.fecha_ingreso) } </td>
              <td className="border border-black px-4 py-2">{formatDate(item.fecha_salida)} </td>
              {/* <td className="border border-black px-4 py-2">{item?.detalles} </td> */}
              <td className="border border-black px-4 py-2">{item?.encargado?.nombre} </td>
              <td className="border border-black px-4 py-2">{item?.estado} </td>
              {
                // Si el usuario autenticado es un administrador, mostrar opciones de edición
                auth?.cargo === 'Administrador' && (
                  <td className="border border-black px-4 py-2">
                    <div
                      className="flex justify-around"
                    >
                      <FaPencilAlt
                        onClick={() => navigate(`/dashboard/actualizar-clientes/${item.propietario.cedula}`)}
                        className="text-black hover:text-blue-700 cursor-pointer"
                        data-tooltip-id="edit_client"
                        data-tooltip-content="Editar cliente"
                      />
                      <ReactTooltip id='edit_client' place='bottom'/>
                    </div>
                  </td>
                )
              } 
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
    fecha_salida: PropTypes.string,
    estado: PropTypes.string.isRequired,
  })).isRequired,
};
  