import { useContext} from 'react';
import logo from '../../assets/imagenes/logo.jpg';
import { useNavigate } from 'react-router-dom';
import { HistoryContext } from '../../context/HistoryContext';
import { FormularioClientes } from '../../components/Clientes/FormularioClientes';
import client from '../../assets/imagenes/client.png';

export const RegistrarClientes= () => {
  const navigate = useNavigate();
  const {clientes} = useContext(HistoryContext)
  console.log(clientes)



  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas abandonar la página?");
    if (confirmLogout === true) {
      navigate('/dashboard/historial-clientes');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center">
      {/* Contenedor de la cabecera */}
      <div className="w-full flex justify-between items-center p-4">
        <img src={logo} alt="Full Prestige" style={{ width: '150px', height: 'auto' }} />
        
        <button 
          onClick={handleLogout}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          VOLVER
        </button>
      </div>
      {/* //Para dirigir a la pagina de actualizar usuario */}
      <h2 className="text-red-600 text-3xl font-bold text-center mb-5 border-t-2 border-b-2 border-red-700 w-full py-2">
       REGISTRAR CLIENTES{/* {pathname.split("-")[0].slice(1).toUpperCase()} USUARIOS  */}
      </h2>
      <div>
        <img src={client} alt="Usuario" style={{ width: '120px', height: '120px' }} className='mx-auto' />
      </div> 

       <div className="w-full max-w-7xl px-10">
        {/* FORMULARIO .................................................................................................................*/}
        <FormularioClientes/>
        {/* ........................................................................................................................ */}
      </div> 

      <footer className="mt-8 w-full text-center text-white">
        <p className="py-4 border-t border-white text-sm">2024 Full Prestige. Todos los derechos reservados.</p>
    </footer>
  </div>
);

};

export default RegistrarClientes;
