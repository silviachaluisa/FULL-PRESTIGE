import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { HistoryContext } from '../../context/HistoryContext';
import { ModalAsistencia } from '../Modals/ModalAsistencia';

export const TablaAsistencia = ({ usuarios }) => {

  const { fetchAsistencias, seleccionado, setSeleccionado, showModal, handleModal, asistencias, setAsistencias } = useContext(HistoryContext);

  const [mesSeleccionado, setMesSeleccionado] = useState('');


  // Formatear fechas en formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    return !isNaN(date) ? date.toISOString().split('T')[0] : 'Fecha inválida';
  };

  // Manejar selección de filas
  const handleRowClick = (usuario) => {
    setSeleccionado(usuario);
    console.log('Usuario seleccionado:', usuario);
  };
  // Filtrar asistencias por el mes seleccionado
  const filtrarPorMes = (asistencias) => {
    if (!mesSeleccionado) return asistencias; // Si no se selecciona mes, mostrar todas las asistencias
    const mesSeleccionadoInt = parseInt(mesSeleccionado.split('-')[1], 10); // Extraemos el mes del valor "YYYY-MM"
    
    return asistencias.filter((item) => {
      const fecha = new Date(item.asistencia.fecha);
      return fecha.getMonth() === mesSeleccionadoInt - 1; // Filtrar por el mes (0-11)
    });
  };

  const encabezadoTabla = ['Cédula', 'Nombre y Apellido', 'Teléfono', 'Cargo', 'Fecha', 'Hora de Ingreso', 'Hora de Salida', 'Estado'];

  // Cargar asistencias de usuarios

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
      <div className="flex gap-2 mb-4">
        <div className="flex items-center gap-2 px-2 border border-orange-500">
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
          onClick={() => setMesSeleccionado('')}
          className="bg-orange-400 text-white px-4 py-2 rounded font-bold hover:bg-gray-700"
        >
          Todos los meses
        </button>
      </div>
      {filtrarPorMes(asistencias).length === 0 ? (
        <div className="text-center text-red-500 font-bold">No existen registros para el mes seleccionado.</div>
      ) : (

        <table className="w-full text-center border-collapse border border-black">
          <thead className="bg-black text-white font-mono">
            <tr>
              {encabezadoTabla.map((header) => (
                <th key={header} className="border border-white px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrarPorMes(asistencias).map((item, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(item)}
                className={`cursor-pointer ${seleccionado?.cedula === item?.cedula ? 'bg-gray-300' : ''}`}
              >
                <td className="border border-black px-4 py-2">{item.cedula}</td>
                <td className="border border-black px-4 py-2">{item.nombre}</td>
                <td className="border border-black px-4 py-2">{item.telefono}</td>
                <td className="border border-black px-4 py-2">{item.cargo}</td>
                <td className="border border-black px-4 py-2">{formatDate(item.asistencia?.fecha)}</td>
                <td className="border border-black px-4 py-2">{item.asistencia?.hora_ingreso || 'N/A'}</td>
                <td className="border border-black px-4 py-2">{item.asistencia?.hora_salida || 'N/A'}</td>
                <td className="border border-black px-4 py-2">{item.asistencia?.estado || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
