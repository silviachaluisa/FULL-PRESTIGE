import PropTypes from 'prop-types';
import { HistoryContext } from '../../context/HistoryContext';
import { useContext, useEffect, useState } from 'react';
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

  const {
    fetchAsistencias,
    seleccionado,
    setSeleccionado,
    showModal,
    handleModal,
    asistencias,
    setAsistencias
  } = useContext(HistoryContext);

  const [mesSeleccionado, setMesSeleccionado] = useState(''); // Estado para el mes seleccionado
  const [asistenciasFiltradas, setAsistenciasFiltradas] = useState([]);

  // Función para manejar el clic en una fila
  const handleRowClick = (usuario) => {
    setSeleccionado(usuario); // Actualizar el usuario seleccionado en el contexto
    console.log("Usuario seleccionado:", usuario);
  };

  const encabezadoTabla = [
    'Cédula', 'Nombre y Apellido', 'Telefono', 'Cargo', 'Fecha', 'Hora de Ingreso', 'Hora de Salida', 'Estado'
  ];

  // Filtrar asistencias por el mes seleccionado
  useEffect(() => {
    const filtrarPorMes = () => {
      if (!mesSeleccionado) {
        setAsistenciasFiltradas(asistencias);
        return;
      }

      const [anioSeleccionado, mesSeleccionadoStr] = mesSeleccionado.split('-');
      const mesSeleccionadoInt = parseInt(mesSeleccionadoStr, 10);

      const filtradas = asistencias.filter((item) => {
        if (!item.asistencia?.fecha) return false;

        const fecha = new Date(item.asistencia.fecha);
        const mesFecha = fecha.getMonth() + 1; // Los meses en JS son 0 indexados
        const anioFecha = fecha.getFullYear();

        return mesFecha === mesSeleccionadoInt && anioFecha === parseInt(anioSeleccionado, 10);
      });

      setAsistenciasFiltradas(filtradas);
    };

    filtrarPorMes();
  }, [mesSeleccionado, asistencias]);

  // Cargar las asistencias de los usuarios
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
        setAsistenciasFiltradas(nuevasAsistencias); // Inicialmente todas las asistencias están filtradas
        console.log("Nuevas asistencias ->", nuevasAsistencias);
      } catch (error) {
        console.error("Error general al obtener las asistencias:", error);
      }
    };
  
    obtenerAsistencias();
  }, [usuarios]);

  return (
    <div className="overflow-x-auto">
      {/* Selector de Mes */}
      <div className="flex gap-2 mb-4">
      <div className='flex items-center gap-2 px-2 border border-orange-500'>
        <label htmlFor="mesSeleccionado" className="block font-bold mb-2">Buscar por Mes:</label>
        <input
          type="month"
          id="mesSeleccionado"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <button
          onClick={() => setMesSeleccionado('')} // Limpiar el filtro de mes
          className="bg-orange-400 text-white px-4 py-2 rounded font-bold hover:bg-gray-700"
        >
          Todos los meses
        </button>
      </div>

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
          {asistenciasFiltradas.map((item, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(item)} // Cambiar la fila seleccionada
              className={`cursor-pointer ${seleccionado?.indice === item?.indice ? 'bg-gray-300' : ''}`} // Marcar la fila seleccionada con color
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
