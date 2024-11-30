import PropTypes from 'prop-types';
import { HistoryContext } from '../../context/HistoryContext';
import { useContext, useEffect } from 'react';
import { ModalPago } from '../Modals/ModalPago';

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

  const { fetchPagos, seleccionado, setSeleccionado, showModal, handleModal, pagos, setPagos } = useContext(HistoryContext);

  // Función para manejar el clic en una fila
  const handleRowClick = (usuario) => {
    // Al seleccionar el usuario, se completan los campos automáticamente
    setSeleccionado(usuario); // Actualizar el usuario seleccionado en el contexto
    console.log("Usuario seleccionado:", usuario);
  };

  // Cargar las asistencias de los usuarios
  useEffect(() => {
    const obtenerPagos = async () => {
      const nuevasPagos = [];
      for (const usuario of usuarios) {
        const response = await fetchPagos(usuario.cedula);
        console.log("Respuesta pagos de", usuario.cedula, "=",response);
        if (response.length === 0) {
          nuevasPagos.push({ ...usuario, pago: {} });
        } else {
          for (const pago of response){
            nuevasPagos.push({ ...usuario, pago: pago });
          }
        }
      }
      setPagos(nuevasPagos);
      console.log("Nuevas pagos ->",nuevasPagos);
    };

    obtenerPagos();
  }, [usuarios]);

  return (
    <div className="overflow-x-auto">
      {/* Tabla de Historial */}
      <table className="w-full text-center border-collapse border border-black">
        <thead className="bg-black text-white font-mono">
          <tr>
            {['Cédula', 'Nombre y Apellido', 'Fecha', 'Adelantos', 'Permisos', 'Multas', 'Atrasos', 'Subtotal'].map((header) => (
              <th key={header} className="border border-white px-4 py-2">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pagos.map((item, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(item)} // Cambiar la fila seleccionada
              className={`cursor-pointer ${seleccionado?.pago._id === item.pago._id ? 'bg-red-200' : ''}`} // Marcar la fila seleccionada con color
            > 
              <td className="border border-black px-4 py-2">{item.cedula}</td>
              <td className="border border-black px-4 py-2">{item.nombre}</td>
              <td className="border border-black px-4 py-2">{formatDate(item.fecha) || "N/A"}</td>
              <td className="border border-black px-4 py-2">{item.adelantos}</td>
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
      fecha: PropTypes.string.isRequired,
      adelantos: PropTypes.string.isRequired,
      permisos: PropTypes.string.isRequired, 
      cargo: PropTypes.string.isRequired,
      estado: PropTypes.string.isRequired,
    })
  ).isRequired,
};
