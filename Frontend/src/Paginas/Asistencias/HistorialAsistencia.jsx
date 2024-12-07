import React from 'react';
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
import AuthContext from '../../context/AuthProvider';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { TablaAsistencia } from '../../components/Asistencia/TablaAsistencia';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaCalendarAlt} from 'react-icons/fa';

export const Asistencia = () => {
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
    usuarios,
    loading ,
    fetchUsuarios,
    fetchAsistencias,
    seleccionado,
    fetchUsuarioByCedula,
    handleModal,
    setTipoModal,
    asistencias
  }= useContext (HistoryContext);
  const { auth } = useContext(AuthContext);
  
  const [cedula, setCedula] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

const handleChange=(e)=>{
  const value = e.target.value

  //Validación para que solo ingresen números y que no sobrepase los 10 dígitos
  if (/^\d{0,10}$/.test(value)){
    setCedula(value); // si es valido, actualiza el estado
  }
};

  const handleLogout=()=>{
    const confirmLogout = window.confirm ("¿Deseas abandonar la página?")
    
    if(confirmLogout===true){
      navigate('/dashboard');
    }
};
 // Llamar a fetchUsuarios una vez cuando el componente carga
 useEffect(() => {
  fetchUsuarios();
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

// ------------------------------------------------------------------------------------------------------------
const handleSearch = async () => {
  // Validación de la cédula
  const cedulaRegex = /^[0-9]{10}$/;
  if (cedula === "") {
    await fetchUsuarios(); // Cargar todos los usuarios si la cédula está vacía
    return;
  }

  if (!cedulaRegex.test(cedula)) {
    setErrorMessage("⚠️La cédula debe contener solo 10 dígitos numéricos.");
    return;
  }

  // Verificar que la cédula se está pasando correctamente
  console.log("Buscando usuarios con cédula:", cedula);

  const usuario = await fetchUsuarioByCedula(cedula);

  // Verificar que el usuario se encontró
  console.log("Usuario encontrado:", usuario);
  
  if (!usuario) {
    setErrorMessage("❌ Usuario no se encuentra registrado");
  } else {
    const asistencias = await fetchAsistencias(cedula);
    console.log("Asistencias encontradas:", asistencias);
    setErrorMessage(""); // Limpiar mensaje de error
    setSuccessMessage(" ✅ Usuario encontrado con éxito");
  }
  
  setCedula(""); // Limpia la cédula del campo de búsqueda

  // Limpiar los mensajes después de 6 segundos
  setTimeout(() => {
    setErrorMessage(""); // Limpiar mensaje de error
    setSuccessMessage(""); // Limpiar mensaje de éxito
  }, 4000);
};

// ---------------------------------------------------------------------------------------------------
const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.text('Historial de Usuarios Registrados', 10, 10);
  doc.autoTable({
    head: [['Cédula', 'Nombre y Apellido', 'Telefono', 'Cargo', 'Fecha', 'Hora de Ingreso', 'Hora de Salida', 'Estado']],
    body: asistencias.map((usuario) => [
      usuario.cedula,
      usuario.nombre,
      usuario.telefono,
      usuario.cargo,
      formatDate(usuario?.asistencia.fecha),
      usuario?.asistencia.hora_ingreso || 'N/A',
      usuario?.asistencia.hora_salida || 'N/A',
      usuario?.asistencia.estado || 'N/A',   
    ]),
  });
  doc.save('HistorialAsistencia.pdf');
};
const handleDownloadExcel = () => {
  const data = asistencias.map((usuario) => ({
    Cédula: usuario.cedula,
    Nombre: usuario.nombre,
    Teléfono: usuario.telefono,
    Cargo: usuario.cargo,
    Fecha: formatDate(usuario?.asistencia.fecha),
    HoraIngreso: usuario?.asistencia.hora_ingreso || 'N/A',
    HoraSalida: usuario?.asistencia.hora_salida || 'N/A',
    Estado: usuario?.asistencia.estado || 'N/A',
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'HistorialAsistencia');
  XLSX.writeFile(workbook, 'HistorialAsistencia.xlsx');
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
            <p className='ml-4 text-white italic font-semibold text-sm' >"Que tu auto refleje lo mejor de ti"</p>

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
        <h2 className=" bg-black px-4 py-2  border-2 border-white text-red-600 text-center text-2xl font-semibold mb-4">HISTORIAL DE ASISTENCIA <FaCalendarAlt className="text-red-600 mx-auto text-5xl mb-4" /></h2>
      
      </div>

      {/* Historial de Usuarios */}
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
            value={cedula}
            placeholder="Cedula"
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
          <button
            onClick={() => handleNewClick("registrar")}
            className="px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-orange-300"
          >
            Registrar Asistencia
          </button>

          <button
            onClick={() => handleNewClick("actualizar")}
            className="ml-4 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-500"
            disabled={Object.keys(seleccionado?.asistencia || {}).length !== 0 ? false : true}
            style={{ cursor: Object.keys(seleccionado?.asistencia || {}).length !== 0 ? "pointer" : "not-allowed" }}
          >
            Actualizar Asistencia
          </button>
        </div>
        {/* ---------------------------------------------------------------------------------------------------------------------------- */}
   {/* TABLA DEL HISTORIAL */}
   {/* Significa que esta esperando una lista, de lo contrario solo muestra el encabezado, esto se modifica del lado del backend */}
   {Array.isArray(usuarios) && usuarios.length !== 0 ? (
  <TablaAsistencia usuarios={usuarios} />
) : (
  <div className="overflow-x-auto">
    <table className="w-full text-center border-collapse border border-black">
      <thead className="bg-black text-white font-mono">
        <tr>
          {[
            'Cédula', 'Nombre y Apellido', 'Telefono', 'Cargo', 'Fecha', 'Hora de Ingreso', 'Hora de Salida', 'Estado'
          ].map((header) => (
            <th key={header} className="border border-black px-4 py-2">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan="8" className="text-center py-4 text-red-700">
            { loading ? 'Cargando...' : 'No hay usuarios registrados'}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)}



       {/* BOTONES------------------------------------------------------------- */}
        <div className='flex space-x-4 justify-center mt-20'>

          <button  onClick={handleDownloadPDF} className="bg-red-400 text-black font-bold px-3 py-2 rounded flex items-center space-x-5"> 
            <img src={pdf} alt="pdf" className='h-6' />
            Descargar PDF
          </button>
          

          <button onClick={handleDownloadExcel} className="bg-green-300 text-black font-bold px-3 py-2 rounded flex item-center space-x-5">
          <img src={excel} alt="excel" className='h-6' />
            Descargar Excel
          </button>
        </div>
      </main>

      
      {/* Footer------------------------------------------------------------------- */}
      <footer className="w-full py-1 text-center text-white bg-black border-t border-white">
      2024 Full Prestige. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Asistencia;
