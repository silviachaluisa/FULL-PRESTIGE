import logo from '../../assets/imagenes/logo.jpg';
import pdf from '../../assets/imagenes/pdf.png'
import excel from '../../assets/imagenes/excel.png'
import { useNavigate } from 'react-router-dom';
import BMWLogo from '../../assets/LogosAutos/BMW.png'
import chevroletLogo from '../../assets/LogosAutos/Chevrolet.png'
import fordLogo from '../../assets/LogosAutos/Ford.png'
import hondaLogo from '../../assets/LogosAutos/Honda.png'
import hundayLogo from '../../assets/LogosAutos/Hunday.png'
import kiaLogo from '../../assets/LogosAutos/Kia.png'
import mazdaLogo from '../../assets/LogosAutos/Mazda.png';
import mercedesLogo from '../../assets/LogosAutos/Mercedes.png'
import peugeotLogo from '../../assets/LogosAutos/Peugeot.png'
import renaultLogo from '../../assets/LogosAutos/Renault.png'
import susukiLogo from '../../assets/LogosAutos/Susuki.png'
import toyotaLogo from '../../assets/LogosAutos/Toyota.png'
import { HistoryContext } from '../../context/HistoryContext';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { TablaMantenimiento } from '../../components/Tecnicos/TablaMantenimientos';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaCalendarAlt} from 'react-icons/fa';
import AuthContext from '../../context/AuthProvider';

