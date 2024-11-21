import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/imagenes/logo.jpg';
import pdf from '../../assets/imagenes/pdf.png';
import excel from '../../assets/imagenes/excel.png';
import BMWLogo from '../../assets/LogosAutos/BMW.png';
import chevroletLogo from '../../assets/LogosAutos/Chevrolet.png';
import fordLogo from '../../assets/LogosAutos/Ford.png';
import hondaLogo from '../../assets/LogosAutos/Honda.png';
import hundayLogo from '../../assets/LogosAutos/Hunday.png';
import kiaLogo from '../../assets/LogosAutos/Kia.png';
import mazdaLogo from '../../assets/LogosAutos/Mazda.png';
import mercedesLogo from '../../assets/LogosAutos/Mercedes.png';
import peugeotLogo from '../../assets/LogosAutos/Peugeot.png';
import renaultLogo from '../../assets/LogosAutos/Renault.png';
import susukiLogo from '../../assets/LogosAutos/Susuki.png';
import toyotaLogo from '../../assets/LogosAutos/Toyota.png';

export const Pagos = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [totalSubtotal, setTotalSubtotal] = useState(0);

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

  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem('pagosRecords')) || [];
    setRecords(savedRecords);
    setFilteredRecords(savedRecords);
    calculateTotalSubtotal(savedRecords);
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas abandonar la página?");
    if (confirmLogout) {
      navigate('/dashboard');
    }
  };

  const handleNewClick = () => {
    navigate('/registrar-pagos');
  };

  const handleSearch = () => {
    const filtered = records.filter(record =>
      record.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
    calculateTotalSubtotal(filtered);
  };

  const calculateTotalSubtotal = (records) => {
    const total = records.reduce((acc, record) => acc + parseFloat(record.subtotal || 0), 0);
    setTotalSubtotal(total.toFixed(2));
  };

  return (
    <div className="min-h-screen flex flex-col" 
      style={{
        background: 'linear-gradient(to right, #2c3e50, #bdc3c7)'
      }}
    >
      <header className="w-full bg-black shadow p-4 flex justify-between items-center">
        <div className='flex items-center'>
          <img src={logo} alt="Full Prestige" className='h-14' />
          <p className='ml-4 text-white italic font-semibold text-sm'>"Que tu auto refleje lo mejor de ti"</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-green-500 text-white px-4 py-2 rounded">
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

      <div>
        <h2 className="bg-black px-4 py-2 border-2 border-white text-red-600 text-center text-xl font-semibold mb-4">HISTORIAL DE PAGOS</h2>
      </div>

      <main className="flex-grow w-full max-w-5xl p-6 bg-white shadow mt-6 rounded-lg mx-auto border border-black">
        <div className="flex items-center justify-between bg-gray-300 p-4 rounded-lg mb-6">
          <input
            type="text"
            placeholder="Nombre y Apellido"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        <div className="overflow-x-auto">
          <h1 className="font-bold">Se muestran los valores de cada campo a continuación: </h1>
          <table className="w-full text-center border-collapse border border-black">
            <thead className="bg-black text-white font-mono">
              <tr>
                {['Fecha', 'Adelanto', 'Permisos', 'Faltas', 'Multas', 'Atrasos', 'Subtotal','Estado', 'Observaciones', 'Opciones'].map((header) => (
                  <th key={header} className="border border-black px-4 py-2">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td className="border border-black px-4 py-2">{record.fecha}</td>
                  <td className="border border-black px-4 py-2">{record.adelanto}</td>
                  <td className="border border-black px-4 py-2">{record.permisos}</td>
                  <td className="border border-black px-4 py-2">{record.faltas}</td>
                  <td className="border border-black px-4 py-2">{record.multas}</td>
                  <td className="border border-black px-4 py-2">{record.atrasos}</td>
                  <td className="border border-black px-4 py-2">{record.subtotal}</td>
                  <td className="border border-black px-4 py-2">{record.observaciones}</td>
                  <td className="border border-black px-4 py-2">
                    <button className="text-black hover:text-blue-700">✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-right font-bold">
          Total de Subtotales: ${totalSubtotal}
        </div>

        <div className="flex space-x-4 justify-center mt-20">
          <button className="bg-red-400 text-black font-bold px-3 py-2 rounded flex items-center space-x-5"> 
            <img src={pdf} alt="pdf" className="h-6" /> Descargar PDF
          </button>
          <button className="bg-green-300 text-black font-bold px-3 py-2 rounded flex item-center space-x-5">
            <img src={excel} alt="excel" className="h-6" /> Descargar Excel
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-1 text-center text-white bg-black border-t border-white">
      2024 Full Prestige. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Pagos;
