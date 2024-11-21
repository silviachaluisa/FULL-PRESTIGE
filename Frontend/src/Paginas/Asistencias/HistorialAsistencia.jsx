import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/imagenes/logo.jpg";
import pdf from "../../assets/imagenes/pdf.png";
import excel from "../../assets/imagenes/excel.png";
import BMWLogo from "../../assets/LogosAutos/BMW.png";
import chevroletLogo from "../../assets/LogosAutos/Chevrolet.png";
import fordLogo from "../../assets/LogosAutos/Ford.png";
import hondaLogo from "../../assets/LogosAutos/Honda.png";
import hundayLogo from "../../assets/LogosAutos/Hunday.png";
import kiaLogo from "../../assets/LogosAutos/Kia.png";
import mazdaLogo from "../../assets/LogosAutos/Mazda.png";
import mercedesLogo from "../../assets/LogosAutos/Mercedes.png";
import peugeotLogo from "../../assets/LogosAutos/Peugeot.png";
import renaultLogo from "../../assets/LogosAutos/Renault.png";
import susukiLogo from "../../assets/LogosAutos/Susuki.png";
import toyotaLogo from "../../assets/LogosAutos/Toyota.png";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Asistencia = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const empleados = [
    { id: 1, nombre: "Juan Pérez", cargo: "Técnico" },
    { id: 2, nombre: "Ana López", cargo: "Administradora" },
    { id: 3, nombre: "Carlos García", cargo: "Mecánico" },
  ];

  const [busqueda, setBusqueda] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [historial, setHistorial] = useState([]);

  const brandLogos = {
    bmw: BMWLogo,
    chevrolet: chevroletLogo,
    ford: fordLogo,
    honda: hondaLogo,
    hunday: hundayLogo,
    kia: kiaLogo,
    mazda: mazdaLogo,
    mercedes: mercedesLogo,
    peugeot: peugeotLogo,
    renault: renaultLogo,
    susuki: susukiLogo,
    toyota: toyotaLogo,
  };

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
    const empleado = empleados.find((emp) =>
      emp.nombre.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setEmpleadoSeleccionado(empleado || null);
  };
  const handleSearch = async () => {
    // Validación de la cédula
    const cedulaRegex = /^[0-9]{10}$/;
  
    if (!cedulaRegex.test(cedula)) {
      setErrorMessage("⚠️La cédula debe contener solo 10 dígitos numéricos.");
      return;
    }
  
    if (cedula === "") {
      await fetchUsuarios(); // Cargar todos los usuarios si la cédula está vacía
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
      setErrorMessage(""); // Limpiar mensaje de error
      setSuccessMessage(" ✅ Usuario encontrado con éxito");
      setFilteredData([usuario]); // Mostrar el usuario encontrado
    }
    
    setCedula(""); // Limpia la cédula del campo de búsqueda
  
    // Limpiar los mensajes después de 6 segundos
    setTimeout(() => {
      setErrorMessage(""); // Limpiar mensaje de error
      setSuccessMessage(""); // Limpiar mensaje de éxito
    }, 4000);
  };

  const registrarEntrada = () => {
    if (!empleadoSeleccionado) {
      alert("Selecciona un empleado válido.");
      return;
    }
    const registro = {
      id: empleadoSeleccionado.id,
      nombre: empleadoSeleccionado.nombre,
      cargo: empleadoSeleccionado.cargo,
      fecha: new Date().toLocaleDateString(),
      entrada: new Date().toLocaleTimeString(),
      salida: null,
      estado: "Presente",
      observaciones: "",
    };
    setHistorial((prev) => [...prev, registro]);
    alert("Entrada registrada con éxito.");
  };

  const registrarSalida = () => {
    if (!empleadoSeleccionado) {
      alert("Selecciona un empleado válido.");
      return;
    }
    const actualizado = historial.map((registro) =>
      registro.id === empleadoSeleccionado.id &&
      registro.fecha === new Date().toLocaleDateString() &&
      !registro.salida
        ? { ...registro, salida: new Date().toLocaleTimeString() }
        : registro
    );
    setHistorial(actualizado);
    alert("Salida registrada con éxito.");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas abandonar la página?");
    if (confirmLogout) navigate("/dashboard");
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Historial de Asistencia', 10, 10);
    doc.autoTable({
      head: [['Cédula', 'Nombre y Apellido', 'Teléfono', 'Correo', 'Dirección', 'Cargo', 'Estado']],
      body: filteredData.map((usuario) => [
        usuario.cedula,
        usuario.nombre,
        usuario.telefono,
        usuario.correo,
        usuario.direccion,
        usuario.cargo,
        usuario.estado,
      ]),
    });
    doc.save('HistorialAsistencia.pdf');
  };
  const handleDownloadExcel = () => {
    const data = filteredData.map((usuario) => ({
      Cédula: usuario.cedula,
      Nombre: usuario.nombre,
      Teléfono: usuario.telefono,
      Email: usuario.correo,
      Dirección: usuario.direccion,
      Cargo: usuario.cargo,
      Estado: usuario.estado,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HistorialAsistencia');
    XLSX.writeFile(workbook, 'HistoriaAsistencia.xlsx');
  };

  

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(to right, #2c3e50, #bdc3c7)",
      }}
    >
      <header className="w-full bg-black shadow p-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Full Prestige" className="h-14" />
          <p className="ml-4 text-white italic font-semibold text-sm">
            "Que tu auto refleje lo mejor de ti"
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          VOLVER
        </button>
      </header>
      <div className="w-full bg-black shadow p-4 flex justify-between items-center border-2 border-white px-2 py-2">
        {Object.keys(brandLogos).map((brand) => (
          <div key={brand} className="text-white text-sm text-center mx-2">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
              <img src={brandLogos[brand]} alt={`${brand} logo`} className="w-full h-full object-contain rounded-full" />
            </div>
            <p>{brand.charAt(0).toUpperCase() + brand.slice(1)}</p>
          </div>
        ))}
      </div>

      <main className="flex-grow w-full max-w-5xl p-6 bg-white shadow mt-6 rounded-lg mx-auto">
        <h2 className="text-center text-xl font-semibold text-red-600">
          HISTORIAL DE ASISTENCIA
        </h2>

        <div className="flex items-center mt-4">
          <input
            type="text"
            onChange={handleSearch}
            value={nombre}
            placeholder="Buscar empleado..."
            className="flex-grow border border-gray-400 p-2 rounded"
          />
          <button 
            onClick={handleSearch} 
            className="ml-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800">
            Buscar
          </button>
        </div>

        {empleadoSeleccionado && (
          <div className="mt-4">
            <p>
              <strong>Empleado:</strong> {empleadoSeleccionado.nombre} (
              {empleadoSeleccionado.cargo})
            </p>
            <button
              onClick={registrarEntrada}
              className="mt-2 bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Registrar Entrada
            </button>
            <button
              onClick={registrarSalida}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Registrar Salida
            </button>
          </div>
        )}

        <table className="w-full mt-6 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Cargo</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Entrada</th>
              <th className="border p-2">Salida</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((registro, index) => (
              <tr key={index} className="odd:bg-gray-100 even:bg-white">
                <td className="border p-2">{registro.nombre}</td>
                <td className="border p-2">{registro.cargo}</td>
                <td className="border p-2">{registro.fecha}</td>
                <td className="border p-2">{registro.entrada || "—"}</td>
                <td className="border p-2">{registro.salida || "—"}</td>
                <td className="border p-2">{registro.estado}</td>
                <td className="border p-2">{registro.observaciones || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>

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

      <footer className="w-full py-2 text-center text-white bg-black">
        2024 Full Prestige. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Asistencia;
