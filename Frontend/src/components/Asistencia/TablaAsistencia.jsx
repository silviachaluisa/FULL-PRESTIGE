import PropTypes from 'prop-types';
import { HistoryContext } from '../../context/HistoryContext';
import { useContext, useEffect, useState } from 'react';
import { ModalAsistencia } from '../Modals/ModalAsistencia';

export const TablaAsistencia = ({ usuarios }) => {
  const { fetchAsistencias } = useContext(HistoryContext);
  const [asistencias, setAsistencias] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null); // Mantener el usuario seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

  // Función para manejar el clic en una fila
  const handleRowClick = (usuario) => {
    // Solo cambiar la fila seleccionada sin abrir el modal
    setSelectedUsuario(usuario);
  };

  // Función para abrir el modal manualmente
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Función para manejar el envío de la asistencia
  const handleSubmitAsistencia = (asistencia) => {
    console.log("Asistencia enviada:", asistencia);
    // Aquí iría la lógica para guardar la asistencia
  };

  // Cargar las asistencias de los usuarios
  useEffect(() => {
    const obtenerAsistencias = async () => {
      const nuevasAsistencias = [];
      for (const usuario of usuarios) {
        const response = await fetchAsistencias(usuario.cedula);
        nuevasAsistencias.push(response);
      }
      setAsistencias(nuevasAsistencias);
    };

    obtenerAsistencias();
  }, [usuarios]);

  return (
    <div className="overflow-x-auto">
      {/* Tabla de Historial */}
      <table className="w-full text-center border-collapse border border-black">
        <thead className="bg-black text-white font-mono">
          <tr>
            {[
              'Cédula',
              'Nombre y Apellido',
              'Telefono',
              'Cargo',
              'Fecha',
              'Hora de Ingreso',
              'Hora de Salida',
              'Estado',
            ].map((header) => (
              <th key={header} className="border border-white px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((item, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(item)}  // Cambiar la fila seleccionada
              className={`cursor-pointer ${selectedUsuario?.cedula === item.cedula ? 'bg-red-200' : ''}`}  // Marcar la fila seleccionada con color
            >
              <td className="border border-black px-4 py-2">{item.cedula}</td>
              <td className="border border-black px-4 py-2">{item.nombre}</td>
              <td className="border border-black px-4 py-2">{item.telefono}</td>
              <td className="border border-black px-4 py-2">{item.cargo}</td>
              <td className="border border-black px-4 py-2">{item.fecha || 'N/A'}</td>
              <td className="border border-black px-4 py-2">{item.horaIngreso || 'N/A'}</td>
              <td className="border border-black px-4 py-2">{item.horaSalida || 'N/A'}</td>
              <td className="border border-black px-4 py-2">{item.estado}</td>
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
      horaIngreso: PropTypes.string.isRequired,
      horaSalida: PropTypes.string.isRequired,
      cargo: PropTypes.string.isRequired,
      estado: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
};
