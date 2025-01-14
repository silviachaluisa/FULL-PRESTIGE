import PropTypes from 'prop-types'; 
import { HistoryContext } from '../../context/HistoryContext';
import { useContext, useEffect, useState } from 'react';
import { ModalPago } from '../Modals/ModalPago';

export const TablaPago = ({ usuarios }) => {
  const [mesSeleccionado, setMesSeleccionado] = useState(''); // Estado para el mes seleccionado

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
    return isNaN(value) ? 'N/A' : value.toFixed(2);
  };

  const { fetchPagos, seleccionado, setSeleccionado, showModal, handleModal, pagos, setPagos } = useContext(HistoryContext);

  // Función para manejar el clic en una fila
  const handleRowClick = (usuario) => {
    setSeleccionado(usuario); // Actualizar el usuario seleccionado en el contexto
    console.log("Usuario seleccionado:", usuario);
  };

  // Función para filtrar por mes
  const filtrarPorMes = (pagos) => {
    if (!mesSeleccionado) return pagos; // Si no se selecciona mes, mostrar todos los pagos
    const mesSeleccionadoInt = parseInt(mesSeleccionado.split('-')[1], 10); // Extraemos el mes del valor "YYYY-MM"
    return pagos.filter((item) => {
      const fecha = new Date(item.pago.fecha);
      return fecha.getMonth() === mesSeleccionadoInt - 1; // Filtrar por el mes (0-11)
    });
  };

  // Cargar los pagos de los usuarios
  useEffect(() => {
    const obtenerPagos = async () => {
      const nuevasPagos = [];
      let indice = 0;
  
      try {
        // Realizar las solicitudes de forma paralela
        const respuestas = await Promise.all(
          usuarios.map(async (usuario) => {
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
          // Asegura que 'pago' no sea undefined
          const pagosConPagoSeguro = pagos.length > 0 ? pagos : [{ ...usuario, pago: {} }];
          pagosConPagoSeguro.forEach((pago) => {
            nuevasPagos.push({ ...usuario, pago, indice });
            indice++;
          });
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
      {/* Filtro de mes */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2 px-2 border border-orange-500">
          <label htmlFor="mes" className="mr-2 font-bold">Seleccionar mes:</label>
          <input
            type="month"
            id="mes"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="border px-4 py-2"
          />
        </div>
        <button
          onClick={() => setMesSeleccionado('')} // Limpiar el filtro de mes
          className="bg-orange-400 text-white px-4 py-2 rounded font-bold hover:bg-gray-700"
        >
          Todos los meses
        </button>
      </div>

      {/* Mostrar mensaje si no hay registros con el filtro de mes */}
        <div>
          {/* ---------------------Tabla de Historial de pagos-------------------- */}
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
    {filtrarPorMes(pagos).length === 0 ? (
      <tr>
        <td colSpan="8" className="text-center text-red-500 font-bold">No existen registros para el mes seleccionado.</td>
      </tr>
    ) : (
      filtrarPorMes(pagos).map((item, index) => (
        <tr
          key={index}
          onClick={() => handleRowClick(item)} // Cambiar la fila seleccionada
          className={`cursor-pointer ${seleccionado?.indice === item?.indice ? 'bg-gray-300' : ''}`} // Marcar la fila seleccionada con color
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
      ))
    )}
  </tbody>
</table>

        </div>
      

      {showModal && (
        <ModalPago
          handleShow={handleModal}
          usuario={seleccionado}
        />
      )}
    </div>
  );
}

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
