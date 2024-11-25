import PropTypes from 'prop-types';
import { HistoryContext } from '../../context/HistoryContext';
import { useContext, useEffect, useState } from 'react';
import { ModalAsistencia } from '../Modals/ModalAsistencia';

export const TablaAsistencia = ({ usuarios }) => {
  // Convertir la fecha ISO 8601 a formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { fetchAsistencias, setSeleccionado } = useContext(HistoryContext);
  const [asistencias, setAsistencias] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null); // Mantener el usuario seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

  // Función para manejar el clic en una fila
  const handleRowClick = (usuario) => {
    // Al seleccionar el usuario, se completan los campos automáticamente
    console.log("Usuario seleccionado:", usuario);

    setSeleccionado(usuario); // Actualizar el usuario seleccionado en el contexto

    setSelectedUsuario({
      ...usuario
      // fecha: formatDate(new Date()), // Fecha actual por defecto
      // hora_ingreso: '', // Puedes poner valor por defecto
      // hora_salida: '' // Puedes poner valor por defecto
    });
   
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Función para manejar el envío de la asistencia
  const handleSubmitAsistencia = (asistencia) => {
    console.log("Asistencia enviada:", asistencia);
    // Aquí iría la lógica para guardar la asistencia
    // Ejemplo de cómo podrías manejar el envío a la API o el almacenamiento
    // fetchSaveAsistencia(asistencia);
    closeModal(); // Cerrar el modal después de registrar la asistencia
  };

  // Cargar las asistencias de los usuarios
  useEffect(() => {
    const obtenerAsistencias = async () => {
      const nuevasAsistencias = [];
      for (const usuario of usuarios) {
        const response = await fetchAsistencias(usuario.cedula);
        nuevasAsistencias.push({ ...usuario, asistencia: response.at(-1) });
      }
      setAsistencias(nuevasAsistencias);
      console.log(nuevasAsistencias);
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
              className={`cursor-pointer ${selectedUsuario?.cedula === item.cedula ? 'bg-red-200' : ''}`} // Marcar la fila seleccionada con color
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
      {isModalOpen && (
        <ModalAsistencia
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmitAsistencia}
          title="Registrar Asistencia"
          selectedUsuario={selectedUsuario} // Pasar el usuario seleccionado al modal
        />
      )}
    </div>
  );
};

TablaAsistencia.propTypes = {
  usuarios: PropTypes.arrayOf(
    PropTypes.shape({
      cedula: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      telefono: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      hora_ingreso: PropTypes.string.isRequired,
      hora_salida: PropTypes.string.isRequired,
      cargo: PropTypes.string.isRequired,
      estado: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};