export const HistorialMantenimiento = () => {
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

  const navigate= useNavigate();
  const {
    loading,
    fetchMantenimientos,
    seleccionado,
    fetchMantenimientosByPlaca,
    fetchMantenimientosByEmpleado,
    handleModal,
    setTipoModal,
    mantenimientos
  }= useContext (HistoryContext);
  
  const { auth } = useContext(AuthContext);

  const [placa, setPlaca] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange=(e)=>{
    const value = e.target.value.toUpperCase(); // Convertir a mayúsculas

    //Validación para que solo ingresen letras(A-Z) seguidas de hasta 4 dígitos
    const placaRegex = /^[A-Z]{0,3}\d{0,4}$/; //Permite hasta 3 letras y letras y hasta 4 números

    if (placaRegex.test(value)){
      setPlaca(value); // si es valido, actualiza el estado
    }
  };

  const handleLogout=()=>{
    const confirmLogout = window.confirm ("¿Deseas abandonar la página?")
    
    if(confirmLogout===true){
        navigate('/dashboard');
    }  
};
 // Llamar a fetchClientes una vez cuando el componente carga
 useEffect(() => {
  
  fetchMantenimientos();
}, []);


const brandLogos = {
  bmw: BMWLogo,
  chevrolet: chevroletLogo,
  ford: fordLogo,
  honda:hondaLogo,
  hunday:hundayLogo,
  kia:kiaLogo,
  mazda: mazdaLogo,
  mercedes:mercedesLogo,
  peugeot:peugeotLogo,
  renault:renaultLogo,
  susuki:susukiLogo,
  toyota:toyotaLogo
};
const handleNewClick = (type) => {
  console.log("Tipo de modal:", type);
  setTipoModal(type);
  handleModal();
};

let encabezadoTabla = [
  'Cédula','Nombre/Apellido', 'Marca', 'Modelo', 'Placa', 'Fecha Ingreso',
  'Fecha Salida', 'Descripción del trabajo', 'Técnico Responsable', 'Estado'
];

if (auth?.cargo === "Administrador"){
  // Si el usuario es un administrador, mostrar la columna de opciones
  encabezadoTabla.push('Opciones');
}

// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
const handleSearch = async () => {
  // Validación de la placa (formato: ABC-1234 o similar)
  const placaRegex = /^[A-Z]{3}-?[0-9]{3,4}$/;

  if (placa === "") {
    if (auth?.cargo === "Administrador") {
      await fetchMantenimientos();
    } else if (auth?.cargo === "Técnico") {
      await fetchMantenimientosByEmpleado(auth?.cedula);
    }
    console.log("Buscando todos los mantenimientos", mantenimientos);
    return;
  }

  if (!placaRegex.test(placa)) {
    setErrorMessage("⚠️ La placa debe seguir el formato: ABC-1234");
    return;
  }

  // Verificar que la placa se está pasando correctamente
  console.log("Buscando cliente con placa:", placa);

  const cliente = await fetchMantenimientosByPlaca(placa);

  // Verificar que el vehículo se encontró
  console.log("Vehículo encontrado:", cliente);

  if (!cliente) {
    setErrorMessage("❌ Vehículo no se encuentra registrado");
  } else {
    const mantenimientos = await fetchMantenimientos(placa);
    console.log("Mantenimientos encontrados:", mantenimientos);
    setErrorMessage(""); // Limpiar mensaje de error
    setSuccessMessage("✅ Vehículo encontrado con éxito");
  }
  
  setPlaca(""); // Limpia la placa del campo de búsqueda

  // Limpiar los mensajes después de 4 segundos
  setTimeout(() => {
    setErrorMessage(""); // Limpiar mensaje de error
    setSuccessMessage(""); // Limpiar mensaje de éxito
  }, 4000);
};
// ----------------------------------------------------------------------------------
  const handleDownloadPDF = () => {
    try{
      const doc = new jsPDF({ orientation: 'landscape' }); // Configuración para orientación horizontal
      doc.text('Historial de Mantenimientos Registrados', 10, 10);
      doc.autoTable({
        head: [['Cédula','Nombre/Apellido','N° Orden',
                'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
                'Descripción del trabajo', 'Técnico Responsable']],
        body: mantenimientos.map((cliente) => [
          cliente.propietario?.cedula || 'N/A',
          cliente.propietario?.nombre || 'N/A',
          cliente.vehiculo?.marca || 'N/A',
          cliente.modelo?.modelo || 'N/A',
          cliente.vehiculo?.placa || 'N/A',
          formatDate(cliente.vehiculo?.fecha_ingreso || 'N/A'),
          formatDate(cliente.vehiculo?.fecha_salida || 'N/A'),
          cliente.descripcion,
          cliente.encargado?.nombre || 'N/A',
        ]),
      });
      doc.save('HistorialMantenimientos.pdf');
      alert("PDF generado con éxito");
      }catch (error){
        console.error("Error al generar PDF:", error);
        alert("Error al generar PDF");
      }
    };

  const handleDownloadExcel = () => {
    try{
      const data= mantenimientos.map((cliente) => ({
        Cédula: cliente.propietario?.cedula || 'N/A',
        Nombre: cliente.propietario?.nombre || 'N/A',
        Marca: cliente.vehiculo?.marca || 'N/A',
        Modelo: cliente.vehiculo?.modelo || 'N/A',
        Placa: cliente.vehiculo?.placa|| 'N/A',
        FechaIngreso: formatDate(cliente.vehiculo?.fecha_ingreso || 'N/A'),
        FechaSalida: formatDate(cliente.vehiculo?.fecha_salida || 'N/A'),
        Descripción:cliente.descripcion || 'N/A',
        Técnico: cliente.encargado.nombre || 'N/A',
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'HistorialMantenimientos');
      XLSX.writeFile(workbook, 'HistorialMantenimientos.xlsx');
      alert
    }catch (error){
      console.error("Error al generar Excel:", error);
      alert("Error al generar Excel");
    }
  };


  return (
  <div className="min-h-screen flex flex-col" 
    style={{
            background: '#bdc3c7',  /* Fallback for old browsers */
            background: '-webkit-linear-gradient(to right, #2c3e50, #bdc3c7)',  /* Chrome 10-25, Safari 5.1-6 */
            background: 'linear-gradient(to right, #2c3e50, #bdc3c7)'  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        }}
    >
      
      <header className="w-full bg-black shadow p-4 flex justify-between items-center">
        <div className='flex items-center'>
          <img src={logo} alt="Full Prestige" className='h-14' />
          <p className='ml-4 text-white italic font-semibold text-sm'>&quot;Que tu auto refleje lo mejor de ti&quot;</p>
        </div>
        <button 
        onClick={handleLogout}
        className="bg-green-500 text-white px-4 py-2 rounded">
        VOLVER</button>
      </header>
      
      <div className="w-full bg-black p-4 grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4 items-center justify-items-center">
        {['BMW','Chevrolet','Ford','Honda','Hunday','Kia','Mazda','Mercedes', 'Peugeot','Renault' ,'Susuki','Toyota'].map((brand) => (
          <div key={brand} className="text-white text-sm text-center mx-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <img
                src={brandLogos[brand.toLowerCase()]} // Accede a la imagen correcta del objeto
                alt={`${brand} logo`}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <p>{brand}</p>
          </div>
        ))}
      </div>  

      <div>
        <h2 className=" bg-black px-4 py-2  border-2 border-white text-red-600 text-center text-2xl font-semibold mb-4">HISTORIAL DE REPARACIONES <FaCalendarAlt className="text-red-600 mx-auto text-5xl mb-4" /></h2>
      </div>

      {/* Historial de Mantenimientos */}
      <main className="flex-grow  w-full p-6 bg-white shadow mt-6 rounded-lg mx-auto border border-black">
      {/* max-w-5xl (Esto hace que el formulario se limite al ancho y no cubra toda la pantalla)*/} 
      {/* w-full  (Para ponerlo en toda la pantalla)*/}
        {/* Formulario de Búsqueda */}

         {/* Mostrar mensaje de error si no se encuentra cliente o si la cédula es inválida */}
         {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          {successMessage && <div className="text-green-500">{successMessage}</div>}
          {/* --------------------------------------------------------------------------------- */}
        <div className="flex items-center justify-between bg-gray-300 p-4 rounded-lg mb-6">
          <input
            type="text"
            onChange={handleChange}
            value={placa}
            placeholder="Placa del vehículo"
            className="bg-gray-200 border border-black py-2 px-4 w-full rounded-lg focus:outline-none"
          />
          <button 
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800">
            Buscar
          </button>

          
        </div>

        {/* ------------------------------------------------------------------------------------------------------------------------ */}
        <div className="flex justify-center items-center bg-gray-300 p-4 rounded-lg mb-6">
          {
            // Si el usuario no es técnico o administrador, no puede registrar mantenimientos
            (auth?.cargo === "Técnico" || auth?.cargo === "Administrador") && (
              <>
                <button
                  onClick={() => handleNewClick("registrar")}
                  className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-500"
                  disabled={
                    (auth?.cargo !== "Técnico") || // Si el usuario no es técnico deshabilitar el botón o
                    (seleccionado?.estado === "Finalizado") ? true : false // Si ya se finalizó el mantenimiento deshabilitar el botón
                  }
                  style={{
                    cursor: 
                      (auth?.cargo !== "Técnico") || // Si el usuario no es técnico mostrar cursor de no permitido
                      (seleccionado?.estado === "Finalizado") ? "not-allowed" : "pointer" // Si ya se finalizó el mantenimiento mostrar cursor de no permitido
                  }}
                  data-tooltip-id='registrar'
                  data-tooltip-content={(auth?.cargo !== "Técnico") ? "Solo los técnicos pueden registrar mantenimientos" : (seleccionado?.estado === "Finalizado") ? "No se puede registrar un mantenimiento finalizado" : "Registrar Mantenimiento"}
                >
                  Registrar Mantenimiento
                </button>
                <ReactTooltip id='registrar' place='bottom'/>
              </>
            )
          }

          {
            // Si el usuario es un tecnico o gerente, puede solicitar actualizaciones
            (auth?.cargo === "Técnico" || auth?.cargo === "Gerente") && (
              <>
                <button
                  onClick={() => handleNewClick("soli-actualizacion")}
                  className="ml-4 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-500"
                  disabled={!(seleccionado?.estado === "Finalizado")} // Si no hay descripción o costo deshabilitar el botón
                  style={{
                    cursor: (seleccionado?.estado === "Finalizado") ? "pointer" : "not-allowed" // Si hay descripción y costo mostrar cursor de permitido
                  }}
                  data-tooltip-id='soli-actualizacion'
                  data-tooltip-content={(seleccionado?.estado === "Finalizado") ? "Solicitar Actualización" : "No se puede solicitar actualización de un mantenimiento no finalizado"}
                >
                  Solicitar Actualización
                </button>
                <ReactTooltip id='soli-actualizacion' place='bottom'/>
              </>
            )
          }
        </div>
        {/* ---------------------------------------------------------------------------------------------------------------------------- */}
      {/* TABLA DEL HISTORIAL */}
      {/* Significa que esta esperando una lista, de lo contrario solo muestra el encabezado, esto se modifica del lado del backend */}
      {Array.isArray(mantenimientos) && mantenimientos.length !== 0 ? (
        <TablaMantenimiento mantenimientos={mantenimientos} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-black">
              <thead className="bg-black text-white font-mono">
                <tr>
                  {encabezadoTabla.map((header) => (
                    <th key={header} className="border border-black px-4 py-2">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={encabezadoTabla.length} className="text-center py-4 text-red-700">
                    { loading ? 'Cargando...' : 'No hay mantenimientos registrados'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      )}

       {/* BOTONES------------------------------------------------------------- */}
       {
        // Si el usuario es un administrador o gerente, mostrar los botones de descarga
        (auth?.cargo === "Administrador" || auth?.cargo === "Gerente") && (
          <div className="flex space-x-4 justify-center mt-20">
            <button
              onClick={handleDownloadPDF}
              className="bg-red-400 text-black font-bold px-3 py-2 rounded flex items-center space-x-5"
            >
              <img src={pdf} alt="pdf" className="h-6" />
              Descargar PDF
            </button>

            <button
              onClick={handleDownloadExcel}
              className="bg-green-300 text-black font-bold px-3 py-2 rounded flex item-center space-x-5"
            >
              <img src={excel} alt="excel" className="h-6" />
              Descargar Excel
            </button>
          </div>
        )
       }
      </main>

        {/* Footer------------------------------------------------------------------- */}
        <footer className="w-full py-1 text-center text-white bg-black border-t border-white">
        2024 Full Prestige. Todos los derechos reservados.
        </footer>
  </div> 
  );
};

export default HistorialMantenimiento;