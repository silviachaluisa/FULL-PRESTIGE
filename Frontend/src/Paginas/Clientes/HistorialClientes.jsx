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
import { HistoryContext } from '../../context/historyProvider';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import toyotaLogo from '../../assets/LogosAutos/Toyota.png'
import { TablaClientes } from '../../components/Clientes/TablaClientes';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';



export const ClientesVehiculos = () => {
  const navigate= useNavigate();
  const {clientes,fetchClientes, fetchClientesByCedula}= useContext (HistoryContext);
  const [cedula, setCedula] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const handleChange=(e)=>{
    setCedula(e.target.value)
};
  
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
  
  const handleLogout=()=>{
    const confirmLogout = window.confirm ("¿Deseas abandonar la página?")
    if(confirmLogout===true){
      navigate('/dashboard');
    }  
  };
  const handleNewClick =()=>{
    navigate('/registrar-clientes')
  }
 // Llamar a fetchUsuarios una vez cuando el componente carga
 useEffect(() => {
  fetchClientes();
}, []);


const handleSearch = async()=>{
 if(cedula === "") {await fetchClientes();return}
 await fetchClientesByCedula(cedula);
};

useEffect(() => {
  if (startDate && endDate) {
    const filtered = clientes.filter((usuario) => {
      const userDate = new Date(usuario.fechaRegistro);
      return userDate >= new Date(startDate) && userDate <= new Date(endDate);
    });
     setFilteredData(filtered);
   } else {
     setFilteredData(clientes);
   }
 }, [startDate, endDate, clientes]);

const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.text('Historial de Clientes Registrados', 10, 10);
  doc.autoTable({
    head: [['Cédula','Nombre y Apellido', 'Contacto', 'Email', 'Dirección', 'N° Orden',
                'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
                'Descripción del trabajo', 'Técnico Responsable', 'Estado']],
    body: filteredData.map((cliente) => [
      cliente.cedula,
      cliente.nombre,
      cliente.telefono,
      cliente.correo,
      cliente.direccion,
      cliente.orden,
      cliente.marca,
      cliente.modelo,
      cliente.placa,
      cliente.fechaIngreso,
      cliente.fechaSalida,
      cliente.descripcion,
      cliente.tecnico,
      cliente.estado ?  "Activo": "Inactivo",
    ]),
  });
  doc.save('HistorialUsuarios.pdf');
};
const handleDownloadExcel = () => {
  const data = filteredData.map((cliente) => ({
    Cédula: cliente.cedula,
    Nombre: cliente.nombre,
    Teléfono: cliente.telefono,
    Email: cliente.correo,
    Dirección: cliente.direccion,
    Orden: cliente.orden,
    Marca: cliente.marca,
    Modelo: cliente.modelo,
    Placa: cliente.placa,
    FechaIngreso: cliente.fechaIngreso,
    FechaSalida: cliente.fechaSalida,
    Descripción: cliente.descripcion,
    Técnico: cliente.tecnico,
    Estado: cliente.estado ?  "Activo": "Inactivo",
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'HistorialClientes');
  XLSX.writeFile(workbook, 'HistorialClientes.xlsx');
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
      

      <div className="w-full bg-black shadow p-4 flex justify-between items-center border-2 border-white px-2 py-2">
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
        <h2 className=" bg-black px-4 py-2  border-2 border-white text-red-600 text-center text-xl font-semibold mb-4">HISTORIAL DE CLIENTES / VEHÍCULOS</h2>
      </div>

      {/* Historial de Clientes/Vehículos */}
      <main className="flex-grow w-full  p-6 bg-white shadow mt-6 rounded-lg mx-auto border border-black">
      {/* max-w-5xl (Esto hace que el formulario se limite al ancho y no cubra toda la pantalla)*/} 
        
        {/* Formulario de Búsqueda */}
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
          <button 
          onClick={handleNewClick}
          className="ml-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800">
            Nuevo
          </button>
        </div>
        {/* <div className="flex items-center justify-between bg-gray-300 p-4 rounded-lg mb-6">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-200 border border-black py-2 px-4 rounded-lg"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-200 border border-black py-2 px-4 rounded-lg"
          />
        </div>  */}

        {/* TABLA DEL HISTORIAL DE CLIENTES------------------------------------------ */}
        {Array.isArray(clientes) && clientes.length !== 0 ? (
          <TablaClientes clientes={clientes} />
        ) : (
       
        <div className="overflow-x-auto">
        {/* Tabla de Historial */}
        <table className="w-full text-center border-collapse border border-black">
          <thead className="bg-black text-white font-mono">
            <tr>
              {[
                'Cédula', 'Contacto', 'Email', 'Dirección', 'N° Orden',
                'Marca', 'Modelo', 'Placa', 'Fecha Ingreso', 'Fecha Salida',
                'Descripción del trabajo', 'Técnico a cargo', 'Estado', 'Opciones'
              ].map((header) => (
                <th key={header} className="border border-black px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
           
            <tr>
            <td colSpan="8" className="text-center py-4 text-red-700">
            No existen registros disponibles.
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

export default ClientesVehiculos;