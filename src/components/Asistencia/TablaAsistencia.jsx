import PropTypes from 'prop-types';
import { useContext } from 'react';
import { HistoryContext } from '../../context/HistoryContext';
import { ModalAsistencia } from '../Modals/ModalAsistencia';

export const TablaAsistencia = ({ usuarios }) => {
  const {
    seleccionado,
    setSeleccionado,
    showModal,
    handleModal
  } = useContext(HistoryContext);

  // Formatear fechas en formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    return !isNaN(date) ? date.toISOString().split('T')[0] : 'Fecha inválida';
  };

  // Manejar selección de filas
  const handleRowClick = (usuario) => {
    setSeleccionado(usuario);
  };

  const encabezadoTabla = ['Cédula', 'Nombre y Apellido', 'Teléfono', 'Cargo', 'Fecha', 'Hora de Ingreso', 'Hora de Salida', 'Estado'];

  return (
    <div className="overflow-x-auto">
      {
        Array.isArray(usuarios) && usuarios.length === 0 ? (
          <div className="text-center text-red-500 font-bold">No existen registros para el mes seleccionado.</div>
        ) : (
          <table className="w-full text-center border-collapse border border-black" role="table">
            <thead className="bg-black text-white font-mono">
              <tr>
                {encabezadoTabla.map((header) => (
                  <th key={header} className="border border-white px-4 py-2">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(usuarios) && usuarios.map((item, index) => (
                <tr
                  key={`${item._id}_${index}`}
                  onClick={() => handleRowClick(item)}
                  className={`cursor-pointer ${seleccionado?._id === item?._id ? 'bg-gray-300' : ''}`}
                >
                  <td className="border border-black px-4 py-2">{item.cedula}</td>
                  <td className="border border-black px-4 py-2">{item.nombre}</td>
                  <td className="border border-black px-4 py-2">{item.telefono}</td>
                  <td className="border border-black px-4 py-2">{item.cargo}</td>
                  <td className="border border-black px-4 py-2">{formatDate(item.asistencias.at(-1)?.fecha)}</td>
                  <td className="border border-black px-4 py-2">{item.asistencias.at(-1)?.hora_ingreso || 'N/A'}</td>
                  <td className="border border-black px-4 py-2">{item.asistencias.at(-1)?.hora_salida || 'N/A'}</td>
                  <td className="border border-black px-4 py-2">{item.asistencias.at(-1)?.estado || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
      {showModal && <ModalAsistencia handleShow={handleModal} usuario={seleccionado} />}
    </div>
  );
};

TablaAsistencia.propTypes = {
  usuarios: PropTypes.arrayOf(
    PropTypes.shape({
      cedula: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      telefono: PropTypes.string.isRequired,
      asistencia: PropTypes.shape({
        fecha: PropTypes.string,
        hora_ingreso: PropTypes.string,
        hora_salida: PropTypes.string,
      }),
      cargo: PropTypes.string.isRequired,
    })
  ).isRequired,
};
