import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaPencilAlt } from "react-icons/fa";
import AuthContext from '../../context/AuthProvider';
import { useContext, useState } from 'react';
import { HistoryContext } from '../../context/HistoryContext';

export const TablaClientes = ({clientes}) => {
  const navigate = useNavigate();
  const {seleccionado, setSeleccionado} = useContext(HistoryContext);
  const { auth } = useContext(AuthContext);
  const [mesSeleccionado, setMesSeleccionado] = useState(''); // Estado para el mes seleccionado

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

  // Función para manejar el click en una fila
  const handleRowClick = (cliente) => {
    setSeleccionado(cliente); //Actualizar el cliente seleccionado en el contexto
    console.log("Cliente seleccionado:", cliente);
  };

// Función para filtrar por mes
const filtrarPorMes = (clientes) => {
  if (!mesSeleccionado) return clientes; // Si no se selecciona mes, mostrar todos los clientes
  // Usamos split('-')[1] para obtener el mes del valor mesSeleccionado (por ejemplo, de 2024-12 obtenemos 12).
  // Usamos parseInt() para convertirlo en un número entero.
  // Restamos 1 a mesSeleccionadoInt para que coincida con el formato 0-11 de getMonth().
    const mesSeleccionadoInt = parseInt(mesSeleccionado.split('-')[1], 10); // Extraemos el mes del valor "YYYY-MM"
    const anioSeleccionadoInt = parseInt(mesSeleccionado.split('-')[0], 10); // Extraemos el año del valor "YYYY-MM"

    console.log("mesSeleccionadoInt", mesSeleccionadoInt);
    return clientes.filter((item) => {
      // Extraemos las partes de la fecha de ingreso directamente
      const [anioIngreso, mesIngreso] = item.fecha_ingreso.split('-').map(Number); // Convertimos a números

      console.log("Fecha de ingreso (año, mes):", anioIngreso, mesIngreso);

      // Comparamos año y mes
      return anioIngreso === anioSeleccionadoInt && mesIngreso === mesSeleccionadoInt;
    });
  };
  

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
      {/* Filtro de mes */}
      <div className="flex gap-4 mb-4">
        <div className='flex items-center gap-2 px-2 border border-orange-500'>
          <label htmlFor="mes" className="mr-2 font-bold ">Seleccionar mes:</label>
          <input 
            type="month"  
            id="mes"
            data-testid="mes"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="border px-4 py-2"
          />
        </div>
        <button
          onClick={() => setMesSeleccionado('')} // Limpiar el filtro de mes
          className="bg-orange-400 text-white px-4 py-2 rounded font-bold hover:bg-gray-700"
        >
          Todos los meses
        </button>
      </div>

      {/* Mostrar mensaje si no hay registros con el filtro de mes */}
      {filtrarPorMes(clientes).length === 0 ? (
        <div className="text-center text-red-500 font-bold">No existen registros para el mes seleccionado.</div>
      ) : (
        <div>
          {/* Tabla de Historial de Clientes */}
          <table className="w-full text-center border-collapse borde">
            <thead className="bg-black text-white">
              <tr>
                {encabezadoTabla.map((header) => (
                  <th key={header} className="border border-white px-4 py-2">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrarPorMes(clientes).map((item) => (
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
                  <td className="border border-black px-4 py-2">{formatDate(item.fecha_ingreso)} </td>
                  <td className="border border-black px-4 py-2">{formatDate(item.fecha_salida)} </td>
                  <td className="border border-black px-4 py-2">{item?.encargado?.nombre} </td>
                  <td className="border border-black px-4 py-2">{item?.estado} </td>
                  {auth?.cargo === 'Administrador' && (
                    <td className="border border-black px-4 py-2">
                      <div className="flex justify-around">
                        <FaPencilAlt
                          onClick={() => navigate(`/dashboard/actualizar-clientes/${item.propietario.cedula}`)}
                          className="text-black hover:text-blue-700 cursor-pointer"
                          data-testid="edit_client"
                          data-tooltip-id="edit_client"
                          data-tooltip-content="Editar cliente"
                        />
                        <ReactTooltip id='edit_client' place='bottom'/>
                      </div>
                    </td>
                  )}
                </tr>
              ))} 
            </tbody>
          </table>
        </div>
      )}
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
