import PropTypes from 'prop-types';
import { HistoryContext } from '../../context/HistoryContext';
import { useContext, useEffect } from 'react';
//import { ModalAsistencia } from '../Modals/ModalAsistencia';

export const TablaPago = ({ usuarios }) => {
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

  const { fetchAsistencias, seleccionado, setSeleccionado, showModal, handleModal, asistencias, setAsistencias } = useContext(HistoryContext);

  // Función para manejar el clic en una fila
  const handleRowClick = (usuario) => {
    // Al seleccionar el usuario, se completan los campos automáticamente
    setSeleccionado(usuario); // Actualizar el usuario seleccionado en el contexto
    console.log("Usuario seleccionado:", usuario);
  };

  // Cargar las asistencias de los usuarios
  useEffect(() => {
    const obtenerAsistencias = async () => {
      const nuevasAsistencias = [];
      for (const usuario of usuarios) {
        const response = await fetchAsistencias(usuario.cedula);
        console.log("Respuesta asistencias de", usuario.cedula, "=",response);
        if (response.length === 0) {
          nuevasAsistencias.push({ ...usuario, asistencia: {} });
        } else {
          for (const asistencia of response){
            nuevasAsistencias.push({ ...usuario, asistencia: asistencia });
          }
        }
      }
      setAsistencias(nuevasAsistencias);
      console.log("Nuevas asistencias ->",nuevasAsistencias);
    };

    obtenerAsistencias();
  }, [usuarios]);

  return (
    <div className="overflow-x-auto">
      {/* Tabla de Historial */}
      <table className="w-full text-center border-collapse border border-black">
        <thead className="bg-black text-white font-mono">
          <tr>
            {['Cédula', 'Nombre y Apellido', 'Telefono', 'Cargo', 'Fecha', 'Hora de Ingreso', 'Hora de Salida', 'Estado'].map((header) => (
              <th key={header} className="border border-white px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {asistencias.map((item, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(item)} // Cambiar la fila seleccionada
              className={`cursor-pointer ${seleccionado?.asistencia._id === item.asistencia._id ? 'bg-red-200' : ''}`} // Marcar la fila seleccionada con color
            > 
              <td className="border border-black px-4 py-2">{item.cedula}</td>
              <td className="border border-black px-4 py-2">{item.nombre}</td>
              <td className="border border-black px-4 py-2">{formatDate(item.fecha) || "N/A"}</td>
              <td className="border border-black px-4 py-2">{item.adelanto}</td>
              <td className="border border-black px-4 py-2">{item.permisos}</td>
              <td className="border border-black px-4 py-2">{item.multas}</td>
              <td className="border border-black px-4 py-2">{item.atrasos}</td>
              <td className="border border-black px-4 py-2">{item.subtotal}</td>
      
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Asistencia */}
      {
        showModal && (
          <ModalPago
            handleShow={handleModal}
            usuario={seleccionado}
          />
        )
      }
    </div>
  );
};

TablaPago.propTypes = {
  usuarios: PropTypes.arrayOf(
    PropTypes.shape({
      cedula: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      telefono: PropTypes.string.isRequired,
      asistencia: PropTypes.shape({
        fecha: PropTypes.string.isRequired,
        hora_ingreso: PropTypes.string.isRequired,
        hora_salida: PropTypes.string.isRequired,
      }),
      cargo: PropTypes.string.isRequired,
      estado: PropTypes.string.isRequired,
    })
  ).isRequired,
};
