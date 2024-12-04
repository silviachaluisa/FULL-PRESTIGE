import PropTypes from 'prop-types';
import { HistoryContext } from '../../context/HistoryContext';
import { useContext, useEffect } from 'react';
import { ModalPago } from '../Modals/ModalPago';

export const TablaPago = ({ usuarios }) => {
  // Convertir la fecha ISO 8601 a formato 'YYYY-MM-DD'
  const formatDate = (isoDate) => {
    try {
      if (!isoDate || typeof isoDate !== 'string') {
        return 'N/A'; // Si no hay fecha, retornar 'N/A'
      }

      const date = new Date(isoDate);
      if (isNaN(date)) {
        throw new Error('Sin registro');
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error(`Error formateando fecha: ${error.message}`);
      return 'Sin registro';
    }
  };

  const verifyNumber = (value) => {
    if (isNaN(value)) {
      return 'N/A'; // Si no hay valor, retornar 'N/A'
    }
    return value;
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
      let indice = 0;
  
      try {
        // Realizar las solicitudes de forma paralela
        const respuestas = await Promise.all(
          usuarios.map(async usuario => {
            try {
              const pagos = await fetchPagos(usuario.cedula);
              return { usuario, pagos };
            } catch (error) {
              console.error(`Error al obtener pagos para ${usuario.cedula}:`, error);
              return { usuario, pagos: [] }; // Retornar vacío en caso de error
            }
          })
        );
  
        // Procesar las respuestas
        respuestas.forEach(({ usuario, pagos }) => {
          if (pagos.length === 0) {
            nuevasPagos.push({ ...usuario, pago: {}, indice });
            indice++;
          } else {
            pagos.forEach(pago => {
              nuevasPagos.push({ ...usuario, pago, indice });
              indice++;
            });
          }
        });
  
        setPagos(nuevasPagos);
        console.log("Nuevos pagos ->", nuevasPagos);
      } catch (error) {
        console.error("Error al obtener los pagos:", error);
      }
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
              className={`cursor-pointer ${seleccionado?.indice === item?.indice ? 'bg-red-200' : ''}`} // Marcar la fila seleccionada con color
            > 
              <td className="border border-black px-4 py-2">{item.cedula}</td>
              <td className="border border-black px-4 py-2">{item.nombre}</td>
              <td className="border border-black px-4 py-2">{formatDate(item?.pago?.fecha || 'N/A')}</td>
              <td className="border border-black px-4 py-2">{verifyNumber(item?.pago.adelanto)}</td>
              <td className="border border-black px-4 py-2">{verifyNumber(item?.pago.permisos)}</td>
              <td className="border border-black px-4 py-2">{verifyNumber(item?.pago.multas)}</td>
              <td className="border border-black px-4 py-2">{verifyNumber(item?.pago.atrasos)}</td>
              <td className="border border-black px-4 py-2">{verifyNumber(item?.pago.subtotal)}</td>
      
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
      multas: PropTypes.string.isRequired,
      atrasos: PropTypes.string.isRequired,
      subtotal: PropTypes.string.isRequired,
    })
  ).isRequired,
};
