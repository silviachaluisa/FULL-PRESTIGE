import PropTypes from 'prop-types';
import { HistoryContext } from '../../context/HistoryContext';
import { useContext, useEffect } from 'react';
import { ModalAsistencia } from '../Modals/ModalAsistencia';

export const TablaAsistencia = ({ usuarios }) => {
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

  // // Cargar las asistencias de los usuarios
  // useEffect(() => {
  //   const obtenerAsistencias = async () => {
  //     const nuevasAsistencias = [];
  //     let indice = 0;
  //     for (const usuario of usuarios) {
  //       const response = await fetchAsistencias(usuario.cedula);
  //       console.log("Respuesta asistencias de", usuario.cedula, "=",response);
  //       if (response.length === 0) {
  //         nuevasAsistencias.push({ ...usuario, asistencia: {}, indice: indice });
  //         indice++;
  //       } else {
  //         for (const asistencia of response){
  //           nuevasAsistencias.push({ ...usuario, asistencia: asistencia, indice: indice });
  //           indice++;
  //         }
  //       }
  //     }
  //     setAsistencias(nuevasAsistencias);
  //     console.log("Nuevas asistencias ->",nuevasAsistencias);
  //   };

  //   obtenerAsistencias();
  // }, [usuarios]);

  useEffect(() => {
    const obtenerAsistencias = async () => {
      let indice = 0;
      const nuevasAsistencias = [];
  
      try {
        // Realizar las solicitudes en paralelo con manejo de errores individuales
        const respuestas = await Promise.all(
          usuarios.map(async usuario => {
            try {
              const asistencias = await fetchAsistencias(usuario.cedula);
              return { usuario, asistencias };
            } catch (error) {
              console.error(`Error al obtener asistencias para ${usuario.cedula}:`, error);
              return { usuario, asistencias: [] }; // Retornar vacío en caso de error
            }
          })
        );
  
        // Procesar las respuestas
        respuestas.forEach(({ usuario, asistencias }) => {
          if (asistencias.length === 0) {
            nuevasAsistencias.push({ ...usuario, asistencia: {}, indice });
            indice++;
          } else {
            asistencias.forEach(asistencia => {
              nuevasAsistencias.push({ ...usuario, asistencia, indice });
              indice++;
            });
          }
        });
  
        setAsistencias(nuevasAsistencias);
        console.log("Nuevas asistencias ->", nuevasAsistencias);
      } catch (error) {
        console.error("Error general al obtener las asistencias:", error);
      }
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
              className={`cursor-pointer ${seleccionado?.indice === item?.indice ? 'bg-red-200' : ''}`} // Marcar la fila seleccionada con color
            >
              <td className="border border-black px-4 py-2">{item.cedula}</td>
              <td className="border border-black px-4 py-2">{item.nombre}</td>
              <td className="border border-black px-4 py-2">{item.telefono}</td>
              <td className="border border-black px-4 py-2">{item.cargo}</td>
              <td className="border border-black px-4 py-2">{formatDate(item.asistencia?.fecha) || "N/A"}</td>
              <td className="border border-black px-4 py-2">{item.asistencia?.hora_ingreso || 'N/A'}</td>
              <td className="border border-black px-4 py-2">{item.asistencia?.hora_salida || 'N/A'}</td>
              <td className="border border-black px-4 py-2">{item.asistencia?.estado || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Asistencia */}
      {
        showModal && (
          <ModalAsistencia
            handleShow={handleModal}
            usuario={seleccionado}
          />
        )
      }
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
        fecha: PropTypes.string.isRequired,
        hora_ingreso: PropTypes.string.isRequired,
        hora_salida: PropTypes.string.isRequired,
      }),
      cargo: PropTypes.string.isRequired,
      estado: PropTypes.string.isRequired,
    })
  ).isRequired,
};
