import PropTypes from 'prop-types';
import { HistoryContext } from '../../context/HistoryContext';
import { useContext, useEffect } from 'react';
import { ModalMantenimiento } from '../Modals/ModalMantenimientos';

export const TablaMantenimiento = ({ clientes }) => {
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
    fetchMantenimientos,
    seleccionado,
    setSeleccionado,
    showModal,
    handleModal,
    mantenimientos,
    setMantenimientos
  } = useContext(HistoryContext);

  // Función para manejar el clic en una fila
  const handleRowClick = (cliente) => {
    // Al seleccionar el cliente, se completan los campos automáticamente
    setSeleccionado(cliente); // Actualizar el cliente seleccionado en el contexto
    console.log("Cliente seleccionado:", cliente);
  };

  
  useEffect(() => {
    const obtenerMantenimientos = async () => {
      let indice = 0;
      const nuevosMantenimientos = [];
      try {
        // Realizar las solicitudes en paralelo con manejo de errores individuales
        const respuestas = await fetchMantenimientos();
        console.log("Respuestas Mantenimientos ->", respuestas);
  
        // Procesar las respuestas
        respuestas.forEach((mantenimiento) => {
          nuevosMantenimientos.push({ ...mantenimiento, indice });
          indice++;
        });
  
        setMantenimientos(nuevosMantenimientos);
        console.log("Nuevos mantenimientos ->", nuevosMantenimientos);
      } catch (error) {
        console.error("Error general al obtener historial de mantenimientos:", error);
      }
    };
    obtenerMantenimientos();
  }, [clientes]);

  return (
    <div className="overflow-x-auto">
      {/* Tabla de Historial */}
      <table className="w-full text-center border-collapse border border-black">
        <thead className="bg-black text-white font-mono">
          <tr>
            {['Cédula','Nombre/Apellido', 'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
                'Descripción del trabajo', 'Técnico Responsable', 'Estado'].map((header) => (
              <th key={header} className="border border-white px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mantenimientos.map((item, index) => (
             <tr
              key={index}
              onClick={() => handleRowClick(item)} // Cambiar la fila seleccionada
               className={`cursor-pointer ${seleccionado?.vehiculo?.placa === item?.vehiculo?.placa ? 'bg-red-200' : ''}`} // Marcar la fila seleccionada con color
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
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Mantenimientos */}
      {
        showModal && (
          <ModalMantenimiento
            handleShow={handleModal}
            cliente={seleccionado}
          />
        )
      }
    </div>
  );
};

TablaMantenimiento.propTypes = {
    clientes: PropTypes.arrayOf(PropTypes.shape({
        propietario: PropTypes.shape({
          cedula: PropTypes.string.isRequired,
          nombre: PropTypes.string.isRequired,  
        }).isRequired,
        vehiculo: PropTypes.shape({
          marca: PropTypes.string.isRequired,
          modelo: PropTypes.string.isRequired,
          placa: PropTypes.string.isRequired,
          fecha_ingreso: PropTypes.string.isRequired,
          fecha_salida: PropTypes.string.isRequired,
        }).isRequired,
      
      })).isRequired,
};
