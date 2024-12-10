import PropTypes from 'prop-types';
import { HistoryContext } from '../../context/HistoryContext';
import { useContext, useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { FaPencilAlt } from "react-icons/fa";
import ModalMantenimiento from "../Modals/ModalMantenimiento";
import AuthContext from '../../context/AuthProvider';

export const TablaMantenimiento = ({ mantenimientos }) => {
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

  const {
    seleccionado,
    setSeleccionado,
    showModal,
    handleModal,
    setTipoModal
  } = useContext(HistoryContext);

  const { auth } = useContext(AuthContext);
  const [ infoMantenimiento, setInfoMantenimiento ] = useState({});

  // Función para manejar el clic en una fila
  const handleRowClick = (cliente, abrir=false) => {
    // Al seleccionar el cliente, se completan los campos automáticamente
    setSeleccionado(cliente); // Actualizar el cliente seleccionado en el contexto
    setInfoMantenimiento(cliente);
    
    if (abrir) {
      setTipoModal("actualizar");
      handleModal();
    }
  }; 

  let encabezadoTabla = [
    'Cédula','Nombre/Apellido', 'Marca', 'Modelo', 'Placa', 'Fecha Ingreso',
    'Fecha Salida', 'Descripción del trabajo', 'Técnico Responsable', 'Estado', "Costo"
  ];

  if (auth?.cargo === "Administrador"){
    // Si el usuario es un administrador, mostrar la columna de opciones
    encabezadoTabla.push('Opciones');
  }

  return (
    <div className="overflow-x-auto">
      {/* Tabla de Historial */}
      <table className="w-full text-center border-collapse border border-black">
        <thead className="bg-black text-white font-mono">
          <tr>
            {encabezadoTabla.map((header) => (
              <th key={header} className="border border-white px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mantenimientos.map((item) => (
             <tr
              key={item._id} // Usa el _id como clave única
              onClick={() => handleRowClick(item)} // Cambiar la fila seleccionada
              className={`cursor-pointer ${
                seleccionado?._id === item._id ? "bg-gray-300" : ""
              }`} // Marcar la fila seleccionada con color
            >
              <td className="border border-black px-4 py-2">{item?.vehiculo?.propietario?.cedula || 'N/A'} </td>
              <td className="border border-black px-4 py-2">{item?.vehiculo?.propietario.nombre || 'N/A'} </td>
              <td className="border border-black px-4 py-2">{item?.vehiculo?.marca || 'N/A'} </td>
              <td className="border border-black px-4 py-2">{item?.vehiculo?.modelo|| 'N/A'} </td>
              <td className="border border-black px-4 py-2">{item?.vehiculo.placa || 'N/A'} </td>
              <td className="border border-black px-4 py-2">{formatDate(item?.vehiculo?.fecha_ingreso) } </td>
              <td className="border border-black px-4 py-2">{formatDate(item?.vehiculo?.fecha_salida)} </td>
              <td className="border border-black px-4 py-2">{item?.descripcion || 'N/A'} </td>
              <td className="border border-black px-4 py-2">{item?.encargado?.nombre || 'N/A'} </td>
              <td className="border border-black px-4 py-2">{item?.estado || 'N/A'} </td>
              <td className="border border-black px-4 py-2">{item?.costo || 'N/A'}$ </td>
              {
                auth?.cargo === "Administrador" && (
                  // Si el usuario es un administrador, mostrar la columna de opciones
                  <td className="border border-black px-4 py-2">
                    <div
                      className="flex justify-around"
                    >
                      <FaPencilAlt
                        onClick={() => handleRowClick(item, true)}
                        className="text-black hover:text-blue-700 cursor-pointer"
                        data-tooltip-id="edit_client"
                        data-tooltip-content="Editar mantenimiento"
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

      {/* Modal de Mantenimientos */}
      {
        showModal && (
          <ModalMantenimiento
            info={infoMantenimiento}
            handleShow={handleModal}
          />
        )
      }
    </div>
  );
};

TablaMantenimiento.propTypes = {
  mantenimientos: PropTypes.array.isRequired,
};
