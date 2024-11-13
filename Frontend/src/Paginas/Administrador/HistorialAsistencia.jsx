import React from 'react';
import logo from '../../assets/imagenes/logo.jpg';
import pdf from '../../assets/imagenes/pdf.png'
import excel from '../../assets/imagenes/excel.png'
import { useNavigate } from 'react-router-dom';


export const Asistencia = () => {
    const navigate= useNavigate();

    const handleLogout=()=>{
        const confirmLogout = window.confirm ("¿Deseas abandonar la página?")
        if(confirmLogout===true){
            navigate('/dashboard');
        }
    };

    const handleNuevo=()=> {
      window.open('/registrar-asistencia', '_blank');
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
            <img src={logo} alt="Full Prestige" className='h-12' />
            <p className='ml-4 text-white italic font-semibold text-sm' >"Que tu auto refleje lo mejor de ti"</p>

        </div>
        <button 
        onClick={handleLogout}
        className="bg-green-500 text-white px-4 py-2 rounded">
        VOLVER</button>
      </header>

      <div>
        <h2 className="bg-black px-4 py-2 text-center text-red-600 text-xl font-bold mb-3 mt-1">HISTORIAL DE ASISTENCIA</h2>
      </div>
      {/* Historial de Asistencia */}

      <main className=" flex-grow w-full max-w-5xl p-6 bg-white  shadow mt-2 mb-4 rounded-lg mx-auto border border-black">


        <div className=" flex items-center mb-4">
          <input
            type="text"
            placeholder="Nombre y Apellido"
            className="border border-gray-400 p-2 rounded-l w-full"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-r">Buscar</button>
          <button 
            onClick={handleNuevo} 
            className="ml-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800">
            Nuevo
          </button>
        </div>
        

       
        <table className="w-full border-collapse border border-gray-300 text-center mb-6">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-2 border border-gray-300">Fecha</th>
              <th className="p-2 border border-gray-300">Nombre/Apellido</th>
              <th className="p-2 border border-gray-300">Hora de Ingreso</th>
              <th className="p-2 border border-gray-300">Hora de Salida</th>
              <th className="p-2 border border-gray-300">Observaciones</th>
              <th className="p-2 border border-gray-300">Opciones</th>
            </tr>

            
          </thead>

          <tbody>
            <tr>
              <td className="p-2 border border-gray-300">2023-11-05</td>
              <td className="p-2 border border-gray-300">Silvia Chaluisa</td>
              <td className="p-2 border border-gray-300">08:00 AM</td>
              <td className="p-2 border border-gray-300">05:00 PM</td>
              <td className="p-2 border border-gray-300">Pagarle Horas extras</td>
              <td className="border border-black px-4 py-2">
                  <button className="text-black hover:text-blue-700">
                    ✏️
                  </button>
                </td>
            </tr>
            
          </tbody>
        </table>

        
        
        
        <div className="flex space-x-4 justify-center mt-20">
          <button className="bg-red-400 text-black font-bold px-3 py-2 rounded flex items-center space-x-5"> 
            <img src={pdf} alt="pdf" className='h-6' />
            Descargar PDF
          </button>
          

          <button className="bg-green-300 text-black font-bold px-3 py-2 rounded flex item-center space-x-5">
          <img src={excel} alt="excel" className='h-6' />
            Descargar Excel
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

export default Asistencia;
